<template>
  <div class="me-wrapper">
    <m-header class="cate-header" title="设置"></m-header>
    <div class="scroll-section">
      <Scroll :pullUpLoad="pullUpLoad" ref="scroll">
        <div class="settings-list">
          <div class="item" @click="go('/change-mobile')">
            <span>修改手机号</span>
            <img src="./more@2x.png" class="fr more">
          </div>
          <div class="item" @click="go('/bind-email')">
            <span>绑定邮箱</span>
            <img src="./more@2x.png" class="fr more">
          </div>
          <div class="item" @click="go('/bankcard')">
            <span>我的银行卡</span>
            <img src="./more@2x.png" class="fr more">
          </div>
          <div class="item" @click="go('/set-money')">
            <span>设置支付密码</span>
            <img src="./more@2x.png" class="fr more">
          </div>
          <div class="item" @click="go('/change-loginPwd')">
            <span>修改登录密码</span>
            <img src="./more@2x.png" class="fr more">
          </div>
          <div class="item" @click="go('/userAvatar')">
            <span>修改头像</span>
            <img src="./more@2x.png" class="fr more">
          </div>
          <div class="item" @click="go('/userInfo')">
            <span>个人资料</span>
            <img src="./more@2x.png" class="fr more">
          </div>
          <div class="item" @click="go('/address')">
            <span>收货地址</span>
            <img src="./more@2x.png" class="fr more">
          </div>
        </div>
        <div class="btn">
          <button @click="logout">退出登录</button>
        </div>
      </Scroll>
    </div>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import {clearUser, setTitle} from 'common/js/util';
  // import {getAppId} from 'api/general';
  import MFooter from 'components/m-footer/m-footer';

  export default {
    data() {
      return {
        pullUpLoad: null
      };
    },
    mounted() {
      setTitle('设置');
      this.pullUpLoad = null;
    },
    methods: {
      go(url) {
        this.$router.push(url);
      },
      logout() {
        clearUser();
        // this.go('/login?setting=1');

        let ua = navigator.userAgent.toLowerCase();
        let isWeixin = ua.indexOf('micromessenger') !== -1;
        if (!isWeixin) {
          this.go('/login?setting=1');
        } else {
          document.addEventListener('WeixinJSBridgeReady', () => { WeixinJSBridge.call('closeWindow'); }, false);
          // 这个可以关闭ios系统的手机
          WeixinJSBridge.call('closeWindow');
        }
        // this._reloadPage();
      }
      // _reloadPage() {
      //   getAppId().then((data) => {
      //     let appId = data.cvalue;
      //     let redirectUri = encodeURIComponent(`${location.origin}?#/home`);
      //     let url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
      //     let suffix = '&response_type=code&scope=snsapi_userinfo#wechat_redirect';
      //     setTimeout(() => {
      //       location.replace(`${url}?appid=${appId}&redirect_uri=${redirectUri}${suffix}`);
      //     }, 100);
      //   });
      // }
    },
    components: {
      Scroll,
      MFooter,
      MHeader
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  .me-wrapper {
    background: #fff;
    position: fixed;
    width: 100%;
    bottom: 0;
    top: 0.88rem;
    left: 0;
    .fl {
      float: left;
    }
    .fr {
      float: right;
    }
    .scroll-section {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: auto;
      .scroll-content {
        /*top: 0;*/
        /*bottom: 2rem;*/
        .settings-list {
          background: $color-highlight-background;
          padding: 0 0.3rem;
          margin-bottom: 1.63rem;
          .item {
            width: 100%;
            height: 1.1rem;
            font-size: $font-size-medium-xx;
            line-height: 1.1rem;
            border-bottom: 1px solid #eee;
            img {
              height: 0.34rem;
            }
            .more {
              margin-top: 0.3rem;
            }
          }
        }
        .btn {
          padding: 0 0.3rem;
          button {
            width: 100%;
            height: 0.84rem;
            border: 1px solid $primary-color;
            color: $primary-color;
            border-radius: 0.08rem;
            font-size: $font-size-medium-x;
            background: $color-highlight-background;
          }
        }
      }
    }
  }
</style>
