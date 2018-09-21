<template>
  <div class="bankcard-edit-wrapper">
    <m-header class="cate-header" title="添加银行卡"></m-header>
    <div class="form-wrapper">
      <div class="form-item border-bottom-1px">
        <div class="item-label">银行卡</div>
        <div class="item-input-wrapper">
          <input type="tel" class="item-input" v-model="realName" v-validate="'required'" name="realName" placeholder="银行卡类型">
          <span v-show="errors.has('realName')" class="error-tip">{{errors.first('realName')}}</span>
        </div>
      </div>
      <div class="form-item border-bottom-1px">
        <div class="item-label">支行名称</div>
        <div class="item-input-wrapper">
          <input type="text" class="item-input" v-model="realName" v-validate="'required'" name="realName" placeholder="银行支行名称">
          <span v-show="errors.has('realName')" class="error-tip">{{errors.first('realName')}}</span>
        </div>
      </div>
    </div>
    <div class="gray"></div>
    <div class="form-wrapper second-form-warpper">
      <div class="form-item border-bottom-1px">
        <div class="item-label">持卡人</div>
        <div class="item-input-wrapper">
          <input type="text" class="item-input" v-model="realName" v-validate="'required'" name="realName" placeholder="持卡人姓名">
          <span v-show="errors.has('realName')" class="error-tip">{{errors.first('realName')}}</span>
        </div>
      </div>
      <div class="form-item border-bottom-1px">
        <div class="item-label">身份证</div>
        <div class="item-input-wrapper">
          <input type="text" class="item-input" v-model="idCard" v-validate="'required|idCard'" name="idCard" placeholder="持卡人身份证号">
          <span v-show="errors.has('idCard')" class="error-tip">{{errors.first('idCard')}}</span>
        </div>
      </div>
      <div class="form-item border-bottom-1px">
        <div class="item-label">手机号</div>
        <div class="item-input-wrapper">
          <input type="tel" class="item-input" v-model="mobile" v-validate="'required|mobile'" name="mobile" placeholder="银行预留手机号">
          <span v-show="errors.has('mobile')" class="error-tip">{{errors.first('mobile')}}</span>
        </div>
      </div>
      <div class="form-item border-bottom-1px">
        <div class="item-label">验证码</div>
        <div class="item-input-wrapper">
          <input type="tel" class="item-input" v-model="captcha" v-validate="'required'" name="captcha" placeholder="请输入验证码">
          <span v-show="errors.has('captcha')" class="error-tip">{{errors.first('captcha')}}</span>
          <button :disabled="sending" class="captBtn">{{captBtnText}}</button>
        </div>
      </div>
      <div class="buttons">
        <button :disabled="setting" @click="saveBankCard" class="btn">确定</button>
      </div>
      <full-loading v-show="showLoading()"></full-loading>
      <toast ref="toast" :text="text"></toast>
    </div>
  </div>
