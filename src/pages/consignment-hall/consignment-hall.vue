<template>
  <div class="consignment-hall-wrapper">
    <div class="type">
      <div>按时间排</div>
      <div>品种</div>
      <div class="my-consignment" @click="go('/consignment-hall/my-consignment')">我的寄售</div>
    </div>
    <div class="content">
      <div class="hot" v-show="proList.length">
        <Scroll :data="proList"
                :hasMore="hasMore"
                @pullingUp="getPageOrders">
        <div class="proList">
          <div class="item" @click="go('/consignment-hall/consignment-product-detail?buy=1&code='+item.code)" v-for="item in proList">
            <img :src="formatImg(item.listPic)" class="hot-pro-img">
            <div class="hot-pro-text">
              <p class="hot-pro-title"><span class="hot-pro-title-name">{{item.name}}</span><span class="hot-pro-title-date">2018/10/28</span></p>
              <p class="hot-pro-bottom"><span class="hot-pro-bottom-price">¥123</span><span class="hot-pro-bottom-number">可售数量：24</span></p>
            </div>
          </div>
        </div>
        </Scroll>
      </div>
      <div class="mall-content">
        <no-result v-show="!proList.length && !hasMore" class="no-result-wrapper" title="抱歉，暂无商品"></no-result>
      </div>
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
import { getDictList } from 'api/general';
import { getProductPage, getProductType } from 'api/biz';
import { getUserDetail } from 'api/user';
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
      indexSub: 0
    };
  },
  methods: {
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
      if(this.categorysSub[this.indexSub].key === 'all') {
        this.parentCategoryCode = this.categorys[this.index].key;
        this.selectdType = '';
      } else {
        this.parentCategoryCode = '';
        this.selectdType = this.categorysSub[this.indexSub].key;
      }
      this.loading = true;
      Promise.all([
        getProductPage({
          start: this.start,
          limit: this.limit,
          // sellType: sellType,
          parentCategoryCode: this.parentCategoryCode,
          categoryCode: this.selectdType,
          statusList: [4, 5, 6],
          orderDir: 'asc',
          orderColumn: 'order_no'
        })
      ]).then(([res1]) => {
        if (res1.list.length < this.limit || res1.totalCount <= this.limit) {
          this.hasMore = false;
        }
        res1.list.map(function () {
          res1.applyDatetime = formatDate(res1.applyDatetime);
        });
        this.proList = this.proList.concat(res1.list);
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
    }
  },
  mounted() {
    this.pullUpLoad = null;
    this.loading = true;
    this.userId = getCookie('userId');
    this.categoryCode = this.$route.query.typeCode || '';
    setTitle('寄售大厅');
    Promise.all([
      getDictList('sell_type'),
      getProductType({
        orderDir: 'asc',
        orderColumn: 'order_no',
        status: '1'
      })
    ]).then(([res1, res2]) => {
      res1.map((item) => {
        this.sellTypeObj[item.dkey] = item.dvalue;
      });
      res2.map((item) => {
        if(!item.parentCode) {
          this.categorys.push({
            value: item.name,
            key: item.code
          });
        }
      });
      this.categorys.map((item, index) => {
        if(item.key === this.categoryCode) {
          this.index = index;
          this.currentIndex = index;
        }
      });
      this.loading = false;
      this.getSubType();
      if(this.userId) {
        this.getUserDetail();
      }
    }).catch(() => { this.loading = false; });
  },
  components: {
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
    .my-consignment {
      border-left: 1px solid $color-border;
    }
  }
  .content {
    .hot {
      padding: 0 0.3rem 0;
      background: $color-highlight-background;
      position: absolute;
      top: 0.8rem;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: auto;
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

}
</style>
