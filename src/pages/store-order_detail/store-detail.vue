<template>
  <div class="mall-wrapper" @click.stop>
    <Scroll ref="scroll" :pullUpLoad="pullUpLoad">
      <div class="content">
          <div class="det-head">
              <div class="det-img"></div>
              <div>{{orderStuTxt ? orderStuTxt : '订单' + orderStatus[orderDetail.status]}}</div>
          </div>
          <p class="back-co"></p>
          <div class="det-con" @click="toRess">
              <div class="con-left">
                  <div class="l-img"></div>
              </div>
              <div class="con-right">
                  <p>{{addressMsg ? addressMsg.receiverName : ''}} <span>{{addressMsg ? addressMsg.receiverMobile : ''}}</span></p>
                  <p>{{addressMsg ? addressMsg.province + addressMsg.city + addressMsg.district + addressMsg.detailAddress : '还未选择地址哦'}}</p>
              </div>
          </div>
          <p class="back-co"></p>
          <!-- 多店铺订单详情 -->
          <div class="sing-order">
            <div class="det-list">
              <div class="list-head">
                  <p>{{orderDetail.sellersName}} <span class="fr">{{logistics[orderDetail.expressType]}}</span></p>
              </div>
              <div v-for="(storeItem, storeIndex) in storeList" :key="storeIndex">
                <div
                  class="shop-det"
                  @click="toShopDet(storeItem.commodityCode, storeItem.shopCode)"
                >
                  <div class="shop-left">
                    <div class="shop-img" :style="getImgSyl(storeItem.listPic ? storeItem.listPic : '')"></div>
                  </div>
                  <div class="shop-right">
                    <p>{{storeItem.commodityName}} <span class="fr">x{{storeItem.quantity}}</span></p>
                    <p>规格分类：{{storeItem.specsName}}</p>
                    <p>合计{{storeItem.quantity}}件商品 <span class="fr price">¥{{formatAmount(storeItem.amount)}}</span></p>
                  </div>
                </div>
                <div class="s-foo" v-if="ispj" v-html="wcOperHtml[storeIndex]" @click="orderOperClick(storeItem)">
                </div>
              </div>
            </div>
          </div>
          <p class="back-co"></p>
          <div class="det-foo">
              <div class="foo-head">
                  <p>订单信息</p>
              </div>
              <div class="foo-con">
                  <p><span>下单时间</span>{{formatDate(orderDetail.applyDatetime)}}</p>
                  <p><span>订单号</span>{{orderDetail.code}}</p>
                  <p><span>订单金额</span>¥{{formatAmount(orderDetail.payAmount)}}({{formatAmount(orderDetail.amount)}}{{orderDetail.cnyDeductAmount ? `-积分(￥${formatAmount(orderDetail.cnyDeductAmount)})` : ''}}{{orderDetail.postalFee > 0 ? `+邮费(￥${formatAmount(orderDetail.postalFee)})` : ''}})</p>
                  <p><span>卖家</span>{{orderDetail.sellersName}}</p>
                  <p><span>支付方式</span>{{payType[orderDetail.payType]}}</p>
                  <p><span>支付流水号</span>{{orderDetail.jourCode}}</p>
              </div>
          </div>
          <div class="sing-foo" v-show="!ispj" v-html="operHtml" @click="orderOperClick">

          </div>
      </div>
    </Scroll>

    <toast ref="toast" :text="textMsg"></toast>
    <full-loading v-show="loading" :title="loadingText"></full-loading>
    <confirm ref="confirm" text="是否取消售后" confirmBtnText="确定" @confirm="cancelAfterSale"></confirm>
  </div>
