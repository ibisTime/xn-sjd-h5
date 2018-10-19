<template>
  <div class="full-screen-wrapper content">
    <div class="title">忘记密码</div>
    <div class="content">
      <div class="form-login">
        <div class="form-item">
          <div class="item-input-wrapper">
            <input v-focus type="tel" class="item-input" name="mobile" v-model="mobile" v-validate="'required|mobile'" placeholder="请输入手机号">
            <span v-show="errors.has('mobile')" class="error-tip">{{errors.first('mobile')}}</span>
          </div>
        </div>
        <div class="form-item">
          <div class="item-input-wrapper">
            <input type="tel" class="item-input captcha" v-model="captcha" name="captcha" placeholder="请输入验证码">
            <span v-show="errors.has('captcha')" class="error-tip">{{errors.first('captcha')}}</span>
            <button :disabled="sending" @click="sendCaptcha" class="captBtn">{{captBtnText}}</button>
          </div>
        </div>
        <div class="form-item">
          <div class="item-input-wrapper">
            <input type="password" class="item-input" name="pwd" v-validate="'required'" v-model="pwd" placeholder="请输入新密码（6～16个字符或字母）">
            <span v-show="errors.has('pwd')" class="error-tip">{{errors.first('pwd')}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="login-btn">
      <button @click="resetPwd">确定</button>
    </div>
    <full-loading v-show="loading" :title="loadText"></full-loading>
    <toast ref="toast" :text="text"></toast>
  </div>
</template>
<script>
  import {reSetPwd} from 'api/user';
  import {directiveMixin} from 'common/js/mixin';
  import {sendCaptcha} from 'api/general';
  import FullLoading from 'base/full-loading/full-loading';
  import Toast from 'base/toast/toast';

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
        captcha: '',
        sending: false,
        userReferee: '',
        type: ''
      };
    },
    methods: {
      // 重置密码
      resetPwd() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.loading = true;
            reSetPwd({
              mobile: this.mobile,
              newLoginPwd: this.pwd,
              smsCaptcha: this.captcha
            }).then((data) => {
              if(data.isSuccess) {
                this.text = '重置成功，即将跳转到登录页';
                this.$refs.toast.show();
                this.loading = false;
                setTimeout(() => {
                  this.$router.replace('/login');
                }, 1000);
              }
            }).catch(() => {
              this.loading = false;
            });
          }
        });
      },
      // 发送验证码
      sendCaptcha() {
        this.$validator.validate('mobile').then((res) => {
          if(res) {
            this.sending = true;
            this.loading = true;
            sendCaptcha({
              bizType: '805063',
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
      Toast
    }
  };
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  @import "~common/scss/variable";
  .content {
    background: $color-highlight-background;
    padding: 0 0.4rem;
    .fl {
      float: left;
    }
    .fr {
      float: right;
    }
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
    .content {
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
              width: 79%;
              height: 100%;
            }
            /*input[type="tel"] {*/
            /*width: 65%;*/
            /*}*/
            input.captcha {
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
              position: relative;
              z-index: 99;
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
  input::-webkit-input-placeholder {
    color: #ccc;
  }
</style>
