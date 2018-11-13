<template>
  <div class="shop-wrapper_det">
    <div class="content">
      <div class="shop-head">
        <p class="shop-p">
          <span class="fl fh"></span>
          <span class="fr fx"></span>
        </p>
      </div>
      <div class="shop-conAll">
        <div class="shop-det">
          <p class="shop-price"><span>￥1000.00</span> - <span>￥2000.00</span></p>
          <p class="shop-msg">产品名称产品名称产品名称产品名称产品名称产品名称产品名称产品名称产品名称产品名称</p>
          <div class="or-msg">
            <p>快递：包邮</p>
            <p>月销15笔</p>
            <p>上海</p>
          </div>
        </div>
        <div class="shop-gg">
          <p>规格：选择规格分类</p>
        </div>
        <div class="shop-pj">
          <div class="pj-head">
            <p>评价 <span class="fr pj-all" @click="go('user-comment')">查看全部 ></span></p>
          </div>
          <div class="pj-content">
            <div class="con-head">
              <div class="u-img"></div>
              <div class="u-name">ksy</div>
            </div>
            <div class="pj-con">
              <p>好看又耐用。攒</p>
            </div>
          </div>
        </div>
        <div class="shop-js">
          <div class="js-head">
            <p><span></span> 图文介绍</p>
            <div class="js-img"></div>
          </div>
        </div>
        <div class="shop-foo">
          <div class="foo-left">
            <div class="le-dp" @click="go('mall-store');">
              <div class="dp-img"></div>
              <p>店铺</p>
            </div>
            <div class="le-kf">
              <div class="kf-img"></div>
              <p>客服</p>
            </div>
          </div>
          <div class="foo-right">
            <button class="add-cart" @click="istoast = true">加入购物车</button>
            <button class="buy">立即购买</button>
          </div>
        </div>
      </div>
      <div class="toast" v-show="istoast">
        <div class="shop-toast">
          <div class="tos-head">
            <div class="head-left">
              <div class="l-img"></div>
            </div>
            <div class="head-right">
              <p class="r-head">¥80-185 <span class="fr iconX" @click="istoast = false"></span></p>
              <p>库存9942件</p>
              <p>选择颜色分类</p>
            </div>
          </div>
          <div class="tos-con">
            <div class="con-head">
              <h5>规格分类</h5>
            </div>
            <div class="con-list">
              <div class="sing">
                <p>规格分类</p>
              </div>
              <div class="sing">
                <p>规格分类</p>
              </div>
              <div class="sing">
                <p>规格分类</p>
              </div>
              <div class="sing">
                <p>规格分类</p>
              </div>
            </div>
            <div class="con-foo">
              <div class="f-left">
                数量
                <p class="fr l-num">
                  <span class="jian"></span> <b>1</b> <span class="jia"></span>
                </p>
              </div>
            </div>
          </div>
          <div class="tos-btn">
            确定
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { formatAmount, setTitle } from 'common/js/util';
export default {
  data() {
    return {
      istoast: false
    };
  },
  created() {
    setTitle('产品详情');
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    },
    go(url) {
      this.$router.push(url);
    },
    getImgSyl(imgs) {
      return {
        backgroundImage: `url(${imgs})`
      };
    }
  },
  mounted() {
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/mixin.scss";
@import "../../common/scss/variable.scss";
.shop-wrapper_det{
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
    font-family: PingFangSC-Regular;
    .shop-head{
      height: 5.3rem;
      background-image: url('./shop.png');
      background-size: 100%;
      background-clip: center;
      padding: 0.4rem 0.3rem;
      .shop-p{
        span{
          display: inline-block;
          width: 0.5rem;
          height: 0.5rem;
          background-size: 100%;
        }
        .fh{
          background-image: url('./fh.png');
        }
        .fx{
          background-image: url('./fx.png');
        }
      }
    }
    .shop-conAll{
      padding: 0.31rem 0;
      font-family: PingFangSC-Semibold;
      letter-spacing: 0.0025rem;
      .shop-det{
        background-color: #fff;
        padding: 0 0.3rem;
        margin-bottom: 0.2rem;
        .shop-price{
          font-size: 0.32rem;
          color: #23AD8C;
          letter-spacing: 0.0025px;
          margin-bottom: 0.31rem;
        }
        .shop-msg{
          font-size: 0.32rem;
          color: #333333;
          letter-spacing: 0.0025rem;
          margin-bottom: 0.3rem;
        }
        .or-msg{
          display: flex;
          justify-content: space-between;
          font-size: 0.26rem;
          color: #999999;
          letter-spacing: 0.002rem;
          padding-bottom: 0.3rem;
        }
      }
      .shop-gg{
        padding-left: 0.3rem;
        background-color: #fff;
        height: 1.1rem;
        line-height: 1.1rem;
        font-size: 0.28rem;
        color: #333333;
        letter-spacing: 0.0022rem;
        margin-bottom: 0.2rem;
      }
      .shop-pj{
        padding: 0.3rem 0.3rem 0;
        background-color: #fff;
        margin-bottom: 0.2rem;
        .pj-head{
          color: #333;
          font-size: 0.32rem;
          margin-bottom: 0.2rem;
          .pj-all{
            color: #999999;
            font-size: 0.28rem;
          }
        }
        .pj-content{
          padding-bottom: 0.3rem;
          font-size: 0.28rem;
          color: #333333;
          letter-spacing: 0.0022rem;
          .con-head{
            display: flex;
            margin-bottom: 0.16rem;
            .u-img{
              margin-right: 0.14rem;
              width: 0.6rem;
              height: 0.6rem;
              border-radius: 100%;
              background-size: 100%;
              background-clip: center;
              background-image: url('./shop.png');
            }
            .u-name{
              color: #999;
              line-height: 0.6rem;
            }
          }
        }
      }
      .shop-js{
        padding: 0.3rem;
        background-color: #fff;
        .js-head{
          p{
            font-size: 0.32rem;
            color: #333333;
            margin-bottom: 0.28rem;
            span{
              display: inline-block;
              width: 0.06rem;
              height: 0.32rem;
              background-color: #23AD8C;
              vertical-align: top;
            }
          }
          .js-img{
            width: 100%;
            height: 4.2rem;
            background-image: url('./shop.png');
            background-size: 100%;
            background-clip: center;
          }
        }
      }
      .shop-foo{
        position: fixed;
        bottom: 0;
        width: 100%;
        display: flex;
        height: 0.98rem;
        align-items: center;
        background-color: #fff;
        .foo-left{
          width: 30%;
          display: flex;
          >div{
            width: 50%;
            text-align: center;
            font-size: 0.22rem;
            color: #999999;
            letter-spacing: 0.0017rem;
            display: flex;
            align-items: center;
            flex-direction: column;
            >div{
              margin-bottom: 0.07rem;
              width: 0.38rem;
              height: 0.32rem;
              background-size: 100% 100%;
            }
            .dp-img{
              background-image: url('./dp.png');
            }
            .kf-img{
              background-image: url('./kf.png');
            }
          }
        }
        .foo-right{
          width: 70%;
          height: 0.84rem;
          display: flex;
          justify-content: space-between;
          button{
            width: 48%;
            line-height: 0.84rem;
            text-align: center;
            letter-spacing: 0.0027rem;
            font-size: 0.32rem;
            border-radius: 0.12rem;
            color: #fff;
          }
          .add-cart{
            background-color: #554F5B;
          }
          .buy{
            background-color: #23AD8C;
          }
        }
      }
    }
    .toast{
      position: fixed;
      z-index: 99;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .7);
    }
    .shop-toast{
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 60%;
      padding: 0.3rem 0.3rem 0.1rem;
      background-color: #fff;
      .tos-head{
        display: flex;
        margin-bottom: 0.3rem;
        .l-img{
          width: 1.6rem;
          height: 1.6rem;
          margin-right: 0.24rem;
          background-image: url('./shop.png');
          background-size: 100% 100%;
        }
        .head-right{
          display: flex;
          width: 100%;
          align-content: space-between;
          flex-wrap: wrap;
          position: relative;
          font-family: PingFang-SC-Medium;
          font-size: 0.26rem;
          color: #999999;
          letter-spacing: 0.002rem;
          >p{
            width: 100%;
          }
          .r-head{
            color: #23AD8C;
            font-size: 0.3rem;
            .iconX{
              width: 0.34rem;
              height: 0.34rem;
              margin-top: -0.1rem;
              display: inline-block;
              background-image: url('./x.png');
              background-size: 100% 100%;
            }
          }
        }
      }
      .tos-con{
        padding-top: 0.3rem;
        .con-head{
          margin-bottom: 0.3rem;
          h5{
            font-family: PingFang-SC-Medium;
            font-size: 0.32rem;
            color: #333333;
            letter-spacing: 0.0025rem;
          }
        }
        .con-list{
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          background: rgba(216,216,216,0.00);
          box-shadow: 0 0.01rem 0 0 #E5E5E5;
          .sing{
            width: 32%;
            text-align: center;
            height: 0.8rem;
            line-height: 0.7rem;
            color: #666;
            background-color: #EBEBEB;
            font-size: 0.28rem;
            margin-bottom: 0.3rem;
          }
        }
      }
      .con-foo{
        height: 1.1rem;
        line-height: 1.1rem;
        background: rgba(216,216,216,0.00);
        box-shadow: 0 0.01rem 0 0 #E5E5E5;
        margin-bottom: 0.65rem;
        .f-left{
          font-family: PingFang-SC-Heavy;
          font-size: 0.32rem;
          color: #333;
          letter-spacing: 0.002rem;
          .l-num{
            span{
              vertical-align: middle;
              display: inline-block;
              width: 0.36rem;
              height: 0.36rem;
              font-size: 0.26rem;
              background-size: 100% 100%;
            }
            b{
              vertical-align: middle;
            }
            .jian{
              background-image: url('./jian.png');
            }
            .jia{
              background-image: url('./jia.png');
            }
          }
        }
      }
      .tos-btn{
        height: 0.9rem;
        line-height: 0.9rem;
        width: 100%;
        background-color: #23AD8C;
        color: #fff;
        text-align: center;
        border-radius: 0.1rem;
        font-size: 0.34rem;
        letter-spacing: 0.05rem;
      }
    }
  }
}
</style>
