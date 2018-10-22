<template>
  <div class="me-wrapper">
    <div class="bg">
      <m-header class="cate-header" title="邀请好友" actText="分享" @action="action"></m-header>
      <div class="content">
        <img :src="bgUrl">
        <div class="erweimaPic" id="qrcode"></div>
      </div>
      <!--<div class="content">-->
        <!--<div class="border">-->
          <!--<div class="erweimaPic" id="qrcode"></div>-->
        <!--</div>-->
        <!--<div class="text">-->
          <!--<span class="wing"></span>-->
          <!--<span>扫 描 二 维 码 ，惊 喜 不 断</span>-->
          <!--<span class="wing"></span>-->
        <!--</div>-->
      <!--</div>-->
    </div>
    <full-loading v-show="loading"></full-loading>
  </div>
</template>
<script>
  const QRCode = require('js-qrcode');
  import MHeader from 'components/m-header/m-header';
  import FullLoading from 'base/full-loading/full-loading';
  import {setTitle, formatImg} from 'common/js/util';
  import { getCookie } from 'common/js/cookie';
  import { getConfig } from 'api/general';
  import { getUserDetail } from 'api/user';

  export default {
    data() {
      return {
        loading: false,
        wechat: true,
        alipay: false,
        balance: false,
        amount: 0,
        url: '',
        bgUrl: ''
      };
    },
    mounted() {
      setTitle('邀请好友');
      this.userId = getCookie('userId');
      this.loading = true;
      Promise.all([
        getUserDetail({
          userId: this.userId
        }),
        getConfig('INVITATION')
      ]).then(([res1, res2]) => {
        getConfig('REGISTER_URL').then((url) => {
          this.url += `${url.cvalue}?type=U&userReferee=${res1.mobile}`;
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
          this.bgUrl = formatImg(res2.cvalue);
          this.loading = false;
        }).catch(() => { this.loading = false; });
      });
      // getUserDetail({
      //   userId: this.userId
      // })
    },
    methods: {
      go(url) {
        this.$router.push(url);
      },
      action() {}
    },
    components: {
      MHeader,
      FullLoading
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
      /*background: url("invitation@2x.png") no-repeat;*/
      /*background-size: 100% 100%;*/
      text-align: center;
      position: fixed;
      top: 0.88rem;
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
        .erweimaPic {
          width: 4.3rem;
          height: 4.3rem;
          position: fixed;
          top: 48%;
          left: 1.6rem;
          z-index: 2;
        }
        .title {
          font-size: 0.36rem;
          color: #fff;
          padding-top: 0.19rem;
          text-align: center;
        }
      }
    }
  }
</style>
