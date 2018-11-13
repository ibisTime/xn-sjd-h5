<template>
  <div class="my-consignment-wrapper">
    <div class="type">
      <div @click="changeType(0)" :class="{active: type === 0}">我的预售资产</div>
      <div @click="changeType(1)" :class="{active: type === 1}">寄售中</div>
      <div @click="changeType(2)" :class="{active: type === 2}">已交易完成</div>
    </div>
    <div class="content">
      <div class="hot" v-show="type === 0 ? originList.length : deriveList.length">
        <Scroll :data="type === 0 ? originList : deriveList"
                :hasMore="hasMore"
                @pullingUp="getPageOrders">
          <div class="proList" v-show="type === 0">
            <div class="item" @click="go('/consignment-product-detail?code='+item.code)" v-for="item in originList">
              <img :src="formatImg(item.presellProduct.listPic)" class="hot-pro-img">
              <div class="hot-pro-text">
                <p class="hot-pro-title">
                  <span class="hot-pro-title-name">
                    <span class="hot-pro-title-name-name">{{item.productName}}</span>
                  </span>
                  <span class="hot-pro-title-date">{{originStatusObj[item.status]}}</span>
                </p>
                <p class="hot-pro-middle"><span class="hot-pro-bottom-number">转让中:{{item.presellQuantity}}</span><span class="hot-pro-bottom-number">提货中:{{item.receivingQuantity}}</span></p>
                <p class="hot-pro-bottom"><span class="hot-pro-bottom-price">¥{{formatAmount(item.price)}}</span><span class="hot-pro-bottom-number">库存：{{item.quantity}}{{item.presellProduct.packUnit}}</span></p>
              </div>
            </div>
          </div>
          <div class="proList" v-show="type === 1 || type === 2">
            <div class="item" @click="go('/consignment-hall/consignment-product-detail?code='+item.code)" v-for="item in deriveList">
              <img :src="formatImg(item.presellProduct.listPic)" class="hot-pro-img">
              <div class="hot-pro-text">
                <p class="hot-pro-title">
                <span class="hot-pro-title-name">
                  <span class="hot-pro-title-name-name">{{item.productName}}</span>
                  <span class="dingxiang consignment-type" v-show="item.type === '0'">定向</span>
                  <span class="guadan consignment-type" v-show="item.type === '2'">挂单</span>
                  <span class="erweima consignment-type" v-show="item.type === '1'">二维码</span>
                </span>
                  <span class="hot-pro-title-date">{{formatDate(item.createDatetime)}}</span>
                </p>
                <p class="hot-pro-bottom"><span class="hot-pro-bottom-price">¥{{formatAmount(item.price)}}</span><span class="hot-pro-bottom-number">总数量：{{item.quantity}}</span></p>
                <!--<p class="hot-pro-bottom" v-show="type === 1"><span class="hot-pro-bottom-price"></span><span class="hot-pro-bottom-number">转让中数量：{{item.presellQuantity}}</span></p>-->
              </div>
            </div>
          </div>
        </Scroll>
      </div>
      <div class="mall-content">
        <no-result v-show="showNoResult()" class="no-result-wrapper" title="抱歉，暂无商品"></no-result>
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
import { getOriginZichanPage, getDeriveZichanPage, getMyConsignmentList } from 'api/biz';
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
      originList: [],
      deriveList: [],
      originStatusObj: {},
      deriveStatusObj: {},
      userDetail: {},
      showCheckIn: false,
      pullUpLoad: null,
      currentIndex: +this.$route.query.index || 0,
      currentIndexSub: +this.$route.query.index || 0,
      index: 0,
      indexSub: 0,
      type: 0
    };
  },
  methods: {
    showNoResult() {
      if(this.type === 0 && !this.originList.length && !this.hasMore) {
        return true;
      }
      if(this.type === 1 && !this.deriveList.length && !this.hasMore) {
        return true;
      }
      if(this.type === 2 && !this.deriveList.length && !this.hasMore) {
        return true;
      }
      return false;
    },
    formatAmount(amount) {
      return formatAmount(amount);
    },
    formatDate(date) {
      return formatDate(date, 'yyyy-MM-dd');
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
    changeType(index) {
      this.type = index;
      this.start = 1;
      this.limit = 10;
      this.originList = [];
      this.deriveList = [];
      this.getPageOrders();
    },
    go(url) {
      this.$router.push(url);
    },
    getPageOrders() {
      this.loading = true;
      if(this.type === 0) {
        Promise.all([
          getOriginZichanPage({
            start: this.start,
            limit: this.limit,
            ownerId: this.userId,
            minQuantity: 0
          })
        ]).then(([res1]) => {
          if (res1.list.length < this.limit || res1.totalCount <= this.limit) {
            this.hasMore = false;
          }
          this.originList = this.originList.concat(res1.list);
          this.start++;
          this.loading = false;
        }).catch(() => { this.loading = false; });
      } else {
        if(this.type === 1) {
          this.params = {};
          this.params.userId = this.userId;
          this.params.orderColumn = 'create_datetime';
          this.params.orderDir = 'desc';
          Promise.all([
            getMyConsignmentList(this.params)
          ]).then(([res1]) => {
            if (res1.list.length < this.limit || res1.totalCount <= this.limit) {
              this.hasMore = false;
            }
            this.deriveList = this.deriveList.concat(res1.list);
            this.start++;
            this.loading = false;
          }).catch((msg) => { console.log(msg); this.loading = false; });
        } else {
          this.params = {
            start: this.start,
            limit: this.limit
          };
          this.params.statusList = [1, 2, 3];
          this.params.creater = this.userId;
          Promise.all([
            getDeriveZichanPage(this.params)
          ]).then(([res1]) => {
            if (res1.list.length < this.limit || res1.totalCount <= this.limit) {
              this.hasMore = false;
            }
            this.deriveList = this.deriveList.concat(res1.list);
            this.start++;
            this.loading = false;
          }).catch((msg) => { console.log(msg); this.loading = false; });
        }
        // console.log(this.deriveList);
      }
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
    this.type = +this.$route.query.type || 0;
    setTitle('我的预售资产');
    Promise.all([
      getDictList('original_group_status'),
      getDictList('derive_group_status')
    ]).then(([res1, res2]) => {
      res1.map((item) => {
        this.originStatusObj[item.dkey] = item.dvalue;
      });
      res2.map((item) => {
        this.deriveStatusObj[item.dkey] = item.dvalue;
      });
      this.loading = false;
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
.my-consignment-wrapper {
  position: fixed;
  width: 100%;
  bottom: 0;
  top: 0;
  left: 0;
  background: #fff;
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
          margin: 0.3rem 0 0;
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
              /*line-height: 0.42rem;*/
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 0.3rem;
              .hot-pro-title-name {
                font-size: 0;
                .hot-pro-title-name-name {
                  font-size: 0.3rem;
                }
                .consignment-type {
                  font-size: 0.2rem;
                  line-height: 0.28rem;
                  padding: 0.02rem 0.05rem;
                  border-radius: 0.04rem;
                  margin-left: 0.1rem;
                }
                .dingxiang {
                  color: #3FC8ED;
                  background: #daf2fa;
                }
                .guadan {
                  color: #F0A65B;
                  background: #faecdd;
                }
                .erweima {
                  color: #F06C5B;
                  background: #edd6d3;
                }
              }
              .hot-pro-title-date {
                font-size: 0.24rem;
                color: #999;
              }
            }
            .hot-pro-middle {
              margin-bottom: 0.3rem;
              span {
                font-size: 0.24rem;
                color: #999;
                margin-right: 0.2rem;
              }
            }
            .hot-pro-bottom {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 0.1rem;
              .hot-pro-bottom-price {
                font-family: 'DIN-Bold';
                font-size:0.3rem;
                color: $primary-color;
                letter-spacing: 0.23px;
                line-height: 0.3rem;
                font-weight: 900;
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
