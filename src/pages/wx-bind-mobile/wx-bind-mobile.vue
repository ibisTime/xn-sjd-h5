<template>
    <div class="bind-mobile-wrapper">
      <div class="form-wrapper">
        <div class="form-item border-bottom-1px">
          <div class="item-label">手机号</div>
          <div class="item-input-wrapper">
            <input type="tel" class="item-input" v-model="mobile" name="mobile" v-validate="'required|mobile'" placeholder="请输入手机号">
            <span v-show="errors.has('mobile')" class="error-tip">{{errors.first('mobile')}}</span>
          </div>
        </div>
        <div class="form-item">
          <div class="item-label">手机验证码</div>
          <div class="item-input-wrapper">
            <input type="tel" class="item-input" v-model="captcha" v-validate="'required'" name="captcha"  placeholder="请输入验证码">
            <span v-show="errors.has('captcha')" class="error-tip">{{errors.first('captcha')}}</span>
          </div>
          <div class="item-btn">
            <button @click="sendCaptcha" :disabled="disabled" class="captBtn">{{captBtnText}}</button>
          </div>
        </div>

        <div class="form-btn">
          <button @click="_bindMobile">确认</button>
        </div>
      </div>
      <toast ref="toast" :text="text"></toast>
      <full-loading v-show="loading"></full-loading>
    </div>
</template>
<script>
  import Toast from 'base/toast/toast';
  import FullLoading from 'base/full-loading/full-loading';
  import {setWxMobAndCapt, setTitle} from 'common/js/util';
  import {sendCaptcha, getAppId} from 'api/general';
  // import {bindMobile} from 'api/user';

  export default {
    data() {
      return {
        loading: false,
        showFlag: false,
        mobile: '',
        mobErr: '',
        captcha: '',
        captErr: '',
        captBtnText: '获取验证码',
        disabled: false,
        text: ''
      };
    },
    methods: {
      show() {
        setTitle('绑定手机号');
        this.showFlag = true;
      },
      hide() {
        this.showFlag = false;
      },
      sendCaptcha() {
        this.$validator.validate('mobile').then((res) => {
          if(res) {
            this.sending = true;
            this.loading = true;
            sendCaptcha({
              bizType: '805051',
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
      _bindMobile() {
        this.$validator.validateAll().then((result) => {
          if(result) {
            setWxMobAndCapt(this.mobile, this.captcha);
            this.loading = true;
            // bindMobile({
            //   isSendSms: '1',
            //   mobile: this.mobile,
            //   smsCaptcha: this.captcha
            // }).then((res) => {
            //   this.loading = false;
            //   if(res.isSuccess) {
            //     this.text = '绑定成功';
            //     this.$refs.toast.show();
            //     getAppId().then((data) => {
            //       let appId = data.cvalue;
            //       let redirectUri = encodeURIComponent(`${location.origin}?${location.hash}`);
            //       let url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
            //       let suffix = '&response_type=code&scope=snsapi_userinfo#wechat_redirect';
            //       setTimeout(() => {
            //         location.replace(`${url}?appid=${appId}&redirect_uri=${redirectUri}${suffix}`);
            //       }, 100);
            //     });
            //   }
            // }).catch(() => { this.loading = false; });
            getAppId().then((data) => {
              let appId = data.cvalue;
              let redirectUri = encodeURIComponent(`${location.origin}?${location.hash}`);
              let url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
              let suffix = '&response_type=code&scope=snsapi_userinfo#wechat_redirect';
              setTimeout(() => {
                location.replace(`${url}?appid=${appId}&redirect_uri=${redirectUri}${suffix}`);
              }, 100);
            });
          } else {
            if(!this.mobile) {
              this.text = '请输入手机号';
            } else if(!this.captcha) {
              this.text = '请输入验证码';
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
            this.captBtnText = i-- + '秒后重发';
          }
        }, 1000);
      },
      _clearInterval() {
        if (this.timer) {
          this.disabled = false;
          clearInterval(this.timer);
          this.captBtnText = '获取验证码';
        }
      }
    },
    components: {
      Toast,
      FullLoading
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .bind-mobile-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $color-background;

    &.slide-up-enter-active, &.slide-up-leave-active {
      transition: all 0.3s;
    }

    &.slide-up-enter, &.slide-up-leave-to {
      top: 100%;
    }
    .form-wrapper {
      .form-item {
        .item-btn {
          .captBtn {
            /*width: 2.1rem;*/
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
</style>
