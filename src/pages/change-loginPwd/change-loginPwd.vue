<template>
  <transition name="slide">
    <div class="change-mobile-wrapper">
      <m-header class="cate-header" title="设置登陆密码"></m-header>
      <div class="form-wrapper">
        <div class="form-item border-bottom-1px">
          <div class="item-input-wrapper">
            <input type="password" class="item-input" name="oldLoginPwd" v-validate="'required|min:6'" v-model="oldLoginPwd" placeholder="请输入原密码(至少6个字符）">
            <span v-show="errors.has('oldLoginPwd')" class="error-tip">{{errors.first('oldLoginPwd')}}</span>
          </div>
        </div>
        <div class="form-item border-bottom-1px">
          <div class="item-input-wrapper">
            <input type="password" class="item-input" name="newLoginPwd" v-validate="'required|min:6'" v-model="newLoginPwd" placeholder="请输入新密码(至少6个字符）">
            <span v-show="errors.has('newLoginPwd')" class="error-tip">{{errors.first('newLoginPwd')}}</span>
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
  import {changeLoginPwd, getUserDetail} from 'api/user';
  import {directiveMixin} from 'common/js/mixin';
  import { getCookie } from 'common/js/cookie';
  import { setTitle } from 'common/js/util';
  import Toast from 'base/toast/toast';
  import MHeader from 'components/m-header/m-header';

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
        text: '',
        oldLoginPwd: '',
        newLoginPwd: ''
      };
    },
    mounted() {
      setTitle('修改登录密码');
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
      _changeMobile() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.setting = true;
            changeLoginPwd({
              oldLoginPwd: this.oldLoginPwd,
              newLoginPwd: this.newLoginPwd
            }).then(data => {
              if(data.isSuccess) {
                this.text = '设置成功';
                this.$refs.toast.show();

                setTimeout(() => {
                  this.$router.back();
                }, 2000);
              }
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
      padding: 0.88rem 0.3rem 0;
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
