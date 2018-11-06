<template>
  <div class="consignment-erweima-wrapper">
    <div class="bg">
      <div class="content">
        <p class="title">二维码转让/转赠</p>
        <div class="erweima-bg">
          <div class="erweimaPic" id="qrcode"></div>
        </div>
        <div class="text">{{this.message}}</div>
        <div class="buypart-bottom">
          <div class="confirm"
               v-clipboard:copy="message"
               v-clipboard:success="onCopy"
               v-clipboard:error="onError">复制二维码地址</div>
        </div>
      </div>
    </div>
    <full-loading v-show="loading"></full-loading>
    <toast ref="toast" :text="text"></toast>
  </div>
</template>
<script>
  const QRCode = require('js-qrcode');
  import FullLoading from 'base/full-loading/full-loading';
  import Toast from 'base/toast/toast';
  import {setTitle, getUserId} from 'common/js/util';
  import { getCookie } from 'common/js/cookie';
  import {initShare} from 'common/js/weixin';
  // import { getConfig } from 'api/general';
  // import { getUserDetail } from 'api/user';

  // import Logo from './logo-64.png';

  export default {
    data() {
      return {
        text: '',
        loading: false,
        wechat: true,
        alipay: false,
        balance: false,
        amount: 0,
        url: '',
        message: ''
      };
    },
    mounted() {
      setTitle('二维码转让');
      this.code = this.$route.query.code;
      this.isWxConfiging = false;
      this.wxData = null;
      this.userId = getCookie('userId') || this.$route.query.userId;
      this.loading = true;
      this.message = location.href.split('#')[0] + '#/consignment-hall/consignment-product-detail?buy=1&code=' + this.code;
      this.url = this.message;
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
      console.log(this.url);
      qr.make(this.url);
      if(!this.isWxConfiging && !this.wxData) {
        this.getInitWXSDKConfig();
      }
      this.loading = false;
    },
    methods: {
      go(url) {
        this.$router.push(url);
      },
      getInitWXSDKConfig() {
        this.loading = true;
        initShare({
          title: '氧林',
          desc: '二维码转让',
          link: location.href.split('#')[0] + '/#/invitation?userId=' + getUserId(),
          imgUrl: 'http://image.tree.hichengdai.com/FhDuAJ9CVvOGGgLV6CxfshkWzV9g?imageMogr2/auto-orient/thumbnail/!300x300'
        }, (data) => {
          this.isWxConfiging = false;
          this.wxData = data;
          this.loading = false;
        }, (msg) => {
          alert(msg);
          this.isWxConfiging = false;
          this.wxData = null;
          this.loading = false;
        });
      },
      onCopy: function (e) {
        this.text = '复制成功';
        this.$refs.toast.show();
      },
      onError: function (e) {
        console.log('无法复制文本！');
      }
    },
    components: {
      Toast,
      FullLoading
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  .consignment-erweima-wrapper {
    background: #fff;
    .fl {
      float: left;
    }
    .fr {
      float: right;
    }
    .bg {
      text-align: center;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 100%;
      .content {
        img {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
        }
        .title {
          /*margin-top: 1.1rem;*/
          margin-top: 0.9rem;
          margin-bottom: 0.32rem;
          font-size: 0.32rem;
          line-height: 0.45rem;
          color: #333;
        }
        .erweima-bg {
          width: 5.7rem;
          height: 5.7rem;
          background: url("./border@2x.png");
          background-size: 100% 100%;
          margin: 0 auto;
          padding-top: 0.52rem;
          .erweimaPic {
            width: 4rem;
            height: 4rem;
            z-index: 2;
            margin: 0 auto;
            border: 0.34rem solid white;
            border-radius: 0.16rem;
            box-sizing: content-box;
          }
        }
        .text {
          text-align: left;
          /*margin: 0.75rem 0.3rem 0.9rem;*/
          margin: 0.55rem 0.3rem 0.7rem;
          /*height: 1.1rem;*/
          padding: 0.3rem;
          font-size: 0.26rem;
          background: #FDFFFE;
          border: 2px solid #F0F0F0;
          box-shadow: 0 2px 16px 0 rgba(127,135,134,0.16);
          border-radius: 8px;
        }
        .buypart-bottom {
          /*<!--height: 0.98rem;-->*/
          /*<!--line-height: 0.9rem;-->*/
          /*<!--color: #fff;-->*/

          /*<!--position: absolute;-->*/
          /*<!--bottom: 0;-->*/
          /*<!--width: 100%;-->*/
          /*<!--left: 0;-->*/
          /*<!--padding: 0 0.3rem;-->*/
          /*<!--border-top: 1px solid $color-border;-->*/
          /*<!--display: flex;-->*/
          /*<!--align-items: center;-->*/
          /*<!--div {-->*/
            /*<!--display: inline-block;-->*/
            /*<!--width: 50%;-->*/
            /*<!--text-align: center;-->*/
          /*<!--}-->*/
          .confirm {
            border-radius: 0.08rem;
            background: $primary-color;
            /*width: 100%;*/
            height: 0.9rem;
            line-height: 0.9rem;
            font-size: 0.3rem;
            color: $color-highlight-background;
            margin: 0 0.3rem;
          }
        }
      }
    }
  }
</style>
