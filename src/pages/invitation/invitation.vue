<template>
  <div class="me-wrapper full-screen-wrapper">
    <div class="bg full-screen-wrapper">
      <m-header class="cate-header" title="邀请好友"></m-header>
      <div class="content">
        <div class="border">
          <div class="erweimaPic" id="qrcode"></div>
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
  const QRCode = require('js-qrcode');
  import MHeader from 'components/m-header/m-header';
  import {setTitle} from 'common/js/util';
  import { getCookie } from 'common/js/cookie';
  import { getConfig } from 'api/general';
  export default {
    data() {
      return {
        wechat: true,
        alipay: false,
        balance: false,
        amount: 0,
        url: ''
      };
    },
    mounted() {
      setTitle('邀请');
      this.userId = getCookie('userId');
      getConfig('REGISTER_URL').then((res) => {
        this.url += `${res.cvalue}&userRefereeType=U&userReferee=${this.userId}`;
        // 用插件生成二维码
        const container = document.getElementById('qrcode');

        // 设置转换二维码图片的参数
        const qr = new QRCode(container, {
          width: 474,
          height: 474,
          typeNumber: -1,
          correctLevel: 2,
          background: '#ffffff',
          foreground: '#000000'
        });
        qr.make(this.url);
      });
    },
    methods: {
      getUrl() {
        getConfig('REGISTER_URL').then((res) => {
          console.log(res);
        });
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
