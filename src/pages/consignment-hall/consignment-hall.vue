<template>
  <div class="consignment-hall-wrapper">
    <category-sjd-consignment @sendMessage="sendMessage"></category-sjd-consignment>
    <div class="content">
      <div class="hot" v-show="proList.length" :style="{bottom: transactionInfo ? '1.3rem' : '0'}">
        <Scroll :data="proList"
                :hasMore="hasMore"
                @pullingUp="getPageOrders">
          <div class="proList">
            <div class="item" @click="go('/consignment-hall/consignment-product-detail?buy=1&code='+item.code)" v-for="item in proList" v-show="proList.length">
              <img :src="formatImg(item.presellProduct.listPic)" class="hot-pro-img">
              <div class="hot-pro-text">
                <p class="hot-pro-title"><span class="hot-pro-title-name">{{item.productName}}</span><span class="hot-pro-title-date">{{formatDate(item.createDatetime, 'yyyy/MM/dd')}}</span></p>
                <p class="hot-pro-bottom"><span class="hot-pro-bottom-price">¥{{formatAmount(item.price)}}</span><span class="hot-pro-bottom-number">可售数量：{{item.quantity}}</span></p>
              </div>
            </div>
          </div>
        </Scroll>
      </div>
      <div class="mall-content">
        <no-result v-show="!proList.length && !hasMore" class="no-result-wrapper" title="抱歉，暂无商品"></no-result>
      </div>
    </div>
    <div class="footer" @click="goEChart" v-if="transactionInfo">
      <p>最新成交信息</p>
      <p>
        <span>{{transactionInfo.productName}}/年</span>
        <span>¥{{formatAmount(transactionInfo.price)}}/{{transactionInfo.unit}}</span>
        <span class="up-down">
          <img src="./up@2x.png" v-if="transactionInfo.wave > 0">
          <img src="./down@2x.png" v-if="transactionInfo.wave < 0">
          <span>{{transactionInfo.wave}}</span>
        </span>
        <span>{{formatDate(transactionInfo.createDatetime, 'yyyy/MM/dd')}}</span>
      </p>
    </div>
    <full-loading v-show="loading" :title="title"></full-loading>
    <toast ref="toast" :text="text"></toast>
    <router-view></router-view>
  </div>
