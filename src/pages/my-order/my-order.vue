<template>
  <div class="adopt-list-wrapper">
    <m-header class="cate-header" title="我的订单"></m-header>
    <div class="type">
      <span @click="changeType(0)" :class="type === 0 ? 'active' : ''">全部</span>
      <span @click="changeType(1)" :class="type === 1 ? 'active' : ''">个人</span>
      <span @click="changeType(2)" :class="type === 2 ? 'active' : ''">定向</span>
      <span @click="changeType(3)" :class="type === 3 ? 'active' : ''">集体</span>
      <span @click="changeType(4)" :class="type === 4 ? 'active' : ''">捐赠</span>
    </div>
    <div class="category-wrapper">
      <category-scroll :currentIndex="currentIndex"
                       :categorys="categorys"
                       @select="selectCategory"></category-scroll>
    </div>
    <!-- 状态(0待支付1已取消2待认养3认养中4已到期) -->
    <!--<div class="status">-->
      <!--<div class="wrap">-->
        <!--<span @click="changeStatus(0)" :class="status === 0 ? 'active' : ''">待支付</span>-->
        <!--<span @click="changeStatus(2)" :class="status === 2 ? 'active' : ''">待认养</span>-->
        <!--<span @click="changeStatus(3)" :class="status === 3 ? 'active' : ''">认养中</span>-->
        <!--<span @click="changeStatus(1)" :class="status === 1 ? 'active' : ''">已取消</span>-->
        <!--<span @click="changeStatus(4)" :class="status === 4 ? 'active' : ''">已到期</span>-->
      <!--</div>-->
    <!--</div>-->
    <div class="gray"></div>
    <div class="order-list">
      <Scroll>
      <!--<Scroll ref="scroll"-->
              <!--:data="currentList.data"-->
              <!--:hasMore="currentList.hasMore"-->
              <!--@pullingUp="getPageOrders">-->
        <div class="item" @click="go('/order-detail')">
          <div class="top">
            <span class="item-code">D2986508238869</span>
            <span class="item-status">待支付</span>
          </div>
          <div class="info">
            <img src="./tree@3x.png">
            <div class="text">
              <p class="title">古树名称</p>
              <p class="position">浙江 杭州</p>
              <div class="props"><span class="duration">年限：1年</span><span class="price">¥2480.00</span></div>
            </div>
          </div>
          <!--<div class="clearfix btns" v-show="showBtns(item.status)">-->
            <!--<span class="btn fr" v-show="showPayBtn(item.status)" @click.stop="payOrder(item)">立即支付</span>-->
            <!--<span class="btn cancel fr" v-show="showCancelBtn(item.status)" @click.stop="_cancelOrder(item)">取消订单</span>-->
          <!--</div>-->
          <div class="gray"></div>
        </div>
      </Scroll>
    </div>
    <full-loading v-show="fetching" :title="fetchText"></full-loading>
  </div>
</template>
<script>
  import {CATEGORYS, ORDER_STATUS} from './config';
  import CategoryScroll from 'base/category-scroll/category-scroll';
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import NoResult from 'base/no-result/no-result';
  import FullLoading from 'base/full-loading/full-loading';
  import Toast from 'base/toast/toast';
  import Confirm from 'base/confirm/confirm';
  import {mapGetters, mapMutations, mapActions} from 'vuex';
  import {SET_ORDER_LIST, SET_CURRENT_ORDER} from 'store/mutation-types';
  import {getPageOrders} from 'api/biz';
  import {formatImg, setTitle} from 'common/js/util';
  import defaultImg from './tree@3x.png';

  export default {
    data() {
      return {
        type: 0,
        status: 0,
        currentCode: '',
        currentGoodsCode: '',
        fetching: false,
        categorys: CATEGORYS,
        currentIndex: +this.$route.query.index || 0,
        toastText: ''
      };
    },
    created() {
      this.first = true;
      this.getInitData();
    },
    computed: {
      currentList() {
        let _curListObj = this.orderList[this.categorys[this.currentIndex].key];
        if (!_curListObj) {
          _curListObj = {
            start: 1,
            limit: 10,
            hasMore: true,
            data: [],
            key: this.categorys[this.currentIndex].key,
            type: this.type
          };
        }
        return _curListObj;
      },
      ...mapGetters(['orderList'])
    },
    methods: {
      getInitData() {
        if (this.shouldGetData()) {
          this.first = false;
          // 清除缓存的订单列表数据
          this.setOrderList({});
          this.getPageOrders();
        }
      },
      shouldGetData() {
        if (this.$route.path === '/my-order') {
          setTitle('订单列表');
          return this.first;
        }
        return false;
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
        this.setOrderList({});
        this.getPageOrders();
      },
      changeStatus(index) {
        this.status = index;
      },
      formatStatus(status) {
        return ORDER_STATUS[status];
      },
      goProductDetail() {
        this.$router.push('/product-detail');
      },
      selectCategory(index) {
        this.currentIndex = index;
        this.$refs.scroll.scrollTo(0, 0);
        if (!this.currentList.data.length && this.currentList.hasMore) {
          this.getPageOrders();
        }
      },
      getPageOrders() {
        let key = this.categorys[this.currentIndex].key;
        let status = key === 'all' ? '' : key;
        console.log(this.currentList.hasMore);
        if (this.currentList.hasMore) {
          getPageOrders(this.currentList.start, this.currentList.limit, status, this.type).then((data) => {
            let _orderOri = this.orderList[key];
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
              ...this.orderList,
              [_currentList['key']]: _currentList
            };
            this.setOrderList(_orderList);
          });
        }
      },
      ...mapMutations({
        'setOrderList': SET_ORDER_LIST,
        'setCurrentOrder': SET_CURRENT_ORDER
      }),
      ...mapActions([
        'editOrderListByRating',
        'editOrderListByCancel',
        'editOrderListByReceived',
        'editOrderListByTk'
      ])
    },
    components: {
      MHeader,
      CategoryScroll,
      Scroll,
      NoResult,
      FullLoading,
      Confirm,
      Toast
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
      top: 2.88rem;
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
          img {
            width: 1.5rem;
            height: 1.5rem;
            flex: 0 0 1.5rem;
            margin-right: 0.2rem;
            border-radius: 0.08rem;
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

              }
              .price {
                font-family: DIN-Bold;
                font-size: $font-size-medium-x;
                color: #151515;
              }
            }
          }
        }
      }
    }
  }
</style>
