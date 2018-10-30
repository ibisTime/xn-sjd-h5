<template>
  <div class="home-wrapper">
    <!--<m-header class="cate-header" title="认养列表"></m-header>-->
    <div class="header clearfix category-wrapper">
      <category-scroll :currentIndex="currentIndex"
                       :categorys="categorys"
                       @select="selectCategory"></category-scroll>
      <category-scroll :currentIndex="currentIndexSub"
                       :categorys="categorysSub"
                       @select="selectCategorySub"></category-scroll>
    </div>
    <div class="content">
      <!--<div class="bulletin">-->
        <!--<div class="title">恭喜Bluce，成功参加See的传承认养</div>-->
      <!--</div>-->
      <div class="hot" v-show="proList.length">
        <Scroll :data="proList"
                :hasMore="hasMore"
                @pullingUp="getPageOrders">
        <div class="proList">
          <div class="item" @click="go('/product-list/product-detail?code='+item.code)" v-for="item in proList">
            <div class="sell-type">{{sellTypeObj[item.sellType]}}</div>
            <div class="sell-type-right">{{canAdopt(item)}}</div>
            <img :src="formatImg(item.listPic)" class="hot-pro-img">
            <div class="hot-pro-text">
              <p class="hot-pro-title">{{item.name}}</p>
              <p class="hot-pro-place"><span class="hot-pro-introduction">{{item.province}} {{item.city}}</span></p>
              <p><span class="hot-pro-price">¥{{formatAmount(item.minPrice)}}起</span></p>
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
      // 专属产品
      if(item.sellType === '1' || item.sellType === '4') {
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
        if(item.directObject !== this.userDetail.level) {
          return '不可认养';
        } else {
          return '可认养';
        }
      }
      if(item.directType && item.directType === '2') {
        // 用户定向且是定向用户
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
        // console.log(startTime);
        // console.log(endTime);
        // 3进行比较
        // console.log(curTime >= startTime && curTime <= endTime);
        if(curTime <= startTime || curTime >= endTime) {
          return '不可认养';
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
          statusList: [4, 5],
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
    setTitle('认养列表');
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
.home-wrapper {
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
  .category-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1.6rem;
    z-index: 100;
    overflow: hidden;
    line-height: 0.8rem;
    background: #fff;
    border-bottom: 1px solid $color-border;
  }
  .content {
    margin: 1.6rem 0 0;
    .bulletin {
      display: flex;
      align-items: center;
      font-size: 0.24rem;
      padding: 0.24rem 0.3rem;
      background: #f0f9f6;
      .title {
        line-height: 0.33rem;
        flex: 1;
      }
    }
    .hot {
      padding: 0 0.3rem 0;
      background: $color-highlight-background;
      position: absolute;
      /*top: 2.4rem;*/
      top: 1.6rem;
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
          width: 3.3rem;
          height: 5.17rem;
          margin-top: 0.3rem;
          border: 1px solid #e6e6e6;
          border-radius: 0.04rem;
          display: inline-block;
          position: relative;
          .sell-type {
            position: absolute;
            left: 0;
            top: 0;
            background: #F7B524;
            /*opacity: 0.5;*/
            padding: 0 0.1rem;
            height: 0.4rem;
            font-size: 0.24rem;
            line-height: 0.4rem;
            text-align: center;
            color: $color-highlight-background;
            border-radius: 0.05rem;
          }
          .sell-type-right {
            position: absolute;
            right: 0;
            top: 0;
            background: #969998;
            /*opacity: 0.5;*/
            padding: 0 0.1rem;
            height: 0.4rem;
            font-size: 0.24rem;
            line-height: 0.4rem;
            text-align: center;
            color: $color-highlight-background;
            border-radius: 0.05rem;
          }
          .hot-pro-img {
            height: 3.3rem;
            width: 100%;
            margin-bottom: 0.2rem;
          }
          .hot-pro-text {
            padding: 0 0.2rem;
            p {
              font-size: 0;
            }
            .hot-pro-title {
              font-size: $font-size-medium-x;
              line-height: 0.42rem;
              margin-bottom: 0.19rem;
            }
            .hot-pro-place {
              margin-bottom: 0.17rem;
              .hot-pro-introduction {
                color: $color-text-l;
                font-size: $font-size-small;
                line-height: $font-size-medium-xx;
              }
              img {
                width: 0.77rem;
                height: 0.32rem;
              }
            }
            .hot-pro-price {
              color: $primary-color;
              font-size: $font-size-small;
              line-height: 0.29rem;
              font-weight: bold;
            }
          }
        }
      }
    }
  }

}
</style>
