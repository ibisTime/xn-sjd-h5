<template>
  <transition name="slide">
    <div class="change-mobile-wrapper">
      <m-header class="cate-header" title="修改手机号"></m-header>
      <div class="form-wrapper">
        <div class="form-item border-bottom-1px">
          <div class="item-input-wrapper">
            <input v-focus type="tel" class="item-input" name="mobile" v-model="mobile" v-validate="'required|mobile'" placeholder="请输入手机号">
            <span v-show="errors.has('mobile')" class="error-tip">{{errors.first('mobile')}}</span>
          </div>
        </div>
        <div class="form-item  border-bottom-1px">
          <div class="item-input-wrapper">
            <input type="tel" class="item-input" v-model="captcha" @change="_captValid" placeholder="请输入验证码">
            <span v-show="errors.has('captcha')" class="error-tip">{{errors.first('captcha')}}</span>
          </div>
          <div class="item-btn">
            <button :disabled="sending" @click="sendCaptcha">{{captBtnText}}</button>
          </div>
        </div>
        <div class="form-item border-bottom-1px">
          <div class="item-input-wrapper">
            <input v-focus type="tel" class="item-input" name="mobile" v-model="mobile" v-validate="'required|mobile'" placeholder="请输入新手机号">
            <span v-show="errors.has('mobile')" class="error-tip">{{errors.first('mobile')}}</span>
          </div>
        </div>
        <div class="form-item  border-bottom-1px">
          <div class="item-input-wrapper">
            <input type="tel" class="item-input" v-model="captcha" @change="_captValid" placeholder="请输入验证码">
            <span v-show="errors.has('captcha')" class="error-tip">{{errors.first('captcha')}}</span>
          </div>
          <div class="item-btn">
            <button :disabled="sending" @click="sendCaptcha" :class="[sending ? 'gray' : '']">{{captBtnText}}</button>
          </div>
        </div>
        <div class="form-btn">
          <button :disabled="setting" @click="_changeMobile">确定</button>
        </div>
        <toast ref="toast" text="修改成功"></toast>
      </div>
    </div>
  </transition>
</template>
<script>
  import MHeader from 'components/m-header/m-header';
  import {mapMutations} from 'vuex';
  import {SET_USER_MOBILE} from 'store/mutation-types';
  import {sendCaptcha} from 'api/general';
  import {changeMobile} from 'api/user';
  import {mobileValid, captValid, setTitle} from 'common/js/util';
  import {directiveMixin} from 'common/js/mixin';
  import Toast from 'base/toast/toast';

  export default {
    mixins: [directiveMixin],
    data() {
      return {
        sending: false,
        setting: false,
        captcha: '',
        captErr: '',
        captBtnText: '获取验证码',
        mobile: '',
        mobErr: ''
      };
    },
    created() {
      setTitle('修改手机号');
    },
    methods: {
      sendCaptcha() {
        if (this._mobileValid()) {
          this.sending = true;
          sendCaptcha(this.mobile, 805061).then(() => {
            this._setInterval();
          }).catch(() => {
            this._clearInterval();
          });
        }
      },
      _changeMobile() {
        if (this._valid()) {
          this.setting = true;
          changeMobile(this.mobile, this.captcha)
            .then(() => {
              this.$refs.toast.show();
              this.setUserMobile(this.mobile);
              setTimeout(() => {
                this.$router.back();
              }, 1000);
            }).catch(() => {
              this.setting = false;
            });
        }
      },
      _valid() {
        let r1 = this._mobileValid();
        let r2 = this._captValid();
        return r1 && r2;
      },
      _mobileValid() {
        let result = mobileValid(this.mobile);
        this.mobErr = result.msg;
        return !result.err;
      },
      _captValid() {
        let result = captValid(this.captcha);
        this.captErr = result.msg;
        return !result.err;
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
      ...mapMutations({
        setUserMobile: SET_USER_MOBILE
      })
    },
    beforeDestroy() {
      this.timer && clearInterval(this.timer);
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
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $color-highlight-background;
    .form-wrapper {
      padding: 0 0.3rem;
      margin-top: 0.88rem;
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
