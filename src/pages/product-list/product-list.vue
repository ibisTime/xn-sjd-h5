<template>
  <div class="home-wrapper">
    <m-header class="cate-header" title="认养列表"></m-header>
    <div class="header clearfix category-wrapper">
      <category-scroll :currentIndex="currentIndex"
                       :categorys="categorys"
                       @select="selectCategory"></category-scroll>
    </div>
    <div class="content">
      <div class="bulletin">
        <div class="title">恭喜Bluce，成功参加See的传承认养</div>
      </div>
      <div class="hot">
        <Scroll :pullUpLoad="pullUpLoad">
        <div class="proList">
          <div class="item" @click="go('/product-detail?code='+item.code)" v-for="item in this.proList">
            <div class="sell-type">{{sellTypeObj[item.sellType]}}</div>
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
      <!--<div class="mall-content">-->
        <!--<no-result v-show="!currentList.length && !hasMore" class="no-result-wrapper" title="抱歉，暂无商品"></no-result>-->
      <!--</div>-->
    </div>
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
import { formatAmount, formatDate, formatImg } from 'common/js/util';
import { getDictList } from 'api/general';
import { getProductPage } from 'api/biz';
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
      categorys: [{value: '全部', key: ''}],
      sellTypeObj: {},
        // {value: '个人', key: '0'},
        // {value: '定向', key: '1'},
        // {value: '集体', key: '2'},
        // {value: '捐赠', key: '3'}],
      showCheckIn: false,
      pullUpLoad: null,
      currentIndex: +this.$route.query.index || 0,
      index: 0
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
    // goProductDetail() {
    //   this.$router.push('/product-detail');
    // },
    go(url) {
      this.$router.push(url);
    },
    selectCategory(index) {
      this.index = index;
      this.currentIndex = index;
      this.start = 1;
      this.limit = 10;
      this.proList = [];
      this.getPageOrders();
    },
    getPageOrders() {
      let sellType = this.categorys[this.index].key;
      this.loading = true;
      Promise.all([
        getProductPage({
          start: this.start,
          limit: this.limit,
          sellType: sellType,
          categoryCode: this.categoryCode,
          status: '4'
        })
      ]).then(([res1]) => {
        if (res1.list.length < this.limit || res1.totalCount <= this.limit) {
          this.hasMore = false;
        }
        this.loading = false;
        res1.list.map(function () {
          res1.applyDatetime = formatDate(res1.applyDatetime);
        });
        this.proList = this.proList.concat(res1.list);
        this.start++;
      }).catch(() => { this.loading = false; });
    }
  },
  mounted() {
    this.pullUpLoad = null;
    this.loading = true;
    this.categoryCode = this.$route.query.typeCode || '';
    Promise.all([
      getDictList('sell_type')
    ]).then(([res1]) => {
      this.loading = false;
      res1.map((item) => {
        this.categorys.push({
          value: item.dvalue,
          key: item.dkey
        });
        this.sellTypeObj[item.dkey] = item.dvalue;
      });
      this.getPageOrders();
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
    top: 0.88rem;
    left: 0;
    width: 100%;
    z-index: 100;
    overflow: hidden;
    height: 0.8rem;
    line-height: 0.8rem;
    background: #fff;
    border-bottom: 1px solid $color-border;
  }
  .content {
    margin: 1.68rem 0 0;
    .bulletin {
      display: flex;
      align-items: center;
      font-size: 0.24rem;
      padding: 0.24rem 0.3rem;
      background: #f0f9f6;
      img {
        width: 0.6rem;
        height: 0.25rem;
        margin-right: 0.11rem;
      }
      .border {
        display: inline;
        width: 0;
        height: 0.15rem;
        border-right: 1px solid #ccc;
        margin-right: 0.11rem;
      }
      .title {
        line-height: 0.33rem;
        flex: 1;
      }
      .more {
        line-height: 0.33rem;
        color: #999;
      }
    }
    .hot {
      padding: 0 0.3rem 0;
      background: $color-highlight-background;
      position: absolute;
      top: 2.5rem;
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
          height: 4.17rem;
          margin-top: 0.3rem;
          border: 1px solid #e6e6e6;
          border-radius: 0.04rem;
          display: inline-block;
          position: relative;
          .sell-type {
            position: absolute;
            right: 0;
            top: 0;
            background: #566272;
            opacity: 0.5;
            width: 0.8rem;
            height: 0.4rem;
            font-size: 0.24rem;
            line-height: 0.4rem;
            text-align: center;
            color: $color-highlight-background;
            border-radius: 0.05rem;
          }
          .hot-pro-img {
            height: 2.3rem;
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
