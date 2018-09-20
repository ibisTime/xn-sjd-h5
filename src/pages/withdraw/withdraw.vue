<template>
  <div class="me-wrapper full-screen-wrapper">
    <div class="bg">
      <m-header class="cate-header" title="提现"></m-header>
      <div class="content">
        <div class="bk">
          <img src="./bankcard@2x.png" alt="">
          <span>招商储蓄卡（8869）</span>
          <img src="./more@2x.png" alt="" class="fr more">
        </div>
        <div class="gray"></div>
        <div class="recharge">
          <p>提现金额（收取 0.1%服务费）</p>
          <p class="number"><input type="number" v-model="amount"></p>
          <div class="have">
            <span class="fl">可用余额 2480.00元</span>
            <span class="fr">全部提取</span>
          </div>
        </div>
        <div class="gray"></div>
        <div class="withdraw-rules">
          <p>提取规则：</p>
          <p>1.每月最大提现次数100次；</p>
          <p>2.提现金额必须是5的倍数，单笔最高5000元；</p>
          <p>3.T+1到账</p>
        </div>
      </div>
      <div class="btn"><button>提现</button></div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
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
      setTitle('提现');
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
        .bk {
          width: 100%;
          height: 1.1rem;
          line-height: 1.1rem;
          font-size: $font-size-medium-x;
          color: #333;
          border-bottom: 1px solid $color-border;
          img {
            height: 0.36rem;
            margin-right: 0.12rem;
            vertical-align: middle;
          }
          span {
            font-size: $font-size-medium-x;
            color: #333;
            vertical-align: middle;
          }
          .more {
            margin-top: 0.35rem;
          }
        }
        .recharge {
          padding-top: 0.34rem;
          p {
            font-size: $font-size-medium-s;
            color: #666;
            margin-bottom: 0.15rem;
          }
          p.number {
            font-weight: bold;
            color: #141414;
            border-bottom: 1px solid $color-border;
            input {
              font-size: 0.64rem;
            }
          }
          .have {
            padding: 0.24rem 0;
            height: 0.8rem;
            span {
              font-size: $font-size-small;
              color: $primary-color;
            }
            span:first-child {
              color: $color-text-l;
            }
          }
        }
        .gray {
          width: 100%;
          height: 0.2rem;
          padding: 0;
          background: transparent;
        }
        .withdraw-rules {
          padding-top: 0.28rem;
          font-size: $font-size-small;
          color: $color-text-l;
          margin-bottom: 1.04rem;
          p {
            line-height: 0.36rem;
          }
        }
      }
      .btn {
        padding: 0 0.3rem;
        button {
          width: 100%;
          height: 0.84rem;
          background: $primary-color;
          color: $color-highlight-background;
          border-radius: 0.08rem;
          font-size: $font-size-medium-xx;
        }
      }
    }
  }
</style>
