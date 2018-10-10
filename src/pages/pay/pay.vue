<template>
  <div class="me-wrapper full-screen-wrapper">
    <div class="bg">
      <!--<m-header class="cate-header" title="支付订单"></m-header>-->
      <div class="content">
        <div class="pay-type">
          <p>支付方式</p>
          <div class="pay-type-list">
            <!--<div @click="selectPayType(1)">-->
              <!--<img src="./wechat@2x.png" alt="">-->
              <!--<div class="text">-->
                <!--<p>微信</p>-->
              <!--</div>-->
              <!--<img class="money fr" src="./choosed@2x.png" v-show="wechat">-->
              <!--<img class="money fr" src="./unchoosed@2x.png" v-show="!wechat">-->
            <!--</div>-->
            <div @click="selectPayType(2)">
              <img src="./alipay@2x.png" alt="">
              <div class="text">
                <p>支付宝</p>
              </div>
              <img class="money fr" src="./choosed@2x.png" v-show="alipay">
              <img class="money fr" src="./unchoosed@2x.png" v-show="!alipay">
            </div>
            <div @click="selectPayType(3)">
              <img src="./balance@2x.png" alt="">
              <div class="text">
                <p>余额支付（剩余¥{{formatAmount(cny)}}）</p>
              </div>
              <img class="money fr" src="./choosed@2x.png" v-show="balance">
              <img class="money fr" src="./unchoosed@2x.png" v-show="!balance">
            </div>
          </div>
        </div>
        <div class="gray"></div>
        <div class="score">
          <p>积分抵扣</p>
          <div class="info-item">使用{{formatAmount(rate.jfAmount)}}积分抵扣{{formatAmount(rate.cnyAmount)}}元（剩余{{formatAmount(jf)}}积分）
            <div class="label">
              <switch-option class="option" :value="isPublish" @update:value="updatePublish"></switch-option>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <span>金额：<span>{{formatAmount(amount)}}</span><span>元</span></span>
        <button class="fr" @click="pay">支付</button>
      </div>
    </div>
    <confirm-input ref="confirmInput" :inpType="'password'" :text="inputText" @confirm="handleInputConfirm"></confirm-input>
    <toast ref="toast" :text="text"></toast>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import SwitchOption from 'base/switch-option/switch-option';
  import Toast from 'base/toast/toast';
  import ConfirmInput from 'base/confirm-input/confirm-input';
  import { getCookie } from 'common/js/cookie';
  import { formatAmount, setTitle } from 'common/js/util';
  import { getOrderDetail, getAccount, payOrder, payOrganizeOrder, getOrganizeOrderDetail, getDeductibleAmount } from 'api/biz';
  import { getUserDetail } from 'api/user';

  export default {
    data() {
      return {
        text: '',
        // wechat: true,    // 微信支付
        alipay: false,   // 支付宝支付
        balance: true,  // 余额支付
        isPublish: false,
        cny: 0,
        jf: 0,
        amount: 0,
        rate: 0,
        inputText: ''
      };
    },
    mounted() {
      setTitle('支付订单');
      this.orderCode = this.$route.query.orderCode || '';
      let userId = getCookie('userId');
      this.loading = true;
      if(this.orderCode[0] === 'G') {
        // 集体订单
        Promise.all([
          getOrganizeOrderDetail({
            code: this.orderCode
          }),
          getAccount({
            userId: userId
          }),
          getDeductibleAmount(this.orderCode),
          getUserDetail({userId: userId})
        ]).then(([res1, res2, res3, res4]) => {
          this.amount = res1.amount;
          this.rate = res3;
          res2.list.map((item) => {
            if(item.currency === 'CNY') {
              this.cny = item.amount;
            }
            if(item.currency === 'JF') {
              this.jf = item.amount;
            }
          });
          this.userDetail = res4;
        });
      } else {
        // 非集体订单
        Promise.all([
          getOrderDetail({
            code: this.orderCode
          }),
          getAccount({
            userId: userId
          }),
          getDeductibleAmount(this.orderCode),
          getUserDetail({userId: userId})
        ]).then(([res1, res2, res3, res4]) => {
          this.amount = res1.amount;
          this.rate = res3;
          res2.list.map((item) => {
            if(item.currency === 'CNY') {
              this.cny = item.amount;
            }
            if(item.currency === 'JF') {
              this.jf = item.amount;
            }
          });
          this.userDetail = res4;
        });
      }
    },
    methods: {
      formatAmount(amount) {
        return formatAmount(amount);
      },
      go(url) {
        this.$router.push(url);
      },
      selectPayType(index) {
        if(index === 1) {
          this.wechat = true;
          this.alipay = false;
          this.balance = false;
        } else if(index === 2) {
          this.wechat = false;
          this.alipay = true;
          this.balance = false;
        } else if(index === 3) {
          this.wechat = false;
          this.alipay = false;
          this.balance = true;
        }
      },
      updatePublish(val) {
        this.isPublish = val;
      },
      pay() {
        this.payType = this.wechat ? '5' : this.alipay ? '3' : '1';
        if(!this.userDetail.tradepwdFlag && this.payType === '1') {
          this.text = '请先去设置支付密码';
          this.$refs.toast.show();
          setTimeout(() => {
            this.$router.push('/set-money');
          }, 1000);
        } else {
          if(this.payType === '1') {
            this.inputText = '支付密码';
            // this.curItem = item;
            this.$refs.confirmInput.show();
          } else {
            this.payOrder();
          }
        }
      },
      // 支付订单
      payOrder() {
        let isJfDeduct = this.isPublish ? 1 : 0;
        this.loading = true;
        if(this.orderCode[0] === 'G') {
          // 集体订单
          payOrganizeOrder({
            code: this.orderCode,
            payType: this.payType,
            isJfDeduct: isJfDeduct,
            tradePwd: this.pwd || ''
          }).then((res) => {
            this.loading = false;
            if(res) {
              if(this.payType === '3' && res.signOrder) {
                this._alipay(res);
              } else {
                this.paySuccess();
              }
            }
          }).catch(() => {
            this.loading = false;
          });
        } else {
          // 非集体订单
          payOrder({
            code: this.orderCode,
            payType: this.payType,
            isJfDeduct: isJfDeduct,
            tradePwd: this.pwd || ''
          }).then((res) => {
            this.loading = false;
            if(res) {
              if(this.payType === '3' && res.signOrder) {
                this._alipay(res);
              } else {
                this.paySuccess();
              }
            }
          }).catch(() => {
            this.loading = false;
          });
        }
      },
      _alipay(res) {
        this.text = '正在跳转支付宝...';
        this.$refs.toast.show();
        setTimeout(() => {
          location.href = res.signOrder;
        }, 1000);
      },
      paySuccess() {
        this.text = '支付成功';
        this.$refs.toast.show();
        setTimeout(() => {
          this.$router.push('/my-order');
        }, 1000);
      },
      // 输入支付密码后点击确定执行的方法
      handleInputConfirm(text) {
        this.pwd = text;
        this.payOrder();
      }
    },
    components: {
      Scroll,
      MHeader,
      SwitchOption,
      Toast,
      ConfirmInput
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  .me-wrapper {
    background: #fff;
    .fl {
      float: left;
    }
    .fr {
      float: right;
    }
    .bg {
      .title {
        font-size: 0.36rem;
        color: #fff;
        padding-top: 0.19rem;
        text-align: center;
      }
      .content {
        padding: 0 0 0 0;
        margin-bottom: 0.98rem;
        background: #f5f5f5;
        div {
          padding: 0 0.3rem;
          background: #ffffff;
        }
        .pay-type {
          padding-top: 0.5rem;
          p {
            font-size: 0.3rem;
            margin-bottom: 0.2rem;
          }
          div {
            padding: 0;
          }
          .pay-type-list {
            background: $color-highlight-background;
            div {
              width: 100%;
              height: 1.1rem;
              font-size: $font-size-medium-x;
              line-height: 1.1rem;
              border-bottom: 1px solid #eee;
              img {
                height: 0.36rem;
                vertical-align: middle;
                margin-right: 0.12rem;
              }
              .text {
                display: inline;
                border: none;
                p {
                  display: inline-block;
                  font-size: $font-size-small-s;
                  color: $color-text-l;
                  line-height: 0.30rem;
                }
                p:first-child {
                  font-size: 0.26rem;
                  color: #333;
                  line-height: 0.37rem;
                  margin-bottom: 0.15rem;
                }
              }
              .money {
                font-size: 0.3rem;
                color: #151515;
                margin-top: 0.5rem;
              }
            }
          }
        }
        .gray {
          width: 100%;
          height: 0.2rem;
          padding: 0;
          background: transparent;
        }
        .score {
          padding-top: 0.5rem;
          p {
            font-size: 0.3rem;
            margin-bottom: 0.2rem;
          }
          div {
            padding: 0;
          }
          .info-item {
            height: 1rem;
            line-height: 1rem;
            font-size: $font-size-medium-s;
            border-bottom: 1px solid $color-border;
            &.border-bottom-1px {
              border: 1px solid $color-border;
            }

            .label {
              float: right;
              color: $color-text-l;
              &.icon-right {
                padding-right: 0.3rem;
                background-repeat: no-repeat;
                background-size: 0.14rem;
                background-position: right center;
              }

              .option {
                margin-top: 0.19rem;
              }

              &.text {
                color: $color-text;
              }
            }
          }
        }
      }
      .footer {
        height: 0.98rem;
        padding: 0.07rem 0.3rem;
        border-top: 1px solid #eee;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        font-size: $font-size-medium-x;
        line-height: 0.7rem;
        background: #fff;
        span {
          span:first-child {
            color: $primary-color;
            font-size: $font-size-medium-x;
          }
          span {
            font-size: $font-size-small;
            color: #151515;
          }
        }
        button {
          width: 2.96rem;
          height: 0.84rem;
          border-radius: 0.08rem;
          background: $primary-color;
          color: $color-highlight-background;
          font-size: 0.3rem;
        }
      }
    }
    .switch-option .switch-ellipse[data-v-0037fbb0] {
      height: 0.5rem;
      width: 0.78rem;
    }
    .switch-option .switch-ellipse .switch-circle {
      width: 0.4rem;
      height: 0.4rem;
    }
  }
</style>
