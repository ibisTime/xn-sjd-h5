<template>
  <transition name="slide">
    <div class="change-mobile-wrapper">
      <m-header class="cate-header" title="绑定邮箱"></m-header>
      <div class="form-wrapper">
        <div class="form-item border-bottom-1px" v-show="userDetail.email">
          <div class="item-input-wrapper">
            <span>已绑定邮箱</span><span>{{userDetail.email}}</span>
          </div>
        </div>
        <div class="form-item border-bottom-1px">
          <div class="item-input-wrapper">
            <input type="text" class="item-input" name="newEmail" v-model="newEmail" v-validate="'required|email'" placeholder="请输入新邮箱地址">
            <span v-show="errors.has('newEmail')" class="error-tip">{{errors.first('newEmail')}}</span>
          </div>
        </div>
        <div class="form-item  border-bottom-1px">
          <div class="item-input-wrapper">
            <input type="tel" class="item-input" name="newCaptcha" v-validate="'required'" v-model="newCaptcha" placeholder="请输入验证码">
            <span v-show="errors.has('newCaptcha')" class="error-tip">{{errors.first('newCaptcha')}}</span>
          </div>
          <div class="item-btn">
            <button :disabled="sending" @click="sendCaptcha" :class="[sending ? 'gray' : '']">{{captBtnText}}</button>
          </div>
        </div>
        <div class="form-btn">
          <button :disabled="setting" @click="bindEmail">确定</button>
        </div>
        <toast ref="toast" text="修改成功"></toast>
      </div>
    </div>
  </transition>
</template>
<script>
  import MHeader from 'components/m-header/m-header';
  import {sendCaptchaEamil} from 'api/general';
  import {bindEmail, getUserDetail} from 'api/user';
  import {directiveMixin} from 'common/js/mixin';
  import Toast from 'base/toast/toast';
  import {setTitle} from 'common/js/util';
  import { getCookie } from 'common/js/cookie';

  export default {
    mixins: [directiveMixin],
    data() {
      return {
        sending: false,
        setting: false,
        captcha: '',
        captBtnText: '获取验证码',
        mobile: '',
        newEmail: '',
        newCaptcha: '',
        userDetail: {email: ''}
      };
    },
    mounted() {
      setTitle('绑定邮箱');
      let userId = getCookie('userId');
      if(userId) {
        this.loading = true;
        Promise.all([
          getUserDetail({userId: userId})
        ]).then(([res1]) => {
          this.userDetail = res1;
          this.loading = false;
        }).catch(() => { this.loading = false; });
      }
    },
    methods: {
      // 发送验证码
      sendCaptcha() {
        this.$validator.validate('newEmail').then((res) => {
          if(res) {
            this.sending = true;
            this.loading = true;
            sendCaptchaEamil({
              bizType: '805086',     // 接口号要换
              email: this.newEmail
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
      bindEmail() {
        this.$validator.validateAll().then((result) => {
          if(result) {
            this.setting = true;
            this.loading = true;
            bindEmail({
              captcha: this.newCaptcha,
              email: this.newEmail
            }).then((res) => {
              this.$refs.toast.show();
              setTimeout(() => {
                this.$router.back();
              }, 1000);
            }).catch(() => {
              this.setting = false;
            });
          }
        });
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
      }
    },
    components: {
      Toast,
      MHeader
    }
  };
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  @import "~common/scss/variable";

  .change-mobile-wrapper {
    position: fixed;
    top: 0.88rem;
    left: 0;
    width: 100%;
    height: 100%;
    background: $color-highlight-background;
    .form-wrapper {
      padding: 0 0.3rem;
      /*margin-top: 0.88rem;*/
      .form-item .item-btn {
        width: 1.68rem;
        padding-right: 0;
        button {
          height: 0.53rem;
          line-height: 0.52rem;
          background: $color-highlight-background;
          color: $primary-color;
          border: 1px solid $primary-color;
          border-radius: 0.04rem;
        }
        .gray {
          background: #cccccc;
          border:none;
          color: #fff;
        }
      }
      .item-input-wrapper {
        padding: 0;
        height: 1.1rem;
        span {
          padding-right: 0.2rem;
        }
        .error-tip {
          right: 0;
        }
      }
      .form-btn {
        padding: 0;
        button {
          border-radius: 0.08rem;
          font-size: $font-size-medium-x;
        }
      }
    }
  }
  input::-webkit-input-placeholder {
    color: #ccc;
  }
</style>
