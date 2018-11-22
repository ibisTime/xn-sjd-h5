<template>
  <div class="mall-wrapper" @click.stop>
    <div class="content">
        <div class="head-nav">
          <category-scroll
            :currentIndex="currentIndex"
            :categorys="shopTypeData"
            @select="selectCategory"
          />
          <category-scroll
            :currentIndex="currentIndexSub"
            :categorys="categorysSub"
            @select="selectCategorySub"
          />
        </div>
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
      location: ''
    };
  },
  created() {
    setTitle('全部商品');
    this.storeTypeCode = this.$route.query.storeTypeCode;
    this.shopCode = this.$route.query.code;
    this.typeIndex = this.$route.query.typeIndex;
    this.location = this.$route.query.location;
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
      this.currentIndexSub = index;
      this.config.categoryCode = this.categorysSub[index].code;
      this.start = 1;
      this.hotShopList = [];
      this.getHotShop();
    },
    // 获取热门商品
    getHotShop() {
      this.config.start = this.start;
      getAllShopData(this.config).then(data => {
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
    }
  },
  components: {
    MFooter,
    FullLoading,
    Toast,
    Scroll,
    NoResult,
    CategoryScroll
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
  .icon{
    display: inline-block;
    width: 0.38rem;
    height: 0.33rem;
    background-size: 100% 100%;
    background-image: url('./shopCart.png');
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
                    color: #23AD8C;
                    border-color: #23AD8C;
                }
            }
        }
    }
    .con-list{
      height: 12rem;
      padding-bottom: 2rem;
      overflow: scroll;
    }
    .shop-list{
        padding: 0.4rem 0.3rem;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .shop-singer{
            width: 48%;
            padding-bottom: 0.3rem;
            margin-bottom: 0.3rem;
            border: 0.01rem solid #E6E6E6;
            border-radius: 0.06rem;
            overflow: hidden;
            .sing-img{
                height: 2.3rem;
                background-image: url('./shop.png');
                background-size: 100% 100%;
                margin-bottom: 0.3rem;
            }
            .shop-det{
                padding: 0 0.3rem 0 0.2rem;
                >h5{
                    font-size: 0.34rem;
                    font-weight: 600;
                    margin-bottom: 0.3rem;
                    letter-spacing: 0.02rem;
                }
                p{
                    font-size: 0.32rem;
                    color: #23AD8C;
                    font-weight: 600;
                }
            }
        }
    }
  }

}
</style>
