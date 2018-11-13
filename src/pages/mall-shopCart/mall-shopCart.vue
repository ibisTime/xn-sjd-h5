<template>
  <div class="mall-wrapper" @click.stop>
    <div class="content">
        <div class="shop-list">
            <ShopSingMsg 
                v-for="(allItem, allIndex) in shopAllData" 
                :key="allIndex"
                :shopIndex="allIndex"
                :shopAll="isShopAll"
                :shopSingData="shopSingData"
                @removeShop="removeShop"
            />
        </div>
        <div class="foo-cart">
            <div class="foo-left">
                <span class="spl" @click.stop="shopAllFn" ref="allShop"></span>全选
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
import ShopSingMsg from './shopSingMsg';
import { formatAmount, formatImg, formatDate, setTitle } from 'common/js/util';
export default {
  data() {
    return {
      loading: true,
      textMsg: '',
      loadingText: '正在加载中...',
      isset: '1',
      shopAllData: [1, 2],
      shopSingData: [{
        num: 1
      },
      {
        num: 2
      }],
      isShopAll: false
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
    },
    removeShop(shopIndex) {
      this.shopAllData.splice(shopIndex, 1);
    },
    shopAllFn() {
      let shopAll = this.$refs.allShop;
      if(shopAll.classList.contains('sel-sp')) {
        shopAll.classList.remove('sel-sp');
        this.isShopAll = false;
      }else {
        shopAll.classList.add('sel-sp');
        this.isShopAll = true;
      }
    }
  },
  components: {
    FullLoading,
    Toast,
    ShopSingMsg
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
}
</style>
