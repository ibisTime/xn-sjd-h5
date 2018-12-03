<template>
  <div class="mall-wrapper" @click.stop>
    <Scroll
      :data="hotShopList"
      :hasMore="hasMore"
      @pullingUp="getHotShop">
      <div class="content" v-show="!isAll">
        <div class="mall-header">
          <div class="head-search">
            <h4>{{name}}</h4>
            <p>{{description}}</p>
          </div>
          <div class="mall-cont">
            <slider v-if="banners.length" :loop="banners.length > 1" :showDots="banners.length > 1">
              <div class="home-slider" v-for="item in banners" :key="item.code">
                <a :href="item.url||'javascript:void(0)'" :style="getImgSyl(item.pic)"></a>
              </div>
            </slider>
          </div>
        </div>
        <div class="mall-list">
          <category-scroll
            :Type="'mall'"
            :currentIndex="currentIndex"
            :categorys="shopTypeData"
            @select="selectCategory"
          ></category-scroll>
          </div>
        <div class="mall-content">
          <div class="con-head">
            <h5>所有商品<span class="fr" @click="tomore">更多</span></h5>
            <div class="ml-list">
                <div class="con-list">
                  <div class="con-sing" @click="toShopDet(shopItem.code, shopItem.shopCode)" v-for="(shopItem, shopIndex) in hotShopList" :key="shopIndex">
                    <div class="con-sing_img">
                      <div class="sing-img" :style="getImgSyl(shopItem.listPic ? shopItem.listPic : '')"></div>
                      <div class="con-txt">
                        <h5>{{shopItem.name}}</h5>
                        <div class="con-foo">
                          <p>￥{{formatAmount(shopItem.minPrice)}}起<span class="icon fr" @click.stop="addCart(shopItem.code, shopItem.name, shopItem.specsList[0].id, shopItem.specsList[0].name)"></span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mall-content">
                  <no-result v-show="!hotShopList.length && !hasMore" class="no-result-wrapper" title="抱歉，暂无商品"></no-result>
                </div>
            </div>
          </div>
        </div>
      </div>
    </Scroll>
    <!--<MallShopList v-show="isAll" />-->
    <div class="go-cart" @click.stop="goCart">
      <p v-if="iscart"></p>
    </div>
    <full-loading v-show="loading" :title="loadingText"></full-loading>
    <toast ref="toast" :text="textMsg"></toast>
  </div>
</template>
<script>
import FullLoading from 'base/full-loading/full-loading';
import Toast from 'base/toast/toast';
import Scroll from 'base/scroll/scroll';
import Slider from 'base/slider/slider';
import CategoryScroll from 'base/category-scroll/category-scroll';
import NoResult from 'base/no-result/no-result';
import MallShopList from '../mall-shopList/mall-shopList';
import { getAllShopData, addShopCart, storeMsg, getShopType, myShopCart } from 'api/store';
import { formatAmount, formatImg, formatDate, setTitle, getUserId } from 'common/js/util';
import { getBanner } from 'api/general';
export default {
  // name: "home",
  data() {
    return {
      loading: true,
      currentIndex: 0,
      textMsg: '',
      loadingText: '正在加载中...',
      isAll: false,
      shopCode: '',
      start: 1,
      config: {
        start: 1,
        limit: 4,
        status: '4',
        orderColumn: 'order_no',
        orderDir: 'asc'
      },
      hasMore: true,
      hotShopList: [],
      addCartConfig: {            // 加入购物车参数
        userId: getUserId(),
        commodityCode: '',
        commodityName: '',        // 商品名称
        specsId: '',              // 规格编号
        specsName: '',            // 规格名称
        quantity: 1              // 商品数量
      },
      description: '',
      name: '',
      shopTypeConfig: {          // 商品类别参数
        start: 1,
        limit: 10,
        level: 1,
        status: 1,
        type: 2,
        orderColumn: 'order_no',
        orderDir: 'asc'
      },
      shopTypeData: [],   // {key: '0', value: '全部', code: ''}
      iscart: false,
      banners: []
    };
  },
  created() {
    this.pullUpLoad = null;
    this.shopCode = this.$route.query.shopCode;
    this.config.shopCode = this.shopCode;
    getBanner({type: 7, shopCode: this.shopCode}).then(data => {
      this.banners = data;
    });
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
    storeMsg(this.shopCode).then(data => {
      this.loading = false;
      this.description = data.description;
      this.name = data.name;
      setTitle(this.name);
    }, () => {
      this.loading = false;
    });
    if(getUserId()) {
      myShopCart(getUserId()).then(data => {
        if(data.length > 0) {
          this.iscart = true;
        }
      });
    }
    this.getHotShop();
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
    getTypeData(code) {
      this.start = 1;
      this.hotShopList = [];
      this.getHotShop();
    },
    addCart(code, name, specsId, specsName) {
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
          // setTimeout(() => {
          //   this.go('/mall-shopCart');
          // }, 1500);
        }, () => {
          this.loading = false;
        });
      }else {
        this.textMsg = '请先登录';
        this.$refs.toast.show();
      }
    },
    toShopDet(code, shopCode) {
      this.go(`/mall-shop_detail?code=${code}&shopCode=${shopCode}`);
    },
    tomore() {
      this.go('/mall-shopList?code=' + this.shopCode);
    },
    selectCategory(index) {
      let storeTypeCode = this.shopTypeData[index].code;
      this.go('/mall-shopList?storeTypeCode=' + storeTypeCode + '&typeIndex=' + index + '&code=' + this.shopCode);
    },
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
    goCart() {
      if(getUserId()) {
        this.go('/mall-shopCart');
      }else {
        this.textMsg = '请先登录';
        this.$refs.toast.show();
      }
    }
  },
  components: {
    FullLoading,
    Toast,
    Scroll,
    Slider,
    NoResult,
    MallShopList,
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
  height: 100%;
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
      .mall-cont{
        height: 3.8rem;
        margin: 0 auto;
        position: relative;
        /*background-image: url('./banner.png');*/
        /*background-size: 100% 100%;*/
        .home-slider {
          height: 100%;
        }
        a {
          width: 100%;
          height: 100%;
          display: block;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
        }
      }
      .head-search{
        width: 100%;
        min-height: 1.5rem;
        background-color: rgba(0, 0, 0, .5);
        padding: 0.3rem 0 0.35rem 0.3rem;
        font-family: PingFang-SC-Medium;
        color: #FFFFFF;
        h4{
            font-size: 0.34rem;
            letter-spacing: 0.0027rem;
            margin-bottom: 0.12rem;
        }
        p{
            font-size: 0.26rem;
            letter-spacing: 0.002rem;
        }
      }
    }
    .mall-content{
      background-color: #fff;
      padding: 0.32rem 0.3rem 0;
      .con-head{
        >h5{
          margin-bottom: 0.24rem;
          font-family: PingFangSC-Semibold;
          font-size: 0.36rem;
          color: #333333;
          letter-spacing: 0.0027rem;
          font-weight: 600;
          span{
            font-family: PingFang-SC-Medium;
            font-size: 0.26rem;
            color: #999999;
            letter-spacing: 0.002rem;
          }
        }
        .ml-list{
          overflow: scroll;
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
            letter-spacing: 0.0025rem;
          }
          .con-foo{
            margin-top: 0.16rem;
            font-family: DIN-Bold;
            color: #23AD8C;
            letter-spacing: 0.0023rem;
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
