<template>
  <transition name="slide">
    <div class="change-mobile-wrapper">
      <!--<m-header class="cate-header" title="设置支付密码"></m-header>-->
      <div class="form-wrapper">
        <div class="form-item border-bottom-1px">
          <div class="item-input-wrapper">
            <input type="tel" class="item-input" name="mobile" v-model="mobile" v-validate="'required|mobile'" placeholder="请输入手机号">
            <span v-show="errors.has('mobile')" class="error-tip">{{errors.first('mobile')}}</span>
          </div>
        </div>
        <div class="form-item  border-bottom-1px">
          <div class="item-input-wrapper">
            <input type="tel" class="item-input" name="captcha" v-model="captcha" v-validate="'required'" placeholder="请输入验证码">
            <span v-show="errors.has('captcha')" class="error-tip">{{errors.first('captcha')}}</span>
          </div>
          <div class="item-btn">
            <button :disabled="sending" @click="sendCaptcha">{{captBtnText}}</button>
          </div>
        </div>
        <div class="form-item border-bottom-1px">
          <div class="item-input-wrapper">
            <input type="password" class="item-input" name="moneyPaw" v-validate="'required'" v-model="moneyPaw" placeholder="请输入支付密码">
            <span v-show="errors.has('moneyPaw')" class="error-tip">{{errors.first('moneyPaw')}}</span>
          </div>
        </div>
        <div class="form-btn">
          <button :disabled="setting" @click="_changeMobile">确定</button>
        </div>
        <toast ref="toast" :text="text"></toast>
      </div>
    </div>
  </transition>
</template>
<script>
  import MHeader from 'components/m-header/m-header';
  import {sendCaptcha} from 'api/general';
  import {setUserMonPaw, getUserDetail} from 'api/user';
  import {directiveMixin} from 'common/js/mixin';
  import { getCookie } from 'common/js/cookie';
  import { setTitle } from 'common/js/util';
  import Toast from 'base/toast/toast';

  export default {
    mixins: [directiveMixin],
    data() {
      return {
        sending: false,
        setting: false,
        captcha: '',
        captBtnText: '获取验证码',
        mobile: '',
        moneyPaw: '',
        text: ''
      };
    },
    mounted() {
      setTitle('设置支付密码');
      this.userId = getCookie('userId');
      this.loading = true;
      Promise.all([
        getUserDetail({userId: this.userId})
      ]).then(([res1]) => {
        this.mobile = res1.mobile || '';
        this.loading = false;
      }).catch(() => { this.loading = false; });
    },
    methods: {
      // 发送验证码
      sendCaptcha() {
        this.$validator.validate('mobile').then((res) => {
          if(res) {
            this.sending = true;
            this.loading = true;
            sendCaptcha({
              bizType: '805066',     // 接口号要换
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
      _changeMobile() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.setting = true;
            setUserMonPaw({
              smsCaptcha: this.captcha,
              tradePwd: this.moneyPaw
            }).then(data => {
              this.text = '设置成功';
              this.$refs.toast.show();

              setTimeout(() => {
                this.$router.back();
              }, 2000);
            }).catch(() => { this.setting = false; });
          } else {
            if(!this.captcha) {
              this.text = '请填写验证码';
              this.$refs.toast.show();
              return;
            }
            if(!this.moneyPaw) {
              this.text = '请填写支付密码';
              this.$refs.toast.show();
              return;
            }
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
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $color-highlight-background;
    .form-wrapper {
      padding: 0 0.3rem;
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
