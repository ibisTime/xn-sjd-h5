<template>
    <div class="sale-wallper">
        <div class="content">
            <div class="sale-head">
                <div class="sale-jtk" @click="setSaleFn('0')">
                    <div class="jtk-left sale-left">
                        <p :style="{'background-image': setIndex == '0' ? `url('/static/yxz.png')` : ''}"></p>
                    </div>
                    <div class="jtk-right sale-right">
                        <h5>仅退款</h5>
                        <p>卖家未发货或与卖家协商同意前提下</p>
                    </div>
                </div>
                <div class="sale-thtk" @click="setSaleFn('1')">
                    <div class="thtk-left sale-left">
                        <p :style="{'background-image': setIndex == '1' ? `url('/static/yxz.png')` : ''}"></p>
                    </div>
                    <div class="thtk-right sale-right">
                        <h5>退货退款</h5>
                        <p>卖家已发货，需要退货物</p>
                    </div>
                </div>
            </div>
            <p class="back-co" v-show="isset"></p>
            <div class="sale-con" v-show="isset">
                <div class="sale-box01">
                    <div class="box-left">
                        <p>退款金额</p>
                    </div>
                    <div class="box-right">
                      <input name="money" v-validate="'required'" type="text" placeholder="请输入金额" v-model="refundAmount">
                      <span v-show="errors.has('money')" class="error-tip">{{errors.first('money')}}</span>
                    </div>
                </div>
                <div class="sale-box01" v-show="setIndex === '1'">
                    <div class="box-left">
                        <p>物流公司</p>
                    </div>
                    <div class="box-right">
                      <input name="company" v-validate="'required'" type="text" placeholder="请输入物流公司" v-model="salesConfig.logisticsCompany">
                      <span v-show="errors.has('company')" class="error-tip">{{errors.first('company')}}</span>
                    </div>
                </div>
                <div class="sale-box01" v-show="setIndex === '1'">
                    <div class="box-left">
                        <p>物流单号</p>
                    </div>
                    <div class="box-right">
                      <input name="logistics" v-validate="'required'" type="text" placeholder="请输入物流单号" v-model="salesConfig.logisticsNumber">
                      <span v-show="errors.has('logistics')" class="error-tip">{{errors.first('logistics')}}</span>
                    </div>
                </div>
                <div class="sale-box01" v-show="setIndex === '1'">
                    <div class="box-left">
                        <p>发货人</p>
                    </div>
                    <div class="box-right">
                      <input name="deliver" v-validate="'required'" type="text" placeholder="请输入发货人" v-model="salesConfig.deliver">
                      <span v-show="errors.has('deliver')" class="error-tip">{{errors.first('deliver')}}</span>
                    </div>
                </div>
            </div>
            <div class="sale-foo" v-show="isset" @click="afterSale">
                提交
            </div>
        </div>
        <full-loading v-show="loading" :title="loadingText"></full-loading>
        <toast ref="toast" :text="textMsg"></toast>
    </div>
</template>

