<template>
  <div class="mall-wrapper" @click.stop>
    <Scroll ref="scroll" :pullUpLoad="pullUpLoad">
      <div class="content" v-show="!isAll">
        <div class="mall-header">
          <div class="head-search">
            <div class="search">
              <span></span>
              <input type="text" placeholder="搜索商品" v-model="shopName" @keyup="searchShop">
            </div>
          </div>
        </div>

        <div class="mall-list" @click.stop>
          <category-scroll
            :Type="'mall'"
            :currentIndex="currentIndex"
            :categorys="shopTypeData"
            @select="selectCategory"
          ></category-scroll>
        </div>
        <div class="mall-content">
          <div class="con-head">
            <h5>热门推荐 <router-link to="/mall/mall-shopList" class="fr" @click.native="isAll = true;">更多</router-link></h5>
            <div class="shop-list" @touchstart.stop>
              <Scroll
                :data="hotShopList"
                :hasMore="hasMore"
                @pullingUp="getHotShop">
                <div class="con-list">
                  <div class="con-sing" @click="toShopDet(shopItem.code, shopItem.shopCode)" v-for="(shopItem, index) in hotShopList" :key="index">
                    <div class="con-sing_img">
                      <div class="sing-img" :style="getImgSyl(shopItem.listPic ? shopItem.listPic : '')"></div>
                      <div class="con-txt">
                        <h5>{{shopItem.name}}</h5>
                        <div class="con-foo">
                          <p>￥{{formatAmount(shopItem.minPrice)}}起
                            <span
                              class="icon fr"
                              @click.stop="addCart(shopItem.code, shopItem.name, shopItem.specsList[0].id, shopItem.specsList[0].name)"
                            ></span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mall-content">
                  <no-result v-show="!hotShopList.length && !hasMore" class="no-result-wrapper" title="抱歉，暂无商品"></no-result>
                </div>
              </Scroll>
            </div>
          </div>
        </div>
      </div>
      <router-view v-show="isAll"></router-view>
    </Scroll>
    <div class="go-cart" @click.stop="toCartFn">
      <p v-if="iscart"></p>
    </div>
    <full-loading v-show="loading" :title="loadingText"></full-loading>
    <toast ref="toast" :text="textMsg"></toast>
    <m-footer></m-footer>
  </div>
