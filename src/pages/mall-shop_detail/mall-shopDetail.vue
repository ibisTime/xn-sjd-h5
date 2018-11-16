<template>
  <div class="shop-wrapper_det">
    <Scroll ref="scroll" :pullUpLoad="pullUpLoad">
      <div class="content">
        <div class="shop-head" :style="getImgSyl(shopDetData.bannerPic ? shopDetData.bannerPic : '')">
          <p class="shop-p">
            <span class="fl fh" @click="go('/mall')"></span>
            <span class="fr fx"></span>
          </p>
        </div>
        <div class="shop-conAll">
          <div class="shop-det">
            <p class="shop-price"><span>￥{{formatAmount(shopDetData.minPrice)}}</span> - <span>￥{{formatAmount(shopDetData.maxPrice)}}</span></p>
            <p class="shop-msg">{{shopDetData.name}}</p>
            <div class="or-msg">
              <p>快递：{{logistics[shopDetData.logistics]}}</p>
              <p>月销{{shopDetData.monthSellCount}}笔</p>
              <p>{{shopDetData.deliverPlace}}</p>
            </div>
          </div>
          <div class="shop-gg">
            <p @click.stop="setSpecification">规格：选择规格分类</p>
          </div>
          <div class="shop-pj">
            <div class="pj-head">
              <p>评价 <span class="fr pj-all" @click="toComment">查看全部 ></span></p>
            </div>
            <div class="pj-content">
              <div class="con-head">
                <div class="u-img" :style="getImgSyl(commentData[0] ? commentData[0].photo : '', 'u')"></div>
                <div class="u-name">{{commentData[0] ? commentData[0].nickname : ''}} <span class="fr time">{{commentDatetime? formatDate(commentDatetime) : ''}}</span></div>
              </div>
              <div class="pj-con" v-html="commentData[0] ? commentData[0].content : ''">
                
              </div>
            </div>
          </div>
          <div class="shop-js">
            <div class="js-head">
              <p><span></span> 图文介绍</p>
              <div class="description-detail" v-html="shopDetData.description" ref="description"></div>
            </div>
          </div>
        </div>
        <div class="toast" v-show="istoast" @click="istoast = false">
          <div class="shop-toast" @click.stop>
            <div class="tos-head">
              <div class="head-left">
                <div class="l-img" :style="getImgSyl(shopDetData.bannerPic ? shopDetData.bannerPic : '')"></div>
              </div>
              <div class="head-right">
                <p class="r-head">¥{{setPrice}} <span class="fr iconX" @click="istoast = false"></span></p>
                <p>库存{{inventory}}件</p>
                <p v-if="specsList.length > 1">{{setSpecsName ? `已选 “${setSpecsName}”` : '选择颜色分类'}}</p>
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
      </div>
    </Scroll>
    <div class="shop-foo">
      <div class="foo-left">
        <div class="le-dp" @click="go(`mall-store?shopCode=${shopCode}`);">
          <div class="dp-img"></div>
          <p>店铺</p>
        </div>
        <div class="le-kf">
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
import { formatAmount, setTitle, getUrlParam, formatImg, formatDate, getUserId } from 'common/js/util';
import { getDictList } from 'api/general';
import { getShopDetail, getCommemtData, addShopCart } from 'api/store';
import FullLoading from 'base/full-loading/full-loading';
import Toast from 'base/toast/toast';
import Scroll from 'base/scroll/scroll';
export default {
  data() {
    return {
      istoast: false,
      loading: true,
      isgm: true,
      textMsg: '',
      loadingText: '加载中...',
      code: '',
      shopCode: '',
      shopDetData: {},  // 商品详情
      logistics: {},   // 邮寄方式
      detailDescription: '',
      config: {      // 评论参数
        start: 1,
        limit: 1,
        commodityCode: '',
        status: 'D'
      },
      commentDatetime: '',
      commentData: [],       // 评论数据
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
      bannerPic: '',
      setSpecsName: ''
    };
  },
  created() {
    setTitle('产品详情');
    this.pullUpLoad = null;
    this.code = getUrlParam('code');
    this.shopCode = getUrlParam('shopCode');
    this.config.commodityCode = this.code;
    this.addCartConfig.commodityCode = this.code;
    Promise.all([
      getDictList('logistics'),  // 获取邮寄方式
      getShopDetail(this.code),       // 获取商品详情
      getCommemtData(this.config)     // 获取评论
    ]).then(([res1, res2, res3]) => {
      this.loading = false;
      res1.forEach(item => {
        this.logistics[item.dkey] = item.dvalue;
      });
      this.shopDetData = res2;
      this.bannerPic = res2.bannerPic;
      this.shopName = res2.shopName;
      this.specsList = res2.specsList;
      this.setPrice = formatAmount(this.specsList[0].price);
      this.inventory = this.specsList[0].inventory;
      this.detailDescription = res2.description;
      this.commentData = res3.list;
      this.addCartConfig.commodityName = res2.name;
      this.addCartConfig.specsId = this.specsList[0].id;
      this.addCartConfig.specsName = this.specsList[0].name;
      if(res3.list[0]) {
        this.commentDatetime = res3.list[0].commentDatetime;
      }
    }).catch(() => { this.loading = false; });
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
      this.isLogin();
      if(this.specsList.length > 1) {
        this.istoast = true;
        this.isgm = true;
        this.isCartType = '0';
      }else {
        this.addShopCart();
      }
    },
    toBuy() { // 外立即购买
      this.isLogin();
      if(this.specsList.length > 1) {
        this.istoast = true;
        this.isgm = true;
        this.isCartType = '1';
        return;
      }
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
    },
    toShopCart() { // 内加入购物车
      this.isLogin();
      this.addShopCart();
    },
    toShopOrder() { // 内立即购买
      this.isLogin();
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
    },
    isLogin() {
      if(!getUserId()) {
        this.textMsg = '请先登录';
        this.$refs.toast.show();
        setTimeout(() => {
          this.go('login');
        }, 1500);
        return;
      }
    },
    setSpecification() { // 点击规格
      this.istoast = true;
      this.isgm = false;
    },
    specsFn(index, item) { // 选中规格
      this.setIndex = index;
      this.setPrice = formatAmount(item.price);
      this.inventory = item.inventory;
      this.addCartConfig.specsId = item.id;
      this.addCartConfig.specsName = item.name;
      this.setSpecsName = item.name;
    },
    minusShop() { // 商品减
      if(this.shopNum > 1) {
        this.shopNum --;
      }
    },
    addShop() {  // 商品加
      this.shopNum ++;
    },
    addShopCart() { // 加入购物车接口
      this.addCartConfig.quantity = this.shopNum;
      this.loading = true;
      addShopCart(this.addCartConfig).then(data => {
        this.loading = false;
        this.textMsg = '加入购物车成功';
        this.$refs.toast.show();
        setTimeout(() => {
          this.go('/mall-shopCart');
        }, 1500);
      }, () => {
        this.loading = false;
      });
    },
    qrorderFn() { // 确认操作
      if(this.isCartType === '0') { // 加入购物车
        this.addShopCart();
      }
      if(this.isCartType === '1') {  // 立即购买

      }
    }
    // 富文本滚动
    // _refreshScroll() {
    //   setTimeout(() => {
    //     this.$refs.scroll.refresh();
    //     let imgs = this.$refs.description.getElementsByTagName('img');
    //     for (let i = 0; i < imgs.length; i++) {
    //       let _img = imgs[i];
    //       if (_img.complete) {
    //         setTimeout(() => {
    //           this.$refs.scroll.refresh();
    //         }, 20);
    //         continue;
    //       }
    //       _img.onload = () => {
    //         setTimeout(() => {
    //           this.$refs.scroll.refresh();
    //         }, 20);
    //       };
    //     }
    //   }, 20);
    // },
    // watch: {
    //   detailDescription() {
    //     this._refreshScroll();
    //   }
    // }
  },
  mounted() {
  },
  components: {
    FullLoading,
    Toast,
    Scroll
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
  .content {
    overflow: auto;
    font-family: PingFangSC-Regular;
    .shop-head{
      height: 5.3rem;
      background-image: url('./shop.png');
      background-size: 100% 100%;
      padding: 0.4rem 0.3rem;
      .shop-p{
        span{
          display: inline-block;
          width: 0.5rem;
          height: 0.5rem;
          background-size: 100%;
        }
        .fh{
          background-image: url('./fh.png');
        }
        .fx{
          background-image: url('./fx.png');
        }
      }
    }
    .shop-conAll{
      padding: 0 0 1.31rem;
      font-family: PingFangSC-Semibold;
      letter-spacing: 0.0025rem;
      .shop-det{
        background-color: #fff;
        padding: 0.3rem 0.3rem 0;
        margin-bottom: 0.2rem;
        .shop-price{
          font-size: 0.32rem;
          color: #23AD8C;
          letter-spacing: 0.0025px;
          margin-bottom: 0.31rem;
        }
        .shop-msg{
          font-size: 0.32rem;
          color: #333333;
          letter-spacing: 0.0025rem;
          margin-bottom: 0.3rem;
        }
        .or-msg{
          display: flex;
          justify-content: space-between;
          font-size: 0.26rem;
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
              background-color: #23AD8C;
              vertical-align: top;
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
    .description-detail{
      font-size: 0.3rem;
      line-height: 1.8;
      img{
        max-width: 100%;
        vertical-align: bottom;
      }
    }
    .shop-toast{
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 60%;
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
            color: #23AD8C;
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
          justify-content: space-between;
          background: rgba(216,216,216,0.00);
          box-shadow: 0 0.01rem 0 0 #E5E5E5;
          .sing{
            padding: 0 0.5rem;
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
            background-color: #23AD8C;
          }
        }
      }
      .con-foo{
        height: 1.1rem;
        line-height: 1.1rem;
        background: rgba(216,216,216,0.00);
        box-shadow: 0 0.01rem 0 0 #E5E5E5;
        margin-bottom: 0.65rem;
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
        background-color: #23AD8C;
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
          background-color: #23AD8C;
        }
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
              background-image: url('./dp.png');
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
          background-color: #23AD8C;
        }
      }
    }
}
</style>
