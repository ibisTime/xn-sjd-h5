<template>
  <div class="me-wrapper">
    <div class="bg">
      <!-- <m-header class="cate-header" title="提现" style="z-inex"></m-header> -->
      <div class="content">
        <Scroll :pullUpLoad="pullUpLoad">
          <div class="bk">
            <img src="./bankcard@2x.png" alt="">
            <select
              name="bk_select"
              id="bk_select"
              class="bk_set"
              v-model="config.payCardNo"
            >
              <option
                :value="item.bankcardNumber"
                v-for="(item, index) in bankcardList"
              >{{item.bankName}}{{formatBankcardNum(item.bankcardNumber)}}</option>
            </select>
            <img src="./more@2x.png" alt="" class="fr more">
          </div>
          <div class="gray"></div>

          <div class="recharge">
            <p>提现金额（收取 {{qxFee * config.amount / 100 }}元手续费）</p>
            <p class="number"><input type="number" v-model="config.amount"></p>
            <div class="have">
              <span class="fl">可用余额 {{formatAmount(userAmount[0].amount)}} 元</span>
              <span class="fr" @click="withdrawAll">全部提取</span>
            </div>
          </div>
          <div class="gray"></div>
          <div class="recharge note">
            <p>提现说明</p>
            <textarea name="" rows="2" v-model="config.applyNote"></textarea>
          </div>
          <div class="gray"></div>
          <div class="withdraw-rules">
            <p>提取规则：</p>
            <p v-for="(item, index) in sysConfig">{{index+1}}.{{item.remark}}:{{item.cvalue}}</p>
            <!--<p>2.提现金额必须是{{qxBei}}的倍数，单笔最高{{dbiMax}}元；</p>-->
            <!--<p>3.T+{{qxDay}}到账</p>-->
          </div>
          <div class="btn"><button @click="userTxMoney">提现</button></div>
        </Scroll>
      </div>
      <confirm-input ref="confirmInput" :text="inputText" :inpType="inpType" @confirm="handleInputConfirm"></confirm-input>
      <toast ref="toast" :text="errMsg"></toast>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import MHeader from 'components/m-header/m-header';
  import {setTitle, formatAmount} from 'common/js/util';
  import { getCookie } from 'common/js/cookie';
  import {paymentType, payApplyFor, userAccount} from 'api/biz';
  import { getBankCardList } from 'api/account';
  import {getSystemConfigPage, getSystemConfigCkey} from 'api/general';
  import { getUserDetail } from 'api/user';
  import ConfirmInput from 'base/confirm-input/confirm-input';
  import Toast from 'base/toast/toast';
  import Scroll from 'base/scroll/scroll';

  export default {
    data() {
      return {
        pullUpLoad: null,
        errMsg: '',
        text: '',
        inputText: '支付密码',
        inpType: 'password',
        wechat: true,
        alipay: false,
        balance: false,
        qxFee: 0,
        maxQx: 0,
        qxBei: 0,
        dbiMax: 0,
        qxDay: 0,
        userAmount: [{amount: 0}],
        payList: [],
        userAccountList: {},
        config: {
          payCardInfo: '中国银行',
          accountNumber: '',
          applyNote: '',
          payCardNo: '',
          applyUserType: 'C',
          amount: '',
          bankName: '',
          bankcardNumber: ''
        },
        bankcardList: [],
        userDetail: {},
        sysConfig: []
      };
    },
    mounted() {
      setTitle('提现');
      let userId = getCookie('userId');
      this.pullUpLoad = null;
      this.getQxFee('USERQXFL');
      // this.getQxFee('USERMONTIMES');
      this.getQxFee('USERQXBS');
      // this.getQxFee('QXDBZDJE');
      // this.getQxFee('USERDZTS');
      this.getConfig();
      Promise.all([
        userAccount(),
        paymentType(),
        getBankCardList(),
        getUserDetail({userId: userId})
      ]).then(([res1, res2, res3, res4]) => {
        this.userAmount = res1.filter(item => {
          return item.currency === 'CNY';
        });
        this.config.accountNumber = this.userAmount[0].accountNumber;
        sessionStorage.setItem('accountNumber', this.userAmount[0].accountNumber);
        res2.forEach(item => {
          this.payList.push({bankName: item.bankName});
        });
        if(res3.length) {
          this.bankcardList = res3;
          this.config.payCardNo = res3[0].bankcardNumber;
        } else {
          this.errMsg = '暂无银行卡，即将前往添加...';
          this.$refs.toast.show();
          setTimeout(() => {
            this.$router.push('/bankcard-addedit');
          }, 1000);
        }
        this.userDetail = res4;
      }).catch(() => {});
    },
    methods: {
      formatAmount(amount) {
        return formatAmount(amount);
      },
      go(url) {
        this.$router.push(url);
      },
      getQxFee(cKey) {
        getSystemConfigCkey(cKey).then(data => {
          switch(cKey) {
            case 'USERQXFL': this.qxFee = parseFloat(data.cvalue) * 100; break;
            case 'USERMONTIMES': this.maxQx = parseFloat(data.cvalue); break;
            case 'USERQXBS': this.qxBei = parseFloat(data.cvalue); break;
            case 'QXDBZDJE': this.dbiMax = parseFloat(data.cvalue); break;
            case 'USERDZTS': this.qxDay = parseFloat(data.cvalue); break;
          }
        });
      },
      getConfig() {
        getSystemConfigPage({
          start: 1,
          limit: 10,
          type: 'WITH'
        }).then(data => {
          this.sysConfig = data.list;
          // switch(cKey) {
          //   case 'USERQXFL': this.qxFee = parseFloat(data.cvalue) * 100; break;
          //   case 'USERMONTIMES': this.maxQx = parseFloat(data.cvalue); break;
          //   case 'USERQXBS': this.qxBei = parseFloat(data.cvalue); break;
          //   case 'QXDBZDJE': this.dbiMax = parseFloat(data.cvalue); break;
          //   case 'USERDZTS': this.qxDay = parseFloat(data.cvalue); break;
          // }
        });
      },
      userTxMoney() {
        if(this.config.payCardNo && this.config.amount && this.config.amount % this.qxBei === 0 && this.userDetail.tradepwdFlag) {
          this.$refs.confirmInput.show();
        } else {
          if(!this.config.payCardNo) {
            this.errMsg = '请选择银行卡';
            this.$refs.toast.show();
            return;
          }
          if(!this.config.amount) {
            this.errMsg = '请填写取现金额';
            this.$refs.toast.show();
            return;
          }
          if(this.config.amount % this.qxBei !== 0) {
            this.errMsg = `提现金额必须是${this.qxBei}的倍数`;
            this.$refs.toast.show();
            return;
          }
          if(!this.userDetail.tradepwdFlag) {
            this.errMsg = '请先去设置支付密码';
            this.$refs.toast.show();
            setTimeout(() => {
              this.$router.push('/set-money');
            }, 1000);
            return;
          }
        }
      },
      handleInputConfirm(data) {
        if(!data) {
          this.errMsg = '请填写支付密码';
          this.$refs.toast.show();
          this.$refs.confirmInput.show();
        } else {
          let amount = (this.config.amount * 1000).toString();
          this.config.tradePwd = data;
          payApplyFor({
            ...this.config,
            amount
          }).then(data => {
            this.errMsg = data.errorInfo;
            if(this.errMsg) {
              this.text = this.errMsg;
              this.$refs.toast.show();
            }else{
              this.errMsg = '操作成功,待平台审核';
              this.$refs.toast.show();
              setTimeout(() => {
                this.$router.push('/me');
              }, 1000);
            }
          });
        }
      },
      formatBankcardNum(num) {
        let reg = /^(\d{4})\d+(\d{4})$/;
        num = num.replace(reg, '$1 **** **** $2');
        return num;
      },
      withdrawAll() {
        this.config.amount = formatAmount(this.userAmount[0].amount);
      }
    },
    components: {
      Toast,
      MHeader,
      ConfirmInput,
      Scroll
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  .me-wrapper {
    background: #fff;
    position: fixed;
    width: 100%;
    bottom: 0;
    top: 0;
    left: 0;
    .fl {
      float: left;
    }
    .fr {
      float: right;
    }
    .bg {
      .title {
        font-size: 0.36rem;
        color: #fff;
        padding-top: 0.19rem;
        text-align: center;
      }
      .content {
        // padding: 0.88rem 0 0 0;
        // height: 5rem;
        background: #f5f5f5;
        .scroll-content {
          padding: 0 0.3rem;
        }
        div {
          background: #ffffff;
        }
        .bk {
          width: 100%;
          height: 1.1rem;
          line-height: 1.1rem;
          font-size: $font-size-medium-x;
          color: #333;
          border-bottom: 1px solid $color-border;
          display: flex;
          align-items: center;
          img {
            height: 0.36rem;
            vertical-align: middle;
            margin-right: 0.15rem;
          }
          span {
            font-size: $font-size-medium-x;
            color: #333;
            vertical-align: middle;
          }
          .bk_set{
            width: 66%;
            background-color: #fff;
            font-size: 0.3rem;
            flex: 1;
          }
        }
        .recharge {
          padding-top: 0.34rem;
          p {
            font-size: $font-size-medium-s;
            color: #666;
            margin-bottom: 0.15rem;
          }
          p.number {
            font-weight: bold;
            color: #141414;
            border-bottom: 1px solid $color-border;
            input {
              font-size: 0.64rem;
              font-family: 'DIN-Bold';
              margin-top: 0.15rem;
              margin-bottom: 0.34rem;
            }
          }
          p.card_no{
            padding-top: .05rem;
            padding-bottom: .15rem;
            input{
              font-size: .36rem;
            }
          }
          textarea{
            font-size: 0.34rem;
            padding: .2rem .1rem;
          }
          .have {
            padding: 0.24rem 0;
            height: 0.8rem;
            span {
              font-size: $font-size-small;
              color: $primary-color;
            }
            span:first-child {
              color: $color-text-l;
            }
          }
        }
        .gray {
          width: 100%;
          height: 0.2rem;
          padding: 0;
          background: transparent;
        }
        .note {
          border-bottom: 1px solid $color-border;
        }
        .withdraw-rules {
          padding-top: 0.28rem;
          font-size: $font-size-small;
          color: $color-text-l;
          margin-bottom: .24rem;
          p {
            line-height: 0.4rem;
          }
        }
      }
      .btn {
        padding-bottom: 2rem;
        button {
          width: 100%;
          height: 0.84rem;
          background: $primary-color;
          color: $color-highlight-background;
          border-radius: 0.08rem;
          font-size: $font-size-medium-xx;
        }
      }
    }
  }
</style>
