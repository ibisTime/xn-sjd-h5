<template>
  <div class="mall-wrapper" @click.stop>
    <div class="content">
        <div class="head-nav">
            <ul class="nav-list" @click="changStu">
                <li><span :class="{'on': isset == '1'}">全部</span></li>
                <li><span :class="{'on': isset == '2'}">待付款</span></li>
                <li><span :class="{'on': isset == '3'}">待发货</span></li>
                <li><span :class="{'on': isset == '4'}">待收货</span></li>
                <li><span :class="{'on': isset == '5'}">待评价</span></li>
            </ul>
        </div>
        <div class="order-list">
            <div class="order-sing">
                <div class="sing-head">
                    <div class="head-dp">
                        店铺名称 >
                        <span class="fr">待付款</span>
                    </div>
                </div>
                <div class="sing-con">
                    <div class="s-con_left">
                        <div class="l-img"></div>
                    </div>
                    <div class="s-con_right">
                        <p>商品名称 <span class="fr">x1</span></p>
                        <p>规格分类：10斤装</p>
                        <p>合计1件商品 <span class="fr sp-b">¥2480.00</span></p>
                    </div>
                </div>
                <div class="sing-foo">
                    <div class="foo-btn">
                        删除订单
                    </div>
                </div>
            </div>
        </div>
    </div>
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
      loadingText: '正在加载中...',
      isset: '1'
    };
  },
  created() {
    setTitle('商品订单');
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
    changStu() {
      let target = event.target;
      switch(target.innerText) {
        case '全部':
          this.isset = '1';
          break;
        case '待付款':
          this.isset = '2';
          break;
        case '待发货':
          this.isset = '3';
          break;
        case '待收货':
          this.isset = '4';
          break;
        case '待评价':
          this.isset = '5';
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
.mall-wrapper {
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
  .on{
        color: #23AD8C !important;
        border-color: #23AD8C !important;
    }
  .content {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    font-family: PingFangSC-Regular;
    .head-nav{
        height: 0.8rem;
        line-height: 0.8rem;
        background-color: #fff;
        border-bottom: 0.01rem solid #e5e5e5;
        font-size: 0.32rem;
        .nav-list{
            display: flex;
            justify-content: space-between;
            padding-bottom: 0.1rem;
            li{
                width: 20%;
                text-align: center;
                span{
                    padding-bottom: 0.08rem;
                    border-bottom: 0.01rem solid transparent;
                }
                .on{
                    color: #23AD8C;
                    border-color: #23AD8C;
                }
            }
        }
    }
    .order-sing{
        margin-bottom: 0.2rem;
        padding: 0 0.3rem;
        background-color: #fff;
        font-family: PingFang-SC-Medium;
        box-shadow: 0 -0.02rem 0 0 #EBEBEB;
        .sing-head{
            height: 0.8rem;
            line-height: 0.8rem;
            font-size: 0.26rem;
            color: #666;
        }
        .sing-con{
            height: 2.1rem;
            padding: 0 0.3rem;
            display: flex;
            .s-con_left{
                width: 1.6rem;
                height: 1.6rem;
                .l-img{
                    width: 100%;
                    height: 100%;
                    background-size: 100% 100%;
                    background-image: url('./shop.png');
                }
            }
            .s-con_right{
                width: 75%;
                height: 1.6rem;
                padding-left: 0.2rem;
                box-sizing: border-box;
                display: flex;
                flex-wrap: wrap;
                align-content: space-around;
                p{
                    width: 100%;
                    font-size: 0.26rem;
                    color: #999999;
                    letter-spacing: 0.002rem;
                    &:nth-of-type(1){
                        font-size: 0.32rem;
                        color: #333333;
                        letter-spacing: 0.0025rem;
                        font-weight: 600;
                        span{
                            font-size: 0.26rem;
                            color: #999999;
                            font-weight: 400;
                        }
                    }
                    .sp-b{
                        font-family: DIN-Bold;
                        font-size: 0.26rem;
                        color: #333333;
                        letter-spacing: 0.0023rem;
                        font-weight: 600;
                    }
                }
            }
        }
        .sing-foo{
            height: 0.9rem;
            padding: 0.18rem 0;
            display: flex;
            box-shadow: 0 -0.02rem 0 0 #EBEBEB;
            flex-direction: row-reverse;
            .foo-btn{
                width: 1.5rem;
                height: 0.56rem;
                text-align: center;
                line-height: 0.56rem;
                border: 0.02rem solid #979797;
                border-radius: 0.06rem;
                font-size: 0.26rem;
                color: #999;
            }
        }
    }
  }

}
</style>

