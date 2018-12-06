<template>
  <div class="mall-wrapper" @click.stop>
    <Scroll ref="scroll" :pullUpLoad="pullUpLoad">
        <div class="content">
            <div class="order-head">
                <div class="o-h_left">
                    <span></span>
                </div>
                <div class="o-h_right" @click="toRess">
                    <p>{{defaultSite ? defaultSite.addressee : ''}} <span>{{defaultSite ? defaultSite.mobile : ''}}</span></p>
                    <p class="to-r">{{ressee ? '' : '还没有收货地址哦'}}<span class="fr" v-show="ressee"></span></p>
                    <p>{{ressee ? ressee : ''}}</p>
                </div>
            </div>
            <p class="back-co"></p>
            <div class="sing-order">
                <div class="order-con">
                    <div class="con-head">
                        <p>{{shopMsgList[0].shopName}}</p>
                    </div>
                    <div class="o-c_con" v-for="(orderItem, orderIndex) in shopMsgList" :key="orderIndex">
                        <div class="c-c_left">
                            <div class="c-c_img" :style="getImgSyl(orderItem.listPic ? orderItem.listPic : orderItem.bannerPic ? orderItem.bannerPic[0] : orderItem.commodityPhoto)"></div>
                        </div>
                        <div class="o-c_right">
                            <p class="r-p1">{{orderItem.commodityName}} <span class="fr">×{{orderItem.quantity}}</span></p>
                            <p class="r-p2">规格分类：{{orderItem.specsName}}</p>
                            <p class="r-p3">¥{{setPrice ? formatAmount(setPrice) : formatAmount(orderItem.amount / orderItem.quantity)}}</p>
                        </div>
                    </div>
                </div>
                <p class="back-co"></p>
            </div>
            <div class="order-foo">
                <div class="foo-box01" v-if="shopMsgList.length === 1 && this.shopMsgList[0].setPrice">
                    <div class="box01-left foo-left">
                        购买数量
                    </div>
                    <div class="box01-right">
                        <span class="jian" @click="minusShop"></span>
                        <b>{{shopMsgList[0].quantity}}</b>
                        <span class="jia" @click="addShop"></span>
                    </div>
                </div>
                <div class="foo-box02">
                    <div class="box02-left foo-left">
                        配送方式{{shopMsgList[0].logistics === '1' ? `(邮费:￥${formatAmount(postalFee)})` : ''}}
                    </div>
                    <div class="box02-right">
                        <p>
                            {{logistics[shopMsgList[0].logistics]}}
                        </p>
                    </div>
                </div>
                <div class="foo-box03">
                    <div class="box03-left foo-left">
                        买家留言:
                    </div>
                    <div class="box03-right">
                        <input type="text" v-model="applyNote" placeholder="请输入留言">
                    </div>
                </div>
            </div>
        </div>
    </Scroll>
    <div class="footer">
        <div class="foo-left">
            <p>合计：<span>¥{{totalPrice}}</span></p>
        </div>
        <div class="foo-right" @click="qrorderFn">
            确认购买
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
import { formatAmount, formatImg, formatDate, setTitle, getUserId } from 'common/js/util';
import { getDictList } from 'api/general';
import { getAddressList, getUser } from 'api/user';
import { buyItNow, shopCartOrder, orderPostage } from 'api/store';
export default {
  data() {
    return {
      loading: true,
      textMsg: '',
      dkey: '',
      loadingText: '正在加载中...',
      defaultSite: {},
      userName: '',
      ressee: '',
      shopMsgList: '',
      setPrice: 0,
      singPrice: 0,
      totalPrice: 0,
      logistics: {},
      applyNote: '',
      config: {     // 直接购买下单参数
        applyUser: getUserId(),
        expressType: '',
        specsId: '',
        quantity: '',
        addressCode: '',
        applyNote: ''
      },
      cartConfig: {  // 购物车下单参数
        applyUser: getUserId(),
        applyNote: '',
        expressType: '',
        cartList: [],
        addressCode: ''
      },
      code: '',
      setRess: '',
      postageConfig: {
        addressCode: '',
        commodityCodeList: []
      },
      postalFee: 0,  // 邮费
      inventory: ''
    };
  },
  created() {
    setTitle('确认订单');
    this.pullUpLoad = null;
    this.code = this.$route.query.code;
    sessionStorage.removeItem('storetype');
    this.setRess = JSON.parse(sessionStorage.getItem('setRess')) || '';
    this.inventory = sessionStorage.getItem('inventory');
    this.shopMsgList = JSON.parse(sessionStorage.getItem('shopMsgList'));
    if(!this.shopMsgList) {
      this.go('/mall');
      return;
    }
    this.config.expressType = this.shopMsgList[0].logistics;
    this.cartConfig.expressType = this.shopMsgList[0].logistics;
    this.shopMsgList.forEach(item => {
      if(item.orderCode) {
        this.cartConfig.cartList.push(item.orderCode);
      }else {
        this.cartConfig.cartList.push(item.code);
      }
      this.postageConfig.commodityCodeList.push(item.commodityCode);
      if(item.setPrice) {
        this.totalPrice += item.setPrice * item.quantity;
      }else {
        this.totalPrice += item.amount;
      }
    });
    Promise.all([
      getAddressList(), // 地址
      getUser(),
      getDictList('logistics')
    ]).then(([res1, res2, res3]) => {
      this.loading = false;
      res3.forEach(item => {
        this.logistics[item.dkey] = item.dvalue;
      });
      res1.forEach(item => {
        if(item.isDefault === '1') {
          this.defaultSite = this.setRess || item;
        }else {
          this.defaultSite = this.setRess;
        }
      });
      this.postageConfig.addressCode = this.defaultSite.code;
      if(this.postageConfig.addressCode) {
        orderPostage(this.postageConfig).then(data => {
          this.postalFee = data.postalFee;
          let all = this.totalPrice + this.postalFee;
          this.totalPrice = formatAmount(all);
        });
      }
      this.config.specsId = this.shopMsgList[0].specsId;
      if(this.shopMsgList.length === 1 && this.shopMsgList[0].setPrice) {
        this.setPrice = this.shopMsgList[0].setPrice;
      }
      this.config.addressCode = this.defaultSite.code;
      this.cartConfig.addressCode = this.defaultSite.code;
      this.ressee = this.defaultSite.province + this.defaultSite.city + this.defaultSite.district + this.defaultSite.detailAddress;
    }).catch(() => {
      this.loading = false;
    });
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
    toRess() {
      this.go('/address');
      sessionStorage.setItem('toBank', '/affirm-order?code=' + this.code);
      sessionStorage.setItem('storetype', 'store');
    },
    addCart() {
      this.go('/mall-shopCart');
    },
    toShopDet() {
      this.go('/mall-shop_detail');
    },
    tomore() {
      this.isAll = true;
    },
    minusShop() {
      if(this.shopMsgList[0].quantity > 1) {
        this.shopMsgList[0].quantity --;
        this.singPriceFn();
      }
    },
    addShop() {
      this.shopMsgList[0].quantity ++;
      if(this.inventory) {
        if(this.shopMsgList[0].quantity > parseInt(this.inventory)) {
          this.textMsg = '规格库存不足';
          this.$refs.toast.show();
          this.shopMsgList[0].quantity --;
        }
      }
      this.singPriceFn();
    },
    singPriceFn() {
      this.singPrice = this.setPrice * this.shopMsgList[0].quantity;
      this.totalPrice = formatAmount(this.singPrice + this.postalFee);
    },
    qrorderFn() {
      if(!this.ressee) {
        this.textMsg = '请选择地址';
        this.$refs.toast.show();
        return;
      }
      if(this.shopMsgList.length === 1 && this.shopMsgList[0].orderCode || this.shopMsgList[0].setPrice) {
        this.buyItNow();
      }else {
        this.shopCartOrder();
      }
    },
    buyItNow() { // 下单（单店铺）
      this.loading = true;
      this.config.applyNote = this.applyNote;
      this.config.quantity = this.shopMsgList[0].quantity;
      buyItNow(this.config).then(data => {
        this.loading = false;
        this.textMsg = '下单成功';
        this.$refs.toast.show();
        sessionStorage.setItem('totalPrice', this.totalPrice);
        setTimeout(() => {
          this.go('/pay?code=' + data.code + '&storeType=one');
        }, 1500);
      }, () => {
        this.loading = false;
      });
    },
    shopCartOrder() {   // 购物车下单
      this.loading = true;
      this.cartConfig.applyNote = this.applyNote;
      shopCartOrder(this.cartConfig).then(data => {
        this.loading = false;
        this.textMsg = '下单成功';
        this.$refs.toast.show();
        sessionStorage.setItem('totalPrice', this.totalPrice);
        setTimeout(() => {
          this.go('/pay?code=' + data.code + '&storeType=more');
        }, 1500);
      }, () => {
        this.loading = false;
      });
    }
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
.mall-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0.98rem;
  width: 100%;
  height: 100%;
  padding-bottom: 1rem;
  background-color: #fff;
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .content {
    overflow: auto;
    padding-bottom: 0.2rem;
    font-family: PingFangSC-Regular;
    .back-co{
        height: 0.2rem;
        background-color: #f5f5f5;
    }
    .order-head{
        display: flex;
        height: 1.6rem;
        background-color: #fff;
        padding: 0.3rem 0.3rem 0.3rem 0.2rem;
        box-shadow: 0 0.01rem 0 0 #EBEBEB;
        .o-h_left{
            position: relative;
            width: 1rem;
            height: 100%;
            span{
                position: absolute;
                left: 0%;
                top: 50%;
                transform: translateY(-50%);
                display: inline-block;
                width: 0.6rem;
                height: 0.6rem;
                background-image: url('./dz.png');
                background-size: 100% 100%;
            }
        }
        .o-h_right{
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            align-content: space-around;
            font-family: PingFang-SC-Medium;
            font-size: 0.28rem;
            color: #333333;
            p{
                width: 100%;
                span{
                    color: #999;
                    margin-left: 0.3rem;
                }
            }
            .to-r{
                height: 0.22rem;
                span{
                    display: inline-block;
                    width: 0.22rem;
                    height: 0.22rem;
                    background-size: 100% 100%;
                    background-image: url('./tz.png');
                }
            }
        }
    }
    .order-con{
        padding: 0 0.3rem 0 0.2rem;
        .con-head{
            height: 0.8rem;
            line-height: 0.8rem;
            background: rgba(224,187,187,0.00);
            box-shadow: 0 0.01rem 0 0 #EBEBEB;
            font-family: PingFang-SC-Medium;
            font-size: 0.26rem;
            color: #333333;
            letter-spacing: 0.002rem;
        }
        .o-c_con{
            padding: 0.32rem 0 0.28rem;
            display: flex;
            .c-c_left{
                width: 1.6rem;
                height: 1.6rem;
                .c-c_img{
                    width: 100%;
                    height: 100%;
                    background-image: url('./shop.png');
                    background-size: 100% 100%;
                }
            }
            .o-c_right{
                width: 84%;
                padding-left: 0.2rem;
                display: flex;
                align-content: space-around;
                flex-wrap: wrap;
                p{
                    width: 100%;
                    font-size: 0.32rem;
                    font-family: PingFang-SC-Medium;
                }
                .r-p1{
                    color: #333333;
                    letter-spacing: 0.0025rem;
                    span{
                        font-size: 0.3rem;
                        color: #999999;
                        letter-spacing: 0.0023rem;
                    }
                }
                .r-p2{
                    font-size: 0.26rem;
                    color: #999999;
                    letter-spacing: 0.002rem;
                }
                .r-p3{
                    font-family: DIN-Bold;
                    color: #151515;
                    letter-spacing: 0.0023rem;
                }
            }
        }
    }
    .order-foo{
        padding: 0 0.3rem 0 0.2rem;
        font-family: PingFang-SC-Medium;
        .foo-left{
            font-size: 0.3rem;
            color: #2D2D2D;
            letter-spacing: 0.0022rem;
        }
        .foo-box01{
            height: 1.2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(216,216,216,0.00);
            box-shadow: 0 0.01rem 0 0 #EBEBEB;
            .box01-right{
                span{
                    display: inline-block;
                    width: 0.36rem;
                    height: 0.36rem;
                    vertical-align: middle;
                    background-size: 100% 100%;
                }
                b{
                    font-size: 0.26rem;
                    vertical-align: middle;
                }
                .jia{
                    background-image: url('./jia.png');
                }
                .jian{
                    background-image: url('./jian.png');
                }
            }
        }
        .foo-box02{
            height: 1.2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(216,216,216,0.00);
            box-shadow: 0 0.02rem 0 0 #EBEBEB;
            .box02-right{
                width: 30%;
                text-align: right;
                font-size: 0.3rem;
                color: #2D2D2D;
                letter-spacing: 0.0022rem;
                span{
                    display: inline-block;
                    width: 0.22rem;
                    height: 0.22rem;
                    background-image: url('./tz.png');
                    background-size: 100% 100%;
                }
            }
        }
        .foo-box03{
            height: 1.2rem;
            display: flex;
            align-items: center;
            background: rgba(216,216,216,0.00);
            box-shadow: 0 0.01rem 0 0 #EBEBEB;
            .box03-right{
                width: 81%;
                height: 0.6rem;
                padding-left: 0.2rem;
                box-sizing: border-box;
                overflow: hidden;
                input{
                    vertical-align: top;
                    width: 100%;
                    height: 100%;
                    padding: 0.1rem;
                    font-family: PingFang-SC-Medium;
                    font-size: 0.28rem;
                    color: #2D2D2D;
                    letter-spacing: 0.0022rem;
                }
            }
        }
    }
  }
  .footer{
        position: fixed;
        bottom: 0;
        z-index: 9999;
        width: 100%;
        height: 1.2rem;
        box-shadow: 0 -1px 0 0 #DBDBDB;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 0.3rem;
        font-family: PingFangSC-Medium;
        letter-spacing: 0.0027rem;
        background-color: #fff;
        .foo-left{
            font-size: 0.28rem;
            color: #666666;
            span{
                color: #23AD8C;
            }
        }
        .foo-right{
            font-size: 0.36rem;
            color: #FFFFFF;
            width: 2.6rem;
            height: 0.9rem;
            line-height: 0.9rem;
            text-align: center;
            border-radius: 0.12rem;
            background-color: #23AD8C;
        }
    }
}
</style>
