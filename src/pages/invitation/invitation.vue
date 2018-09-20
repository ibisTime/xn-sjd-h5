<template>
  <div class="me-wrapper full-screen-wrapper">
    <div class="bg full-screen-wrapper">
      <m-header class="cate-header" title="邀请好友"></m-header>
      <div class="content">
        <div class="border">
          <img src="./code.png" alt="">
        </div>
        <div class="text">
          <span class="wing"></span>
          <span>扫 描 二 维 码 ，惊 喜 不 断</span>
          <span class="wing"></span>
        </div>
      </div>
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
      background: url("invitation@2x.png") no-repeat;
      background-size: 100% 100%;
      margin-top: 0.88rem;
      .title {
        font-size: 0.36rem;
        color: #fff;
        padding-top: 0.19rem;
        text-align: center;
      }
      .content {
        background: #fff;
        width: 6.54rem;
        margin: 2.92rem auto auto;
        border-radius: 0.3rem;
        text-align: center;
        position: fixed;
        top: 0.88rem;
        left: 0;
        right: 0;
        .border {
          background: url("./border@2x.png") no-repeat;
          width: 5.34rem;
          height: 5.34rem;
          background-size: 100% 100%;
          margin: 0.6rem auto 0;
          img {
            width: 4.74rem;
            height: 4.74rem;
            margin-top: 0.3rem;
          }
        }
        .text {
          padding-top: 0.8rem;
          padding-bottom: 0.74rem;
          font-size: 0.24rem;
          text-align: center;
          color: #999;
          img {
            width: 0.4rem;
            height: 0.34rem;
          }
          .wing {
            width: 0.3rem;
            border-top: 1px solid #ebebeb;
            height: 43%;
            display: inline-block;
          }
        }
      }
    }
  }
</style>
