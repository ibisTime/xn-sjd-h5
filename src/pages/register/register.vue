<template>
  <div class="content">
    <div class="scroll-section">
      <Scroll :pullUpLoad="pullUpLoad">
        <div class="title">注册</div>
        <div class="in-content">
          <div class="form-login">
            <div class="form-item">
              <div class="item-input-wrapper">
                <input v-focus type="tel" class="item-input" name="mobile" v-model="mobile" v-validate="'required|mobile'" placeholder="请输入手机号">
                <span v-show="errors.has('mobile')" class="error-tip">{{errors.first('mobile')}}</span>
              </div>
            </div>
            <div class="form-item">
              <div class="item-input-wrapper">
                <input type="tel" class="item-input captcha" v-model="captcha" v-validate="'required'" name="captcha" placeholder="请输入验证码">
                <span v-show="errors.has('captcha')" class="error-tip">{{errors.first('captcha')}}</span>
                <button :disabled="sending" @click="sendCaptcha" class="captBtn">{{captBtnText}}</button>
              </div>
            </div>
            <div class="form-item">
              <div class="item-input-wrapper">
                <input type="password" class="item-input" name="pwd" v-validate="'required|min:6|max:16'" v-model="pwd" placeholder="请输入密码（6～16个字符）">
                <span v-show="errors.has('pwd')" class="error-tip">{{errors.first('pwd')}}</span>
              </div>
            </div>
            <div class="form-item">
              <div class="item-input-wrapper">
                <input type="password" class="item-input" name="rePwd" v-validate="'required|min:6|max:16'" v-model="rePwd" placeholder="请确认密码（6～16个字符）">
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
          我已阅读并接受<router-link tag="span" to="/register/protocol?register=1">《氧林产品服务条款》</router-link>
        </div>
        <div class="login-btn">
          <button @click="register">注册</button>
        </div>
      </Scroll>
    </div>
    <full-loading v-show="loading" :title="loadText"></full-loading>
    <toast ref="toast" :text="text"></toast>
    <router-view></router-view>
  </div>
</template>
<script>
  import {register, login} from 'api/user';
  import {directiveMixin} from 'common/js/mixin';
  import { setTitle, setUser } from 'common/js/util';
  import {sendCaptcha} from 'api/general';
  import FullLoading from 'base/full-loading/full-loading';
  import Toast from 'base/toast/toast';
  import Scroll from 'base/scroll/scroll';

  export default {
    mixins: [directiveMixin],
    data() {
      return {
        loading: false,
        loadText: '',
        text: '',
        mobile: '',
        pwd: '',
        rePwd: '',
        captBtnText: '获取验证码',
        isChecked: true,
        captcha: '',
        sending: false,
        userReferee: '',
        type: '',
        pullUpLoad: null
      };
    },
    mounted() {
      setTitle('注册');
    },
    methods: {
      // 注册
      register() {
        // debugger;
        this.$validator.validateAll().then((result) => {
          if (result && this.pwd === this.rePwd && this.isChecked) {
            this.loading = true;
            this.loadText = '注册中...';
            this.userReferee = this.$route.query.userReferee;
            this.type = this.$route.query.type;
            register({
              mobile: this.mobile,
              loginPwd: this.pwd,
              smsCaptcha: this.captcha,
              userReferee: this.userReferee,
              userRefereeType: this.type
            }).then((data) => {
              if(data.code) {
                // 注册完了去登录
                login({
                  loginName: this.mobile,
                  loginPwd: this.pwd
                }).then((data) => {
                  setUser(data);
                  this.text = '注册成功，已为您自动登录';
                  this.$refs.toast.show();
                  this.loading = false;
                  setTimeout(() => {
                    this.$router.replace('/home');
                  }, 1000);
                }).catch(() => {
                  this.loading = false;
                });
              }
            }).catch(() => {
              this.loading = false;
            });
          } else {
            if(!this.isChecked) {
              this.text = '请阅读协议';
              this.$refs.toast.show();
            }
          }
        });
      },
      checked(e) {
        e.preventDefault();
        this.isChecked = !this.isChecked;
      },
      // 发送验证码
      sendCaptcha() {
        this.$validator.validate('mobile').then((res) => {
          if(res) {
            this.sending = true;
            this.loading = true;
            sendCaptcha({
              bizType: '805041',
              mobile: this.mobile
            }).then(() => {
              this.loading = false;
              this._setInterval();
            }).catch(() => {
              this.loading = false;
              this._clearInterval();
            });
          }
        });
      },
      go(url) {
        this.$router.push(url);
      },
      _setInterval() {
        let i = 60;
        this.timer = setInterval(() => {
          if (i === 0) {
            this._clearInterval();
          } else {
            this.captBtnText = i-- + 's';
          }
        }, 1000);
      },
      _clearInterval() {
        if (this.timer) {
          clearInterval(this.timer);
          this.sending = false;
          this.captBtnText = '获取验证码';
        }
      },
      back() {
        this.$router.back();
      }
    },
    components: {
      FullLoading,
      Toast,
      Scroll
    }
  };
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  @import "~common/scss/variable";
  .content {
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
    .scroll-section {
      position: absolute;
      top: 0.2rem;
      bottom: 0.76rem;
      left: 0.4rem;
      right: 0.4rem;
      overflow: auto;
      .header {
        margin-bottom: 1.72rem;
        img  {
          height: 0.42rem;
        }
      }
      .title {
        font-size: $font-size-large-xx;
        padding: 0.3rem 0.2rem 0.76rem;
      }
      .in-content {
        width: 100%;
        height: 4.7rem;
        padding: 0 0.2rem;
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
              .error-tip {
                color: red;
              }
              input {
                width: 65%;
                height: 100%;
              }
              /*input[type="tel"] {*/
              /*width: 65%;*/
              /*}*/
              input.captcha {
                width: 45%;
              }
              .captBtn {
                width: 2.1rem;
                height: 0.68rem;
                border: 1px solid $primary-color;
                color: $primary-color;
                background: $color-highlight-background;
                border-radius: 0.04rem;
                margin-top: 0.16rem;
                position: relative;
                z-index: 99;
                float: right;
              }
            }
          }
        }
      }
      .sure {
        color: $color-text-l;
        font-size: $font-size-medium-s;
        margin-bottom: 1.2rem;
        padding: 0 0.2rem;
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
    }
  }
  input::-webkit-input-placeholder {
    color: #ccc;
  }
</style>