</template>
<script>
import MFooter from 'components/m-footer/m-footer';
import FullLoading from 'base/full-loading/full-loading';
import Scroll from 'base/scroll/scroll';
import CategoryScroll from 'base/category-scroll/category-scroll';
import NoResult from 'base/no-result/no-result';
import Toast from 'base/toast/toast';
import { getAllShopData, addShopCart, getShopType, myShopCart } from 'api/store';
import { formatAmount, formatImg, formatDate, setTitle, getUserId } from 'common/js/util';
export default {
  data() {
    return {
      loading: true,
      currentIndex: 0,
      textMsg: '',
      loadingText: '正在加载...',
      isAll: false,
      hasMore: true,
      hotShopList: [],
      config: {
        start: 1,
        limit: 4,
        status: '4',
        location: '1',
        orderColumn: 'update_datetime',
        orderDir: 'asc'
      },
      start: 1,
      pullUpLoad: '',
      shopPrice: [],
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
      shopTypeData: [{key: 0, value: '全部', pic: '', code: ''}],
      shopName: '',
      iscart: false,
      shopCode: ''
    };
  },
  created() {
    setTitle('商场');
    this.shopCode = this.$route.query.code;
    if(this.shopCode) {
      this.isAll = true;
    }
    this.pullUpLoad = null;
    this.getHotShop();
    getShopType(this.shopTypeConfig).then(data => {
      data.list.map((item, index) => {
        this.shopTypeData.push({
          key: index,
          value: item.name,
          code: item.code,
          pic: item.pic
        });
      });
    });
    if(getUserId()) {
      myShopCart(getUserId()).then(data => {
        if(data.length > 0) {
          this.iscart = true;
        }
      });
    }
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
    searchShop() {
      if(event.keyCode === 13) {
        this.config.name = this.shopName;
        this.start = 1;
        this.hotShopList = [];
        this.getHotShop();
      }
    },
    getTypeData(code) {
      this.start = 1;
      this.hotShopList = [];
      this.getHotShop();
    },
    selectCategory(index) {
      this.currentIndex = index;
      this.config.parentCategoryCode = this.shopTypeData[index].code;
      this.start = 1;
      this.hotShopList = [];
      this.getHotShop();
    },
    addCart(code, name, specsId, specsName) {
      if(!getUserId()) {
        this.go('login');
      }
      this.loading = true;
      this.addCartConfig.commodityCode = code;
      this.addCartConfig.commodityName = name;
      this.addCartConfig.specsId = specsId;
      this.addCartConfig.specsName = specsName;
      addShopCart(this.addCartConfig).then(data => {
        this.loading = false;
        this.textMsg = '加入购物车成功';
        this.$refs.toast.show();
        // setTimeout(() => {
        //   this.go('/mall-shopCart');
        // }, 1500);
      }, () => {
        this.loading = false;
      });
    },
    toShopDet(code, shopCode) {
      this.go(`/mall-shop_detail?code=${code}&shopCode=${shopCode}`);
    },
    tomore() {
      this.isAll = true;
    },
    toCartFn() {
      if(!getUserId()) {
        this.textMsg = '请先登录';
        setTimeout(() => {
          this.go('/login');
        }, 1500);
        return;
      }
      this.go('/mall-shopCart');
    },
    // 获取热门商品
    getHotShop() {
      this.config.start = this.start;
      getAllShopData(this.config).then(data => {
        this.loading = false;
        if (data.totalPage <= this.start) {
          this.hasMore = false;
        }
        this.hotShopList = [...this.hotShopList, ...data.list];
        this.start ++;
        if(this.config.parentCategoryCode) {
          delete this.config.parentCategoryCode;
        }
        if(this.config.name) {
          delete this.config.name;
          this.shopName = '';
        }
      }, () => {
        this.loading = false;
      });
    }
  },
  components: {
    MFooter,
    FullLoading,
    Toast,
    Scroll,
    NoResult,
    CategoryScroll
  },
  watch: {
    '$route.path': function (newVal, oldVal) {
      this.loading = true;
      if(newVal === '/mall') {
        this.isAll = false;
        setTitle('商场');
      }
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    }
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
  .banner-default {
    width: 100%;
    height: 3rem;
  }
  .content {
    overflow: auto;
    font-family: PingFangSC-Regular;

    .mall-header{
      width: 100%;
      height: 3.7rem;
      margin: 0 auto;
      position: relative;
      background-image: url('./banner.png');
      background-size: 100% 100%;
      .head-search{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        padding: 0.24rem 0.3rem;
        .search{
          width: 100%;
          opacity: 0.9;
          background: #FFFFFF;
          border: 0.01rem solid #E5E5E5;
          border-radius: 0.72rem;
          overflow: hidden;
          height: 0.72rem;
          line-height: 0.2rem;
          padding-left: 0.3rem;
          span{
            width: .24rem;
            height: 0.24rem;
            display: inline-block;
            vertical-align: middle;
            background-image: url('./search.png');
            background-size: 100% 100%;
          }
          input{
            font-size: 0.28rem;
            color: #999999;
            letter-spacing: 0.01rem;
            width: 90%;
            height: 100%;
            vertical-align: middle;
            margin-left: -0.2rem;
          }
        }
      }
    }
    .mall-content{
      background-color: #fff;
      padding: 0.32rem 0.3rem 0;
      .con-head{
        .shop-list{
          height: 5rem;
          overflow: scroll;
        }
        >h5{
          margin-bottom: 0.24rem;
          font-family: PingFangSC-Semibold;
          font-size: 0.36rem;
          color: #666;
          letter-spacing: 0.01rem;
          font-weight: 600;
          a{
            font-family: PingFang-SC-Medium;
            font-size: 0.26rem;
            color: #999999;
            letter-spacing: 0.01rem;
          }
        }
        .con-list{
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          .con-sing{
            width: 48%;
            box-sizing: border-box;
            font-size: 0.32rem;
            border: 1px solid #E6E6E6;
            border-radius: 4px;
            padding-bottom: 0.3rem;
            margin-bottom: 0.3rem;
          }
          .sing-img{
            width: 100%;
            height: 2.3rem;
            margin-bottom: 0.2rem;
            background-size: 100% 100%;
            background-image: url('./shop.png');
          }
          .con-txt{
            padding: 0 0.35rem 0 0.2rem;
          }
          h5{
            font-family: PingFangSC-Medium;
            color: #333;
            font-size: 0.32rem;
            font-weight: 600;
            letter-spacing: 0.01rem;
          }
          .con-foo{
            margin-top: 0.16rem;
            font-family: DIN-Bold;
            color: #23AD8C;
            letter-spacing: 0.01rem;
            line-height: 0.3rem;
            font-size: 0.3rem;
            font-weight: bold;
            .icon{
              display: inline-block;
              width: 0.28rem;
              height: 0.23rem;
              background-size: 100% 100%;
              background-image: url('./shopCart.png')
            }
          }
        }
      }
    }
  }
  .go-cart{
    position: fixed;
    bottom: 1.3rem;
    right: 0.3rem;
    width: 1.3rem;
    height: 1.3rem;
    background-image: url('./1.png');
    background-size: 100% 100%;
    p{
      width: 0.2rem;
      height: .2rem;
      border-radius: 100%;
      background-color: red;
      position: absolute;
      top: 0.1rem;
      right: 0.2rem;
    }
  }
}
</style>
