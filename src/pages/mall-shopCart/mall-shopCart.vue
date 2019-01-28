<template>
  <div class="mall-wrapper" @click.stop>
    <div class="content">
      <Scroll ref="scroll" :pullUpLoad="pullUpLoad">
        <m-header class="cate-header" title="我的购物车" :actText="actText" @action="manageCart"></m-header>
        <div class="shop-list">
          <ShopSingMsg
              v-if="shopAllData.length > 0"
              v-for="(allItem, allIndex) in shopAllData"
              :key="allIndex"
              :shopIndex="allIndex"
              :shopAll="isShopAll"
              :storeSingData="allItem"
              :storeAllShop="shopAllData"
              :isManage="isManage"
              @shopTatilFn="shopTatilFn"
              @allStoreSetFn="allStoreSetFn"
          >
          </ShopSingMsg>
        </div>
        <div class="mall-content">
          <no-result v-show="!shopAllData.length && !hasMore" class="no-result-wrapper" title="暂无商品"></no-result>
        </div>
      </Scroll>
    </div>
    <div class="foo-cart">
      <div class="foo-left">
          <span class="spl" @click.stop="shopAllFn" ref="allShop"></span>全选
      </div>
      <div class="foo-right">
        <p v-show="!isManage">合计：<span>¥{{formatAmount(tatil)}}</span> <button @click="shopCartOrder">结算</button></p>
        <p v-show="isManage" class="foo-remove" @click="removeShop">
          <span>删 除</span>
        </p>
      </div>
    </div>
    <full-loading v-show="loading" :title="loadingText"></full-loading>
    <toast ref="toast" :text="textMsg">
    </toast>
  </div>
</template>
<script>
import MHeader from 'components/m-header/m-header';
import FullLoading from 'base/full-loading/full-loading';
import NoResult from 'base/no-result/no-result';
import Toast from 'base/toast/toast';
import Scroll from 'base/scroll/scroll';
import ShopSingMsg from './shopSingMsg';
import { formatAmount, formatImg, formatDate, setTitle, getUserId } from 'common/js/util';
import { myShopCart, shopRemoveFn } from 'api/store';
export default {
  data() {
    return {
      loading: true,
      hasMore: false,
      textMsg: '',
      loadingText: '正在加载中...',
      isset: '1',
      shopAllData: [],
      isShopAll: '',
      tatil: 0,
      isSetAll: null,
      actText: '管理',
      codeList: [],
      isManage: false,
      setCodeList: []
    };
  },
  created() {
    setTitle('购物车');
    this.pullUpLoad = null;
    this.getCartData();
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
    getCartData() {
      myShopCart(getUserId()).then(data => {
        this.loading = false;
        this.tatil = 0;
        let shopAll = this.$refs.allShop;
        shopAll.classList.remove('sel-sp');
        this.isShopAll = '';
        this.shopAllData = data;
      });
    },
    // removeShop(shopIndex, shopCode, shopName) {    // 删除店铺操作
    //   let setCodeList = new Set();
    //   this.codeList.forEach((item, index) => {
    //     if(item.shopName === shopName) {
    //       setCodeList.add(item.shopCode);
    //     }
    //   });
    //   setCodeList = [...setCodeList];
    //   if(setCodeList.length > 0) {
    //     this.loading = true;
    //     shopRemoveFn(setCodeList).then(data => {
    //       this.textMsg = '删除成功';
    //       this.$refs.toast.show();
    //       this.getCartData();
    //     });
    //     return;
    //   }else if(shopCode) {
    //     storeRemoveFn(shopCode).then(data => {
    //       this.textMsg = '删除成功';
    //       this.$refs.toast.show();
    //       this.getCartData();
    //     }, () => {
    //       this.loading = false;
    //     });
    //     return;
    //   }else {
    //     this.textMsg = '请选择商品';
    //     this.$refs.toast.show();
    //   }
    // },
    removeShop() {
      if(this.setCodeList.length > 0) {
        shopRemoveFn(this.setCodeList).then(data => {
          this.textMsg = '删除成功';
          this.$refs.toast.show();
          this.getCartData();
        });
      }else {
        this.textMsg = '请选择商品';
        this.$refs.toast.show();
      }
    },
    shopTatilFn(storeAllShop, isAll, codeList) { // 计算总额
      this.tatil = 0;
      if(codeList) {
        this.codeList = [...this.codeList, ...codeList];
      }
      this.setCodeList = [];
      storeAllShop.forEach(allItem => {
        allItem.cartList.forEach(item => {
          if(item.isSet) {
            this.tatil += item.amount;
            this.setCodeList.push(item.code);
          }
        });
      });
      if(isAll) {
        this.$refs.allShop.classList.remove('sel-sp');
        this.isSetAll += isAll;
      }
    },
    shopAllFn() {              // 选择全选
      let shopAll = this.$refs.allShop;
      this.tatil = 0;
      if(shopAll.classList.contains('sel-sp')) {
        shopAll.classList.remove('sel-sp');
        this.isShopAll = '';
      }else {
        this.setCodeList = [];
        shopAll.classList.add('sel-sp');
        this.isShopAll = 'true' + this.isSetAll;
        this.shopAllData.forEach(allItem => {
          allItem.cartList.forEach(item => {
            this.tatil += item.amount;
            this.setCodeList.push(item.code);
          });
        });
      }
    },
    allStoreSetFn(isAllSet) { // 判断是否全部了
      if(isAllSet) {
        this.isShopAll = 'true';
        this.$refs.allShop.classList.add('sel-sp');
      }
    },
    shopCartOrder() {   // 去结算
      let shopMsgList = [];
      this.loading = true;
      this.shopAllData.forEach(allItem => {
        allItem.cartList.forEach(item => {
          if(item.isSet) {
            shopMsgList.push(item);
          }
        });
      });
      if(shopMsgList.length === 0) {
        this.loading = false;
        this.textMsg = '请选择商品';
        this.$refs.toast.show();
        return;
      }
      sessionStorage.setItem('shopMsgList', JSON.stringify(shopMsgList));
      this.go('/affirm-order');
    },
    manageCart() {
      this.isManage = !this.isManage;
      this.actText = this.isManage ? '取消' : '管理';
    }
  },
  components: {
    MHeader,
    FullLoading,
    Toast,
    ShopSingMsg,
    Scroll,
    NoResult
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
    .shop-list{
      padding-top: 0.88rem;
    }
  }
  .foo-cart{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 0.98rem;
    z-index: 9999;
    line-height: 0.98rem;
    display: flex;
    justify-content: space-between;
    font-size: 0.28rem;
    padding: 0rem 0.3rem;
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
      .foo-remove{
        text-align: center;
        border: 1px solid #23AD8C;
        color: #23AD8C;
        padding: 0 0.4rem;
        height: 0.7rem;
        line-height: 0.7rem;
        margin-top: 0.14rem;
        border-radius: 0.08rem;
        span{
          margin: 0;
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
