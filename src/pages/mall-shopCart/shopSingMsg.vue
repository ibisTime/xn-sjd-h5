<template>
    <div>
      <div class="shop-sing">
        <div class="sing-head">
              <span class="spl" :class="{'sel-sp': isShopAll}" @click="setShopAll()"></span>
              <span class="sp-name" @click="toStoreFn">
                  {{this.storeSingData.shopName}}<b> ＞</b>
              </span>
              <!--<span class="clr fr">-->
                  <!--<p @click.stop="removeShop">删除</p>-->
              <!--</span>-->
          </div>
        <div class="sing-con" v-for="(singItem, singIndex) in shopSingData" :key="singIndex" :style="{opacity: singItem.status === '1' || isManage ? '' : '0.5'}">
          <div class="con-left" @click.stop="setShopSing(singIndex, singItem)"  v-if="singItem.status === '1' || isManage">
              <span class="spl" ref="selShop"></span>
          </div>
          <div class="con-left" @click.stop="setShopSing(singIndex, singItem)"  v-else>
            <!--<span class="spl" ref="selShop"></span>-->
          </div>
          <div class="con-right">
              <div class="r-left" :style="getImgSyl(singItem.commodityPhoto ? singItem.commodityPhoto : '')"></div>
              <div class="r-con">
                  <div class="rr-head">{{singItem.commodityName}} <span class="fr num">x{{singItem.quantity}}</span></div>
                  <div class="rr-con"><span>规格分类：{{singItem.specsName}}</span><span v-if="singItem.status === '0'" class="status">失效</span></div>
                  <div class="rr-price">¥{{formatAmount(shopPriceList[singIndex])}}
                      <p class="fr bot">
                          <span class="jian" @click.stop="minusFn(singIndex)"></span>
                          <span>{{singItem.quantity}}</span>
                          <span class="jia" @click.stop="addFn(singIndex)"></span>
                      </p>
                  </div>
              </div>
          </div>
          </div>
      </div>
      <p class="back-co"></p>
    </div>
</template>

