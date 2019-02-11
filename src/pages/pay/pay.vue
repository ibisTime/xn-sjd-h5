<template>
  <div class="me-wrapper full-screen-wrapper">
    <div class="bg">
      <m-header class="cate-header" title="支付订单"></m-header>
      <div class="content">
        <Scroll :pullUpLoad="pullUpLoad" ref="scroll">
          <div class="detail">
            <!--<img :src="formatImg(orderDetail.product.listPic)">-->
            <!--<div class="detail-text">-->
              <!--<div class="detail-text-top">-->
                <!--<span class="name">{{orderDetail.product.name}}</span>-->
                <!--<span class="number">x{{orderDetail.quantity}}</span>-->
              <!--</div>-->
              <!--<div class="detail-text-middle">{{orderDetail.product.city}} {{orderDetail.product.city}}</div>-->
              <!--<div class="detail-text-bottom">-->
                <!--<span class="specs">规格:{{orderDetail.productSpecsName}}</span>-->
                <!--<span class="price">¥{{formatAmount(orderDetail.price)}}</span>-->
              <!--</div>-->
            <!--</div>-->
            <div class="info" v-if="!storeCode">
              <div class="imgWrap" :style="getImgSyl(orderDetail.product.listPic)"></div>
              <div class="text">
                <p class="title"><span class="title-title">{{orderDetail.product.name}}</span><span class="title-number">x{{orderDetail.quantity}}</span></p>
                <p class="position"><span>{{orderDetail.product.city}} {{orderDetail.product.city}}</span><span class="price">¥{{formatAmount(orderDetail.price)}}</span></p>
                <div class="props"><span class="duration">规格：{{orderDetail.productSpecsName}}</span><span class="price">¥{{formatAmount(orderDetail.amount)}}</span></div>
              </div>
            </div>
            <div class="info" v-if="storeCode && (storeType === 'one' || type === 'one')" v-for="item in orderDetail.detailList">
              <div class="imgWrap" :style="getImgSyl(item.listPic)"></div>
              <div class="text">
                <p class="title"><span class="title-title">{{item.commodityName}}</span><span class="title-number">x{{orderDetail.quantity}}</span></p>
                <!--<p class="position"><span class="price">¥{{formatAmount(item.price)}}</span></p>-->
                <div class="props"><span class="duration">规格：{{item.specsName}}</span><span class="price">¥{{formatAmount(item.price)}}</span></div>
              </div>
            </div>
            <div class="mall-info" v-if="storeCode && (storeType === 'more' || type === 'more')" v-for="item in orderDetail">
              <div class="sing-head">
                <span class="sp-name">{{item.shop.name}}</span>
              </div>
              <div class="sing-con" v-for="(coItem, singIndex) in item.commodityOrderDetails" :key="singIndex">
                <div class="con-right">
                  <div class="r-left" :style="getImgSyl(coItem.listPic ? coItem.listPic : '')"></div>
                  <div class="r-con">
                    <div class="rr-head">{{coItem.commodity.name}} <span class="fr num">x{{coItem.quantity}}</span></div>
                    <div class="rr-con"><span>规格分类：{{coItem.specsName}}</span><span>¥{{formatAmount(coItem.price)}}</span></div>
                    <!--<div class="rr-price"></div>-->
                  </div>
                </div>
              </div>
            </div>
            <div class="gray"></div>
          </div>
          <div class="identifyCode" v-show="identifyCode">
            下单识别码：{{identifyCode}}
            <span>(可在订单页面查看)</span>
          </div>
          <div class="pay-type">
            <p>支付方式</p>
            <div class="pay-type-list">
              <div @click="selectPayType(1)" :style="{ opacity: isWeixin && showWeixin ? '1' : '0.1' }">
                <img src="./wechat@2x.png">
                <div class="text">
                  <p>微信</p>
                </div>
                <img class="money fr" src="./choosed@2x.png" v-show="wechat">
                <img class="money fr" src="./unchoosed@2x.png" v-show="!wechat">
              </div>
              <div @click="selectPayType(2)">
                <img src="./alipay@2x.png">
                <div class="text">
                  <p>支付宝</p>
                </div>
                <img class="money fr" src="./choosed@2x.png" v-show="alipay">
                <img class="money fr" src="./unchoosed@2x.png" v-show="!alipay">
              </div>
              <div @click="selectPayType(3)">
                <img src="./balance@2x.png">
                <div class="text">
                  <p>余额支付（剩余¥{{formatAmount(cny)}}）</p>
                </div>
                <img class="money fr" src="./choosed@2x.png" v-show="balance">
                <img class="money fr" src="./unchoosed@2x.png" v-show="!balance">
              </div>
            </div>
          </div>
        </Scroll>
        <!--<div class="gray"></div>-->
        <!--<div class="score" v-show="!jishou">-->
          <!--<p>积分抵扣</p>-->
          <!--<div class="info-item">使用{{formatAmount(rate.jfAmount)}}积分抵扣{{formatAmount(rate.cnyAmount)}}元（剩余{{formatAmount(jf)}}积分）-->
            <!--<div class="label">-->
              <!--<switch-option class="option" :value="isPublish" @update:value="updatePublish"></switch-option>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="score-rules" v-if="type">-->
          <!--<p>规则：</p>-->
          <!--<p v-for="(item, index) in sysConfig" :key="index">{{index+1}}.{{item.remark}}:{{item.cvalue}}</p>-->
        <!--</div>-->
      </div>
      <div class="footer">
        <span>金额：<span v-if="totalPrice">
          {{isPublish ? formatAmount(totalPrice - rate.cnyAmount) :
          formatAmount(totalPrice)}}
        </span>
        <span v-if="!totalPrice">
          {{isPublish ? formatAmount(amount - rate.cnyAmount) :
          formatAmount(amount)}}
        </span>
          <span>元</span></span>
        <button class="fr" @click="pay">支付</button>
      </div>
    </div>
    <confirm-input ref="confirmInput" :inpType="'password'" :text="inputText" @confirm="handleInputConfirm"></confirm-input>
    <toast ref="toast" :text="text"></toast>
    <full-loading v-show="loading" :title="loadingText"></full-loading>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import SwitchOption from 'base/switch-option/switch-option';
  import Toast from 'base/toast/toast';
  import ConfirmInput from 'base/confirm-input/confirm-input';
  import FullLoading from 'base/full-loading/full-loading'; // loading
  import { getCookie } from 'common/js/cookie';
  import { formatAmount, setTitle, getUserId, formatImg } from 'common/js/util';
  import { getOrderDetail, getAccount, payOrder, payOrganizeOrder, getOrganizeOrderDetail, getDeductibleAmount, getOrganizeOrderScore,
            getPreOrderDetail, payPreOrder, getJishouOrderDetail, payJishouOrder, preOrderScore} from 'api/biz';
  import { getUserDetail } from 'api/user';
  import { getConfigPage } from 'api/general';
  import { payOneOrder, payMoreOrder, getStoreDeductible, getMoreDeductible, moreStoreOrder, getMallOrderDetailByGroupCode } from 'api/store';         // 商城
  import { initPay } from 'common/js/weixin';
  import defaultImg from './tree@3x.png';

  export default {
    data() {
      return {
        loading: false,
        loadingText: '正在载入...',
        text: '',
        wechat: true,    // 微信支付
        alipay: false,   // 支付宝支付
        balance: false,  // 余额支付
        isPublish: false,
        cny: 0,
        jf: 0,
        amount: 0,
        rate: 0,
        inputText: '',
        sysConfig: [],
        identifyCode: '',
        pre: false,
        jishou: false,
        storeCode: '',
        storeType: '',
        config: {          // 商城订单支付参数
          code: '',
          payType: '5',
          updater: getUserId(),
          remark: '',
          isJfDeduct: '0'
        },
        moreConfig: {    // 购物车下单支付参数
          payGroup: '',
          payType: '5',
          tradePwd: '',
          isJfDeduct: '',
          remark: ''
        },
        totalPrice: '',        // 商品订单总额
        type: '',
        showWeixin: true,
        isWeixin: true,
        shopMsgList: [],
        orderDetail: {
          product: {
            listPic: ''
          }
        },
        pullUpLoad: null
      };
    },
    mounted() {
      setTitle('支付订单');
      let ua = navigator.userAgent.toLowerCase();
      this.isWeixin = ua.indexOf('micromessenger') !== -1;
      this.orderCode = this.$route.query.orderCode;
      this.type = this.$route.query.type;
      this.pre = this.$route.query.pre;
      this.jishou = this.$route.query.jishou;
      this.userId = getCookie('userId');
      this.shopMsgList = JSON.parse(sessionStorage.getItem('shopMsgList'));
      if(!this.orderCode) {
        this.totalPrice = this.shopMsgList[0].payAmount ? Number(this.shopMsgList[0].payAmount) : Number(sessionStorage.getItem('totalPrice')) * 1000;
      }
      this.storeCode = this.$route.query.code;             // 商城订单code
      this.storeType = this.$route.query.storeType;        // 商城类型：one为直接购买，more为购物车下单
      this.config.code = this.storeCode;
      this.moreConfig.payGroup = this.storeCode;
      if(this.storeCode) {
        this.loading = true;
        getUserDetail({userId: this.userId}).then(data => {
          this.userDetail = data;
          this.loading = false;
          if(!this.isWeixin || !this.userDetail.h5OpenId) {
            this.selectPayType(2);
            this.showWeixin = false;
          }
        });
        getAccount({userId: this.userId}).then(data => {
          data.list.map((item) => {
            if(item.currency === 'CNY') {
              this.cny = item.amount;
            }
            if(item.currency === 'JF') {
              this.jf = item.amount;
            }
          });
        });
        if(this.storeType === 'more') {
          // 购物车下单
          getMoreDeductible(this.storeCode).then(data => {
            this.rate = data;
          }, () => {});
          getMallOrderDetailByGroupCode(this.storeCode).then((res) => {
            this.orderDetail = res;
          }).catch(() => {});
        }else {
          // 直接购买下单
          getStoreDeductible(this.storeCode).then(data => {
            this.rate = data;
          }, () => {});
          moreStoreOrder(this.storeCode).then((res) => {
            this.orderDetail = res;
          }).catch(() => {});
        }
        this.getConfig();
        return;
      }
      if(this.pre) {
        this.getPreInitData();
      } else if(this.jishou) {
        this.getJishouInitData();
      } else {
        this.getInitData();
      }
    },
    methods: {
      error() {
        this.loading = false;
        this.text = '支付失败！';
        this.$refs.toast.show();
      },
      success() {
        this.paySuccess();
      },
      formatAmount(amount) {
        return formatAmount(amount);
      },
      getImgSyl(imgs) {
        let img = imgs ? formatImg(imgs) : defaultImg;
        return {
          backgroundImage: `url(${img})`
        };
      },
      go(url) {
        this.$router.push(url);
      },
      getInitData() {
        this.loading = true;
        if(this.orderCode[0] === 'G') {
          // 集体订单
          Promise.all([
            getOrganizeOrderDetail({
              code: this.orderCode
            }),
            getAccount({
              userId: this.userId
            }),
            getOrganizeOrderScore(this.orderCode),
            getUserDetail({userId: this.userId})
          ]).then(([res1, res2, res3, res4]) => {
            this.orderDetail = res1;
            this.identifyCode = res1.identifyCode;
            this.amount = res1.amount;
            this.rate = res3;
            res2.list.map((item) => {
              if(item.currency === 'CNY') {
                this.cny = item.amount;
              }
              if(item.currency === 'JF') {
                this.jf = item.amount;
              }
            });
            this.userDetail = res4;
            if(!this.isWeixin || !this.userDetail.h5OpenId) {
              this.selectPayType(2);
              this.showWeixin = false;
            }
            this.getConfig();
            this.loading = false;
          }).catch(() => { this.loading = false; });
        } else {
          // 非集体订单
          Promise.all([
            getOrderDetail({
              code: this.orderCode
            }),
            getAccount({
              userId: this.userId
            }),
            getDeductibleAmount(this.orderCode),
            getUserDetail({userId: this.userId})
          ]).then(([res1, res2, res3, res4]) => {
            this.orderDetail = res1;
            this.amount = res1.amount;
            this.rate = res3;
            res2.list.map((item) => {
              if(item.currency === 'CNY') {
                this.cny = item.amount;
              }
              if(item.currency === 'JF') {
                this.jf = item.amount;
              }
            });
            this.userDetail = res4;
            if(!this.isWeixin || !this.userDetail.h5OpenId) {
              this.selectPayType(2);
              this.showWeixin = false;
            }
            this.getConfig();
            this.loading = false;
          }).catch(() => { this.loading = false; });
        }
      },
      getPreInitData() {
        this.loading = true;
        Promise.all([
          getPreOrderDetail({
            code: this.orderCode
          }),
          getAccount({
            userId: this.userId
          }),
          getUserDetail({userId: this.userId}),
          preOrderScore({ code: this.orderCode })
        ]).then(([res1, res2, res3, res4]) => {
          this.orderDetail = res1;
          this.amount = res1.amount;
          res2.list.map((item) => {
            if(item.currency === 'CNY') {
              this.cny = item.amount;
            }
            if(item.currency === 'JF') {
              this.jf = item.amount;
            }
          });
          this.userDetail = res3;
          if(!this.isWeixin || !this.userDetail.h5OpenId) {
            this.selectPayType(2);
            this.showWeixin = false;
          }
          this.rate = res4;
          this.getConfig();
          this.loading = false;
        }).catch(() => { this.loading = false; });
      },
      getJishouInitData() {
        this.loading = true;
        Promise.all([
          getJishouOrderDetail({
            code: this.orderCode
          }),
          getAccount({
            userId: this.userId
          }),
          getUserDetail({userId: this.userId})
        ]).then(([res1, res2, res3]) => {
          this.orderDetail = res1;
          this.amount = res1.amount;
          res2.list.map((item) => {
            if(item.currency === 'CNY') {
              this.cny = item.amount;
            }
            if(item.currency === 'JF') {
              this.jf = item.amount;
            }
          });
          this.userDetail = res3;
          if(!this.isWeixin || !this.userDetail.h5OpenId) {
            this.selectPayType(2);
            this.showWeixin = false;
          }
          this.loading = false;
        }).catch(() => { this.loading = false; });
      },
      selectPayType(index) {
        if(index === 1) {
          if(this.isWeixin && this.showWeixin) {
            this.wechat = true;
            this.alipay = false;
            this.balance = false;
            this.config.payType = '5';
            this.moreConfig.payType = '5';
          } else {
            return;
          }
        } else if(index === 2) {
          this.wechat = false;
          this.alipay = true;
          this.balance = false;
          this.config.payType = '3';
          this.moreConfig.payType = '3';
        } else if(index === 3) {
          this.wechat = false;
          this.alipay = false;
          this.balance = true;
          this.config.payType = '1';
          this.moreConfig.payType = '1';
        }
      },
      updatePublish(val) {
        this.isPublish = val;
      },
      pay() {
        this.payType = this.wechat ? '5' : this.alipay ? '3' : '1';
        if((this.payType === '1' || this.config.payType === '1' || this.moreConfig.payType === '1') && !this.userDetail.tradepwdFlag) {
          this.text = '请先去设置支付密码';
          this.$refs.toast.show();
          setTimeout(() => {
            this.$router.push('/set-money');
          }, 1000);
        } else {
          if(this.payType === '1' || this.config.payType === '1' || this.moreConfig.payType === '1') {
            this.inputText = '支付密码';
            // this.curItem = item;
            this.$refs.confirmInput.show();
          } else {
            if(this.storeCode) {
              if(this.isPublish) {
                this.config.isJfDeduct = '1';
                this.moreConfig.isJfDeduct = '1';
              }
              if(this.storeType === 'more') {
                payMoreOrder(this.moreConfig).then(data => {
                  if(this.wechat) {
                    let wxConfig = {
                      appId: data.appId, // 公众号名称，由商户传入
                      timeStamp: data.timeStamp, // 时间戳，自1970年以来的秒数
                      nonceStr: data.nonceStr, // 随机串
                      wechatPackage: data.wechatPackage,
                      signType: data.signType, // 微信签名方式：
                      paySign: data.paySign // 微信签名
                    };
                    initPay(wxConfig, this.success, this.error, this.cancel);
                  }else {
                    this._alipay(data);
                  }
                });
              }else {
                payOneOrder(this.config).then(data => {
                  if(this.wechat) {
                    let wxConfig = {
                      appId: data.appId, // 公众号名称，由商户传入
                      timeStamp: data.timeStamp, // 时间戳，自1970年以来的秒数
                      nonceStr: data.nonceStr, // 随机串
                      wechatPackage: data.wechatPackage,
                      signType: data.signType, // 微信签名方式：
                      paySign: data.paySign // 微信签名
                    };
                    initPay(wxConfig, this.success, this.error, this.cancel);
                  }else {
                    this._alipay(data);
                  }
                });
              }
              return;
            }
            if(this.pre) {
              this.payPreOrder();
            } else if(this.jishou) {
              this.payJishouOrder();
            } else {
              this.payOrder();
            }
          }
        }
      },
      // 支付订单
      payOrder() {
        let isJfDeduct = this.isPublish ? 1 : 0;
        this.loading = true;
        if(this.orderCode[0] === 'G') {
          // 集体订单
          payOrganizeOrder({
            code: this.orderCode,
            payType: this.payType,
            isJfDeduct: isJfDeduct,
            tradePwd: this.pwd || ''
          }).then((res) => {
            this.loading = false;
            if(res) {
              if(this.payType === '3' && res.signOrder) {
                this._alipay(res);
              } else if(this.payType === '5') {
                let wxConfig = {
                  appId: res.appId, // 公众号名称，由商户传入
                  timeStamp: res.timeStamp, // 时间戳，自1970年以来的秒数
                  nonceStr: res.nonceStr, // 随机串
                  wechatPackage: res.wechatPackage,
                  signType: res.signType, // 微信签名方式：
                  paySign: res.paySign // 微信签名
                };
                initPay(wxConfig, this.success, this.error, this.cancel);
              } else {
                this.paySuccess();
              }
            }
          }).catch(() => {
            this.loading = false;
          });
        } else {
          // 非集体订单
          payOrder({
            code: this.orderCode,
            payType: this.payType,
            isJfDeduct: isJfDeduct,
            tradePwd: this.pwd || ''
          }).then((res) => {
            this.loading = false;
            if(res) {
              if(this.payType === '3' && res.signOrder) {
                this._alipay(res);
              } else if(this.payType === '5') {
                let wxConfig = {
                  appId: res.appId, // 公众号名称，由商户传入
                  timeStamp: res.timeStamp, // 时间戳，自1970年以来的秒数
                  nonceStr: res.nonceStr, // 随机串
                  wechatPackage: res.wechatPackage,
                  signType: res.signType, // 微信签名方式：
                  paySign: res.paySign // 微信签名
                };
                initPay(wxConfig, this.success, this.error, this.cancel);
              } else {
                this.paySuccess();
              }
            }
          }).catch(() => {
            this.loading = false;
          });
        }
      },
      // 支付预售订单
      payPreOrder() {
        this.loading = true;
        let isJfDeduct = this.isPublish ? 1 : 0;
        payPreOrder({
          code: this.orderCode,
          payType: this.payType,
          isJfDeduct: isJfDeduct,
          tradePwd: this.pwd || ''
        }).then((res) => {
          this.loading = false;
          // alert(JSON.stringify(res));
          if(res) {
            if(this.payType === '3' && res.signOrder) {
              this._alipay(res);
            } else if(this.payType === '5') {
              let wxConfig = {
                appId: res.appId, // 公众号名称，由商户传入
                timeStamp: res.timeStamp, // 时间戳，自1970年以来的秒数
                nonceStr: res.nonceStr, // 随机串
                wechatPackage: res.wechatPackage,
                signType: res.signType, // 微信签名方式：
                paySign: res.paySign // 微信签名
              };
              initPay(wxConfig, this.success, this.error, this.cancel);
            } else {
              this.paySuccess();
            }
          }
        }).catch(() => {
          this.loading = false;
        });
      },
      // 支付寄售订单
      payJishouOrder() {
        payJishouOrder({
          code: this.orderCode,
          payType: this.payType,
          tradePwd: this.pwd || ''
        }).then((res) => {
          this.loading = false;
          if(res) {
            if(this.payType === '3' && res.signOrder) {
              this._alipay(res);
            } else if(this.payType === '5') {
              let wxConfig = {
                appId: res.appId, // 公众号名称，由商户传入
                timeStamp: res.timeStamp, // 时间戳，自1970年以来的秒数
                nonceStr: res.nonceStr, // 随机串
                wechatPackage: res.wechatPackage,
                signType: res.signType, // 微信签名方式：
                paySign: res.paySign // 微信签名
              };
              initPay(wxConfig, this.success, this.error, this.cancel);
            } else {
              this.paySuccess();
            }
          }
        }).catch(() => {
          this.loading = false;
        });
      },
      _alipay(res) {
        this.text = '正在跳转支付宝...';
        this.$refs.toast.show();
        sessionStorage.removeItem('shopMsgList');
        setTimeout(() => {
          location.href = res.signOrder;
        }, 1000);
      },
      paySuccess() {
        this.text = '支付成功';
        this.$refs.toast.show();
        if(this.pre) {
          setTimeout(() => {
            this.$router.push(`/booking-order`);
          }, 1000);
        } else if(this.jishou) {
          setTimeout(() => {
            this.$router.push(`/me`);
          }, 1000);
        } else {
          setTimeout(() => {
            this.$router.push(`/my-order?type=${this.type}`);
          }, 1000);
        }
      },
      // 输入支付密码后点击确定执行的方法
      handleInputConfirm(text) {
        this.pwd = text;
        if(!this.pwd) {
          this.text = '请填写支付密码';
          this.$refs.toast.show();
          this.inputText = '支付密码';
          this.$refs.confirmInput.show();
        } else {
          if(this.storeCode) {
            this.loading = true;
            this.config.tradePwd = this.pwd;
            this.moreConfig.tradePwd = this.pwd;
            this.loadingText = '正在支付...';
            if(this.isPublish) {
              this.config.isJfDeduct = '1';
              this.moreConfig.isJfDeduct = '1';
            }
            if(this.storeType === 'more') {
              payMoreOrder(this.moreConfig).then(data => {
                this.loading = false;
                this.text = '支付成功';
                this.$refs.toast.show();
                sessionStorage.removeItem('totalPrice');
                sessionStorage.removeItem('shopMsgList');
                setTimeout(() => {
                  this.$router.push(`/store-order`);
                }, 1500);
              }, (err) => {
                this.loading = false;
                if(err === '当前订单不是待支付状态') {
                  setTimeout(() => {
                    this.$router.push('/mall');
                  }, 1200);
                }
              });
            }else {
              payOneOrder(this.config).then(data => {
                this.loading = false;
                this.text = '支付成功';
                this.$refs.toast.show();
                sessionStorage.removeItem('totalPrice');
                sessionStorage.removeItem('shopMsgList');
                setTimeout(() => {
                  this.$router.push(`/store-order`);
                }, 1500);
              }, (err) => {
                this.loading = false;
                if(err === '当前订单不是待支付状态') {
                  setTimeout(() => {
                    this.$router.push('/mall');
                  }, 1200);
                }
              });
            }
            return;
          }
          if(this.pre) {
            this.payPreOrder();
          } else if(this.jishou) {
            this.payJishouOrder();
          } else {
            this.payOrder();
          }
        }
      },
      getConfig() {
        this.ckey = '';
        if(this.orderCode) {
          if(this.pre) {
            this.ckey = 'PRESELL_DK_RATE';
          } else {
            this.ckey = 'ADOPT_DK_RATE';
          }
        }
        getConfigPage({
          start: 1,
          limit: 100,
          type: 'JF_RULE',
          ckey: this.ckey
        }).then(data => {
          // this.sysConfig = data.list;
          this.sysConfig.push({
            remark: `使用${data.list[0].cvalue}积分抵扣1元`,
            cvalue: ''
          });
          if(this.orderCode) {
            this.sysConfig.push({
              remark: '该产品最大积分抵扣上限',
              cvalue: `${this.orderDetail.product.maxJfdkRate}%`
            });
          }
        });
      }
    },
    components: {
      Scroll,
      MHeader,
      SwitchOption,
      Toast,
      ConfirmInput,
      FullLoading
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  .me-wrapper {
    background: #fff;
    .fl {
      float: left;
    }
    .fr {
      float: right;
    }
    .bg {
      .title {
        font-size: 0.36rem;
        color: #fff;
        padding-top: 0.19rem;
        text-align: center;
      }
      .content {
        padding: 0;
        margin-bottom: 0.98rem;
        background: #f5f5f5;
        position: absolute;
        top: 0.8rem;
        bottom: 0;
        left: 0;
        right: 0;
        overflow: auto;
        div {
          padding: 0 0.3rem;
          background: #ffffff;
        }
        .scroll-content {
          padding: 0;
        }
        .detail {
          width: 100%;
          /*height: 2.3rem;*/
          font-size: $font-size-medium-x;
          line-height: 1.1rem;
          border-bottom: 1px solid #eee;
          /*display: flex;*/
          /*align-items: center;*/
          .info {
            display: flex;
            align-items: center;
            font-size: 0;
            padding: 0.3rem 0;
            .imgWrap {
              width: 1.5rem;
              height: 1.5rem;
              flex: 0 0 1.5rem;
              margin-right: 0.2rem;
              border-radius: 0.08rem;
              position: relative;
              overflow: hidden;
              background-repeat: no-repeat;
              background-position: center;
              background-size: cover;
            }
            .text {
              display: flex;
              flex-direction: column;
              width: 100%;
              padding: 0;
              .title {
                font-size: 0.3rem;
                line-height: 0.42rem;
                margin-bottom: 0.17rem;
                display: flex;
                justify-content: space-between;
                flex: 1;
                color: $color-text;
              }
              .position {
                font-size: 0.24rem;
                line-height: 0.33rem;
                color: #999;
                margin-bottom: 0.25rem;
                display: flex;
                justify-content: space-between;
              }
              .props {
                font-size: $font-size-small;
                line-height: 0.33rem;
                color: #999;
                display: flex;
                justify-content: space-between;
                padding: 0;
                .price {
                  font-family: DIN-Bold;
                  font-size: $font-size-medium-x;
                  color: #151515;
                }
              }
            }
          }
          .mall-info {
            padding: 0;
            background-color: #fff;
            .sing-head{
              height: 0.8rem;
              line-height: 0.9rem;
              font-size: 0.26rem;
              padding: 0;
              >span{
                display: inline-block;
                vertical-align: middle;
              }
              .sp-name{
                color: #333;
                b{
                  color: #979797;
                  font-weight: 400;
                }
              }
              .clr{
                color: #999;
                letter-spacing: 0.002rem;
              }
            }
            .sing-con{
              display: flex;
              font-size: 0.32rem;
              padding: 0.3rem 0 0.2rem;
              border-top: 0.01rem solid #EBEBEB;
              margin: 0;
              .con-left{
                height: 1.5rem;
                line-height: 1.5rem;
                width: 0.91rem;
              }
              .con-right{
                display: flex;
                letter-spacing: 0.0025rem;
                padding: 0;
                width: 100%;
                .r-left{
                  width: 2rem;
                  height: 1.5rem;
                  margin-right: 0.2rem;
                  background-image: url('./shop.png');
                  background-position: center;
                  background-size: cover;
                }
                .r-con{
                  display: flex;
                  align-content: space-between;
                  flex-wrap: wrap;
                  line-height: 0.5rem;
                  padding: 0;
                  flex: 1;
                  >div{
                    width: 100%;
                  }
                  .rr-head{
                    color: #333;
                    padding: 0;
                    .num{
                      color: #999;
                      font-size: 0.24rem;
                    }
                  }
                  .rr-con{
                    font-size: 0.26rem;
                    color: #999;
                    display: flex;
                    justify-content: space-between;
                    padding: 0;
                    .status {
                      color: $second-color;
                    }
                  }
                  .rr-price{
                    font-family: DIN-Bold;
                    color: #151515;
                    .bot{
                      color: #333;
                      font-size: 0.24rem;
                      font-family: PingFang-SC-Heavy;
                      span{
                        display: inline-block;
                        width: 0.36rem;
                        height: 0.36rem;
                        line-height: 0.36rem;
                        vertical-align: middle;
                        background-size: 100%;
                        text-align: center;
                      }
                      .jia{
                        background-image: url('./jia.png');
                      }
                      .jian{
                        background-image: url('./jian.png');
                      }
                    }
                  }
                }
              }
            }
          }
          .btns {
            padding: 0.18rem 0.3rem;
            border-top: 1px solid $color-border;

            .btn {
              font-size: 0.26rem;
              display: inline-block;
              margin-left: 0.2rem;
              padding: 0 0.2rem;
              height: 0.6rem;
              line-height: 0.6rem;
              border: 1px solid $primary-color;
              border-radius: 0.06rem;
              color: $primary-color;
              confirm-wrapper
              &.cancel {
                border-color: #ccc;
                color: $color-text-l;
              }
            }
          }
        }
        .identifyCode {
          font-size: 0.3rem;
          line-height: 1.1rem;
          border-bottom: 1px solid $color-border;
          /*padding-bottom: 0.2rem;*/
        }
        .pay-type {
          padding-top: 0.2rem;
          p {
            font-size: 0.3rem;
            margin-bottom: 0.2rem;
          }
          div {
            padding: 0;
          }
          .pay-type-list {
            background: $color-highlight-background;
            div {
              width: 100%;
              height: 1.1rem;
              font-size: $font-size-medium-x;
              line-height: 1.1rem;
              border-bottom: 1px solid #eee;
              img {
                height: 0.36rem;
                vertical-align: middle;
                margin-right: 0.12rem;
              }
              .text {
                display: inline;
                border: none;
                p {
                  display: inline-block;
                  font-size: $font-size-small-s;
                  color: $color-text-l;
                  line-height: 0.30rem;
                }
                p:first-child {
                  font-size: 0.26rem;
                  color: #333;
                  line-height: 0.37rem;
                  margin-bottom: 0.15rem;
                }
              }
              .money {
                font-size: 0.3rem;
                color: #151515;
                margin-top: 0.5rem;
              }
            }
          }
        }
        .gray {
          width: 100%;
          height: 0.2rem;
          padding: 0;
          background: transparent;
        }
        .score {
          padding-top: 0.5rem;
          p {
            font-size: 0.3rem;
            margin-bottom: 0.2rem;
          }
          div {
            padding: 0;
          }
          .info-item {
            height: 1rem;
            line-height: 1rem;
            font-size: $font-size-medium-s;
            border-bottom: 1px solid $color-border;
            &.border-bottom-1px {
              border: 1px solid $color-border;
            }

            .label {
              float: right;
              color: $color-text-l;
              &.icon-right {
                padding-right: 0.3rem;
                background-repeat: no-repeat;
                background-size: 0.14rem;
                background-position: right center;
              }

              .option {
                margin-top: 0.19rem;
              }

              &.text {
                color: $color-text;
              }
            }
          }
        }
        .score-rules {
          padding-top: 0.28rem;
          font-size: $font-size-small;
          color: $color-text-l;
          margin-bottom: .24rem;
          p {
            line-height: 0.36rem;
          }
        }
      }
      .footer {
        height: 0.98rem;
        padding: 0.07rem 0.3rem;
        border-top: 1px solid #eee;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        font-size: $font-size-medium-x;
        line-height: 0.7rem;
        background: #fff;
        span {
          span:first-child {
            color: $primary-color;
            font-size: $font-size-medium-x;
          }
          span {
            font-size: $font-size-small;
            color: #151515;
          }
        }
        button {
          width: 2.96rem;
          height: 0.84rem;
          border-radius: 0.08rem;
          background: $primary-color;
          color: $color-highlight-background;
          font-size: 0.3rem;
        }
      }
    }
    .switch-option .switch-ellipse[data-v-0037fbb0] {
      height: 0.5rem;
      width: 0.78rem;
    }
    .switch-option .switch-ellipse .switch-circle {
      width: 0.4rem;
      height: 0.4rem;
    }
  }
</style>