<script>
import FullLoading from 'base/full-loading/full-loading';
import Toast from 'base/toast/toast';
import { formatAmount, formatImg, formatDate, setTitle, getUserId } from 'common/js/util';
import { refundMoney, salesReturn, oneStoreOrder } from 'api/store';
export default {
  data() {
    return {
      loading: true,
      isset: false,
      setIndex: '',
      textMsg: '',
      loadingText: '正在加载中...',
      salesConfig: { // 退货参数
        orderDetailCode: '',   // 订单明细编号
        logisticsCompany: '',    // 物流公司
        logisticsNumber: '',    // 物流单号
        refundAmount: '',    // 退款金额
        deliver: ''    // 发货人
      },
      refundConfig: {  // 退款入参
        orderDetailCode: '',
        refundAmount: '',
        applyUser: getUserId()
      },
      refundAmount: '',
      orderDetailCode: '',
      toCode: ''
    };
  },
  created() {
    setTitle('售后');
    this.orderDetailCode = this.$route.query.code;
    this.toCode = this.$route.query.toCode;
    oneStoreOrder(this.orderDetailCode).then(data => {
      this.loading = false;
      this.refundAmount = formatAmount(data.amount);
    }, () => {
      this.loading = false;
    });
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    },
    formatImg(img) {
      return formatImg(img);
    },
    formatDate(date, format) {
      return formatDate(date, format);
    },
    go(url) {
      this.$router.push(url);
    },
    getImgSyl(imgs) {
      return {
        backgroundImage: `url(${imgs})`
      };
    },
    setSaleFn(index) {
      if(index === this.setIndex) {
        this.setIndex = '';
        this.isset = false;
        return;
      }
      this.setIndex = index;
      this.isset = true;
    },
    afterSale() {
      switch(this.setIndex) {
        case '0': // 退款
          if(this.refundAmount === '') {
            this.textMsg = '请填写完整';
            this.$refs.toast.show();
            return;
          }
          this.loading = true;
          this.refundConfig.refundAmount = parseFloat(this.refundAmount) * 1000;
          this.refundConfig.orderDetailCode = this.orderDetailCode;
          refundMoney(this.refundConfig).then(data => {
            this.loading = false;
            this.textMsg = '申请成功';
            this.$refs.toast.show();
            setTimeout(() => {
              this.go('/store-order_detail?code=' + this.toCode);
            }, 1500);
          }, () => {
            this.loading = false;
          });
          break;
        case '1': // 退货
          if(this.refundAmount === '' || this.salesConfig.logisticsCompany === '' || this.salesConfig.logisticsNumber === '') {
            this.textMsg = '请填写完整';
            this.$refs.toast.show();
            return;
          }
          this.loading = true;
          this.salesConfig.refundAmount = parseFloat(this.refundAmount) * 1000;
          this.salesConfig.orderDetailCode = this.orderDetailCode;
          salesReturn(this.salesConfig).then(data => {
            this.loading = false;
            this.textMsg = '申请成功';
            this.$refs.toast.show();
            setTimeout(() => {
              this.go('/store-order_detail?code=' + this.toCode);
            }, 1500);
          }, () => {
            this.loading = false;
          });
          break;
      }
    }
  },
  components: {
    FullLoading,
    Toast
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/mixin.scss";
@import "../../common/scss/variable.scss";
.sale-wallper {
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
  .error-tip{
    color: red;
  }
  .content {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background-color: #fff;
    font-family: PingFangSC-Regular;
    .back-co{
        height: 0.2rem;
        background-color: #f5f5f5;
    }
    .sale-head{
      padding: 0 0.3rem;
        >div{
            height: 1.8rem;
            padding: 0.3rem 0;
            display: flex;
            background: rgba(216,216,216,0.00);
            box-shadow: 0 0.02rem 0 0 #EBEBEB;
            font-family: PingFang-SC-Medium;
            .sale-left{
                width: 0.66rem;
                padding-top: 0.36rem;
                box-sizing: border-box;
                p{
                    width: 0.36rem;
                    height: 0.36rem;
                    border-radius: 100%;
                    background-size: 100% 100%;
                    border: 0.02rem solid #CCCCCC;
                }
            }
            .sale-right{
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                align-content: space-around;
                h5{
                    width: 100%;
                    font-size: 0.32rem;
                    color: #333333;
                    letter-spacing: 0.0025rem;
                }
                p{
                    width: 100%;
                    font-size: 0.26rem;
                    color: #999999;
                    letter-spacing: 0.0023rem;
                }
            }
        }

    }
    .sale-con{
      padding: 0 0.3rem;
        >div{
            height: 1.2rem;
            padding: 0.38rem 0;
            font-family: PingFang-SC-Medium;
            letter-spacing: 0.0022rem;
            font-size: 0.28rem;
            color: #333333;
            display: flex;
            background: rgba(216,216,216,0.00);
            box-shadow: 0 0.02rem 0 0 #EBEBEB;
            .box-left{
                width: 30%;
            }
            .box-right{
                width: 70%;
            }
        }
    }
    .sale-foo{
      margin: 0 0.3rem;
      margin-top: 0.6rem;
      height: 0.9rem;
      line-height: 0.9rem;
      text-align: center;
      font-size: 0.36rem;
      color: #fff;
      background-color: #23AD8C;
      border-radius: 0.12rem;
    }
  }
}
</style>

