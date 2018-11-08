<template>
  <div class="adopt-list-wrapper">
    <div class="category-wrapper">
      <!--<category-scroll :currentIndex="currentIndexSell"-->
                       <!--:categorys="categorysSell"-->
                       <!--@select="selectCategorySell"></category-scroll>-->
      <category-scroll :currentIndex="currentIndex"
                       :categorys="categorysStatus"
                       @select="selectCategory"></category-scroll>
    </div>
    <div class="gray"></div>
    <div class="order-list">
      <scroll ref="scroll"
              :data="currentList.data"
              :hasMore="currentList.hasMore"
              @pullingUp="getPageOrders">
        <ul v-if="currentList">
          <li class="item" v-for="(item, index) in currentList.data" @click="goDetail(item)">
            <div class="top">
              <span class="item-code">{{item.sellerName}}</span>
              <span class="item-status">{{formatStatus(item.status)}}</span>
            </div>
            <div class="info">
              <div class="imgWrap" :style="getImgSyl(item.presellProduct.listPic)"></div>
              <div class="text">
                <p class="title"><span class="title-title">{{item.presellProduct.name}}</span><span class="title-number">x{{item.quantity}}</span></p>
                <p class="position">预售规格：{{item.specsName}}</p>
                <div class="props"><span class="duration">合计{{item.quantity}}件商品</span><span class="price">¥{{formatAmount(item.amount)}}</span></div>
              </div>
            </div>
            <div class="clearfix btns" v-show="showBtns(item.status)">
              <span class="btn fr" v-show="showPayBtn(item.status)" @click.stop="payOrder(item)">立即支付</span>
              <span class="btn cancel fr" v-show="showCancelBtn(item.status)" @click.stop="_cancelOrder(item)">取消订单</span>
            </div>
            <div class="gray"></div>
          </li>
        </ul>
        <no-result v-show="!currentList.hasMore && !(currentList.data && currentList.data.length)" title="暂无订单" class="no-result-wrapper"></no-result>
      </Scroll>
    </div>
    <confirm-input ref="confirmInput" :text="inputText" @confirm="handleInputConfirm"></confirm-input>
    <toast :text="toastText" ref="toast"></toast>
    <!--<router-view @updateNum="handleUpdateNum"></router-view>-->
    <full-loading v-show="fetching" :title="fetchText"></full-loading>
    <router-view></router-view>
  </div>
