<template>
  <div class="mall-wrapper" @click.stop>
    <div class="content">
        <div class="shop-list">
            <div class="shop-sing">
                <div class="sing-head">
                    <span class="spl"></span>
                    <span class="sp-name">
                        店铺名称<b> ></b>
                    </span>
                    <span class="clr fr">
                        <p>删除</p>
                    </span>
                </div>
                <div class="sing-con">
                    <div class="con-left">
                        <span class="spl"></span>
                    </div>
                    <div class="con-right">
                        <div class="r-left">
                            <div class="l-img"></div>
                        </div>
                        <div class="r-con">
                            <div class="rr-head">商品名称 <span class="fr num">x1</span></div>
                            <div class="rr-con">规格分类：10斤装</div>
                            <div class="rr-price">¥2480.00 <p class="fr bot"><span class="jian"></span><span>1</span><span class="jia"></span></p></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="shop-sing">
                <div class="sing-head">
                    <span class="spl"></span>
                    <span class="sp-name">
                        店铺名称<b> ></b>
                    </span>
                    <span class="clr fr">
                        <p>删除</p>
                    </span>
                </div>
                <div class="sing-con">
                    <div class="con-left">
                        <span class="spl"></span>
                    </div>
                    <div class="con-right">
                        <div class="r-left">
                            <div class="l-img"></div>
                        </div>
                        <div class="r-con">
                            <div class="rr-head">商品名称 <span class="fr num">x1</span></div>
                            <div class="rr-con">规格分类：10斤装</div>
                            <div class="rr-price">¥2480.00 <p class="fr bot"><span class="jian"></span><span>1</span><span class="jia"></span></p></div>
                        </div>
                    </div>
                </div>
                <div class="sing-con">
                    <div class="con-left">
                        <span class="spl"></span>
                    </div>
                    <div class="con-right">
                        <div class="r-left">
                            <div class="l-img"></div>
                        </div>
                        <div class="r-con">
                            <div class="rr-head">商品名称 <span class="fr num">x1</span></div>
                            <div class="rr-con">规格分类：10斤装</div>
                            <div class="rr-price">¥2480.00 <p class="fr bot"><span class="jian"></span><span>1</span><span class="jia"></span></p></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="foo-cart">
            <div class="foo-left">
                <span class="spl"></span>全选
            </div>
            <div class="foo-right">
                <p>合计：<span>¥100</span> <button>结算</button></p>
            </div>
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
      loadingText: '正在加载中...',
      isset: '1'
    };
  },
  created() {
    setTitle('购物车');
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
  .icon{
    display: inline-block;
    width: 0.36rem;
    height: 0.36rem;
    background-size: 100% 100%;
  }
  .content {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    font-family: PingFang-SC-Medium;
    .shop-sing{
        padding: 0 0.3rem 0.3rem;
        background-color: #fff;
        .sing-head{
            height: 0.8rem;
            line-height: 0.7rem;
            background: rgba(224,187,187,0.00);
            box-shadow: 0 0.01rem 0 0 #EBEBEB;
            font-size: 0.26rem;
            >span{
                display: inline-block;
                vertical-align: middle;
            }
            .sp-name{
                color: #333;
                b{
                    color: #979797;
                    font-weight: 400;
                }
            }
            .clr{
                color: #999;
                letter-spacing: 0.002rem;
            }
        }
        .sing-con{
            display: flex;
            font-size: 0.32rem;
            margin-top: 0.3rem;
            padding-bottom: 0.2rem;
            border-bottom: 0.01rem solid #EBEBEB;
            .con-left{
                height: 1.5rem;
                line-height: 1.5rem;
            }
            .con-right{
                display: flex;
                letter-spacing: 0.0025rem;
                .r-left{
                    width: 2rem;
                    height: 1.5rem;
                    margin-right: 0.2rem;
                    background-image: url('./shop.png');
                    background-position: center;
                    background-size: cover;
                }
                .r-con{
                    display: flex;
                    align-content: space-between; 
                    flex-wrap: wrap;
                    >div{
                        width: 100%;
                    }
                    .rr-head{
                        color: #333;
                        .num{
                            color: #999;
                            font-size: 0.24rem;
                        }
                    }
                    .rr-con{
                        font-size: 0.26rem;
                        color: #999;
                    }
                    .rr-price{
                        font-family: DIN-Bold;
                        color: #151515;
                        .bot{
                            color: #333;
                            font-size: 0.24rem;
                            font-family: PingFang-SC-Heavy;
                            span{
                                display: inline-block;
                                width: 0.36rem;
                                height: 0.36rem;
                                line-height: 0.36rem;
                                vertical-align: middle;
                                background-size: 100%;
                                text-align: center;
                            }
                            .jia{
                                background-image: url('./jia.png');
                            }
                            .jian{
                                background-image: url('./jian.png');
                            }
                        }
                    }
                }
            }
        }
    }
    .spl{
        display: inline-block;
        width: 0.36rem;
        height: 0.36rem;
        border-radius: 100%;
        border: 0.02rem solid #ccc;
        margin-right: 0.55rem;
    }
    .foo-cart{
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 0.98rem;
        line-height: 0.98rem;
        display: flex;
        justify-content: space-between;
        font-size: 0.28rem;
        padding: 0 0.3rem;
        background-color: #fff;
        box-shadow: 0 -1px 0 0 #EBEBEB;
        .foo-left{
            span{
                vertical-align: middle; 
                margin-right: 0.16rem;
            }
        }
        .foo-right{
            color: #333;
            font-size: 0.32rem;
            span{
                color: #23AD8C;
                margin-right: 0.4rem;
            }
            button{
                width: 1.44rem;
                height: 0.66rem;
                line-height: 0.66rem;
                text-align: center;
                border-radius: 0.1rem;
                background-color: #23AD8C;
                color: #fff;
            }
        }
    }
  }

}
</style>
