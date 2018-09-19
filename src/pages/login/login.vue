<template>
  <div class="full-screen-wrapper content">
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
            <input type="password" class="item-input" name="pwd" v-model="pwd" v-validate="'required'" placeholder="请输入密码（6～16个字符或字母组成">
            <span v-show="errors.has('pwd')" class="error-tip">{{errors.first('pwd')}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="login-btn">
      <button @click="login">登录</button>
    </div>
    <div class="register-findpwd">
      <span class="fl">立即注册</span>
      <span class="fr">忘记密码？</span>
    </div>
    <div class="wx-login">
      <span class="wing"></span>
      <img src="./wx-login@2x.png" alt="">
      <span>微信快速登录</span>
      <span class="wing"></span>
    </div>
  </div>
</template>
<script>
  import {login} from 'api/user';
  import {setTitle, setUser} from 'common/js/util';
  import {directiveMixin} from 'common/js/mixin';
  import FullLoading from 'base/full-loading/full-loading';

  export default {
    mixins: [directiveMixin],
    data() {
      return {
        loadFlag: false,
        loadText: '',
        mobile: '',
        pwd: ''
      };
    },
    created() {
      setTitle('登录');
    },
    methods: {
      login() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.loadFlag = true;
            this.loadText = '登录中...';
            login(this.mobile, this.pwd).then((data) => {
              setUser(data);
              this.loadFlag = false;
              this.$router.replace('/redirect');
            }).catch(() => {
              this.loadFlag = false;
            });
          }
        });
      }
    },
    components: {
      FullLoading
    }
  };
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  @import "~common/scss/variable";
  .content {
    background: $color-highlight-background;
    padding: 1.5rem 0.6rem;
    .fl {
      float: left;
    }
    .fr {
      float: right;
    }
    .title {
      font-size: $font-size-large-xx;
      margin-bottom: 0.76rem;
    }
    .content {
      width: 100%;
      height: 2.3rem;
      padding: 0;
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
              width: 79%;
              height: 100%;
            }
          }
        }
      }
    }
    .login-btn {
      margin-bottom: 0.4rem;
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
    }
    .wx-login {
      font-size: 0.26rem;
      height: 0.4rem;
      text-align: center;
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
  input::-webkit-input-placeholder {
    color: #ccc;
  }
</style>