</template>
<script>
  // import {ORDER_STATUS} from 'common/js/dict';
  import CategoryScroll from 'base/category-scroll/category-scroll';
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import NoResult from 'base/no-result/no-result'; // 暂无数据
  import FullLoading from 'base/full-loading/full-loading'; // loading
  import Toast from 'base/toast/toast'; // 已加载完/加载时的loading
  import ConfirmInput from 'base/confirm-input/confirm-input';
  import {mapGetters, mapMutations, mapActions} from 'vuex';
  import {SET_PRE_ORDER_LIST, SET_CURRENT_PRE_ORDER} from 'store/mutation-types';
  import {getPreOrderPage, cancelPreOrder} from 'api/biz';
  import { getDictList } from 'api/general';
  import {formatAmount, formatImg, setTitle} from 'common/js/util';
  import { getCookie } from 'common/js/cookie';
  import defaultImg from './tree@3x.png';

  export default {
    data() {
      return {
        type: 0,
        status: 0,
        currentCode: '',
        currentGoodsCode: '',
        fetching: false,
        fetchText: '',
        categorysStatus: [{key: 'all', value: '全部'}],
        // categorysSell: [],
        currentIndex: +this.$route.query.index || 0,
        text: '',
        inputText: '',
        toastText: '',
        sellTypeObj: {},
        // currentIndexSell: +this.$route.query.index || 0,
        statusObj: {},
        groupStatusObj: {}
      };
    },
    mounted() {
      setTitle('预售订单');
      // this.currentIndexSell = +this.$route.query.type;
      // this.type = +this.$route.query.type;
      this.first = true;
      this.userId = getCookie('userId');
      this.type = 1;
      if(this.userId) {
        this.getInitData();
      } else {
        this.toastText = '您未登录';
        this.$refs.toast.show();
        setTimeout(() => {
          this.$router.push('/login');
        }, 500);
      }
    },
    computed: {
      currentList() {
        if(this.categorysStatus[this.currentIndex]) {
          let _curListObj = this.preOrderList[this.categorysStatus[this.currentIndex].key];
          if (!_curListObj) {
            _curListObj = {
              start: 1,
              limit: 10,
              hasMore: true,
              data: [],
              key: this.categorysStatus[this.currentIndex].key,
              type: this.type
            };
          }
          return _curListObj;
        }
      },
      ...mapGetters(['preOrderList'])
    },
    methods: {
      getInitData() {
        // this.getCategorysSell();
        this.getCategorysStatus(0);
        // this.getGroupStatus();
        if (this.shouldGetData()) {
          this.first = false;
          // 清除缓存的订单列表数据
          this.setPreOrderList({});
          this.getPageOrders();
        }
      },
      shouldGetData() {
        if (this.$route.path === '/booking-order') {
          setTitle('预售订单');
          return this.first;
        }
        return false;
      },
      // 获取状态分类
      getCategorysStatus() {
        getDictList('presell_order_status').then((res) => {
          res.map((item) => {
            this.categorysStatus.push({
              key: item.dkey,
              value: item.dvalue
            });
            this.statusObj[item.dkey] = item.dvalue;
          });
        }).catch(() => {});
      },
      getImgSyl(imgs) {
        let img = imgs ? formatImg(imgs) : defaultImg;
        return {
          backgroundImage: `url(${img})`
        };
      },
      go(url) {
        this.$router.push(url);
      },
      changeType(index) {
        this.type = index;
        this.first = false;
        // 清除缓存的订单列表数据
        this.setPreOrderList({});
        this.getPageOrders();
      },
      changeStatus(index) {
        this.status = index;
      },
      formatAmount(amount) {
        return formatAmount(amount);
      },
      formatStatus(status) {
        if(this.type === '4') {
          return this.groupStatusObj[status];
        } else {
          return this.statusObj[status];
        }
        // return ORDER_STATUS[status];
      },
      goDetail(item) {
        this.setCurrentPreOrder(item);
        this.$router.push(`/booking-order/booking-order-detail?code=${item.code}`);
      },
      payOrder(item) {
        this.go(`/pay?pre=1&orderCode=${item.code}`);
      },
      _cancelOrder(item) {
        this.inputText = '取消原因';
        this.curItem = item;
        this.$refs.confirmInput.show();
      },
      showBtns(status) {
        if (status !== '0') {
          return false;
        }
        return true;
      },
      showPayBtn(status) {
        return status === '0';
      },
      showCancelBtn(status) {
        return status === '0';
      },
      selectCategory(index) {
        this.currentIndex = index;
        this.$refs.scroll.scrollTo(0, 0);
        if (!this.currentList.data.length && this.currentList.hasMore) {
          this.getPageOrders();
        }
      },
      // selectCategorySell(index) {
      //   this.currentIndexSell = index;
      //   this.$refs.scroll.scrollTo(0, 0);
      //   this.type = this.categorysSell[index].key;
      //   this.first = false;
      //   // 清除缓存的订单列表数据
      //   this.setOrderList({});
      //   if(this.type === '4') {
      //     this.getCategorysStatus(this.type);
      //   }
      //   if (!this.currentList.data.length && this.currentList.hasMore) {
      //     this.getPageOrders();
      //   }
      // },
      handleInputConfirm(text) {
        this.fetching = true;
        if (this.curItem.status === '0') {
          this.cancelOrder(text);
        }
      },
      cancelOrder(text) {
        cancelPreOrder({
          code: this.curItem.code,
          remark: text
        }).then(() => {
          this.fetching = false;
          this.editPreOrderListByCancel({
            code: this.curItem.code
          });
        }).catch(() => {
          this.fetching = false;
        });
      },
      getPageOrders() {
        let key = this.categorysStatus[this.currentIndex].key;
        let status = key === 'all' ? '' : key;
        if (this.currentList.hasMore) {
          getPreOrderPage(this.currentList.start, this.currentList.limit, status, this.type).then((data) => {
            let _orderOri = this.preOrderList[key];
            let _order;
            if (!_orderOri) {
              _order = {
                start: 1,
                limit: 10,
                hasMore: true,
                data: [],
                key: key,
                type: this.type
              };
            } else {
              _order = {
                ..._orderOri
              };
            }
            if (data.list.length < _order.limit || data.totalCount <= _order.limit) {
              _order.hasMore = false;
            }
            _order.start++;
            let _currentList = {
              ..._order
            };
            _currentList.data = _currentList.data.concat(data.list);
            let _orderList = {
              ...this.preOrderList,
              [_currentList['key']]: _currentList
            };
            this.setPreOrderList(_orderList);
          });
        }
      },
      ...mapMutations({
        'setPreOrderList': SET_PRE_ORDER_LIST,
        'setCurrentPreOrder': SET_CURRENT_PRE_ORDER
      }),
      ...mapActions([
        'editPreOrderListByPay',
        'editPreOrderListByCancel'
      ])
    },
    components: {
      MHeader,
      CategoryScroll,
      Scroll,
      NoResult,
      FullLoading,
      Toast,
      ConfirmInput
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  .adopt-list-wrapper {
    background: #fff;
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
      height: 0.8rem;
      margin-top: 0.88rem;
      font-size: 0;
      display: flex;
      align-items: center;
      justify-content: space-around;
      border-bottom: 1px solid $color-border;
      .active {
        color: $primary-color;
        border-bottom: 1px solid $primary-color;
      }
      span {
        font-size: $font-size-medium-x;
        line-height: 0.42rem;
      }
    }
    .category-wrapper {
      width: 100%;
      z-index: 100;
      overflow: hidden;
      height: 0.9rem;
      line-height: 0.9rem;
      background: #fff;
      border-bottom: 1px solid $color-border;
    }
    .category-item{
      padding: 0.1rem 0.33rem;
      background: #F0F0F0;
      border-radius: 1rem;
      font-size: $font-size-small;
      line-height: 0.33rem;
      color: #999;
    }
    .status {
      height: 0.9rem;
      font-size: 0;
      align-content: center;
      overflow-x: auto;
      overflow-y: hidden;

      .wrap{
        width: 8.5rem;
        overflow: hidden;
      }

      .active {
        background: $primary-color;
        color: $color-highlight-background;
      }
      span {
        display: inline-block;
        padding: 0.1rem 0.33rem;
        background: #F0F0F0;
        border-radius: 1rem;
        font-size: $font-size-small;
        line-height: 0.33rem;
        color: #999;
        float: left;
        margin-left: 0.3rem;
        margin-top: 0.2rem;

        &:first-child {
          margin-left: 0.15rem;
        }
      }
    }
    .gray {
      width: 100%;
      height: 0.2rem;
      padding: 0;
      background: #f5f5f5;
    }
    .order-list {
      background: $color-highlight-background;
      position: absolute;
      top: 1.08rem;
      bottom: 0;
      left: 0;
      right: 0;
      .item {
        width: 100%;
        /*height: 2.3rem;*/
        font-size: $font-size-medium-x;
        line-height: 1.1rem;
        border-bottom: 1px solid #eee;
        /*display: flex;*/
        /*align-items: center;*/
        .top {
          padding: 0.17rem 0.3rem;
          font-size: $font-size-small;
          line-height: 0.33rem;
          color: #666;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid $color-border;
          .item-status {
            color: #FE5656;
            line-height: 0.33rem;
            display: inline;
          }
        }
        .info {
          display: flex;
          font-size: 0;
          padding: 0.3rem;
          .imgWrap {
            width: 1.5rem;
            height: 1.5rem;
            flex: 0 0 1.5rem;
            margin-right: 0.2rem;
            border-radius: 0.08rem;
            position: relative;
            overflow: hidden;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
          }
          .text {
            display: flex;
            flex-direction: column;
            width: 100%;
            .title {
              font-size: 0.3rem;
              line-height: 0.42rem;
              margin-bottom: 0.17rem;
              display: flex;
              justify-content: space-between;
              flex: 1;
              .title-number {
                color: #999;
                font-size: 0.24rem;
                line-height: 0.33rem;
              }
            }
            .position {
              font-size: 0.24rem;
              line-height: 0.33rem;
              color: #999;
              margin-bottom: 0.25rem;
            }
            .props {
              font-size: $font-size-small;
              line-height: 0.33rem;
              color: #999;
              display: flex;
              justify-content: space-between;
              .duration {
                letter-spacing: 0.2px;
              }
              .price {
                font-family: DIN-Bold;
                font-size: 0.3rem;
                color: #151515;
                letter-spacing: 0.23px;
                line-height: 0.3rem;
              }
            }
          }
        }
        .btns {
          padding: 0.18rem 0.3rem;
          border-top: 1px solid $color-border;

          .btn {
            font-size: 0.26rem;
            display: inline-block;
            margin-left: 0.2rem;
            padding: 0 0.2rem;
            height: 0.6rem;
            line-height: 0.6rem;
            border: 1px solid $primary-color;
            border-radius: 0.06rem;
            color: $primary-color;
            confirm-wrapper
            &.cancel {
              border-color: #ccc;
              color: $color-text-l;
            }
          }
        }
      }
    }
  }
</style>
