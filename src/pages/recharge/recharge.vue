<template>
  <div class="me-wrapper full-screen-wrapper">
    <div class="bg">
      <m-header class="cate-header" title="充值"></m-header>
      <div class="content">
        <div class="have">当前余额：2480.00元</div>
        <div class="recharge">
          <p>充值金额</p>
          <p class="number">¥<input type="number" v-model="amount"></p>
        </div>
        <div class="gray"></div>
        <div class="pay-type">
          <p>支付方式</p>
          <div class="pay-type-list">
            <div @click="selectPayType(1)">
              <img src="./wechat@2x.png" alt="">
              <div class="text">
                <p>微信</p>
              </div>
              <img class="money fr" src="./choosed@2x.png" v-show="wechat">
              <img class="money fr" src="./unchoosed@2x.png" v-show="!wechat">
            </div>
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
                <p>余额支付（剩余¥10.00）</p>
              </div>
              <img class="money fr" src="./choosed@2x.png" v-show="balance">
              <img class="money fr" src="./unchoosed@2x.png" v-show="!balance">
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <span>金额：<span>{{amount}}</span><span>元</span></span>
        <button class="fr">支付</button>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import {setTitle} from 'common/js/util';

  export default {
    data() {
      return {
        wechat: true,
        alipay: false,
        balance: false,
        amount: 0
      };
    },
    created() {
      setTitle('充值');
    },
    methods: {
      getTel() {
        if (this.telephone) {
          return `tel://${this.telephone}`;
        } else {
          return '';
        }
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
      }
    },
    components: {
      Scroll,
      MHeader
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
        padding: 0.88rem 0 0 0;
        margin-bottom: 0.98rem;
        background: #f5f5f5;
        div {
          padding: 0 0.3rem;
          background: #ffffff;
        }
        .have {
          width: 100%;
          height: 1.1rem;
          line-height: 1.1rem;
          font-size: $font-size-medium-x;
          color: #333;
          border-bottom: 1px solid $color-border;
        }
        .recharge {
          padding-top: 0.34rem;
          padding-bottom: 0.53rem;
          p {
            font-size: $font-size-medium-s;
            color: #666;
            margin-bottom: 0.15rem;
          }
          p.number {
            font-weight: bold;
            color: #141414;
            input {
              font-size: 0.64rem;
            }
          }
        }
        .gray {
          width: 100%;
          height: 0.2rem;
          padding: 0;
          background: transparent;
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
              height: 1.5rem;
              font-size: $font-size-medium-x;
              line-height: 1.5rem;
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
        }
      }
    }
  }
</style>
