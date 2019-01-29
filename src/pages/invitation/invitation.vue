<template>
  <div class="me-wrapper">
    <div class="bg">
      <back-only class="cate-header" title="分享二维码"></back-only>
      <div class="all" :style="{display: allDisplay}">
        <Scroll :pullUpLoad="pullUpLoad" ref="scroll">
          <div class="title">氧护青山，绿水长流</div>
          <div class="content">
            <!--<img :src="bgUrl">-->
            <div class="content-top">
              <span class="wing"></span>
              <span class="content-top-title">扫一扫，养棵树</span>
              <span class="wing"></span>
            </div>
            <div class="erweimaPic" id="qrcode1"></div>
            <div class="steps">
              <p>1.使用扫一扫注册氧林账号</p>
              <p>2.分享给好友一起认养树</p>
            </div>
          </div>
          <div class="button" @click="saveImgFn"><button>邀请好友</button></div>
        </Scroll>
      </div>
      <div class="real" ref="copyImg" :style="{display: realDisplay}">
        <Scroll :pullUpLoad="pullUpLoad" ref="scroll">
          <div class="title">氧护青山，绿水长流</div>
          <div class="content">
            <div class="info">
              <div class="info-title">
                <!--<img :src="aaaurl" ref="head">-->
                <span class="head" :style="getImgSyl()"></span>
                <span>{{nickname}}</span>
              </div>
              <p class="info-invite">邀请你加入氧林</p>
            </div>
            <div class="erweimaPic" id="qrcode2"></div>
            <div class="content-top">
              <span class="wing"></span>
              <span class="content-top-title">扫一扫，养棵树</span>
              <span class="wing"></span>
            </div>
          </div>
        </Scroll>
      </div>
      <img class="con-img" ref="conImg" @click="isFz = true;" :style="{display: imgDisplay}">
    </div>
    <toast ref="toast" :text="text"></toast>
    <full-loading v-show="loading"></full-loading>
  </div>
