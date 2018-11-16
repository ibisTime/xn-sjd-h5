<template>
  <div class="shop-wrapper_det">
    <div class="content">
    <Scroll 
        :data="commentList"
        :hasMore="hasMore"
        @pullingUp="getCommemtDataFn">
      <div class="com-list">
          <div class="com-singer" v-for="(item, index) in commentList" :key="index">
              <div class="sing-head">
                  <div class="s-head_left">
                      <div class="l-img"></div>
                  </div>
                  <div class="s-head_right">
                      <p>{{userMsgList[index].nickname}} <span class="fr">{{formatDate(item.commentDatetime)}}</span></p>
                  </div>
              </div>
              <div class="sing-con" v-html="item.content">
                  
              </div>
              <div class="sing-foo">
                  <div class="s-foo_left">
                      <p>浏览46次</p>
                  </div>
                  <div class="s-foo_right">
                      <p><span class="foo-pl"></span> <span class="pl">评论</span></p>
                      <p><span class="foo-z"></span> <span class="pl">150</span></p>
                  </div>
              </div>
          </div>
      </div>
      <div class="mall-content">
        <no-result v-show="!commentList.length && !hasMore" class="no-result-wrapper" title="暂无评论"></no-result>
      </div>
    </Scroll>
    <div class="shop-foo">
        <div class="foo-left">
            <div class="le-dp" @click="go('mall-store');">
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
    <full-loading v-show="loading" :title="loadingText"></full-loading>
    <toast ref="toast" :text="textMsg"></toast>
  </div>
</template>
<script>
import FullLoading from 'base/full-loading/full-loading';
import Toast from 'base/toast/toast';
import Scroll from 'base/scroll/scroll';
import NoResult from 'base/no-result/no-result';
import { formatAmount, setTitle, formatDate, getUrlParam, formatImg, getUserId } from 'common/js/util';
import { getUser } from 'api/user';
import { getShopDetail, getCommemtData, addShopCart } from 'api/store';
export default {
  data() {
    return {
      istoast: false,
      loading: true,
      isgm: true,
      hasMore: true,
      textMsg: '',
      loadingText: '加载中...',
      code: '',
      shopCode: '',
      shopDetData: {},  // 商品详情
      logistics: {},   // 邮寄方式
      detailDescription: '',
      start: 1,
      config: {      // 评论参数
        start: 1,
        limit: 1,
        commodityCode: '',
        status: 'D'
      },
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
      setSpecsName: '',
      commentList: [],
      userMsgList: []
    };
  },
  created() {
    setTitle('全部评论');
    this.code = getUrlParam('code');
    this.config.commodityCode = this.code;
    this.addCartConfig.commodityCode = this.code;
    this.getCommemtDataFn();
    getShopDetail(this.code).then(data => {
      this.shopDetData = data;
      this.specsList = data.specsList;
      this.bannerPic = data.bannerPic;
      this.shopName = data.shopName;
      this.setPrice = formatAmount(this.specsList[0].price);
      this.inventory = this.specsList[0].inventory;
      this.detailDescription = data.description;
      this.addCartConfig.commodityName = data.name;
      this.addCartConfig.specsId = this.specsList[0].id;
      this.addCartConfig.specsName = this.specsList[0].name;
    });
  },
  methods: {
    formatDate(time) {
      return formatDate(time);
    },
    formatImg(img) {
      return formatImg(img);
    },
    formatAmount(amount) {
      return formatAmount(amount);
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
    getCommemtDataFn() {
      this.config.start = this.start;
      getCommemtData(this.config).then(data => {
        if (data.totalPage <= this.start) {
          this.hasMore = false;
        }
        this.commentList = [...this.commentList, ...data.list];
        this.start ++;
        data.list.forEach(item => {
          getUser(item.userId).then(res => {
            this.userMsgList.push(res);
          });
        });
        this.loading = false;
      }, () => {
        this.loading = false;
      });
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
  },
  components: {
    FullLoading,
    Toast,
    Scroll,
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
    bottom: 0.98rem;
    width: 100%;
    .fl {
        float: left;
    }
    .fr {
        float: right;
    }
    .content {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        overflow: auto;
        font-family: PingFang-SC-Medium;
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
                width: 32%;
                text-align: center;
                height: 0.8rem;
                line-height: 0.7rem;
                color: #666;
                background-color: #EBEBEB;
                font-size: 0.28rem;
                margin-bottom: 0.3rem;
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
    }
}
</style>
