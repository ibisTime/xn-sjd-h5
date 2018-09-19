<template>
  <div class="full-screen-wrapper content">
    <div class="title">注册</div>
    <div class="content">
      <div class="form-login">
        <div class="form-item">
          <div class="item-input-wrapper">
            <input v-focus type="tel" class="item-input" name="mobile" v-model="mobile" v-validate="'required|mobile'" placeholder="请输入账号">
            <span v-show="errors.has('mobile')" class="error-tip">{{errors.first('mobile')}}</span>
          </div>
        </div>
        <div class="form-item">
          <div class="item-input-wrapper">
            <input type="tel" class="item-input" v-model="captcha" v-validate="'required'" name="captcha" placeholder="请输入验证码">
            <span v-show="errors.has('captcha')" class="error-tip">{{errors.first('captcha')}}</span>
            <button :disabled="sending" @click="sendCaptcha" class="captBtn">{{captBtnText}}</button>
          </div>
        </div>
        <div class="form-item">
          <div class="item-input-wrapper">
            <input type="password" class="item-input" name="tradePwd" v-validate="'required'" v-model="pwd" placeholder="请输入密码">
            <span v-show="errors.has('pwd')" class="error-tip">{{errors.first('pwd')}}</span>
          </div>
        </div>
        <div class="form-item">
          <div class="item-input-wrapper">
            <input type="password" class="item-input" name="reTradePwd" v-validate="'required'" v-model="rePwd" placeholder="请确认密码">
            <span v-show="errors.has('rePwd')" class="error-tip">{{errors.first('rePwd')}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="sure">
      <div class="ck" @click="checked">
        <img src="./checkbox.png" alt="" v-show="isChecked">
        <div class="check-border" v-show="!isChecked"></div>
      </div>
      我已阅读并接受<span @click="goOther('/protocol')">《时间岛产品服务条款》</span>
    </div>
    <div class="login-btn">
      <button @click="register">注册</button>
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
        pwd: '',
        rePwd: '',
        captBtnText: '获取验证码',
        isChecked: false,
        captcha: '',
        sending: false
      };
    },
    created() {
      setTitle('注册');
    },
    methods: {
      register() {
        this.$validator.validateAll().then((result) => {
          console.log(result);
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
      },
      checked(e) {
        e.preventDefault();
        this.isChecked = !this.isChecked;
      },
      sendCaptcha() {},
      goOther(url) {
        this.$router.push(url);
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
      height: 4.7rem;
      padding: 0;
      margin-bottom: 0.3rem;
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
            input[type="tel"] {
              width: 65%;
            }
            .captBtn {
              width: 2.1rem;
              height: 0.68rem;
              border: 1px solid $primary-color;
              color: $primary-color;
              background: $color-highlight-background;
              border-radius: 0.04rem;
              margin-top: 0.16rem;
            }
          }
        }
      }
    }
    .sure {
      color: $color-text-l;
      font-size: $font-size-medium-s;
      margin-bottom: 1.2rem;
      .ck {
        width: 0.24rem;
        height: 0.24rem;
        display: inline-block;
        img {
          width: 100%;
          height: 100%;
        }
      }
      input[type="checkbox"] {
        width: 0.24rem;
        height: 0.24rem;
        border: 1px solid #979797;
        border-radius: 0.04rem;
      }
      span {
        color: $primary-color;
      }
      .check-border {
        width: 0.24rem;
        height: 0.24rem;
        border: 1px solid #979797;
        border-radius: 0.04rem;
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
  }
  input::-webkit-input-placeholder {
    color: #ccc;
  }
</style>
