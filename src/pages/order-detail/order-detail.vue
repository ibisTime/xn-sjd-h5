<template>
  <div class="adopt-list-wrapper">
    <m-header class="cate-header" title="订单详情"></m-header>
    <div class="header-height"></div>
    <div class="status" v-show="detail.status === '4'">
      <img src="./overdue@1.5x.png" class="icon">
      <p class="status-text">订单已过期</p>
    </div>
    <div class="gray"></div>
    <div class="order-list">
      <Scroll :pullUpLoad="pullUpLoad">
        <div class="item" @click="go('/product-detail?code='+detail.productCode)">
          <div class="top">
            <span class="item-code">{{detail.code}}</span>
            <span class="item-status">{{formatStatus(detail.status)}}</span>
          </div>
          <div class="info">
            <div class="imgWrap" :style="getImgSyl(detail.product.listPic)"></div>
            <div class="text">
              <p class="title"><span class="title-title">{{detail.product.name}}</span><span class="title-number" v-show="detail.status === '3' || detail.status === '4'">x{{detail.adoptOrderTreeList.length}}</span></p>
              <p class="position">{{detail.product.province}} {{detail.product.city}} {{detail.product.area}}</p>
              <div class="props"><span class="duration">年限：{{detail.adoptYear}}</span><span class="price" v-show="!detail.jfDeductAmount">¥{{formatAmount(detail.price)}}</span><span class="price" v-show="detail.jfDeductAmount">¥{{formatAmount(detail.payAmount)}}+{{formatAmount(detail.jfDeductAmount)}}积分</span></div>
            </div>
          </div>
          <div class="gray"></div>
        </div>
        <div class="treeList" v-show="detail.status === '3'">
          <div class="top">
            <span class="item-code">树木列表</span>
          </div>
          <div class="info" v-for="(item, index) in detail.treeList" @click="goTree(index)">
            <div class="imgWrap" :style="getImgSyl(item.pic)"></div>
            <div class="text">
              <p class="title"><span class="title-title">{{item.treeNumber}}</span><span class="title-number">x1</span></p>
              <div class="props"><span class="duration">树龄：{{item.age}}</span><span class="price">¥{{formatAmount(detail.price)}}</span></div>
            </div>
          </div>
        </div>
        <div class="gray"></div>
        <div class="duration">
          <div class="duration-item"><span class="name">起始时间</span><span>{{formatDate(detail.startDatetime, 'yyyy-MM-dd')}}</span></div>
          <div class="duration-item"><span class="name">终止时间</span><span>{{formatDate(detail.endDatetime, 'yyyy-MM-dd')}}</span></div>
        </div>
      </Scroll>
    </div>
    <div class="btns" v-show="showBtns(detail.status)">
      <div class="btn cancel" v-show="showCancelBtn(detail.status)" @click="_cancelOrder(detail)">取消订单</div>
      <div class="btn" v-show="showPayBtn(detail.status)" @click="payOrder(detail)">立即支付</div>
    </div>
    <!--<div class="btns" v-show="detail.adoptOrderTreeList.length && detail.adoptOrderTreeList[0].status === '2'">-->
      <!--<div class="btn" @click="goTree">看看这棵树</div>-->
    <!--</div>-->
    <full-loading v-show="loading" :title="loadingText"></full-loading>
    <confirm-input ref="confirmInput" :text="inputText" @confirm="handleInputConfirm"></confirm-input>
    <toast :text="toastText" ref="toast"></toast>
  </div>