</template>
<script>
import FullLoading from 'base/full-loading/full-loading';
import Toast from 'base/toast/toast';
import Scroll from 'base/scroll/scroll';
import Confirm from 'base/confirm/confirm';
import { formatAmount, formatImg, formatDate, setTitle, getUserId } from 'common/js/util';
import { moreStoreOrder, affirmOrder, removeMoreOrder, cancelAfterSale } from 'api/store';
import { getDictList } from 'api/general';
export default {
  data() {
    return {
      loading: true,
      textMsg: '',
      loadingText: '正在加载中...',
      code: '',
      orderType: '',     // one 立即购买  more 多订单
      storeList: [],
      orderDetail: {},
      logistics: {},   // 邮寄方式
      addressMsg: {},   // 地址信息
      orderStatus: {},
      affrimConfig: {  // 确认收货入参
        code: '',
        receiver: getUserId(),
        shopCode: ''
      },
      operHtml: '',
      wcOperHtml: [],
      ispj: false,
      isRess: true,
      setRessCode: '',
      statusDetList: [],
      logisCompany: {},
      orderStuTxt: '',
      payType: {},
      postageConfig: {
        addressCode: '',
        commodityCodeList: []
      }
    };
  },
  created() {
    setTitle('订单详情');
    this.pullUpLoad = null;
    this.code = this.$route.query.code;
    this.orderType = this.$route.query.type;
    sessionStorage.removeItem('isokIndex');
    getDictList('commodity_order_detail_status').then(data => {
      data.forEach(item => {
        this.statusDetList.push({
          key: item.dkey,
          value: item.dvalue
        });
      });
    });
    getDictList('commodity_cnavigate_status').then(data => {
      data.forEach(item => {
        this.orderStatus[item.dkey] = item.dvalue;
      });
    });
    getDictList('logistics_company').then(data => {
      data.forEach(item => {
        this.logisCompany[item.dkey] = item.dvalue;
      });
    });
    getDictList('pay_type').then(data => {
      data.forEach(item => {
        this.payType[item.dkey] = item.dvalue;
      });
    });
  },
  mounted() {
    this.orderMessage();
    sessionStorage.removeItem('storetype');
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
      if(this.isRess) {
        this.go('/address?shopCode=' + this.orderDetail.code);
        sessionStorage.setItem('toBank', '/store-order_detail?code=' + this.code);
        sessionStorage.setItem('storetype', 'store');
      }
    },
    orderOperFn(status) { // 根据状态展示按钮
      switch(status) {
        case '0':
          this.operHtml = `<div class="foo-btn change-site set-btn">修改地址</div>
                        <div class="foo-btn remove set-btn">取消订单</div>
                        <div class="foo-btn topay set-btn">立即付款</div>`;
          break;
        case '1':
          this.operHtml = ``;
          break;
        case '2':
          this.operHtml = `<div class="foo-btn order-take set-btn">确认收货</div>
                      <div class="foo-btn look-wl set-btn">查看物流</div>`;
          break;
        case '3':
          this.operHtml = ``;
          break;
        case '4':
          this.operHtml = ``;
          break;
        case '5':
          this.operHtml = ``;
          break;
      };
    },
    orderOperClick(storeItem) { // 订单操作
      this.currentItem = storeItem;
      let target = event.target;
      if(target.classList.contains('cancel-after-sale')) { // 取消售后
        this.$refs.confirm.show();
      }
      if(target.classList.contains('drawback')) { // 申请退款
        this.go('/after-sale?code=' + this.code + '&toCode=' + this.orderDetail.code + '&jfMount=' + this.orderDetail.cnyDeductAmount + '&postalFee=' + this.orderDetail.postalFee);
      }
      if(target.classList.contains('change-site')) { // 修改地址
        this.toRess();
      }
      if(target.classList.contains('remove')) { // 取消订单
        this.loading = true;
        this.loadingText = '';
        removeMoreOrder({
          updater: getUserId(),
          code: this.orderDetail.code
        }).then(data => {
          this.textMsg = '已取消订单';
          this.$refs.toast.show();
          this.loading = false;
          this.loadingText = '正在加载...';
          this.orderMessage();
        }, () => {
          this.loadingText = '正在加载...';
          this.loading = false;
        });
      }
      if(target.classList.contains('topay')) { // 待付款-去付款
        let shopMsgList = [this.orderDetail];
        sessionStorage.setItem('shopMsgList', JSON.stringify(shopMsgList));
        this.go('/pay?code=' + this.orderDetail.code + '&type=one');
      }
      if(target.classList.contains('after-sale')) { // 申请售后
        this.go('/after-sale?code=' + storeItem.code + '&toCode=' + this.orderDetail.code + '&jfMount=' + this.orderDetail.cnyDeductAmount + '&postalFee=' + this.orderDetail.postalFee);
      }
      if(target.classList.contains('look-wl')) { // 查看物流
        this.loading = true;
        let logisData = {
          statusTxt: this.orderStatus[this.orderDetail.status],
          shopPic: this.storeList[0].listPic,
          logicPany: this.logisCompany[this.orderDetail.logisticsCompany],
          orderCode: this.orderDetail.code,
          status: this.orderDetail.status
        };
        sessionStorage.setItem('logisticData', JSON.stringify(logisData));
        this.go(`/logistics?expCode=${this.orderDetail.logisticsCompany}&expNo=${this.orderDetail.logisticsNumber}`);
      }
      if(target.classList.contains('order-take')) { // 确认收货
        this.loading = true;
        this.affrimConfig.code = this.orderDetail.code;
        this.affrimConfig.shopCode = this.orderDetail.shopCode;
        affirmOrder(this.affrimConfig).then(data => {
          this.textMsg = '操作成功';
          this.$refs.toast.show();
          this.orderMessage();
        }, () => {
          this.loading = false;
        });
      }
      if(target.classList.contains('order-pj')) { // 发表评论
        this.loading = true;
        this.go('/user-pj?code=' + storeItem.code + '&toCode=' + this.orderDetail.code);
      }
    },
    toShopDet(code, shopCode) {
      this.go(`/mall-shop_detail?code=${code}&shopCode=${shopCode}`);
    },
    orderMessage() {  // 获取订单信息
      moreStoreOrder(this.code).then(data => {
        this.orderStuTxt = '';
        this.postageConfig.addressCode = data.addressCode;
        data.detailList.forEach(item => {
          this.postageConfig.commodityCodeList.push(item.commodityCode);
        });
        this.orderDetail = data;
        this.loading = false;
        this.storeList = data.detailList;   // moreStoreOrder
        this.addressMsg = {
          province: data.province,
          city: data.city,
          district: data.district,
          detailAddress: data.detailAddress,
          receiverMobile: data.receiverMobile,
          receiverName: data.receiverName
        };
        if(data.status === '1' || data.status === '2' || data.status === '3' || data.status === '4') {
          this.ispj = true;
          data.detailList.forEach((item, index) => {
            if(item.afterSaleStatus && item.afterSaleStatus !== '9' && item.status === '0') {
              switch(item.afterSaleStatus) {
                case '2':
                  this.orderStuTxt = '售后中';
                  this.wcOperHtml.push(`<div class="foo-btn">售后中</div><div class="foo-btn cancel-after-sale set-btn">取消售后</div>`);
                  break;
                case '3':
                  this.orderStuTxt = '退款成功';
                  this.wcOperHtml.push(`<div class="foo-btn order-pj set-btn">评价</div><div class="foo-btn">退款成功</div>`);
                  break;
                case '8':
                  this.orderStuTxt = '退款失败';
                  this.wcOperHtml.push(`<div class="foo-btn order-pj set-btn">评价</div><div class="foo-btn">退款失败</div>`);
                  break;
              }
            } else {
              if(item.status === '0') {
                this.wcOperHtml.push(`<div class="foo-btn order-pj set-btn">评价</div><div class="foo-btn after-sale set-btn">申请售后</div>`);
              } else if(item.status === '1') {
                this.wcOperHtml.push(`<div class="foo-btn">已完成</div>`);
              } else if(item.status === '2') {
                this.orderStuTxt = '售后中';
                this.wcOperHtml.push(`<div class="foo-btn">售后中</div>`);
              } else if(item.status === '5' || item.status === '6') {
                if(item.afterSaleStatus === '2') {
                  this.orderStuTxt = '售后中';
                  this.wcOperHtml.push(`<div class="foo-btn">售后中</div><div class="foo-btn cancel-after-sale set-btn">取消售后</div>`);
                } else {
                  this.wcOperHtml.push(`<div class="foo-btn after-sale set-btn">申请退款</div>`);
                }
                // this.wcOperHtml.push(`<div class="foo-btn after-sale set-btn">申请退款</div>`);
              }
              // switch(item.status) {
              //   case '0':
              //     this.wcOperHtml.push(`<div class="foo-btn order-pj set-btn">评价</div><div class="foo-btn after-sale set-btn">申请售后</div>`);
              //     break;
              //   case '1':
              //     this.wcOperHtml.push(`<div class="foo-btn">已完成</div>`);
              //     break;
              //   case '2':
              //     this.orderStuTxt = '售后中';
              //     this.wcOperHtml.push(`<div class="foo-btn">售后中</div>`);
              //     break;
              //   case '5':
              //   case '6':
              //     this.wcOperHtml.push(`<div class="foo-btn after-sale set-btn">申请退款</div>`);
              //     break;
              // }
            }
          });
        }else {
          this.orderOperFn(data.status);
        }
        if(Number(data.status) > 0) {
          this.isRess = false;
        }
      }, () => {
        this.loading = false;
      });
    },
    cancelAfterSale() {
      this.loading = true;
      cancelAfterSale(this.currentItem.code).then(() => {
        location.reload();
        this.loading = false;
      }).catch(() => { this.loading = false; });
    }
  },
  components: {
    FullLoading,
    Toast,
    Scroll,
    Confirm
  },
  beforeDestroy() {
    sessionStorage.removeItem('setRess');
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
  bottom: 0rem;
  width: 100%;
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .back-co{
    height: 0.2rem;
    background-color: #f5f5f5;
  }
  .content {
    overflow: auto;
    background-color: #fff;
    font-family: PingFangSC-Regular;
    .sing-foo{
        height: 1rem;
        padding: 0.2rem 0.3rem;
        display: flex;
        box-shadow: 0 -0.02rem 0 0 #EBEBEB;
        flex-direction: row-reverse;
    }
    .s-foo{
      height: 1rem;
      padding: 0.2rem 0.3rem;
      display: flex;
      box-shadow: 0 0.02rem 0 0 #EBEBEB;
      flex-direction: row-reverse;
    }
    .det-head{
      width: 100%;
      height: 2.8rem;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      flex-direction: column;
      font-size: 0.32rem;
      color:  #2D2D2D;
      font-weight: bold;
      justify-content: center;
      .det-img{
        width: 1rem;
        height: 1rem;
        border-radius: 100%;
        background-size: 100% 100%;
        background-image: url('./dsh.png');
        margin-bottom: 0.2rem;
      }
    }
    .det-con{
      height: 1.6rem;
      padding: 0.3rem 0 0.3rem 0.2rem;
      display: flex;
      .con-left{
        width: 0.9rem;
        position: relative;
        .l-img{
          width: 0.6rem;
          height: 0.6rem;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          background-image: url('./dz.png');
          background-size: 100% 100%;
        }
      }
      .con-right{
        width: 80%;
        display: flex;
        flex-wrap: wrap;
        align-content: space-around;
        font-size: 0.28rem;
        color: #333;
        p{
          width: 100%;
        }
        span{
          color: #999;
        }
      }
    }
    .det-list{
      padding: 0 0.3rem;
      .list-head{
        height: 0.8rem;
        line-height: 0.8rem;
        color: #666;
        font-size: 0.26rem;
        background: rgba(224,187,187,0.00);
        box-shadow: 0 0.02rem 0 0 #EBEBEB;
      }
      .shop-det{
        display: flex;
        padding: 0.32rem 0 0.3rem 0;
        background: rgba(224,187,187,0.00);
        .shop-left{
          height: 1.6rem;
          width: 1.6rem;
          margin-right: 0.2rem;
          .shop-img{
            width: 100%;
            height: 100%;
            background-size: 100% 100%;
            background-image: url('./shop.png');
          }
        }
        .shop-right{
          width: 79%;
          display: flex;
          flex-wrap: wrap;
          align-content: space-around;
          p{
            width: 100%;
            font-size: 0.26rem;
            color: #999999;
            letter-spacing: 0.002rem;
            &:nth-of-type(1){
              font-size: 0.32rem;
              color: #333;
              font-weight: 600;
              span{
                font-size: 0.3rem;
                color: #999;
              }
            }
            .price{
              font-size: 0.26rem;
              color: #333;
              font-weight: 600;
            }
          }
        }
      }
    }
    .det-foo{
      padding-top: .32rem;
      padding-left: 0.3rem;
      .foo-head{
        margin-bottom: 0.4rem;
        font-size: 0.32rem;
        color: #2D2D2D;
        letter-spacing: 0.0025rem;
      }
      .foo-con{
        font-size: 0.28rem;
        color: #2D2D2D;
        letter-spacing: 0.0022rem;
        p{
          margin-bottom: 0.3rem;
          span{
            display: inline-block;
            width: 1.7rem;
          }
        }
      }
    }
  }

}
</style>

