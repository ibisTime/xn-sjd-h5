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
              v-model="config.payCardInfo"
            >
              <option
                :value="item.bankName"
                v-for="(item, index) in payList"
                :key="index"
              >{{item.bankName}}</option>
            </select>
            <img src="./more@2x.png" alt="" class="fr more">
          </div>
          <div class="gray"></div>
          <div class="recharge">
            <p>银行卡号</p>
            <p class="card_no"><input type="number" v-model="config.payCardNo"></p>
          </div>
          <div class="gray"></div>
          <div class="recharge">
            <p>提现金额（收取 {{qxFee}}%服务费）</p>
            <p class="number"><input type="number" v-model="config.amount"></p>
            <div class="have">
              <span class="fl">可用余额 {{formatAmount(userAmount[0].amount)}} 元</span>
              <span class="fr">全部提取</span>
            </div>
          </div>
          <div class="gray"></div>
          <div class="recharge">
            <p>提现说明</p>
            <textarea name="" id="" rows="2" v-model="config.applyNote"></textarea>
          </div>
          <div class="gray"></div>
          <div class="withdraw-rules">
            <p>提取规则：</p>
            <p>1.每月最大提现次数{{maxQx}}次；</p>
            <p>2.提现金额必须是{{qxBei}}的倍数，单笔最高{{dbiMax}}元；</p>
            <p>3.T+{{qxDay}}到账</p>
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
  import {paymentType, payApplyFor, userAccount} from 'api/biz';
  import {getSystemConfigCkey} from 'api/general';
  import ConfirmInput from 'base/confirm-input/confirm-input';
  import Toast from 'base/toast/toast';
  import Scroll from 'base/scroll/scroll';

  export default {
    data() {
      return {
        pullUpLoad: null,
        errMsg: '',
        text: '',
        inputText: '资金密码',
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
          amount: 100
        }
      };
    },
    created() {
      setTitle('提现');
      this.pullUpLoad = null;
    },
    mounted() {
      this.getQxFee('USERQXFL');
      this.getQxFee('USERMONTIMES');
      this.getQxFee('USERQXBS');
      this.getQxFee('QXDBZDJE');
      this.getQxFee('USERDZTS');
      userAccount().then(data => {
        this.userAmount = data.filter(item => {
          return item.currency === 'CNY';
        });
        this.config.accountNumber = this.userAmount[0].accountNumber;
        sessionStorage.setItem('accountNumber', this.userAmount[0].accountNumber);
      });
      paymentType().then(data => {
        data.forEach(item => {
          this.payList.push({bankName: item.bankName});
        });
      });
    },
    methods: {
      formatAmount(amount) {
        return formatAmount(amount);
      },
      getTel() {
        if (this.telephone) {
          return `tel://${this.telephone}`;
        } else {
          return '';
        }
      },
      go(url) {
        this.$router.push(url);
      },
      selectPayType(index) {
        if(index === 1) {
          this.wechat = true;
          this.alipay = false;
          this.balance = false;
        } else if(index === 2) {
          this.wechat = false;
          this.alipay = true;
          this.balance = false;
        } else if(index === 3) {
          this.wechat = false;
          this.alipay = false;
          this.balance = true;
        }
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
      userTxMoney() {
        this.$refs.confirmInput.show();
      },
      handleInputConfirm(data) {
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
            this.text = '操作成功';
            this.$refs.toast.show();
            setTimeout(() => {
              this.$router.push('/me');
            }, 1000);
          }
        });
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
        div {
          padding: 0 0.3rem;
          background: #ffffff;
        }
        .bk {
          width: 100%;
          height: 1.1rem;
          line-height: 1.1rem;
          font-size: $font-size-medium-x;
          color: #333;
          border-bottom: 1px solid $color-border;
          img {
            height: 0.36rem;
            margin-right: 0.12rem;
            vertical-align: middle;
          }
          span {
            font-size: $font-size-medium-x;
            color: #333;
            vertical-align: middle;
          }
          .bk_set{
            width: 66%;
            padding-left: 0.2rem;
            background-color: #fff;
          }
          .more {
            margin-top: 0.35rem;
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
        .withdraw-rules {
          padding-top: 0.28rem;
          font-size: $font-size-small;
          color: $color-text-l;
          margin-bottom: .24rem;
          p {
            line-height: 0.36rem;
          }
        }
      }
      .btn {
        padding: 0 0.3rem;
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
