<template>
  <div class="me-wrapper">
    <div class="bg">
      <back-only class="cate-header" title="分享二维码"></back-only>
      <div class="all">
        <div class="title">氧护青山，绿水长流</div>
        <div class="content">
          <!--<img :src="bgUrl">-->
          <div class="content-top">
            <span class="wing"></span>
            <span class="content-top-title">扫一扫，养棵树</span>
            <span class="wing"></span>
          </div>
          <div class="erweimaPic" id="qrcode"></div>
          <div class="steps">
            <p>1.使用扫一扫注册氧林账号</p>
            <p>2.分享给好友一起认养树</p>
          </div>
        </div>
        <div class="button"><button>邀请好友</button></div>
      </div>
    </div>
    <toast ref="toast" :text="text"></toast>
    <full-loading v-show="loading"></full-loading>
  </div>
</template>
<script>
  const QRCode = require('js-qrcode');
  import Toast from 'base/toast/toast';
  import FullLoading from 'base/full-loading/full-loading';
  import BackOnly from 'components/back-only/back-only';
  import {setTitle, formatImg, getUserId} from 'common/js/util';
  import { getCookie } from 'common/js/cookie';
  import {initShare} from 'common/js/weixin';
  import { getConfig } from 'api/general';
  import { getUserDetail } from 'api/user';
  import { share } from 'api/biz';

  export default {
    data() {
      return {
        text: '',
        loading: false,
        url: '',
        bgUrl: ''
      };
    },
    mounted() {
      setTitle('分享二维码');
      this.isWxConfiging = false;
      this.wxData = null;
      this.userId = getCookie('userId') || this.$route.query.userId;
      this.loading = true;
      Promise.all([
        getUserDetail({
          userId: this.userId
        }),
        getConfig('INVITATION')
      ]).then(([res1, res2]) => {
        getConfig('REGISTER_URL').then((url) => {
          this.url += `${url.cvalue}?type=U&userReferee=${res1.mobile}`;
          console.log(this.url);
          // 用插件生成二维码
          const container = document.getElementById('qrcode');
          // 设置转换二维码图片的参数
          const qr = new QRCode(container, {
            render: 'canvas',
            width: 474,
            height: 474,
            typeNumber: -1,
            correctLevel: 2,
            background: '#ffffff',
            foreground: '#000000',
            src: 'http://image.tree.hichengdai.com/FhDuAJ9CVvOGGgLV6CxfshkWzV9g?imageMogr2/auto-orient/thumbnail/!300x300'
          });
          qr.make(this.url);
          this.bgUrl = formatImg(res2.cvalue);
          if(!this.isWxConfiging && !this.wxData) {
            this.getInitWXSDKConfig();
          }
          this.loading = false;
        }).catch(() => { this.loading = false; });
      }).catch(() => { this.loading = false; });
    },
    methods: {
      go(url) {
        this.$router.push(url);
      },
      getInitWXSDKConfig() {
        this.loading = true;
        getUserDetail({userId: getUserId()}).then((res) => {
          initShare({
            title: '注册氧林，体验氧圈生活',
            desc: '注册氧林的新用户，开启我的氧圈生活',
            link: location.href.split('#')[0] + '/#/register?userReferee=' + res.mobile + '&type=U',
            imgUrl: 'http://image.tree.hichengdai.com/FhDuAJ9CVvOGGgLV6CxfshkWzV9g?imageMogr2/auto-orient/thumbnail/!300x300',
            success: (res) => {
              this.channel = '';
              if(res.errMsg.indexOf('sendAppMessage') !== -1) {
                this.channel = 0;
              } else if(res.errMsg.indexOf('shareTimeline') !== -1) {
                this.channel = 1;
              } else if(res.errMsg.indexOf('shareQQ') !== -1) {
                this.channel = 2;
              } else if(res.errMsg.indexOf('shareQZone') !== -1) {
                this.channel = 3;
              }
              share(this.channel, '邀请有礼').then((res) => {
                if(res.code) {
                  this.text = '分享成功';
                  this.$refs.toast.show();
                }
              }).then(() => {});
            }
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
        });
      }
    },
    components: {
      BackOnly,
      Toast,
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
      .cate-header {
        font-weight: 500;
      }
      .all {
        padding: 0.3rem 0.6rem;
        .title {
          color: $primary-color;
          font-size: 0.3rem;
          margin-bottom: 0.5rem;
        }
        .content {
          background: $color-highlight-background;
          margin-bottom: 1rem;
          .content-top {
            padding: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            .wing {
              display: inline-block;
              width: 0.32rem;
              border-top: 1px solid black;
            }
            .content-top-title {
              margin: 0 0.2rem;
              font-size: 0.32rem;
            }
          }
          img {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
          }
          .erweimaPic {
            width: 4.3rem;
            height: 4.3rem;
            /*position: fixed;*/
            /*top: 48%;*/
            /*left: 1.6rem;*/
            z-index: 2;
            margin: 0 auto;
            margin-bottom: 0.82rem;
          }
          .steps {
            padding: 0.4rem 0;
            border-top: 1px solid rgb(242, 242, 242);
            p {
              font-size: 0.3rem;
              color: $color-gray;
              margin-bottom: 0.2rem;
              &:last-child {
                margin-bottom: 0;
              }
            }
          }
          .title {
            font-size: 0.36rem;
            color: #fff;
            padding-top: 0.19rem;
            text-align: center;
          }
        }
        .button {
          height: 0.88rem;
          button {
            width: 100%;
            height: 100%;
            background: $primary-color;
            text-align: center;
            font-size: 0.28rem;
            border-radius: 0.5rem;
            color: $color-highlight-background;
          }
        }

      }

    }
  }
</style>
