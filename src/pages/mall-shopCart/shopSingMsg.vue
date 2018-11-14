<template>
    <div>
        <div class="shop-sing">
            <div class="sing-head">
                <span class="spl" :class="{'sel-sp': isShopAll}" @click="setShopAll()"></span>
                <span class="sp-name">
                    店铺名称<b> ＞</b>
                </span>
                <span class="clr fr">
                    <p @click.stop="removeShop">删除</p>
                </span>
            </div>
            <div class="sing-con" v-for="(singItem, singIndex) in shopSingData" :key="singIndex">
                <div class="con-left" @click.stop="setShopSing(singIndex)">
                    <span class="spl" ref="selShop"></span>
                </div>
                <div class="con-right">
                    <div class="r-left">
                        <div class="l-img"></div>
                    </div>
                    <div class="r-con">
                        <div class="rr-head">商品名称 <span class="fr num">x1</span></div>
                        <div class="rr-con">规格分类：10斤装</div>
                        <div class="rr-price">¥2480.00 
                            <p class="fr bot">
                                <span class="jian" @click.stop="minusFn(singIndex)"></span>
                                <span>{{singItem.num}}</span>
                                <span class="jia" @click.stop="addFn(singIndex)"></span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    shopIndex: {
      type: Number,
      default: 0
    },
    shopAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShopAll: false,
      isShopSing: false,
      shopSingNum: -1,
      selShop: '',
      shopLen: 0,
      shopSingData: []
    };
  },
  mounted() {
    this.selShop = this.$refs.selShop;
  },
  methods: {
    // 店铺选中
    setShopAll() {
      this.isShopAll = !this.isShopAll;
      if(this.isShopAll) {
        this.selShop.forEach(item => {
          item.classList.add('sel-sp');
          this.shopLen = this.selShop.length;
        });
      }else{
        this.selShop.forEach(item => {
          item.classList.remove('sel-sp');
          this.shopLen = 0;
        });
      }
    },
    // 单个选中
    setShopSing(index) {
      let target = event.target;
      if(target.tagName === 'SPAN') {
        if(target.classList.contains('sel-sp')) {
          target.classList.remove('sel-sp');
          this.isShopAll = false;
          this.shopLen --;
        }else {
          target.classList.add('sel-sp');
          this.shopLen ++;
        }
        if(this.shopLen === this.selShop.length) {
          this.isShopAll = true;
        }
      }
    },
    // 商品减
    minusFn(singIndex) {
      if(this.shopSingData[singIndex].num > 1) {
        this.shopSingData[singIndex].num --;
      }
    },
    // 商品加
    addFn(singIndex) {
      this.shopSingData[singIndex].num ++;
    },
    removeShop() {
      this.$emit('removeShop', this.shopIndex);
    }
  },
  watch: {
    shopAll(newVal, oldVal) {
      this.shopAll = newVal;
      if(this.shopAll) {
        this.isShopAll = true;
        this.selShop.forEach(item => {
          item.classList.add('sel-sp');
          this.shopLen = this.selShop.length;
        });
      }else {
        this.isShopAll = false;
        this.selShop.forEach(item => {
          item.classList.remove('sel-sp');
          this.shopLen = 0;
        });
      }
    }
  }
};
</script>


<style lang="scss">
@import "../../common/scss/mixin.scss";
@import "../../common/scss/variable.scss";
.fl {
    float: left;
}
.fr {
    float: right;
}
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
.sel-sp{
    border: none;
    background-image: url('./xz.png');
    background-size: 100% 100%;
}
</style>

