<template>
  <div class="mall-wrapper" @click.stop>
    <div class="content">
      <header>
        <div class="inner">
          <div class="search">
            <div class="search-icon"></div>
            <input type="text" ref="searchInput" placeholder="请输入商品名称" v-model="query" @click="focus"/>
            <i v-show="query" class="close-icon" @click="clearInput"></i>
          </div>
        </div>
      </header>
        <!--<div class="head-nav">-->
          <!--<category-scroll-->
            <!--:currentIndex="currentIndex"-->
            <!--:categorys="shopTypeData"-->
            <!--@select="selectCategory"-->
          <!--/>-->
          <!--<category-scroll-->
            <!--:currentIndex="currentIndexSub"-->
            <!--:categorys="categorysSub"-->
            <!--@select="selectCategorySub"-->
          <!--/>-->
        <!--</div>-->
      <category-sjd-mall-list
        @filterConfirm="filterConfirm"
        @all="all"
        @ageConfirm="ageConfirm"></category-sjd-mall-list>
        <div class="con-list">
          <Scroll
            :data="hotShopList"
            :hasMore="hasMore"
            @pullingUp="getHotShop">
            <div class="shop-list">
              <div class="shop-singer" @click="toShopDet(item.code, item.shopCode)" v-for="(item, index) in hotShopList" :key="index">
                  <div class="sing-img" :style="getImgSyl(item.listPic ? item.listPic : '')"></div>
                  <div class="shop-det">
                    <h5>{{item.name}}</h5>
                    <div class="con-type">
                      <span class="label">销量 {{item.monthSellCount}}</span>
                      <span class="place">{{item.originalPlace}}</span>
                    </div>
                    <p>￥{{formatAmount(item.minPrice)}} 起
                      <span class="fr icon" @click.stop="addListCart(item.code, item.name, item.specsList[0].id, item.specsList[0].name)"></span>
                    </p>
                  </div>
              </div>
            </div>
            <div class="mall-content">
              <no-result v-show="!hotShopList.length && !hasMore" class="no-result-wrapper" title="抱歉，暂无商品"></no-result>
            </div>
          </Scroll>
        </div>
    </div>
    <toast ref="toast" :text="textMsg"></toast>
    <full-loading v-show="loading" :title="loadingText"></full-loading>
  </div>
