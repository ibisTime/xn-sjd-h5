<template>
  <div class="shop-wrapper_det">
    <div class="tab">
      <span @click="changeTab(0)" :class="[tab === 0 ? 'active': '']">商品</span>
      <span @click="changeTab(1)" :class="[tab === 1 ? 'active': '']">图文详情</span>
      <span @click="changeTab(2)" :class="[tab === 2 ? 'active': '']">评价</span>
    </div>
    <Scroll ref="scroll"
            :data="commentList"
            :hasMore="hasMore"
            @pullingUp="getCommemtDataFn">
      <div class="content">
        <!-- <div class="shop-head">
        </div> -->
        <div class="shop-conAll" v-show="tab === 0">
          <div class="slider-wrapper">
            <slider :loop="loop">
              <div class="home-slider" v-for="(item, index) in bannerPic" :key="index">
                <a :href="'javascript:void(0)'" :style="getImgSyl(item ? item : '')"></a>
              </div>
            </slider>
            <back-only></back-only>
          </div>
          <div class="shop-det">
            <p class="shop-price" v-if="shopDetData.minPrice === shopDetData.maxPrice"><span>￥{{formatAmount(shopDetData.minPrice)}}</span></p>
            <p class="shop-price" v-else><span>￥{{formatAmount(shopDetData.minPrice)}}</span> - <span>￥{{formatAmount(shopDetData.maxPrice)}}</span></p>
            <p class="shop-msg">{{shopDetData.name}}</p>
            <div class="or-msg">
              <p>快递：{{logistics[shopDetData.logistics]}}</p>
              <p>总销量：{{shopDetData.monthSellCount}}笔</p>
              <p v-if="shopDetData.originalPlace">产地：{{shopDetData.originalPlace}}</p>
            </div>
          </div>
          <div class="shop-gg">
            <p @click.stop="setSpecification">规格：选择规格分类</p>
          </div>
          <div class="shop-pj" v-if="commentData.content">
            <div class="pj-head">
              <p>评价 <span class="fr pj-all" @click="changeTab(2)">查看全部 ></span></p>
            </div>
            <div class="pj-content">
              <div class="con-head">
                <div class="u-img" :style="getImgSyl(commentData ? commentData.photo : '', 'u')"></div>
                <div class="u-name">{{commentData ? commentData.nickname : ''}} <span class="fr time">{{commentDatetime? formatDate(commentDatetime) : ''}}</span></div>
              </div>
              <div class="pj-con" v-html="commentData ? commentData.content : ''">
              </div>
            </div>
          </div>
        </div>
        <div class="shop-js" v-show="tab === 1">
          <div class="js-head">
            <p><span></span> 图文介绍</p>
            <div class="description-detail" v-html="shopDetData.description" ref="description"></div>
          </div>
        </div>
        <div class="com-list" v-show="tab === 2 && commentList.length">
          <div class="com-singer" v-for="(item, index) in commentList" :key="index">
            <div class="sing-head">
              <div class="s-head_left">
                <div class="l-img" :style="getImgSyl(item.photo ? item.photo : '', 'u')"></div>
              </div>
              <div class="s-head_right">
                <p>{{item.nickname}} <span class="fr">{{formatDate(item.commentDatetime)}}</span></p>
              </div>
            </div>
            <div class="sing-con" v-html="item.content">

            </div>
          </div>
          <p></p>
        </div>
        <div class="com-list" v-show="tab === 2 && !commentList.length && !hasMore">
          <div class="mall-content">
            <no-result class="no-result-wrapper" title="暂无评论"></no-result>
          </div>
        </div>
      </div>
    </Scroll>
    <div class="toast" v-show="istoast" @click="istoast = false">
      <div class="shop-toast" @click.stop>
        <div class="tos-head">
          <div class="head-left">
            <div class="l-img" :style="getImgSyl(shopDetData.bannerPic ? shopDetData.bannerPic : '')"></div>
          </div>
          <div class="head-right">
            <p class="r-head">¥{{setPrice}} <span class="fr iconX" @click="istoast = false"></span></p>
            <p>库存{{inventory}}件</p>
            <p v-if="specsList.length > 1">{{setSpecsName ? `已选 “${setSpecsName}”` : '请选择商品规格'}}</p>
            <p v-if="specsList.length == 1">已选 “{{specsList[0].name}}”</p>
          </div>
        </div>
        <div class="tos-con">
          <div class="con-head">
            <h5>规格分类</h5>
          </div>
          <div class="con-list">
            <div class="sing"
              v-for="(item, index) in specsList"
              :key="index"
              @click="specsFn(index, item)"
              :class="{'set-index': setIndex == index}"
            >
              <p>{{item.name}}</p>
            </div>
          </div>
          <div class="con-foo">
            <div class="f-left">
              数量
              <p class="fr l-num">
                <span class="jian" @click="minusShop"></span>&nbsp;&nbsp; <b>{{shopNum}}</b> &nbsp;&nbsp;<span class="jia" @click="addShop"></span>
              </p>
            </div>
          </div>
        </div>
        <div class="tos-btn" v-show="isgm" @click="qrorderFn">
          确定
        </div>
        <div class="tos-btns" v-show="!isgm">
          <div class="gwc" @click="toShopCart">
            加入购物车
          </div>
          <div class="ljgm" @click="toShopOrder">
            立即购买
          </div>
        </div>
      </div>
    </div>
    <div class="shop-foo">
      <div class="foo-left">
        <div class="le-dp" @click="go(`mall-store?shopCode=${shopCode}`);">
          <div class="dp-img"></div>
          <p>店铺</p>
        </div>
        <div class="le-kf" @click="toConver">
          <div class="kf-img"></div>
          <p>客服</p>
        </div>
      </div>
      <div class="foo-right">
        <button class="add-cart" @click="setAddCart">加入购物车</button>
        <button class="buy" @click="toBuy">立即购买</button>
      </div>
    </div>
    <full-loading v-show="loading" :title="loadingText"></full-loading>
    <toast ref="toast" :text="textMsg"></toast>
  </div>
