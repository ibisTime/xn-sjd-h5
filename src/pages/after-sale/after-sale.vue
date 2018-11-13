<template>
    <div class="sale-wallper">
        <div class="content">
            <div class="sale-head">
                <div class="sale-jtk">
                    <div class="jtk-left sale-left">
                        <p></p>
                    </div>
                    <div class="jtk-right sale-right">
                        <h5>仅退款</h5>
                        <p>卖家未发货或与卖家协商同意前提下</p>
                    </div>
                </div>
                <div class="sale-thtk">
                    <div class="thtk-left sale-left">
                        <p></p>
                    </div>
                    <div class="thtk-right sale-right">
                        <h5>退货退款</h5>
                        <p>卖家已发货，需要退换货物</p>
                    </div>
                </div>
            </div>
            <p class="back-co"></p>
            <div class="sale-con">
                <div class="sale-box01">
                    <div class="box-left">
                        <p>退款金额</p>
                    </div>
                    <div class="box-right">
                        <input type="text" placeholder="请输入金额">
                    </div>
                </div>
                <div class="sale-box01">
                    <div class="box-left">
                        <p>物流公司</p>
                    </div>
                    <div class="box-right">
                        <input type="text" placeholder="请输入物流公司">
                    </div>
                </div>
                <div class="sale-box01">
                    <div class="box-left">
                        <p>物流单号</p>
                    </div>
                    <div class="box-right">
                        <input type="text" placeholder="请输入物流单号">
                    </div>
                </div>
            </div>
            <div class="sale-foo">
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
import { formatAmount, formatImg, formatDate, setTitle } from 'common/js/util';
export default {
  data() {
    return {
      loading: true,
      textMsg: '',
      loadingText: '正在加载中...'
    };
  },
  created() {
    setTitle('售后');
  },
  mounted() {
    this.loading = false;
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
    tomore() {
      this.isAll = true;
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
  bottom: 0.98rem;
  width: 100%;
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .content {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background-color: #fff;
    padding: 0 0.3rem;
    font-family: PingFangSC-Regular;
    .back-co{
        height: 0.2rem;
        background-color: #f5f5f5;
    }
    .sale-head{
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
        margin-top: 1.4rem;
        height: 1rem;
        line-height: 1rem;
        text-align: center;
        font-size: 0.36rem;
        color: #fff;
        background-color: #23AD8C;
        border-radius: 0.12rem;
    }
  }
}
</style>

