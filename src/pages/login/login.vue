<template>
  <div class="login-content">
    <!--<m-header class="cate-header"></m-header>-->
    <div class="scroll-section">
      <Scroll :pullUpLoad="pullUpLoad">
        <div class="header"><img src="./back.png" @click="back"></div>
        <div class="title">欢迎回来</div>
        <div class="content">
          <div class="form-login">
            <div class="form-item border-bottom-1px">
              <div class="item-input-wrapper" @click="focus">
                <input v-focus type="tel" ref="input" autofocus class="item-input" name="mobile" v-model="mobile" v-validate="'required|mobile'" placeholder="请输入手机号">
                <span v-show="errors.has('mobile')" class="error-tip">{{errors.first('mobile')}}</span>
              </div>
            </div>
            <div class="form-item">
              <div class="item-input-wrapper">
                <input type="password" class="item-input" name="pwd" v-model="pwd" v-validate="'required|min:6|max:16'" placeholder="请输入密码">
                <span v-show="errors.has('pwd')" class="error-tip">{{errors.first('pwd')}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="login-btn">
          <button @click="login">登录</button>
        </div>
        <div class="register-findpwd">
          <span class="fl" @click="go('/register')">立即注册</span>
          <span class="fr" @click="go('/forget-pwd')">忘记密码？</span>
        </div>
        <div class="wx-login" @click="AppId">
          <span class="wing"></span>
          <img src="./wx-login@2x.png" alt="">
          <span>微信快速登录</span>
          <span class="wing"></span>
        </div>
      </Scroll>
    </div>
    <full-loading v-show="loading" :title="loadText"></full-loading>
    <toast ref="toast" :text="text"></toast>
    <wx-bind-mobile ref="bindMobile"></wx-bind-mobile>
  </div>
</template>
<script>
  import {login, wxLogin} from 'api/user';
  import {getConfig} from 'api/general';
  // import {setUser, setTitle, getWxMobAndCapt} from 'common/js/util';
  import {setUser, setTitle, isLogin, getWxMobAndCapt} from 'common/js/util';
  import {directiveMixin} from 'common/js/mixin';
  // import { setCookie } from 'common/js/cookie';
  import Toast from 'base/toast/toast';
  import FullLoading from 'base/full-loading/full-loading';
  import MHeader from 'components/m-header/m-header';
  import Scroll from 'base/scroll/scroll';
  import WxBindMobile from 'components/wx-bind-mobile/wx-bind-mobile';

  export default {
    mixins: [directiveMixin],
    data() {
      return {
        loading: false,
        loadText: '',
        pullUpLoad: null,
        text: '',
        mobile: '',
        pwd: ''
      };
    },
    mounted() {
      setTitle('登录');
      this.me = this.$route.query.me || '';
      if (!isLogin()) {
        if (/code=([^&]+)&state=/.exec(location.href)) {
          this.code = RegExp.$1;
          alert(1);
          alert(this.code);
          if (/userReferee=([^&$]+)/.exec(location.href)) {
            this.userReferee = RegExp.$1;
          }
          this.wxLogin(this.code, this.userReferee);
        } else if (/userReferee=([^&$]+)/.exec(location.href)) {
          alert(2);
          this.userReferee = RegExp.$1;
          this.AppId();
        }
      } else {
        // this.checkUser(getUserId());
        this.$router.push('/home');
      }
    },
    methods: {
      focus() {
        this.$refs.input.focus();
      },
      // 微信登录
      wxLogin(code, userReferee) {
        alert('wxlogin');
        let mobAndCapt = getWxMobAndCapt();
        let mobile;
        let smsCaptcha;
        if (mobAndCapt) {
          mobile = mobAndCapt.mobile || '';
          smsCaptcha = mobAndCapt.captcha || '';
        }
        this.loading = true;
        wxLogin({
          code,
          userReferee,
          mobile,
          smsCaptcha,
          isNeedMobile: '0'
        }).then((data) => {
          this.loading = false;
          // code, , , , '0'
          alert('data-' + JSON.stringify(data));
          setUser(data);
          if (data.isNeedMobile === '1') {
            this.text = '微信登录需要先绑定手机号';
            this.$refs.toast.show();
            this.$refs.bindMobile.show();
          } else {
            this.$router.push('/home');
            // if (this.$route.path === '/home/recommend') {
            //   location.replace(`${location.origin}/?#/home`);
            // } else {
            //   location.replace(`${location.origin}/?#${this.$route.fullPath}`);
            // }
          }
        }).catch(() => {});
      },
      login() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.loading = true;
            this.loadText = '登录中...';
            login({
              loginName: this.mobile,
              loginPwd: this.pwd
            }).then((data) => {
              setUser(data);
              this.loading = false;
              this.$router.replace('/home');
            }).catch(() => {
              this.loading = false;
            });
          }
        });
      },
      go(url) {
        this.$router.push(url);
      },
      back() {
        this.go('/home');
      },
      AppId() {
        // 获取用户appid
        getConfig('wx_h5_access_key').then(res => {
          var appId = res.cvalue;
          let redirectUri = `${location.origin}/${location.hash}`;
          // let redirectUri = 'front.miss.hichengdai.com';
          if (this.userReferee && !/userReferee=([^&$]+)/.exec(location.href)) {
            redirectUri += `?userReferee=${this.userReferee}`;
          }
          // 获取当前地址
          let redirectUri1 = encodeURIComponent(redirectUri);
          let url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
          let suffix =
            '&response_type=code&scope=snsapi_userinfo#wechat_redirect';
          alert(`${url}?appid=${appId}&redirect_uri=${redirectUri}${suffix}`);
          // 发送微信网页授权地址，由此获取code
          setTimeout(() => {
            location.replace(
              `${url}?appid=${appId}&redirect_uri=${redirectUri1}${suffix}`
            );
          }, 100);
        });
      }
    },
    components: {
      FullLoading,
      MHeader,
      Toast,
      Scroll,
      WxBindMobile
    }
  };
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  @import "~common/scss/variable";
  .login-content {
    background: $color-highlight-background;
    padding: 0 0.4rem;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    .fl {
      float: left;
    }
    .fr {
      float: right;
    }
    .cate-header {
      background: transparent;
      .inner {
        .icon-back {
          background: url("./back.png");
        }
      }
    }
    .scroll-section {
      position: absolute;
      top: 0.2rem;
      bottom: 0.76rem;
      left: 0.4rem;
      right: 0.4rem;
      overflow: auto;
      .header {
        img  {
          height: 0.42rem;
        }
      }
      .title {
        margin-top: 0.5rem;
        font-size: $font-size-large-xx;
        margin-bottom: 0.76rem;
        padding: 0 0.2rem;
      }
      .content {
        width: 100%;
        height: 2.3rem;
        padding: 0 0.2rem;
        margin-bottom: 0.8rem;
        .form-login {
          width: 100%;
          height: 100%;
          .form-item {
            width: 100%;
            height: 1.1rem;
            font-size: 0.3rem;
            border-bottom: 1px solid #EBEBEB;
            .item-input-wrapper {
              width: 100%;
              height: 100%;
              input {
                width: 65%;
                height: 100%;
              }
              .error-tip {
                color: red;
              }
            }
          }
        }
      }
      .login-btn {
        margin-bottom: 0.4rem;
        padding: 0 0.2rem;
        button {
          width: 100%;
          height: 0.9rem;
          background: $primary-color;
          color: $color-highlight-background;
          border-radius: 0.08rem;
          font-size: 0.32rem;
        }
      }
      .register-findpwd {
        font-size: 0.26rem;
        color: $color-text-l;
        margin-bottom: 1.3rem;
        padding: 0 0.2rem;
      }
      .wx-login {
        font-size: 0.26rem;
        height: 1rem;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 0.4rem;
          height: 0.34rem;
          margin-right: 0.2rem;
        }
        .wing {
          width: 0.3rem;
          border-top: 1px solid #ebebeb;
          display: inline-block;
          margin: 0 0.2rem;
        }
      }
    }
  }
  input::-webkit-input-placeholder {
    color: #ccc;
  }
</style>