</template>
<script>
  // import {SET_BANKCARD_LIST} from 'store/mutation-types';
  import {getBankCardList, getBankCodeList, addBankCard, editBankCard} from 'api/account';
  import FullLoading from 'base/full-loading/full-loading';
  import Toast from 'base/toast/toast';
  import MHeader from 'components/m-header/m-header';

  export default {
    data() {
      return {
        bankcodeList: [],
        setting: false,
        realName: '',
        bankName: '',
        subbranch: '',
        bankcardNumber: '',
        bindMobile: '',
        text: '新增成功',
        captBtnText: '获取验证码',
        idCard: '',
        mobile: '',
        captcha: '',
        sending: false
      };
    },
    created() {
      if (this.$route.params.id) {
        Promise.all([
          this._getBankCardList(),
          this._getBankCodeList()
        ]).then(([bankCard, bankCode]) => {
          this._initPageData(bankCard, bankCode);
        }).catch(() => {});
      } else {
        Promise.all([
          this._getBankCardList(),
          this._getBankCodeList()
        ]).then(() => {}).catch(() => {});
      }
    },
    methods: {
      // 获取银行数据字典列表
      _getBankCodeList() {
        return getBankCodeList().then((data) => {
          this.bankcodeList = data;
          this.bankName = data[0];
          return data;
        });
      },
      _getBankCardList() {
        if (!this.bankcardList) {
          return getBankCardList().then((data) => {
            this.setBankCardList(data);
            return this._judgeBankCode(data);
          });
        } else {
          return this._judgeBankCode(this.bankcardList);
        }
      },
      _judgeBankCode(data) {
        if (this.$route.params.id) {
          let index = data.findIndex((item) => {
            return item.code === this.$route.params.id;
          });
          if (!~index) {
            this.text = '银行卡编号错误';
            setTimeout(() => {
              this.$refs.toast.show();
            }, 20);
            return Promise.reject('银行卡编号错误');
          }
          return Promise.resolve(data[index]);
        } else {
          return Promise.resolve(data);
        }
      },
      _initPageData(bankCard, bankCode) {
        setTimeout(() => {
          let index = bankCode.findIndex((item) => {
            return item.bankCode === bankCard.bankCode;
          });
          this.bankName = bankCode[index];
          this.realName = bankCard.realName;
          this.subbranch = bankCard.subbranch;
          this.bankcardNumber = bankCard.bankcardNumber;
          this.bindMobile = bankCard.bindMobile;
        }, 100);
      },
      showLoading() {
        return false;
        // if (!this.$route.params.id) {   // 新增
        //   return !this.bankcodeList.length;
        // } else {   // 修改
        //   return !this.bankcodeList.length || !this.bankName;
        // }
      },
      saveBankCard() {
        this.$validator.validateAll().then((result) => {
          if(result) {
            let param = {
              bankcardNumber: this.bankcardNumber,
              bankCode: this.bankName.bankCode,
              bankName: this.bankName.bankName,
              subbranch: this.subbranch,
              bindMobile: this.bindMobile,
              realName: this.realName
            };
            if (this.$route.params.id) {
              param.code = this.$route.params.id;
              this._editBankCard(param);
            } else {
              this._addBankCard(param);
            }
          }
        });
      },
      _addBankCard(param) {
        addBankCard(param).then((code) => {
          this.setting = false;
          this.text = '新增成功';
          this.$refs.toast.show();
          if (this.bankcardList) {
            param.code = code;
            this.addBankCard({
              bankcard: param
            });
          }
          setTimeout(() => {
            this.$router.back();
          }, 1000);
        }).catch(() => {
          this.setting = false;
        });
      },
      _editBankCard(param) {
        editBankCard(param).then(() => {
          this.setting = false;
          this.text = '修改成功';
          this.$refs.toast.show();
          this.editBankCard({
            bankcard: param
          });
          setTimeout(() => {
            this.$router.back();
          }, 1000);
        }).catch(() => {
          this.setting = false;
        });
      }
    },
    components: {
      FullLoading,
      Toast,
      MHeader
    }
  };
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .bankcard-edit-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $color-highlight-background;
    font-size: $font-size-large-xxx;
    .form-wrapper {
      padding: 0.88rem 0.3rem 0 0.3rem;
      .form-item {
        .item-label {
          padding: 0;
          flex: 0 0 1.5rem;
        }
        .item-input-wrapper {
          .captBtn {
            width: 1.68rem;
            height: 0.52rem;
            background: $color-highlight-background;
            border: 1px solid $primary-color;
            border-radius: 0.04rem;
            color: $primary-color;
            font-size: $font-size-small-s;
          }
        }
      }
    }
    .second-form-warpper {
      padding-top: 0;
    }
    .gray {
      width: 100%;
      height: 0.2rem;
      padding: 0;
      background: #f5f5f5;
    }

    .arrow {
      position: absolute;
      right: 0.24rem;
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      @include bg-image('arrow');
      width: 0.3rem;
      height: 0.3rem;
      top: 50%;
      transform: translate(0, -50%);
    }
  }
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  .btn {
    display: block;
    width: 100%;
    line-height: 0.9rem;
    margin: 1.43rem 0;
    background-color: $primary-color;
    color: #fff;
    text-align: center;
    border-radius: 0.08rem;
    font-size: 0.3rem;
  }
  .error-tip {
    position: absolute;
    right: 0.16rem;
    top: 0.38rem;
    white-space: nowrap;
    font-size: $font-size-medium;
    color: #ff0000;
  }
  .item-input-wrapper {
      position: relative;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      height: 1rem;
      padding: 0 0.16rem;
      padding-left: 0.2rem;
      min-width: 2.56rem;

      .item-input {
        padding: 0.12rem 0;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        line-height: 1.2;
        background: transparent;
      }

      .hide-area {
        position: absolute;
        visibility: hidden;
      }

      textarea {
        width: 100%;
        background: transparent;
      }

      .error-tip {
        position: absolute;
        right: 0.16rem;
        top: 0.38rem;
        white-space: nowrap;
        font-size: $font-size-medium;
        color: #ff0000;
      }
    }
    .form-wrapper {
  .form-item {
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    font-size: $font-size-medium-x;
    background-color: #fff;

    &.border-bottom-1px {
      @include border-bottom-1px($color-border);
    }

    &:last-child {
      @include border-none();
    }

    &.is-textarea {
      .item-input-wrapper {
        padding: 0.1rem 0.2rem;
      }
    }

    .item-label {
      width: 2rem;
      -webkit-box-flex: 0;
      -ms-flex: 0 0 2rem;
      flex: 0 0 2rem;
      text-align: left;
      padding-left: 0.3rem;
    }

    .inner-label {
      padding: 0 0.16rem;
      height: 1rem;
      line-height: 1rem;
    }

    .item-input-wrapper {
      position: relative;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      height: 1rem;
      padding: 0 0.16rem;
      padding-left: 0.2rem;
      min-width: 2.56rem;

      .item-input {
        padding: 0.12rem 0;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        line-height: 1.2;
        background: transparent;
      }

      .hide-area {
        position: absolute;
        visibility: hidden;
      }

      textarea {
        width: 100%;
        background: transparent;
      }

      .error-tip {
        position: absolute;
        right: 0.16rem;
        top: 0.38rem;
        white-space: nowrap;
        font-size: $font-size-medium;
        color: #ff0000;
      }
    }
    .item-btn {
      padding-left: 0.3rem;
      width: 2.1rem;
      padding-right: 0.3rem;
      //@include border-left-1px($color-border);

      &::after {
        height: 1em;
        bottom: 50%;
        transform: translate(0, 50%);
      }

      button {
        width: 100%;
        height: 0.6rem;
        line-height: 0.6rem;
        white-space: nowrap;
        border-radius: 0.1rem;
        font-size: $font-size-medium-s;
        background: transparent;
        color: $primary-color;

        &[disabled] {
          color: $color-disable-background;
        }
      }
    }
  }

  select {
    font-size: $font-size-medium-x;
  }

  .form-btn {
    margin-top: 0.8rem;
    padding: 0 0.3rem;
    width: 100%;

    button {
      display: block;
      width: 100%;
      line-height: 0.9rem;
      border-radius: 0.1rem;
      font-size: $font-size-large-s;
      background: $primary-color;
      color: #fff;

      &[disabled] {
        background: $color-disable-background;
      }
    }
  }
}
</style>
