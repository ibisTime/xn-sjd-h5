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
        nickname: ''
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
            this.allDisplay = 'none';
            this.realDisplay = 'none';
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
        overflow: auto;
        .title {
          color: $primary-color;
          font-size: 0.3rem;
          margin-bottom: 0.5rem;
        }
        .content {
          background: $color-highlight-background;
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
      .all {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        .content {
          margin-bottom: 1rem;
        }
      }

    }
    .con-img{
      position: absolute;
      width: 90%;
      height: 70%;
      top: 5%;
      left: 5%;
      z-index: 9;
      display: none;
      border: 1px solid black;
    }
  }
</style>
