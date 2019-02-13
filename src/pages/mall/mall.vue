<template>
  <div class="mall-wrapper" @click.stop>
    <Scroll
      :pullUpLoad="pullUpLoad">
      <div class="content" v-show="!isAll">
        <div class="mall-header">
          <slider v-if="banners.length" :loop="banners.length > 1" :showDots="banners.length > 1">
            <div class="home-slider" v-for="item in banners" :key="item.code">
              <a :href="item.url||'javascript:void(0)'" :style="getImgSyl(item.pic)"></a>
            </div>
          </slider>
          <div class="head-search">
            <div class="search">
              <span></span>
              <input type="text" placeholder="搜索商品" v-model="shopName" @keyup="searchShop" @click="searchShop">
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
        <p class="hr"></p>
        <div class="mall-content">
          <div class="activity">
            <img :src="formatImg(activityPic)" >
          </div>
          <div class="con-head" v-if="hotShopList.length > 3">
            <h5>热门推荐 <router-link to="/mall-shopList?location=1" class="fr">查看更多</router-link></h5>
            <div class="shop-list">
                <div class="con-list">
                  <!--<div class="con-sing" @click="toShopDet(shopItem.code, shopItem.shopCode)" v-for="(shopItem, index) in hotShopList" :key="index">-->
                    <!--<div class="con-sing_img">-->
                      <!--<div class="sing-img" :style="getImgSyl(shopItem.listPic ? shopItem.listPic : '')"></div>-->
                      <!--<div class="con-txt">-->
                        <!--<h5>{{shopItem.name}}</h5>-->
                        <!--<div class="con-foo">-->
                          <!--<p>￥{{formatAmount(shopItem.minPrice)}}起-->
                            <!--<span-->
                              <!--class="icon fr"-->
                              <!--@click.stop="addCart(shopItem.code, shopItem.name, shopItem.specsList[0].id, shopItem.specsList[0].name)"-->
                            <!--&gt;</span>-->
                          <!--</p>-->
                        <!--</div>-->
                      <!--</div>-->
                    <!--</div>-->
                  <!--</div>-->
                  <div class="hot-big">
                    <div class="left" @click="toShopDet(hotShopList[0].code, hotShopList[0].shopCode)">
                      <div class="title">{{hotShopList[0].name}}</div>
                      <div class="text">辅助文字</div>
                      <div class="sing-img" :style="getImgSyl(hotShopList[0].listPic ? hotShopList[0].listPic : '')"></div>
                    </div>
                    <div class="right">
                      <div class="right-top" @click="toShopDet(hotShopList[1].code, hotShopList[1].shopCode)">
                        <div class="right-left">
                          <div class="title">{{hotShopList[1].name}}</div>
                          <div class="text">辅助文字</div>
                        </div>
                        <div class="sing-img" :style="getImgSyl(hotShopList[1].listPic ? hotShopList[1].listPic : '')"></div>
                      </div>
                      <div class="right-bottom" @click="toShopDet(hotShopList[2].code, hotShopList[2].shopCode)">
                        <div class="right-left">
                          <div class="title">{{hotShopList[2].name}}</div>
                          <div class="text">辅助文字</div>
                        </div>
                        <div class="sing-img" :style="getImgSyl(hotShopList[2].listPic ? hotShopList[2].listPic : '')"></div>
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
      <!--<router-view v-show="isAll"></router-view>-->
    </Scroll>
    <div class="go-cart" @click.stop="toHomeFn">
    </div>
    <full-loading v-show="loading" :title="loadingText"></full-loading>
    <toast ref="toast" :text="textMsg"></toast>
    <m-footer-sjd-mall></m-footer-sjd-mall>
  </div>