</template>
<script>
import MFooter from 'components/m-footer/m-footer';
import FullLoading from 'base/full-loading/full-loading';
import Toast from 'base/toast/toast';
import Scroll from 'base/scroll/scroll';
import CategoryScroll from 'base/category-scroll/category-scroll';
import NoResult from 'base/no-result/no-result';
import CategorySjdMallList from 'components/category-sjd-mallList/category-sjd-mallList';
import { formatAmount, formatImg, formatDate, setTitle, getUserId } from 'common/js/util';
import { getAllShopData, addShopCart, getShopType } from 'api/store';
export default {
  data() {
    return {
      loading: true,
      hasMore: true,
      currentIndex: 0,
      currentIndexSub: 0,
      textMsg: '',
      loadingText: '正在加载...',
      isset: -1,
      start: 1,
      config: {
        start: 1,
        limit: 8,
        status: '4',
        orderColumn: 'order_no',
        orderDir: 'asc'
      },
      hotShopList: [],
      addCartConfig: {            // 加入购物车参数
        userId: getUserId(),
        commodityCode: '',
        commodityName: '',        // 商品名称
        specsId: '',              // 规格编号
        specsName: '',            // 规格名称
        quantity: 1              // 商品数量
      },
      shopTypeConfig: {          // 商品类别参数
        start: 1,
        limit: 10,
        level: 1,
        status: 1,
        type: 2,
        orderColumn: 'order_no',
        orderDir: 'asc'
      },
      shopTypeData: [{key: '0', value: '全部', code: ''}],
      categorysSub: [{key: '0', value: '全部', code: ''}],
      shopCode: '',
      storeTypeCode: '',
      setIndex: 0,
      typeIndex: '',
      location: '',
      query: '',
      filterParams: {}
    };
  },
  created() {
    setTitle('全部商品');
    this.storeTypeCode = this.$route.query.storeTypeCode;
    this.shopCode = this.$route.query.code;
    this.typeIndex = this.$route.query.typeIndex;
    this.location = this.$route.query.location;
    this.query = this.$route.query.query || '';
    this.categoryCode = this.$route.query.categoryCode || '';    // 从产品分类页跳转过来
    if(this.categoryCode) {
      this.config.categoryCode = this.categoryCode;
    }
    if(this.location) {
      this.config.location = this.location;
    }
    if(this.shopCode) {
      this.config.shopCode = this.shopCode;
    }
    if(this.storeTypeCode) {
      this.config.parentCategoryCode = this.storeTypeCode;
      this.shopTypeConfig.parentCode = this.storeTypeCode;
      this.currentIndex = Number(this.typeIndex) + 1;
      this.getTypeDataFn(this.categorysSub, '2');
    }
    this.getTypeDataFn(this.shopTypeData, '1');
    this.getHotShop();
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
    focus() {
      this.$emit('focus');
    },
    clearInput() {
      this.query = '';
    },
    getImgSyl(imgs, type) {
      let pic = imgs ? formatImg(imgs) : type === 'u' ? 'static/avatar@2x.png' : 'static/default.png';
      return {
        backgroundImage: `url(${pic})`
      };
    },
    toShopDet(code, shopCode) {
      this.go(`/mall-shop_detail?code=${code}&shopCode=${shopCode}`);
    },
    changStu() {
      let target = event.target;
      let type = target.getAttribute('data-type');
      let code = target.getAttribute('data-code');
      this.isset = Number(type);
      if(this.isset > -1) {
        this.config.parentCategoryCode = code;
        this.hotShopList = [];
        this.start = 1;
        this.getHotShop();
      }else {
        delete this.config.parentCategoryCode;
        this.hotShopList = [];
        this.start = 1;
        this.getHotShop();
      }
    },
    getTypeDataFn(shopType, type) {
      if(type === '1') {
        this.shopTypeConfig.level = 1;
        delete this.shopTypeConfig.parentCode;
      }
      if(type === '2') {
        delete this.shopTypeConfig.level;
      }
      getShopType(this.shopTypeConfig).then(data => {
        data.list.map((item, index) => {
          shopType.push({
            key: index,
            value: item.name,
            code: item.code
          });
        });
      });
    },
    selectCategory(index) {
      this.currentIndex = index;
      this.currentIndexSub = 0;
      this.config.parentCategoryCode = this.shopTypeData[index].code;
      this.categorysSub = [{key: '0', value: '全部', code: ''}];
      this.shopTypeConfig.parentCode = this.shopTypeData[index].code;
      delete this.config.categoryCode;
      this.start = 1;
      this.hotShopList = [];
      this.getHotShop();
      if(!this.shopTypeConfig.parentCode) {
        this.categorysSub = [{key: '0', value: '全部', code: ''}];
      }else {
        this.getTypeDataFn(this.categorysSub, '2');
      }
    },
    selectCategorySub(index) {
      if(index === 0) {
        this.config.parentCategoryCode = this.shopTypeData[this.currentIndex].code;
      }else {
        delete this.shopTypeConfig.parentCode;
      }
      this.currentIndexSub = index;
      this.config.categoryCode = this.categorysSub[index].code;
      this.start = 1;
      this.hotShopList = [];
      this.getHotShop();
    },
    // 获取热门商品
    getHotShop() {
      let searchConfig = this.config;
      searchConfig.start = this.start;
      if(this.query !== '') {
        searchConfig.name = this.query;
      } else {
        if(searchConfig.name) {
          delete searchConfig.name;
        }
      }
      searchConfig = {
        ...searchConfig,
        ...this.filterParams,
        ...this.ageParams
      };
      getAllShopData(searchConfig).then(data => {
        if (data.totalPage <= this.start) {
          this.hasMore = false;
        }
        this.hotShopList = [...this.hotShopList, ...data.list];
        this.start ++;
        if(this.config.parentCategoryCode) {
          delete this.config.parentCategoryCode;
        }
      });
    },
    addListCart(code, name, specsId, specsName) {
      if(this.setIndex === 0) {
        if(getUserId()) {
          this.loading = true;
          this.addCartConfig.commodityCode = code;
          this.addCartConfig.commodityName = name;
          this.addCartConfig.specsId = specsId;
          this.addCartConfig.specsName = specsName;
          addShopCart(this.addCartConfig).then(data => {
            this.loading = false;
            this.textMsg = '加入购物车成功';
            this.$refs.toast.show();
            setTimeout(() => {
              this.setIndex = 0;
            }, 500);
          }, () => {
            this.loading = false;
          });
          this.setIndex ++;
        }else {
          this.textMsg = '请先登录';
          this.$refs.toast.show();
        }
      }
    },
    filterConfirm(params) {
      this.filterParams = params;
      this.start = 1;
      this.hotShopList = [];
      this.getHotShop();
    },
    all() {
      this.filterParams = {};
      this.ageParams = {};
      this.query = '';
      this.start = 1;
      this.hotShopList = [];
      this.getHotShop();
    },
    ageConfirm(params) {
      this.ageParams = params;
      this.start = 1;
      this.hotShopList = [];
      this.getHotShop();
      console.log(params);
    }
  },
  components: {
    MFooter,
    FullLoading,
    Toast,
    Scroll,
    NoResult,
    CategoryScroll,
    CategorySjdMallList
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
  height: 100%;
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  header {
    height: 0.88rem;
    padding: 0.14rem 0 0.14rem 0.3rem;
    /*<!--border-bottom: 1px solid $color-border;-->*/

    .inner {
      height: 0.6rem;
      display: flex;
      align-items: center;
      .back {
        height: 0.32rem;
        margin-right: 0.2rem;
      }
      .search {
        flex: 1;
        height: 0.6rem;
        display: flex;
        align-items: center;
        border-radius: 0.3rem;
        background: #f3f4f8;
        margin-right: 0.3rem;

        .search-icon {
          flex: 0 0 0.54rem;
          height: 0.34rem;
          background-repeat: no-repeat;
          background-position: 0.2rem center;
          background-size: 0.24rem;
          @include bg-image('search');
        }

        input {
          flex: 1;
          font-size: $font-size-medium;
          background: transparent;
        }

        .close-icon {
          display: inline-block;
          width: 0.7rem;
          height: 0.34rem;
          background-size: 0.3rem;
          background-position: center;
          background-repeat: no-repeat;
          @include bg-image('close');
        }
      }

      .cancel {
        padding: 0 0.3rem;
        height: 0.6rem;
        line-height: 0.6rem;
        font-size: $font-size-medium-xx;
      }
      .sign {
        height: 100%;
        font-size: 0;
        img {
          margin: 0 0.3rem;
          height: 0.52rem;
        }
      }
    }
  }
  .icon{
    display: inline-block;
    width: 0.28rem;
    height: 0.22rem;
    background-size: 100% 100%;
    @include bg-image('cart');
  }
  .content {
    overflow: auto;
    background-color: #fff;
    font-family: PingFangSC-Regular;
    .head-nav{
        line-height: 0.8rem;
        border-bottom: 0.01rem solid #e5e5e5;
        font-size: 0.32rem;
        .nav-list{
            display: flex;
            margin-right: 0.1rem;
            padding-bottom: 0.1rem;
            li{
                width: 25%;
                text-align: center;
                span{
                    padding-bottom: 0.08rem;
                    border-bottom: 0.01rem solid transparent;
                }
                .on{
                    color: $mall-color;
                    border-color: $mall-color;
                }
            }
        }
    }
    .con-list{
      /*height: 12rem;*/
      /*padding-bottom: 2rem;*/
      /*overflow: scroll;*/

      padding: 0.3rem 0.3rem 0;
      background: $color-highlight-background;
      position: absolute;
      top: 1.7rem;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: auto;
    }
    .shop-list{
        /*padding: 0.4rem 0.3rem;*/
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .shop-singer{
          width: 48%;
          padding-bottom: 0.3rem;
          margin-bottom: 0.3rem;
          border-radius: 0.06rem;
          overflow: hidden;
          border: 1px solid $color-border;
          border-top: none;
          .sing-img{
              height: 2.3rem;
              background-image: url('./shop.png');
              background-size: 100% 100%;
              margin-bottom: 0.3rem;
          }
          .shop-det{
            padding: 0 0.3rem 0 0.2rem;
            .con-type {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 0.18rem;
              .label {
                color: $mall-color;
                font-size: 0.22rem;
                padding: 0.07rem;
                border: 1px solid $mall-color;
              }
              .place {
                font-size: 0.22rem;
                color: #b3b3b3;
              }
            }
              >h5{
                  font-size: 0.34rem;
                  font-weight: 600;
                  margin-bottom: 0.1rem;
                  letter-spacing: 0.02rem;
              }
              p{
                  font-size: 0.32rem;
                  color: $mall-color;
              }
          }
        }
    }
  }

}
</style>
