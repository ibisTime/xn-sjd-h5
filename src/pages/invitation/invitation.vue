<template>
  <div class="me-wrapper">
    <div class="bg">
      <!--<m-header class="cate-header" title="邀请好友" actText="分享" @action="action"></m-header>-->
      <div class="content">
        <img :src="bgUrl">
        <div class="erweimaPic" id="qrcode"></div>
      </div>
    </div>
    <toast ref="toast" :text="text"></toast>
    <full-loading v-show="loading"></full-loading>
  </div>
</template>
<script>
  const QRCode = require('js-qrcode');
  import Toast from 'base/toast/toast';
  import MHeader from 'components/m-header/m-header';
  import FullLoading from 'base/full-loading/full-loading';
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
      setTitle('邀请好友');
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
            width: 474,
            height: 474,
            typeNumber: -1,
            correctLevel: 2,
            background: '#ffffff',
            foreground: '#000000'
          });
          qr.make(this.url);
          this.bgUrl = formatImg(res2.cvalue);
          if(!this.isWxConfiging && !this.wxData) {
            this.getInitWXSDKConfig();
          }
          this.loading = false;
        }).catch(() => { this.loading = false; });
      });
    },
    methods: {
      go(url) {
        this.$router.push(url);
      },
      getInitWXSDKConfig() {
        this.loading = true;
        initShare({
          title: '氧林',
          desc: '邀请好友',
          link: location.href.split('#')[0] + '/#/invitation?userId=' + getUserId(),
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
      }
    },
    components: {
      MHeader,
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