</template>
<script>
import Toast from 'base/toast/toast';
import FullLoading from 'base/full-loading/full-loading';
import Slider from 'base/slider/slider';
import NoResult from 'base/no-result/no-result';
import MHeader from 'components/m-header/m-header';
import Scroll from 'base/scroll/scroll';
import CategoryScroll from 'base/category-scroll/category-scroll';
import { formatAmount, formatDate, formatImg, setTitle } from 'common/js/util';
import { getCookie } from 'common/js/cookie';
import { getDeriveZichanPage, getProductType } from 'api/biz';
import { getUserDetail } from 'api/user';
import CategorySjdConsignment from 'components/category-sjd-consignment/category-sjd-consignment';
export default {
  data() {
    return {
      title: '正在加载...',
      loading: true,
      toastText: '',
      currentList: [],
      text: '',
      start: 1,
      limit: 10,
      hasMore: true,
      proList: [],
      categorys: [],
      categorysSub: [{value: '全部', key: 'all'}],
      sellTypeObj: {},
        // {value: '个人', key: '0'},
        // {value: '定向', key: '1'},
        // {value: '集体', key: '2'},
        // {value: '捐赠', key: '3'}],
      userDetail: {},
      showCheckIn: false,
      pullUpLoad: null,
      currentIndex: +this.$route.query.index || 0,
      currentIndexSub: +this.$route.query.index || 0,
      index: 0,
      indexSub: 0,
      type: 0,
      showFlag: true,
      flag: false,
      transactionInfo: null
    };
  },
  methods: {
    clickType() {
      this.flag = true;
    },
    genghuan() {
      this.flag = !this.flag;
    },
    formatAmount(amount) {
      return formatAmount(amount);
    },
    formatDate(date, format) {
      return formatDate(date, format);
    },
    formatImg(img) {
      return formatImg(img);
    },
    action() {
      this.showCheckIn = true;
    },
    close() {
      this.showCheckIn = false;
    },
    go(url) {
      this.$router.push(url);
    },
    changeType(index) {
      this.type = index;
    },
    canAdopt(item) {
      if(!this.userDetail.level) {
        return '您未登录';
      }
      // 专属产品
      if(item.sellType === '1') {
        // 销售类型为专属且未到认养量
        if(item.raiseCount === item.nowCount) {
          return '已被认养';
        } else {
          return '可认养';
        }
      }
      // 定向产品
      if(item.directType && item.directType === '1') {
        // 等级定向且用户为该等级
        if(item.raiseCount === item.nowCount) {
          return '已被认养';
        }
        if(item.directObject !== this.userDetail.level) {
          return '不可认养';
        } else {
          return '可认养';
        }
      }
      if(item.directType && item.directType === '2') {
        // 用户定向且是定向用户
        if(item.raiseCount === item.nowCount) {
          return '已被认养';
        }
        if(item.directObject !== this.userId) {
          return '不可认养';
        } else {
          return '可认养';
        }
      }
      // 捐赠产品
      if(item.sellType === '3') {
        let curTime = new Date();
        // 2把字符串格式转换为日期类
        let startTime = new Date(Date.parse(item.raiseStartDatetime));
        let endTime = new Date(Date.parse(item.raiseEndDatetime));
        // 3进行比较
        if(curTime <= startTime || curTime >= endTime) {
          return '不可认养';
        } else {
          return '可认养';
        }
      }
      // 专属产品
      if(item.sellType === '4') {
        // 销售类型为专属且未到认养量
        if(item.raiseCount === item.nowCount) {
          return '已满标';
        } else {
          return '可认养';
        }
      }
    },
    selectCategory(index) {
      this.index = index;
      this.indexSub = 0;
      this.currentIndexSub = 0;
      this.currentIndex = index;
      this.start = 1;
      this.limit = 10;
      this.proList = [];
      this.loading = true;
      this.getSubType();
    },
    selectCategorySub(index) {
      this.indexSub = index;
      this.currentIndexSub = index;
      this.start = 1;
      this.limit = 10;
      this.proList = [];
      this.getPageOrders();
    },
    // 获取下级分类
    getSubType() {
      this.loading = true;
      getProductType({
        parentCode: this.categorys[this.index].key,
        status: '1',
        orderDir: 'asc',
        orderColumn: 'order_no'
      }).then((res) => {
        this.categorysSub = [{value: '全部', key: 'all'}];
        res.map((item) => {
          this.categorysSub.push({
            value: item.name,
            key: item.code
          });
        });
        this.selectdType = this.categorysSub[this.indexSub].key;
        this.getPageOrders();
        this.loading = false;
      }).catch(() => { this.loading = false; });
    },
    getPageOrders() {
      this.loading = true;
      Promise.all([
        getDeriveZichanPage({
          start: this.start,
          limit: this.limit,
          status: 0,
          type: 2,
          minQuantity: 0,
          variety: this.variety || '',
          orderColumn: this.orderColumn || '',
          orderDir: this.orderDir || 'asc'
        }),
        getDeriveZichanPage({
          start: this.start,
          limit: this.limit,
          status: 1,
          type: 2,
          variety: this.variety || '',
          orderColumn: 'create_datetime',
          orderDir: 'desc'
        })
      ]).then(([res1, res2]) => {
        if (res1.list.length < this.limit || res1.totalCount <= this.limit) {
          this.hasMore = false;
        }
        this.proList = this.proList.concat(res1.list);
        this.transactionInfo = res2.list[0];
        this.start++;
        this.loading = false;
      }).catch(() => { this.loading = false; });
    },
    getUserDetail() {
      getUserDetail({
        userId: this.userId
      }).then((res) => {
        this.userDetail = res;
      });
    },
    sendMessage(orderby, pinzhong) {
      if(pinzhong === '全部品种') {
        this.variety = '';
      } else {
        this.variety = pinzhong;
      }
      switch (orderby) {
        case 0: this.orderColumn = ''; this.orderDir = ''; break;
        case 1: this.orderColumn = 'create_datetime'; this.orderDir = 'desc'; break;
        case 2: this.orderColumn = 'price'; this.orderDir = ''; break;
        case 3: this.orderColumn = 'quantity'; this.orderDir = 'desc'; break;
      }
      this.start = 1;
      this.limit = 10;
      this.proList = [];
      this.getPageOrders();
    },
    goEChart() {
      this.go('/consignment-hall/echart');
    }
  },
  mounted() {
    this.pullUpLoad = null;
    this.loading = true;
    this.userId = getCookie('userId');
    this.categoryCode = this.$route.query.typeCode || '';
    setTitle('寄售大厅');
    this.getPageOrders();
  },
  components: {
    CategorySjdConsignment,
    FullLoading,
    Toast,
    Slider,
    NoResult,
    MHeader,
    Scroll,
    CategoryScroll
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/mixin.scss";
@import "../../common/scss/variable.scss";
.consignment-hall-wrapper {
  position: fixed;
  width: 100%;
  bottom: 0;
  top: 0;
  left: 0;
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .mask {
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000000, $alpha: 0.7);
    position: absolute;
    top: 0;
    left: 0;
    display: none;
  }
  .type {
    font-size: 0;
    background: #fff;
    height: 0.8rem;
    text-align: center;
    display: flex;
    align-items: center;
    border-bottom: 1px solid $color-border;
    div {
      width: 33.3%;
      display: inline-block;
      font-size: 0.3rem;
      color: #666;
      letter-spacing: 0.25px;
    }
    img {
      width: 0.18rem;
      height: 0.12rem;
    }
    .my-consignment {
      border-left: 1px solid $color-border;
    }
    .active {
      color: $primary-color;
      font-family: PingFangSC-Semibold;
    }
  }
  .content {
    .hot {
      padding: 0 0.3rem 0;
      background: $color-highlight-background;
      position: absolute;
      top: 0.8rem;
      bottom: 1.3rem;
      left: 0;
      right: 0;
      overflow: auto;
      z-index: -1;
      .proList {
        background: $color-highlight-background;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        font-size: 0;
        .item {
          width: 100%;
          /*height: 5.17rem;*/
          margin: 0.3rem 0;
          border-bottom: 1px solid #e6e6e6;
          display: flex;
          padding-bottom: 0.3rem;
          .hot-pro-img {
            height: 1.7rem;
            width: 2.4rem;
            margin-right: 0.3rem;
            border-radius: 0.04rem;
          }
          .hot-pro-text {
            padding: 0.1rem 0 0 0;
            flex: 1;
            p {
              font-size: 0;
            }
            .hot-pro-title {
              line-height: 0.42rem;
              margin-bottom: 0.19rem;
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 0.7rem;
              .hot-pro-title-name {
                font-size: 0.3rem;
              }
              .hot-pro-title-date {
                font-size: 0.24rem;
                color: #999;
              }
            }
            .hot-pro-bottom {
              display: flex;
              align-items: center;
              justify-content: space-between;
              .hot-pro-bottom-price {
                font-family: 'DIN-Bold';
                font-size:0.3rem;
                color: $primary-color;
                letter-spacing: 0.23px;
                line-height: 0.3rem;
              }
              .hot-pro-bottom-number {
                font-size: 0.24rem;
                color: #999;
              }
            }
          }
        }
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 1.3rem;
    background: #373838;
    padding: 0.3rem;
    font-size: 0.24rem;
    color: #fff;
    p:first-child {
      margin-bottom: 0.16rem;
    }
    p:last-child {
      display: flex;
      justify-content: space-between;
      .up-down {
        color: $primary-color;
        img {
          width: 0.16rem;
          height: 0.2rem;
        }
      }
    }
  }
  .mask {
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000000, $alpha: 0.7);
    position: absolute;
    top: 0;
    left: 0;
    display: none;
  }
  .show {
    display: block;
  }
  .buypart {
    width: 100%;
    height: 7.7rem;
    position: fixed;
    bottom: 0;
    background-color: #fff;
    display: none;
    z-index: 9;
    &.show {
      display: block;
    }
    // padding: 0 0.3rem;
    .title {
      height: 1.5rem;
      position: relative;
      border-bottom: 1px solid #eee;
      margin: 0 0.3rem;
      .title-pic {
        position: absolute;
        left: 0;
        bottom: 0.28rem;
        padding: 0.03rem;
        border-radius: 0.1rem;
        background-color: #fff;
        img {
          width: 1.6rem;
          height: 1.6rem;
        }
      }
      .title-right {
        margin-left: 2.14rem;
        position: relative;
        overflow: hidden;
        p {
          margin-top: 0.27rem;
          font-size: $font-size-medium-x;
          line-height: 0.42rem;
          color: #333;
        }
        span {
          margin-top: 0.4rem;
          font-size: $font-size-medium;
          color: #999;
        }
        i {
          width: 0.34rem;
          line-height: 0.34rem;
          line-height: 0.34rem;
          font-size: $font-size-medium;
          text-align: center;
          color: #333;
          border: 1px solid #333;
          border-radius: 50%;
          position: absolute;
          top: 0.2rem;
          right: 0;
        }
        .position {
          font-size: 0.24rem;
          line-height: 0.33rem;
          color: $color-text-l;
          img {
            width: 0.16rem;
            height: 0.2rem;
            margin-right: 0.08rem;
          }
        }
      }
    }
    .packaging {
      height: 1.74rem;
      border-bottom: 1px solid #eee;
      margin: 0.3rem;
      overflow: scroll;
      .packaging-title {
        font-size: $font-size-medium-x;
        line-height: 0.42rem;
        margin: 0 0 0.3rem 0;
      }
      p {
        margin-top: 0.3rem;
        margin-bottom: 0.4rem;
        font-size: $font-size-medium-xx;
        color: #333;
      }
      .select {
        .select-item {
          display: flex;
          align-items: center;
          margin-bottom: 0.28rem;
          span {
            float: left;
            min-width: 1.18rem;
            padding: 0 0.1rem;
            font-size: $font-size-medium-s;
            border-radius: 0.1rem;
            flex: 1;
            color: #666;
            line-height: 0.37rem;
          }
          img {
            width: 0.36rem;
          }
          span + span {
            margin-left: 0.2rem;
          }
        }
      }
    }
    .number {
      height: 1.1rem;
      border-bottom: 1px solid #eee;
      margin: 0 0.3rem;
      display: flex;
      align-items: center;
      span {
        font-size: 0.3rem;
      }
      .right {
        flex: 1;
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        .right-item {
          float: right;
          text-align: center;
          line-height: 0.5rem;
        }
        .diamonds {
          width: 0.36rem;
          height: 0.36rem;
        }
        .num {
          width: 0.9rem;
          font-size: $font-size-medium-x;
          color: #333;
          height: 0.36rem;
        }
      }
    }
    .other {
      height: 1.1rem;
      border-bottom: 1px solid #eee;
      margin: 0 0.3rem;
      display: flex;
      align-items: center;
      font-size: 0.3rem;
      span {
        margin-right: 0.2rem;
      }
      input {
        height: 70%;
        border: 1px solid $color-border;
      }
    }
    .buypart-bottom {
      height: 0.98rem;
      line-height: 0.9rem;
      color: #fff;
      font-size: $font-size-medium-x;
      position: absolute;
      bottom: 0;
      width: 100%;
      left: 0;
      padding: 0 0.3rem;
      border-top: 1px solid $color-border;
      display: flex;
      align-items: center;
      div {
        display: inline-block;
        width: 50%;
        text-align: center;
      }
      .confirm {
        border-radius: 0.08rem;
        background: $primary-color;
        width: 100%;
        height: 0.9rem;
        line-height: 0.98rem;
      }
    }
  }
}
</style>