</template>
<script>
  const QRCode = require('js-qrcode');
  import Toast from 'base/toast/toast';
  import Scroll from 'base/scroll/scroll';
  import FullLoading from 'base/full-loading/full-loading';
  import BackOnly from 'components/back-only/back-only';
  import {setTitle, formatImg, getUserId} from 'common/js/util';
  import { getCookie } from 'common/js/cookie';
  import {initShare} from 'common/js/weixin';
  import { getConfig } from 'api/general';
  import { getUserDetail } from 'api/user';
  import { share } from 'api/biz';
  import html2canvas from 'html2canvas';

  export default {
    data() {
      return {
        text: '',
        loading: false,
        url: '',
        bgUrl: '',
        isFz: true,
        pullUpLoad: null,
        imgDisplay: 'none',
        realDisplay: 'none',
        allDisplay: 'block',
        head: '',
        nickname: '',
        aaaurl: 'data:image/png;base64,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%E2%80%A6'
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
        this.convertImgToBase64(formatImg(res1.photo), this.imgUrl);
        this.nickname = res1.nickname;
        getConfig('REGISTER_URL').then((url) => {
          this.url += `${url.cvalue}?type=U&userReferee=${res1.mobile}`;
          console.log(this.url);
          // 用插件生成二维码
          const container1 = document.getElementById('qrcode1');
          // 设置转换二维码图片的参数
          const qr1 = new QRCode(container1, {
            render: 'canvas',
            width: 474,
            height: 474,
            typeNumber: -1,
            correctLevel: 2,
            background: '#ffffff',
            foreground: '#000000',
            src: 'http://image.tree.hichengdai.com/FhDuAJ9CVvOGGgLV6CxfshkWzV9g?imageMogr2/auto-orient/thumbnail/!300x300'
          });
          qr1.make(this.url);
          // const container2 = document.getElementById('qrcode2');
          // // 设置转换二维码图片的参数
          // const qr2 = new QRCode(container2, {
          //   render: 'canvas',
          //   width: 474,
          //   height: 474,
          //   typeNumber: -1,
          //   correctLevel: 2,
          //   background: '#ffffff',
          //   foreground: '#000000',
          //   src: 'http://image.tree.hichengdai.com/FhDuAJ9CVvOGGgLV6CxfshkWzV9g?imageMogr2/auto-orient/thumbnail/!300x300'
          // });
          // qr2.make(this.url);
          this.bgUrl = formatImg(res2.cvalue);
          if(!this.isWxConfiging && !this.wxData) {
            this.getInitWXSDKConfig();
          }
          this.loading = false;
        }).catch(() => { this.loading = false; });
      }).catch(() => { this.loading = false; });
    },
    methods: {
      getImgSyl(img) {
        return {
          backgroundImage: img ? `url(${img})` : `url(${this.head})`
        };
      },
      go(url) {
        this.$router.push(url);
      },
      imgUrl(url) {
        this.head = url;
      },
      formatImg(img) {
        return formatImg(img);
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
              if (res.errMsg.indexOf('sendAppMessage') !== -1) {
                this.channel = 0;
              } else if (res.errMsg.indexOf('shareTimeline') !== -1) {
                this.channel = 1;
              } else if (res.errMsg.indexOf('shareQQ') !== -1) {
                this.channel = 2;
              } else if (res.errMsg.indexOf('shareQZone') !== -1) {
                this.channel = 3;
              }
              share(this.channel, '邀请有礼').then((res) => {
                if (res.code) {
                  this.text = '分享成功';
                  this.$refs.toast.show();
                }
              }).then(() => {
              });
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
      },
      saveImgFn() {
        const container2 = document.getElementById('qrcode2');
        // 设置转换二维码图片的参数
        const qr2 = new QRCode(container2, {
          render: 'canvas',
          width: 474,
          height: 474,
          typeNumber: -1,
          correctLevel: 2,
          background: '#ffffff',
          foreground: '#000000',
          src: 'http://image.tree.hichengdai.com/FhDuAJ9CVvOGGgLV6CxfshkWzV9g?imageMogr2/auto-orient/thumbnail/!300x300'
        });
        qr2.make(this.url);
        this.allDisplay = 'none';
        this.realDisplay = 'block';
        setTimeout(() => {
          html2canvas(this.$refs.copyImg, {
            allowTaint: false
          }).then((canvas) => {
            var url = canvas.toDataURL('image/png');
            this.$refs.conImg.setAttribute('src', url);
            this.imgDisplay = 'block';
          });
        }, 1000);
      },
      convertImgToBase64(url, callback, outputFormat) {
        let canvas = document.createElement('CANVAS');
        let ctx = canvas.getContext('2d');
        let img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
          canvas.height = img.height;
          canvas.width = img.width;
          ctx.drawImage(img, 0, 0);
          var dataURL = canvas.toDataURL(outputFormat || 'image/png');
          callback.call(this, dataURL);
          canvas = null;
        };
        img.src = url;
      }
    },
    components: {
      BackOnly,
      Toast,
      FullLoading,
      Scroll
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
      .all,.real {
        padding: 0.3rem 0.6rem;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        overflow: auto;
        .title {
          color: $primary-color;
          font-size: 0.3rem;
          margin-bottom: 0.5rem;
        }
        .content {
          background: $color-highlight-background;
          margin-bottom: 1rem;
          .info-title {
            margin-bottom: 0.28rem;
            display: inline-flex;
            align-items: center;
            .head {
              width: 0.5rem;
              height: 0.5rem;
              margin-right: 0.1rem;
              border-radius: 2rem;
              position: static;
              background-size: 100% 100%;
            }
            span {
              font-size: 0.24rem;
            }
          }
          .info-invite {
            font-size: 0.2rem;
            margin-bottom: 0.34rem;
          }
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
          font-size: 0;
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
    .con-img{
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 9;
      display: none;
      border: 1px solid black;
    }
  }
</style>