<script>
import { formatAmount, formatImg } from 'common/js/util';
export default {
  props: {
    storeAllShop: {
      type: Array,
      default: []
    },
    storeSingData: {
      type: Object,
      default: {}
    },
    shopIndex: {
      type: Number,
      default: 0
    },
    shopAll: {
      type: String,
      default: ''
    },
    isManage: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isShopAll: false,
      isShopSing: false,
      isAll: 0,
      shopSingNum: -1,
      selShop: '',
      shopLen: 0,
      shopSingData: [],
      shopPriceList: [],
      shopTatil: [],
      setIndexList: [],
      codeList: []
    };
  },
  created() {
    this.shopSingData = this.storeSingData.cartList;
    this.shopSingData.forEach((item, index) => {
      this.shopPriceList[index] = item.amount / item.quantity;
    });
  },
  mounted() {
    this.selShop = this.$refs.selShop;
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    },
    formatImg(img) {
      return formatImg(img);
    },
    getImgSyl(imgs, type) {
      let pic = imgs ? formatImg(imgs) : type === 'u' ? 'static/avatar@2x.png' : 'static/default.png';
      return {
        backgroundImage: `url(${pic})`
      };
    },
    go(url) {
      this.$router.push(url);
    },
    // 店铺选中
    setShopAll() {
      this.isShopAll = !this.isShopAll;
      if(this.isShopAll) {
        this.selShop.forEach((item, index) => {
          item.classList.add('sel-sp');
          this.shopLen = this.selShop.length;
          this.setIndexList.push(index);
          this.storeAllShop[this.shopIndex].cartList[index].isSet = true;
          this.storeAllShop[this.shopIndex].cartList[index].shopName = this.storeSingData.shopName;
        });
      }else{
        this.selShop.forEach((item, index) => {
          item.classList.remove('sel-sp');
          this.isAll = 1;
          this.shopLen = 0;
          this.setIndexList = [];
          this.storeAllShop[this.shopIndex].cartList[index].isSet = false;
        });
      }
      this.$emit('shopTatilFn', this.storeAllShop, this.isAll, this.storeSingData.shopName);
      this.allStoreSetFn();
    },
    // 单个选中
    setShopSing(index, singData) {
      let target = event.target;
      if(target.tagName === 'SPAN') {
        if(target.classList.contains('sel-sp')) {  // 取消选中
          target.classList.remove('sel-sp');
          this.isShopAll = false;
          this.isAll = 2;
          this.codeList.forEach((item, shopIndex) => {
            if(item.shopName === this.shopSingData[index].shopName) {
              this.codeList.splice(shopIndex, 1);
            }
          });
          this.setIndexList.splice(this.setIndexList.indexOf(index, 1));
          this.shopLen --;
          this.shopTatil -= this.shopSingData[index].amount;
          this.storeAllShop[this.shopIndex].cartList[index].isSet = false;
        }else { // 选中
          target.classList.add('sel-sp');
          this.setIndexList.push(index);
          this.shopLen ++;
          this.shopTatil += this.shopSingData[index].amount;
          this.storeAllShop[this.shopIndex].cartList[index].isSet = true;
          this.storeAllShop[this.shopIndex].cartList[index].shopName = this.storeSingData.shopName;
          let shopMsg = JSON.parse(JSON.stringify({
            shopName: singData.shopName,
            shopCode: singData.code
          }));
          this.codeList.push(shopMsg);
        }
        if(this.shopLen === this.selShop.length) {
          this.isShopAll = true;
        }
        this.$emit('shopTatilFn', this.storeAllShop, this.isAll, this.codeList);
        this.allStoreSetFn();
      }
    },
    // 全选
    allStoreSetFn() {
      let setIndex = 0;
      let allLength = 0;
      this.storeAllShop.forEach(allItem => {
        allItem.cartList.forEach(item => {
          allLength++;
          if(item.isSet) {
            setIndex++;
          }
        });
      });
      if(setIndex === allLength) {
        this.$emit('allStoreSetFn', '1');
      }
    },
    // 商品减
    minusFn(singIndex) {
      if(this.shopSingData[singIndex].quantity > 1) {
        this.shopSingData[singIndex].quantity --;
        this.shopSingData[singIndex].amount = this.shopPriceList[singIndex] * this.shopSingData[singIndex].quantity;
        if(this.setIndexList.indexOf(singIndex) !== -1) {
          this.shopTatil -= this.shopPriceList[singIndex];
          this.storeAllShop[this.shopIndex].cartList[singIndex].isSet = true;
          this.$emit('shopTatilFn', this.storeAllShop);
        }
      }
    },
    // 商品加
    addFn(singIndex) {
      this.shopSingData[singIndex].quantity ++;
      this.shopSingData[singIndex].amount = this.shopPriceList[singIndex] * this.shopSingData[singIndex].quantity;
      if(this.setIndexList.indexOf(singIndex) !== -1) {
        this.shopTatil += this.shopPriceList[singIndex];
        this.storeAllShop[this.shopIndex].cartList[singIndex].isSet = true;
        this.$emit('shopTatilFn', this.storeAllShop);
      }
    },
    removeShop() { // 选中删除
      this.selShop = this.$refs.selShop;
      this.shopLen = this.selShop.length;
      let storeCode = '';
      let shopName = '';
      if(this.isShopAll) {
        storeCode = this.storeSingData.shopCode;
      }
      if(this.codeList.length > 0) {
        shopName = this.storeSingData.shopName;
      }
      this.$emit('removeShop', this.shopIndex, storeCode, shopName);
    },
    toStoreFn() {
      this.go(`/mall-store?shopCode=${this.storeSingData.shopCode}`);
    }
  },
  watch: {
    shopAll(newVal, oldVal) {
      this.shopAll = newVal;
      if(this.shopAll) {
        this.isShopAll = true;
        this.selShop.forEach((item, index) => {
          item.classList.add('sel-sp');
          this.shopLen = this.selShop.length;
          this.setIndexList.push(index);
          this.storeAllShop[this.shopIndex].cartList[index].isSet = true;
        });
      }else {
        this.isShopAll = false;
        this.selShop.forEach((item, index) => {
          item.classList.remove('sel-sp');
          this.shopLen = 0;
          this.setIndexList = [];
          this.storeAllShop[this.shopIndex].cartList[index].isSet = false;
        });
      }
    },
    storeSingData(newVal, oldVal) {
      this.selShop.forEach((item, index) => {
        item.classList.remove('sel-sp');
        this.shopLen = 0;
        this.setIndexList = [];
      });
      this.storeSingData = newVal;
      this.shopSingData = newVal.cartList;
      this.isShopAll = false;
      this.isShopSing = false;
      this.isAll = 0;
      this.shopSingNum = -1;
      this.selShop = this.$refs.selShop;
      this.codeList = [];
      this.shopTatil = [];
      this.shopSingData.forEach((item, index) => {
        this.shopPriceList[index] = item.amount / item.quantity;
      });
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
.back-co{
  height: 0.2rem;
  background-color: #f5f5f5;
}
.shop-sing{
    padding: 0 0.3rem 0.3rem;
    background-color: #fff;
    .sing-head{
        height: 0.8rem;
        line-height: 0.9rem;
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
        padding-top: 0.3rem;
        padding-bottom: 0.2rem;
        border-top: 0.01rem solid #EBEBEB;
        .con-left{
          height: 1.5rem;
          line-height: 1.5rem;
          width: 0.91rem;
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
                  display: flex;
                  justify-content: space-between;
                  .status {
                    color: $second-color;
                  }
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