</template>
<script>
  import {ORDER_STATUS} from 'common/js/dict';
  import Toast from 'base/toast/toast';
  import Scroll from 'base/scroll/scroll';
  import FullLoading from 'base/full-loading/full-loading';
  import ConfirmInput from 'base/confirm-input/confirm-input';
  import Slider from 'base/slider/slider';
  import NoResult from 'base/no-result/no-result';
  import MHeader from 'components/m-header/m-header';
  import { formatAmount, formatImg, formatDate } from 'common/js/util';
  import { getOrderDetail, getOrganizeOrderDetail, cancelOrder } from 'api/biz';
  import defaultImg from './tree@3x.png';

  export default {
    data() {
      return {
        title: '正在加载...',
        type: '',
        loading: true,
        toastText: '',
        inputText: '',
        loadingText: '',
        text: '',
        pullUpLoad: null,
        detail: {product: {}, adoptOrderTreeList: {}},
        choosedIndex: 0,
        code: ''   // 产品code
      };
    },
    methods: {
      formatAmount(amount) {
        return formatAmount(amount);
      },
      formatImg(img) {
        return formatImg(img);
      },
      formatDate(date, format) {
        return formatDate(date, format);
      },
      formatStatus(status) {
        return ORDER_STATUS[status];
      },
      go(url) {
        this.$router.push(url);
      },
      chooseSpecs(index) {
        this.choosedIndex = index;
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
      payOrder(item) {
        this.$router.push(`/pay?orderCode=${item.code}&type=${item.type}`);
      },
      handleInputConfirm(text) {
        this.loading = true;
        if (this.curItem.status === '0') {
          this.cancelOrder(text);
        }
      },
      cancelOrder(text) {
        this.loadingText = '取消中...';
        cancelOrder(this.curItem.code, text).then(() => {
          this.loading = false;
          this.editOrderListByCancel({
            code: this.curItem.code
          });
        }).catch(() => {
          this.loading = false;
        });
      },
      _cancelOrder(item) {
        this.inputText = '取消原因';
        this.curItem = item;
        this.$refs.confirmInput.show();
      },
      getImgSyl(imgs) {
        let img = imgs ? formatImg(imgs) : defaultImg;
        return {
          backgroundImage: `url(${img})`
        };
      },
      // 点击树木列表时触发的事件
      goTree(index) {
        if(this.detail.adoptOrderTreeList[index].status === '2') {
          this.go(`/my-tree?aTCode=${this.detail.adoptOrderTreeList[index].code}`);
        } else {
          this.toastText = '这棵树已经被赠送或到期咯';
          this.$refs.toast.show();
        }
      }
    },
    mounted() {
      this.pullUpLoad = null;
      this.code = this.$route.query.code;
      this.type = this.$route.query.type;// 订单类型（1个人/2定向/3捐赠/4集体）
      this.loading = true;
      if(this.type === '4') {
        Promise.all([
          getOrganizeOrderDetail({
            code: this.code
          })
        ]).then(([res1]) => {
          this.loading = false;
          this.detail = res1;
        }).catch(() => { this.loading = false; });
      } else {
        Promise.all([
          getOrderDetail({
            code: this.code
          })
        ]).then(([res1]) => {
          this.loading = false;
          this.detail = res1;
        }).catch(() => { this.loading = false; });
      }
    },
    components: {
      FullLoading,
      Slider,
      NoResult,
      MHeader,
      Scroll,
      Toast,
      ConfirmInput
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  .header-height{
    width: 100%;
    height: 0.88rem;
  }
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
    .status {
      padding: 0.56rem;
      text-align: center;
      left: 0;
      .icon {
        width: 0.96rem;
        height: 0.96rem;
        margin-bottom: 0.2rem;
      }
      .status-text {
        font-family: 'PingFangSC-Semibold';
        color: #2D2D2D;
        font-size: $font-size-medium-x;
        line-height: 0.42rem;
      }
    }
    .gray {
      width: 100%;
      height: 0.2rem;
      padding: 0;
      background: #f5f5f5;
    }
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
    .order-list {
      background: $color-highlight-background;
      .item {
        width: 100%;
        font-size: $font-size-medium-x;
        line-height: 1.1rem;
        border-bottom: 1px solid #eee;
      }
      .treeList {
        .info {
          border-bottom: 1px solid $color-border;
        }
      }
    }
    .btns {
      display: flex;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 0.98rem;
      line-height: 0.98rem;
      font-size: $font-size-large-s;
      color: #fff;
      border-top: 1px solid $color-border;

      .btn {
        flex: 1;
        text-align: center;
        background-color: $primary-color;

        &.cancel {
          color: $color-text;
          background: #fff;
        }
      }
    }
    .duration {
      font-size: $font-size-medium-s;
      line-height: 0.37rem;
      font-family: 'PingFangSC-Medium';
      .duration-item {
        padding: 0.37rem 0.3rem;
        border-bottom: 1px solid $color-border;
        .name {
          margin-right: 0.76rem;
        }
      }
    }
  }
</style>
