<template>
  <div class="booking-order-detail-wrapper">
    <div class="content" :style="{'bottom': showBtns(detail.status) ? '0.98rem' : '0'}">
      <Scroll :pullUpLoad="pullUpLoad">
        <div class="scroll-scroll">
          <div class="status">
            <!--<img src="./overdue@1.5x.png" class="icon">-->
            <img src="./daizhifu@2x.png" class="icon" v-if="detail.status === '0'">
            <img src="./yiquxiao@2x.png" class="icon" v-if="detail.status === '1'">
            <p class="status-text">订单{{statusObj[detail.status]}}</p>
            <!--<p class="remaining-time">剩余时间：20:00</p>-->
          </div>
          <div class="gray"></div>
          <div class="order-list">
            <!--<Scroll :pullUpLoad="pullUpLoad">-->
            <div class="item" @click="go('/booking-product-list/booking-product-detail?code='+detail.productCode)">
              <div class="top">
                <span class="item-code">{{detail.sellerName}}</span>
                <span class="item-status">{{statusObj[detail.status]}}</span>
              </div>
              <div class="info">
                <div class="imgWrap" :style="getImgSyl(detail.presellProduct.listPic)"></div>
                <div class="text">
                  <p class="title"><span class="title-title">{{detail.presellProduct.name}}</span><span class="title-number">x{{detail.quantity}}</span></p>
                  <p class="position">预售规格：{{detail.specsName}}</p>
                  <div class="props"><span class="duration">合计{{detail.quantity}}件商品</span><span class="price">¥{{formatAmount(detail.amount)}}</span></div>
                </div>
              </div>
              <div class="gray"></div>
            </div>
            <div class="order-info">
              <div class="order-info-title">订单信息</div>
              <div class="order-info-content">
                <p><span>订单号</span><span>{{detail.code}}</span></p>
                <p><span>订单金额</span><span>{{formatAmount(detail.amount)}}元</span></p>
                <p><span>卖家</span><span>{{detail.sellerName}}</span></p>
                <p v-if="detail.jourCode"><span>支付流水号</span><span>{{detail.jourCode}}</span></p>
                <p><span>预计发货时间</span><span>{{formatDate(detail.presellProduct.harvestDatetime)}}</span></p>
                <p v-if="detail.treeNumbers"><span>树木编号</span><span>{{detail.treeNumbers}}</span></p>
                <p><span>数量</span><span>{{detail.quantity}}</span></p>
              </div>
            </div>
            <!--</Scroll>-->
          </div>
        </div>
      </Scroll>
      <div class="btns" v-show="showBtns(detail.status)">
        <div class="btn cancel" v-show="showCancelBtn(detail.status)" @click="_cancelOrder(detail)">取消订单</div>
        <div class="btn" v-show="showPayBtn(detail.status)" @click="payOrder(detail)">立即支付</div>
      </div>
    </div>
    <full-loading v-show="loading" :title="loadingText"></full-loading>
    <confirm-input ref="confirmInput" :text="inputText" @confirm="handleInputConfirm"></confirm-input>
    <toast :text="toastText" ref="toast"></toast>
  </div>
</template>
<script>
  import Toast from 'base/toast/toast';
  import Scroll from 'base/scroll/scroll';
  import FullLoading from 'base/full-loading/full-loading';
  import ConfirmInput from 'base/confirm-input/confirm-input';
  import Slider from 'base/slider/slider';
  import NoResult from 'base/no-result/no-result';
  import MHeader from 'components/m-header/m-header';
  import { formatAmount, formatImg, formatDate, setTitle } from 'common/js/util';
  import { getPreOrderDetail, cancelPreOrder } from 'api/biz';
  import { getDictList } from 'api/general';
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
        detail: {presellProduct: {listPic: ''}, adoptOrderTreeList: {}},
        choosedIndex: 0,
        code: '',   // 产品code,
        statusObj: {}
      };
    },
    methods: {
      formatAmount(amount) {
        return formatAmount(amount);
      },
      formatImg(img) {
        return formatImg(img);
      },
      formatDate(date) {
        return formatDate(date, 'yyyy-MM-dd');
      },
      go(url) {
        this.$router.push(url);
      },
      chooseSpecs(index) {
        this.choosedIndex = index;
      },
      showBtns(status) {
        if(status !== '0') {
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
        this.go(`/pay?pre=1&orderCode=${item.code}`);
      },
      handleInputConfirm(text) {
        if (this.curItem.status === '0') {
          this.cancelOrder(text);
        }
      },
      cancelOrder(text) {
        this.loading = true;
        cancelPreOrder({
          code: this.curItem.code,
          remark: text
        }).then(() => {
          this.loading = false;
          location.reload();
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
      }
    },
    mounted() {
      setTitle('预售订单详情');
      this.pullUpLoad = null;
      this.code = this.$route.query.code;
      this.loading = true;
      Promise.all([
        getPreOrderDetail({
          code: this.code
        }),
        getDictList('presell_order_status')
      ]).then(([res1, res2]) => {
        this.loading = false;
        this.detail = res1;
        res2.map((item) => {
          this.statusObj[item.dkey] = item.dvalue;
        });
      }).catch(() => { this.loading = false; });
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
  .booking-order-detail-wrapper {
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
    .content {
      position: absolute;
      top: 0;
      bottom: 0.98rem;
      left: 0;
      right: 0;
      overflow: auto;
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
          margin-bottom: 0.12rem;
        }
        .remaining-time {
          font-family: 'PingFang-SC-Medium';
          font-size: 0.3rem;
          color: #FE5656;
          letter-spacing: 0.25px;
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
              font-weight: 600;
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
      }
      .btns {
        display: flex;
        /*position: absolute;*/
        position: fixed;
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
      .order-info {
        padding: 0.3rem;
        color: #2D2D2D;
        .order-info-title {
          font-size: 0.3rem;
          letter-spacing: 0.25px;
          margin-bottom: 0.42rem;
        }
        .order-info-content {
          font-size: 0.26rem;
          letter-spacing: 0.22px;
          p {
            margin-bottom: 0.3rem;
            span:first-child {
              width: 30%;
              display: inline-block;
            }
          }
        }
      }
    }
  }
</style>