</template>
<script>
import MFooterSjdMall from 'components/m-footer-sjd-mall/m-footer-sjd-mall';
import FullLoading from 'base/full-loading/full-loading';
import Scroll from 'base/scroll/scroll';
import Slider from 'base/slider/slider';
import CategoryScroll from 'base/category-scroll/category-scroll';
import NoResult from 'base/no-result/no-result';
import Toast from 'base/toast/toast';
import { getAllShopData, addShopCart, getShopType, myShopCart } from 'api/store';
import { formatAmount, formatImg, formatDate, setTitle, getUserId } from 'common/js/util';
import { getBanner, getConfigPage } from 'api/general';
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
        orderColumn: 'order_no',
        orderDir: 'asc'
      },
      start: 1,
      pullUpLoad: null,
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
      shopTypeData: [],    // {key: 0, value: '全部', pic: '', code: ''}
      shopName: '',
      iscart: false,
      shopCode: '',
      banners: [],
      activityPic: ''
    };
  },
  created() {
    setTitle('商场');
    this.shopCode = this.$route.query.code;
    let href = location.href;
    if(href.indexOf('mall-shopList') !== -1) {
      this.isAll = true;
    }
    if(this.shopCode) {
      this.isAll = true;
    }
    getBanner({type: 6}).then(data => {
      this.banners = data;
    });
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
    getConfigPage({type: 'SYS_TXT', ckey: 'ACTIVITY_PIC'}).then((res) => {
      this.activityPic = res.list[0].cvalue;
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
      // if(event.keyCode === 13) {
      //   this.config.name = this.shopName;
      //   this.start = 1;
      //   this.hotShopList = [];
      //   this.getHotShop();
      // }
      this.go('/search-mall');
    },
    getTypeData(code) {
      this.start = 1;
      this.hotShopList = [];
      this.getHotShop();
    },
    selectCategory(index) {
      let storeTypeCode = this.shopTypeData[index].code;
      this.go('/mall-shopList?storeTypeCode=' + storeTypeCode + '&typeIndex=' + index);
      this.isAll = true;
    },
    addCart(code, name, specsId, specsName) {
      if(!getUserId()) {
        this.textMsg = '请先登录';
        this.$refs.toast.show();
        return;
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
    toHomeFn() {
      // if(!getUserId()) {
      //   this.textMsg = '请先登录';
      //   this.$refs.toast.show();
      //   return;
      // }
      this.go('/home');
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
        }
      }, () => {
        this.loading = false;
      });
    }
  },
  components: {
    MFooterSjdMall,
    FullLoading,
    Toast,
    Scroll,
    NoResult,
    CategoryScroll,
    Slider
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
  background-color: #fff;
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .hr{
    height: 0.2rem;
    background-color: #f5f5f5;
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
      background-size: 100% 100%;
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
    .mall-list {
      padding: 0.44rem 0;
    }
    .mall-content{
      background-color: #fff;
      padding: 0.32rem 0.3rem 0;
      .activity {
        margin-bottom: 0.3rem;
        img {
          width: 100%;
          height: 2.3rem;
        }
      }
      .con-head{
        .shop-list{
          /*height: 5rem;*/
          overflow: scroll;
        }
        >h5{
          margin-bottom: 0.24rem;
          font-family: PingFangSC-Semibold;
          font-size: 0.32rem;
          color: #333;
          letter-spacing: 0.01rem;
          font-weight: 600;
          a{
            font-family: PingFang-SC-Medium;
            font-size: 0.24rem;
            color: #999999;
            letter-spacing: 0.01rem;
          }
        }
        .con-list{
          .hot-big {
            border: 1px solid #ebebeb;
            display: flex;
            align-items: center;
            width: 100%;
            .left {
              display: flex;
              flex: 1;
              flex-direction: column;
              align-items: center;
              .title {
                font-size: 0.3rem;
                color: #333;
                margin-bottom: 0.16rem;
              }
              .text {
                font-size: 0.24rem;
                color: #666;
                margin-bottom: 0.16rem;
              }
              .sing-img {
                width: 3.16rem;
                height: 2.36rem;
                background-size: 100% 100%;
                background-image: url('./shop.png');
              }
            }
            .right {
              border-left: 1px solid #ebebeb;
              display: flex;
              align-items: center;
              flex-direction: column;
              flex: 1;
              .right-top,.right-bottom {
                padding: 0.32rem 0.3rem;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
              }
              .right-top {
                border-bottom: 1px solid #ebebeb;
              }
              .right-left {
                .title {
                  font-size: 0.28rem;
                  color: #333;
                  margin-bottom: 0.1rem;
                }
                .text {
                  font-size: 0.24rem;
                  color: #666;
                }
              }
              .sing-img {
                width: 1.5rem;
                height: 1.5rem;
                background-size: 100% 100%;
                background-image: url('./shop.png');
              }
            }
          }
        }
      }
    }
  }
  .go-cart{
    position: fixed;
    bottom: 1.3rem;
    left: 0.3rem;
    width: 0.8rem;
    height: 0.8rem;
    background-image: url('./back-home@2x.png');
    background-size: 100% 100%;
  }
}
</style>
