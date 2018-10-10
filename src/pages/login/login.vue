<template>
  <div class="full-screen-wrapper login-content">
    <!--<m-header class="cate-header"></m-header>-->
    <div class="header"><img src="./back.png" @click="back"></div>
    <div class="title">欢迎回来</div>
    <div class="content">
      <div class="form-login">
        <div class="form-item border-bottom-1px">
          <div class="item-input-wrapper">
            <input v-focus type="tel" class="item-input" name="mobile" v-model="mobile" v-validate="'required|mobile'" placeholder="请输入手机号">
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
    <!--<div class="wx-login" @click="AppId">-->
      <!--<span class="wing"></span>-->
      <!--<img src="./wx-login@2x.png" alt="">-->
      <!--<span>微信快速登录</span>-->
      <!--<span class="wing"></span>-->
    <!--</div>-->
    <full-loading v-show="loading" :title="loadText"></full-loading>
    <toast ref="toast" :text="text"></toast>
  </div>
</template>
<script>
  import {login} from 'api/user';
  import {getConfig} from 'api/general';
  import {setUser} from 'common/js/util';
  import {directiveMixin} from 'common/js/mixin';
  import Toast from 'base/toast/toast';
  import FullLoading from 'base/full-loading/full-loading';
  import MHeader from 'components/m-header/m-header';

  export default {
    mixins: [directiveMixin],
    data() {
      return {
        loading: false,
        loadText: '',
        text: '',
        mobile: '',
        pwd: ''
      };
    },
    mounted() {
      this.me = this.$route.query.me || '';
    },
    methods: {
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
          if (this.userReferee && !/userReferee=([^&$]+)/.exec(location.href)) {
            redirectUri += `?userReferee=${this.userReferee}`;
          }
          // 获取当前地址
          let redirectUri1 = encodeURIComponent(redirectUri);
          let url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
          let suffix =
            '&response_type=code&scope=snsapi_userinfo#wechat_redirect';
          /* alert(`${url}?appid=${appId}&redirect_uri=${redirectUri}${suffix}`); */
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
      Toast
    }
  };
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  @import "~common/scss/variable";
  .login-content {
    background: $color-highlight-background;
    padding: 0 0.4rem;
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
    .header {
      margin-bottom: 1.72rem;
      img  {
        height: 0.42rem;
      }
    }
    .title {
      margin-top: 2rem;
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
      margin-bottom: 2.3rem;
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
  input::-webkit-input-placeholder {
    color: #ccc;
  }
</style>