</template>
<script>
import { formatAmount, setTitle, formatImg, formatDate, getUserId } from 'common/js/util';
import { initShare } from 'common/js/weixin';
import { getDictList } from 'api/general';
import { getUser } from 'api/user';
import { getShopDetail, getCommemtData, addShopCart } from 'api/store';
import { share } from 'api/biz';
import FullLoading from 'base/full-loading/full-loading';
import Toast from 'base/toast/toast';
import Scroll from 'base/scroll/scroll';
import Slider from 'base/slider/slider';
import BackOnly from 'components/back-only/back-only';
import NoResult from 'base/no-result/no-result';
export default {
  data() {
    return {
      istoast: false,
      loading: true,
      isgm: true,
      loop: false,
      textMsg: '',
      loadingText: '加载中...',
      code: '',
      shopCode: '',
      shopDetData: {},  // 商品详情
      bannerPic: [],
      logistics: {},   // 邮寄方式
      detailDescription: '',
      // config: {      // 评论参数
      //   start: 1,
      //   limit: 1,
      //   commodityCode: '',
      //   status: 'D'
      // },
      commentDatetime: '',
      commentData: {},       // 评论数据
      specsList: [],          // 产品规格
      setPrice: '',           // 选中规格价格
      inventory: '',           // 选中规格库存
      setIndex: 0,            // 选中的第几个规格
      shopNum: 1,              // 商品数量
      addCartConfig: {            // 加入购物车参数
        userId: getUserId(),
        commodityCode: '',
        commodityName: '',        // 商品名称
        specsId: '',              // 规格编号
        specsName: '',            // 规格名称
        quantity: 1              // 商品数量
      },
      isCartType: '0',             // 无规格 0 点外购物车  1 点外立即购买
      shopName: '',                // 店铺名称
      setSpecsName: '',
      tab: 0,
      commentList: [],
      userMsgList: [],
      start: 1,
      hasMore: true,
      config: {      // 评论参数
        start: 1,
        limit: 6,
        commodityCode: '',
        statusList: ['D', 'B']
      }
    };
  },
  created() {
    this.isWxConfiging = false;
    this.wxData = null;
    setTitle('产品详情');
    sessionStorage.removeItem('setRess');
    this.pullUpLoad = null;
    this.code = this.$route.query.code;
    this.shopCode = this.$route.query.shopCode;
    this.config.commodityCode = this.code;
    this.addCartConfig.commodityCode = this.code;
    this.getCommemtDataFn();
    let userId = getUserId();
    if(userId) {
      Promise.all([
        getDictList('logistics'),  // 获取邮寄方式
        getShopDetail(this.code),       // 获取商品详情
        getCommemtData(this.config),     // 获取评论
        getUser(userId)
      ]).then(([res1, res2, res3, res4]) => {
        this.commentList = res3.list;
        this.loading = false;
        res1.forEach(item => {
          this.logistics[item.dkey] = item.dvalue;
        });
        this.shopDetData = res2;
        this.bannerPic = res2.bannerPic.split('||');
        if(this.bannerPic.length > 1) {
          this.loop = true;
        }
        this.shopName = res2.shopName;
        this.specsList = res2.specsList;
        this.setPrice = formatAmount(this.specsList[0].price);
        this.inventory = this.specsList[0].inventory;
        sessionStorage.setItem('inventory', this.inventory);
        this.setSpecsName = this.specsList[0].name;
        this.detailDescription = res2.description;
        this.addCartConfig.commodityName = res2.name;
        this.addCartConfig.specsId = this.specsList[0].id;
        this.addCartConfig.specsName = this.specsList[0].name;
        if(res3.list.length) {
          getUser(res3.list[0].userId).then(res => {
            this.commentData = res3.list[0];
            this.commentData.photo = res.photo;
          });
          this.commentDatetime = res3.list[0].commentDatetime;
        }
        this.userDetail = res4;
        if(!this.isWxConfiging && !this.wxData) {
          this.getInitWXSDKConfig();
        }
      }).catch(() => { this.loading = false; });
    } else {
      Promise.all([
        getDictList('logistics'),  // 获取邮寄方式
        getShopDetail(this.code),       // 获取商品详情
        getCommemtData(this.config)     // 获取评论
      ]).then(([res1, res2, res3]) => {
        this.commentList = res3.list;
        this.loading = false;
        res1.forEach(item => {
          this.logistics[item.dkey] = item.dvalue;
        });
        this.shopDetData = res2;
        this.bannerPic = res2.bannerPic.split('||');
        if(this.bannerPic.length > 1) {
          this.loop = true;
        }
        this.shopName = res2.shopName;
        this.specsList = res2.specsList;
        this.setPrice = formatAmount(this.specsList[0].price);
        this.inventory = this.specsList[0].inventory;
        sessionStorage.setItem('inventory', this.inventory);
        this.setSpecsName = this.specsList[0].name;
        this.detailDescription = res2.description;
        this.addCartConfig.commodityName = res2.name;
        this.addCartConfig.specsId = this.specsList[0].id;
        this.addCartConfig.specsName = this.specsList[0].name;
        if(res3.list.length) {
          getUser(res3.list[0].userId).then(res => {
            this.commentData = res3.list[0];
            this.commentData.photo = res.photo;
          });
          this.commentDatetime = res3.list[0].commentDatetime;
        }
        if(!this.isWxConfiging && !this.wxData) {
          this.getInitWXSDKConfig();
        }
      }).catch(() => { this.loading = false; });
    }
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    },
    formatImg(img) {
      return formatImg(img);
    },
    formatDate(time) {
      return formatDate(time);
    },
    go(url) {
      this.$router.push(url);
    },
    changeTab(index) {
      this.tab = index;
    },
    getImgSyl(imgs, type) {
      let pic = imgs ? formatImg(imgs) : type === 'u' ? 'static/avatar@2x.png' : 'static/default.png';
      return {
        backgroundImage: `url(${pic})`
      };
    },
    toComment() {
      this.go('user-comment?code=' + this.code);
    },
    setAddCart() { // 外加入购物车
      if(this.isLogin()) {
        if(this.specsList.length > 1) {
          this.istoast = true;
          this.isgm = true;
          this.isCartType = '0';
        }else {
          this.addShopCart();
        }
      }
    },
    toBuy() { // 外立即购买
      if(this.isLogin()) {
        if(this.specsList.length > 1) {
          this.istoast = true;
          this.isgm = true;
          this.isCartType = '1';
          return;
        }
        if(this.inventory > 0) {
          this.loading = true;
          let shopMsg = {
            ...this.addCartConfig,
            shopName: this.shopName,
            bannerPic: this.bannerPic,
            logistics: this.shopDetData.logistics,
            setPrice: parseFloat(this.setPrice) * 1000
          };
          let shopMsgList = [shopMsg];
          sessionStorage.setItem('shopMsgList', JSON.stringify(shopMsgList));
          this.go('/affirm-order?code=' + this.code);
        }else {
          this.textMsg = '库存规格不足';
          this.$refs.toast.show();
        }
      }
    },
    toShopCart() { // 内加入购物车
      if(!getUserId()) {
        this.textMsg = '您未登录';
        this.$refs.toast.show();
        setTimeout(() => {
          this.$router.push('/login');
        }, 1000);
        return;
      }
      this.istoast = false;
      this.addShopCart();
    },
    toShopOrder() { // 内立即购买
      if(this.isLogin()) {
        if(this.inventory > 0) {
          this.loading = true;
          let shopMsg = {
            ...this.addCartConfig,
            shopName: this.shopName,
            bannerPic: this.bannerPic,
            logistics: this.shopDetData.logistics,
            setPrice: parseFloat(this.setPrice) * 1000
          };
          let shopMsgList = [shopMsg];
          sessionStorage.setItem('shopMsgList', JSON.stringify(shopMsgList));
          this.go('/affirm-order?code=' + this.code);
        }else {
          this.textMsg = '库存规格不足';
          this.$refs.toast.show();
        }
      }
    },
    isLogin() {
      if(!getUserId()) {
        this.textMsg = '您未登录';
        this.$refs.toast.show();
        this.istoast = false;
        setTimeout(() => {
          this.$router.push('/login');
        }, 1000);
        return false;
      }else {
        return true;
      }
    },
    setSpecification() { // 点击规格
      this.istoast = true;
      this.isgm = false;
    },
    specsFn(index, item) { // 选中规格
      this.setIndex = index;
      this.setPrice = formatAmount(item.price);
      this.inventory = item.inventory > 0 ? item.inventory : 0;
      sessionStorage.setItem('inventory', this.inventory);
      this.addCartConfig.specsId = item.id;
      this.addCartConfig.specsName = item.name;
      this.setSpecsName = item.name;
    },
    minusShop() { // 商品减
      if(this.shopNum > 1) {
        this.shopNum --;
        this.addCartConfig.quantity = this.shopNum;
      }
    },
    addShop() {  // 商品加
      this.shopNum ++;
      if(this.inventory < this.shopNum) {
        this.shopNum --;
        this.textMsg = '库存规格不足';
        this.$refs.toast.show();
      }
      this.addCartConfig.quantity = this.shopNum;
    },
    addShopCart() { // 加入购物车接口
      if(this.inventory > 0) {
        this.loading = true;
        addShopCart(this.addCartConfig).then(data => {
          this.loading = false;
          this.textMsg = '加入购物车成功';
          this.$refs.toast.show();
          this.istoast = false;
        }, () => {
          this.loading = false;
        });
      }else {
        this.textMsg = '库存规格不足';
        this.$refs.toast.show();
      }
    },
    qrorderFn() { // 确认操作
      if(this.isCartType === '0') { // 加入购物车
        this.addShopCart();
      }
      if(this.isCartType === '1') {  // 立即购买
        this.toShopOrder();
      }
    },
    toConver() {
      if(this.isLogin()) {
        this.go(`/store-service?user2=${this.shopDetData.sellUserId}`);
      }
    },
    getCommemtDataFn() {
      this.config.start = this.start;
      getCommemtData(this.config).then(data => {
        if (data.totalPage <= this.start) {
          this.hasMore = false;
        }
        this.commentList = [...this.commentList, ...data.list];
        this.start ++;
        this.loading = false;
      }, () => {
        this.loading = false;
      });
    },
    getInitWXSDKConfig() {
      this.loading = true;
      // console.log(this.shopDetData.name);
      // console.log(location.href.split('#')[0] + '/#/mall-shop_detail?code=' + this.code + '&shopCode=' + this.shopCode + '&userReferee=' + this.userDetail.mobile + '&type=U');
      // console.log(formatImg(this.shopDetData.listPic));
      initShare({
        title: '氧林商城',
        desc: this.shopDetData.name,
        link: location.href.split('#')[0] + '/#/mall-shop_detail?code=' + this.code + '&shopCode=' + this.shopCode + '&userReferee=' + this.userDetail.mobile + '&type=U',
        imgUrl: formatImg(this.shopDetData.listPic),
        success: (res) => {
          this.channel = '';
          if(res.errMsg.indexOf('sendAppMessage') !== -1) {
            this.channel = 0;
          } else if(res.errMsg.indexOf('shareTimeline') !== -1) {
            this.channel = 1;
          } else if(res.errMsg.indexOf('shareQQ') !== -1) {
            this.channel = 2;
          } else if(res.errMsg.indexOf('shareQZone') !== -1) {
            this.channel = 3;
          }
          share(this.channel, '商城商品').then((res) => {
            if(res.code) {
              this.textMsg = '分享成功';
              this.$refs.toast.show();
            }
          }).then(() => {});
        }
      }, (data) => {
        this.isWxConfiging = false;
        this.wxData = data;
        this.loading = false;
      }, (msg) => {
        alert(msg);
        this.isWxConfiging = false;
        this.wxData = null;
        this.loading = false;
      });
    }
  },
  components: {
    BackOnly,
    FullLoading,
    Toast,
    Scroll,
    Slider,
    NoResult
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/mixin.scss";
@import "../../common/scss/variable.scss";
.shop-wrapper_det{
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  margin-bottom: 1.2rem;
  width: 100%;
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .tab {
    height: 0.8rem;
    font-size: 0.3rem;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: $color-highlight-background;
    span {
      color: #666;
      line-height: 0.42rem;
    }
    .active {
      color: $mall-color;
      border-bottom: 1px solid $mall-color;
      padding-bottom: 0.04rem;
    }
  }
  .content {
    overflow: auto;
    font-family: PingFangSC-Regular;
    .slider-wrapper {
      background: $color-highlight-background;
      height: 5rem;
      width: 100%;
      overflow: hidden;
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
    .shop-head{
      height: 5.3rem;
      background-image: url('./shop.png');
      background-size: 100% 100%;
      padding: 0.4rem 0.3rem;
    }
    .shop-conAll{
      padding: 0 0 1.31rem;
      /*font-family: PingFangSC-Semibold;*/
      letter-spacing: 0.0025rem;
      .shop-det{
        background-color: #fff;
        padding: 0.3rem 0.3rem 0;
        margin-bottom: 0.2rem;
        .shop-price{
          font-size: 0.3rem;
          color: $mall-color;
          letter-spacing: 0.0025px;
          margin-bottom: 0.31rem;
        }
        .shop-msg{
          font-size: 0.3rem;
          color: #333333;
          letter-spacing: 0.0025rem;
          margin-bottom: 0.3rem;
        }
        .or-msg{
          display: flex;
          justify-content: space-between;
          font-size: 0.24rem;
          color: #999999;
          letter-spacing: 0.002rem;
          padding-bottom: 0.3rem;
        }
      }
      .shop-gg{
        padding-left: 0.3rem;
        background-color: #fff;
        height: 1.1rem;
        line-height: 1.1rem;
        font-size: 0.28rem;
        color: #333333;
        letter-spacing: 0.0022rem;
        margin-bottom: 0.2rem;
      }
      .shop-pj{
        padding: 0.3rem 0.3rem 0;
        background-color: #fff;
        margin-bottom: 0.2rem;
        .pj-head{
          color: #333;
          font-size: 0.32rem;
          margin-bottom: 0.2rem;
          .pj-all{
            color: #999999;
            font-size: 0.28rem;
          }
        }
        .pj-content{
          padding-bottom: 0.3rem;
          font-size: 0.28rem;
          color: #333333;
          letter-spacing: 0.0022rem;
          .con-head{
            display: flex;
            margin-bottom: 0.16rem;
            .u-img{
              margin-right: 0.14rem;
              width: 0.6rem;
              height: 0.6rem;
              border-radius: 100%;
              background-size: 100%;
              background-clip: center;
              background-image: url('./shop.png');
            }
            .u-name{
              width: 88%;
              color: #999;
              line-height: 0.6rem;
            }
          }
        }
      }
    }
    .description-detail{
      font-size: 0.3rem;
      line-height: 1.8;
      img{
        max-width: 100%;
        vertical-align: bottom;
      }
    }
    .shop-js{
      padding: 0.3rem;
      background-color: #fff;
      .js-head{
        p{
          font-size: 0.32rem;
          color: #333333;
          margin-bottom: 0.2rem;
          span{
            display: inline-block;
            width: 0.06rem;
            height: 0.32rem;
            background-color: $mall-color;
            vertical-align: top;
          }
        }
      }
    }
    .com-singer{
      width: 100%;
      padding: 0.3rem;
      background-color: #fff;
      .sing-head{
        display: flex;
        height: 0.66rem;
        align-items: center;
        .s-head_left{
          width: 0.66rem;
          height: 0.66rem;
          margin-right: 0.16rem;
          .l-img{
            width: 100%;
            height: 100%;
            border-radius: 100%;
            background-size: 100% 100%;
            background-image: url('./shop.png');
          }
        }
        .s-head_right{
          width: 85%;
          font-size: 0.3rem;
          color: #999999;
          letter-spacing: 0.0022rem;
          span{
            font-size: 0.26rem;
          }
        }
      }
      .sing-foo{
        display: flex;
        justify-content: space-between;
        font-size: 0.26rem;
        color: #999999;
        .s-foo_left{
          letter-spacing: 0.2px;
        }
        .s-foo_right{
          display: flex;
          p{
            margin-left: 0.4rem;
            vertical-align: middle;
            span{
              display: inline-block;
              width: 0.3rem;
              height: 0.3rem;
              background-size: 100% 100%;
              margin-right: 0.1rem;
              vertical-align: middle;
            }
            .pl{
              width: auto;
            }
            .foo-pl{
              background-image: url('./pl.png');
            }
            .foo-z{
              background-image: url('./dz.png');
            }
          }
        }
      }
    }
  }
  .toast{
    position: fixed;
    z-index: 99;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .7);
  }
  .shop-toast{
    position: absolute;
    bottom: 0rem;
    width: 100%;
    min-height: 30%;
    padding: 0.3rem 0.3rem 0.1rem;
    background-color: #fff;
    .tos-head{
      display: flex;
      margin-bottom: 0.3rem;
      .l-img{
        width: 1.6rem;
        height: 1.6rem;
        margin-right: 0.24rem;
        background-image: url('./shop.png');
        background-size: 100% 100%;
      }
      .head-right{
        display: flex;
        width: 100%;
        align-content: space-between;
        flex-wrap: wrap;
        position: relative;
        font-family: PingFang-SC-Medium;
        font-size: 0.26rem;
        color: #999999;
        letter-spacing: 0.002rem;
        >p{
          width: 100%;
        }
        .r-head{
          color: $mall-color;
          font-size: 0.3rem;
          .iconX{
            width: 0.34rem;
            height: 0.34rem;
            margin-top: -0.1rem;
            display: inline-block;
            background-image: url('./x.png');
            background-size: 100% 100%;
          }
        }
      }
    }
    .tos-con{
      padding-top: 0.3rem;
      .con-head{
        margin-bottom: 0.3rem;
        h5{
          font-family: PingFang-SC-Medium;
          font-size: 0.32rem;
          color: #333333;
          letter-spacing: 0.0025rem;
        }
      }
      .con-list{
        display: flex;
        flex-wrap: wrap;
        background: rgba(216,216,216,0.00);
        box-shadow: 0 0.01rem 0 0 #E5E5E5;
        .sing{
          padding: 0 0.5rem;
          margin: 0 0.2rem;
          text-align: center;
          height: 0.8rem;
          line-height: 0.7rem;
          color: #666;
          background-color: #EBEBEB;
          font-size: 0.28rem;
          margin-bottom: 0.3rem;
        }
        .set-index{
          color: #fff;
          background-color: $mall-color;
        }
      }
    }
    .con-foo{
      height: 1.1rem;
      line-height: 1.1rem;
      background: rgba(216,216,216,0.00);
      box-shadow: 0 0.01rem 0 0 #E5E5E5;
      margin-bottom: 0.45rem;
      .f-left{
        font-family: PingFang-SC-Heavy;
        font-size: 0.32rem;
        color: #333;
        letter-spacing: 0.002rem;
        .l-num{
          span{
            vertical-align: middle;
            display: inline-block;
            width: 0.36rem;
            height: 0.36rem;
            font-size: 0.26rem;
            background-size: 100% 100%;
          }
          b{
            vertical-align: middle;
          }
          .jian{
            background-image: url('./jian.png');
          }
          .jia{
            background-image: url('./jia.png');
          }
        }
      }
    }
    .tos-btn{
      height: 0.9rem;
      line-height: 0.9rem;
      width: 100%;
      background-color: $mall-color;
      color: #fff;
      text-align: center;
      border-radius: 0.1rem;
      font-size: 0.34rem;
      letter-spacing: 0.05rem;
    }
    .tos-btns{
      height: 0.9rem;
      line-height: 0.9rem;
      width: 100%;
      text-align: center;
      font-size: 0.34rem;
      letter-spacing: 0.02rem;
      display: flex;
      color: #fff;
      justify-content: space-between;
      >div{
        width: 48%;
        border-radius: 0.06rem;
      }
      .gwc{
        background-color: #554F5B;
      }
      .ljgm{
        background-color: $mall-color;
      }
    }
  }
  .shop-foo{
        position: fixed;
        bottom: 0;
        width: 100%;
        display: flex;
        height: 0.98rem;
        align-items: center;
        background-color: #fff;
        .foo-left{
          width: 30%;
          display: flex;
          >div{
            width: 50%;
            text-align: center;
            font-size: 0.22rem;
            color: #999999;
            letter-spacing: 0.0017rem;
            display: flex;
            align-items: center;
            flex-direction: column;
            >div{
              margin-bottom: 0.07rem;
              width: 0.38rem;
              height: 0.32rem;
              background-size: 100% 100%;
            }
            .dp-img{
              background-image: url('./dp@2x.png');
            }
            .kf-img{
              background-image: url('./kf.png');
            }
          }
        }
      .foo-right{
        width: 70%;
        height: 0.84rem;
        display: flex;
        justify-content: space-between;
        button{
          width: 48%;
          line-height: 0.84rem;
          text-align: center;
          letter-spacing: 0.0027rem;
          font-size: 0.32rem;
          border-radius: 0.12rem;
          color: #fff;
        }
        .add-cart{
          background-color: #554F5B;
        }
        .buy{
          background-color: $mall-color;
        }
      }
    }
}
</style>
