<template>
  <div class="shop-wrapper_det">
    <div class="content">
      <div class="com-list">
          <div class="com-singer">
              <div class="sing-head">
                  <div class="s-head_left">
                      <div class="l-img"></div>
                  </div>
                  <div class="s-head_right">
                      <p>王大锤001 <span class="fr">10分钟前</span></p>
                  </div>
              </div>
              <div class="sing-con">
                  <p>好看又耐用。攒</p>
                  <div class="con-img" v-if="isCommentImg">
                      <div></div>
                  </div>
              </div>
              <div class="sing-foo">
                  <div class="s-foo_left">
                      <p>浏览46次</p>
                  </div>
                  <div class="s-foo_right">
                      <p><span class="foo-pl"></span> 评论</p>
                      <p><span class="foo-z"></span> 150</p>
                  </div>
              </div>
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
</template>
<script>
import { formatAmount, setTitle } from 'common/js/util';
export default {
  data() {
    return {
      isCommentImg: false,
      istoast: false
    };
  },
  created() {
    setTitle('全部评论');
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
        font-family: PingFang-SC-Medium;
        .com-singer{
            width: 100%;
            padding: 0.3rem;
            background-color: #fff;
            .sing-head{
                display: flex;
                height: 0.66rem;
                align-items: center;
                .s-head_left{
                    width: 0.66rem;
                    height: 0.66rem;
                    margin-right: 0.16rem;
                    .l-img{
                        width: 100%;
                        height: 100%;
                        border-radius: 100%;
                        background-size: 100% 100%;
                        background-image: url('./shop.png');
                    }
                }
                .s-head_right{
                    width: 85%;
                    font-size: 0.3rem;
                    color: #999999;
                    letter-spacing: 0.0022rem;
                    span{
                        font-size: 0.26rem;
                    }
                }
            }
            .sing-con{
                margin: 0.18rem 0 0.3rem 0;
                font-size: 0.3rem;
                color: #333333;
                letter-spacing: 0.0025rem;
                .con-img{
                    display: flex;
                    flex-wrap: wrap;
                    div{
                        background-size: 100% 100%;
                        width: 2.1rem;
                        height: 2.1rem;
                        margin-right: 2%;
                        margin-top: 0.2rem;
                        background-image: url('./shop.png');
                    }
                }
            }
            .sing-foo{
                display: flex;
                justify-content: space-between;
                font-size: 0.26rem;
                color: #999999;
                .s-foo_left{
                    letter-spacing: 0.2px;
                }
                .s-foo_right{
                    display: flex;
                    p{
                        margin-left: 0.4rem;
                        span{
                            display: inline-block;
                            width: 0.3rem;
                            height: 0.3rem;
                            background-size: 100% 100%;
                            margin-right: 0.1rem;
                        }
                        .foo-pl{
                            background-image: url('./pl.png');
                        }
                        .foo-z{
                            background-image: url('./dz.png');
                        }
                    }
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
</style>
