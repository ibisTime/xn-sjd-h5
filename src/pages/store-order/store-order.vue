<template>
  <div class="mall-wrapper" @click.stop>
    <div class="content">
        <div class="head-nav">
          <category-scroll
            :currentIndex="currentIndex"
            :categorys="orderTypeList"
            @select="selectCategory"
          ></category-scroll>
        </div>
        <div class="main">
            <Scroll
                :data="orderList"
                :hasMore="hasMore"
                @pullingUp="morePageOrderFn">
                <div class="order-list">
                    <div
                        class="order-sing"
                        v-for="(orderItem, orderIndex) in orderList"
                        :key="orderIndex"
                    >
                        <div class="sing-head">
                            <div class="head-dp" @click="go(`/mall-store?shopCode=${orderItem.shopCode}`)">
                                {{currentIndex === 7 ? orderItem.shopName : orderItem.sellersName}}>
                                <span class="fr">{{currentIndex === 7 ? statusDetList[+shopStatusList[orderIndex]] : orderStatus[orderItem.status]}}</span>
                                <span class="fr time">{{formatDate(orderItem.applyDatetime)}}</span>
                            </div>
                        </div>
                        <div
                          class="sing-con"
                          @click="toOrderDet(currentIndex === 7 ? orderItem.orderCode : orderItem.code)"
                          v-for="(shopItem, shopIndex) in orderItem.detailList"
                        >
                            <div class="s-con_left">
                                <div class="l-img"  :style="getImgSyl(shopItem ? shopItem.listPic : '')"></div>
                            </div>
                            <div class="s-con_right">
                                <p>{{shopItem.commodityName}} <span class="fr">x{{shopItem.quantity}}</span></p>
                                <p>规格分类：{{shopItem.specsName}}</p>
                                <p>合计{{shopItem.quantity}}件商品 <span class="fr sp-b">¥{{formatAmount(shopItem.amount)}}</span></p>
                            </div>
                        </div>
                        <p class="order-all">合计：￥{{formatAmount(orderItem.payAmount || orderItem.amount)}}({{formatAmount(orderItem.amount)}}{{orderItem.cnyDeductAmount ? `-积分(${formatAmount(orderItem.cnyDeductAmount)})` : ''}}{{orderItem.postalFee > 0 ? `+邮费(${formatAmount(orderItem.postalFee)})` : ''}})</p>
                        <div class="sing-foo" v-if="operHtmlList[orderIndex]" v-html="operHtmlList[orderIndex]" @click="orderOperClick(orderIndex)">
                        </div>
                    </div>
                </div>
                <div class="mall-content">
                    <no-result v-show="!orderList.length && !hasMore" class="no-result-wrapper" title="还没有商品订单哦"></no-result>
                </div>
            </Scroll>
        </div>
    </div>
    <toast ref="toast" :text="textMsg"></toast>
    <full-loading v-show="loading" :title="loadingText"></full-loading>
    <m-footer-sjd-mall></m-footer-sjd-mall>
  </div>
</template>
<script>
import FullLoading from 'base/full-loading/full-loading';
import Toast from 'base/toast/toast';
import Scroll from 'base/scroll/scroll';
import CategoryScroll from 'base/category-scroll/category-scroll';
import NoResult from 'base/no-result/no-result';
import MFooterSjdMall from 'components/m-footer-sjd-mall/m-footer-sjd-mall';
import { formatAmount, formatImg, formatDate, setTitle, getUserId } from 'common/js/util';
import { onePageOrder, affirmOrder, removeMoreOrder, orderDetail } from 'api/store';
import { getDictList } from 'api/general';
export default {
  data() {
    return {
      loading: true,
      hasMore: true,
      currentIndex: 0,
      textMsg: '',
      loadingText: '正在加载...',
      isset: '1',
      start: 1,
      orderConfig: {
        start: 1,
        limit: 8,
        status: '',
        orderDir: 'desc',
        orderColumn: 'update_datetime',
        applyUser: getUserId()
      },
      orderDetailConfig: {
        start: 1,
        limit: 8,
        statusList: ['2', '3'],
        applyUser: getUserId()
      },
      affrimConfig: {  // 确认收货入参
        orderCode: '',
        receiver: getUserId(),
        shopCode: ''
      },
      orderList: [],
      orderStatus: {},
      operHtmlList: [],
      orderTypeList: [
        {key: 0, value: '全部'}
      ],
      logisCompany: {},
      afterSalesData: [],  // 售后数据
      statusDetList: [],
      shopStatusList: [],
      payAmount: 0
    };
  },
  created() {
    setTitle('商品订单');
    sessionStorage.removeItem('setRess');
    getDictList('commodity_order_detail_status').then(data => {
      data.forEach(item => {
        this.statusDetList.push(item.dvalue);
      });
    });
    getDictList('commodity_cnavigate_status').then(data => {
      data.forEach((item, index) => {
        this.orderStatus[item.dkey] = item.dvalue;
        this.orderTypeList.push({
          key: index + 1,
          value: item.dvalue
        });
      });
    });
    getDictList('logistics_company').then(data => {
      data.forEach(item => {
        this.logisCompany[item.dkey] = item.dvalue;
      });
    });
    this.morePageOrderFn();
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
    selectCategory(index) {
      this.currentIndex = index;
      this.start = 1;
      this.orderList = [];
      if(index === 0) {
        this.orderConfig.status = '';
      }else if(index === 7) {
        this.loading = true;
        this.orderDetailConfig.start = this.start;
        orderDetail(this.orderDetailConfig).then(data => {
          this.loading = false;
          if (data.totalPage <= this.start) {
            this.hasMore = false;
          }
          this.orderList = [...this.orderList, ...data.list];
          this.orderList.forEach(orderItem => {
            orderItem.detailList = [];
            orderItem.detailList.push(orderItem);
            this.shopStatusList.push(orderItem.status);
          });
          this.start ++;
        });
        return;
      }else {
        this.orderConfig.status = index - 1;
      }
      this.morePageOrderFn();
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
        case '6':
          this.operHtml = ``;
          break;
      };
      this.operHtmlList.push(this.operHtml);
    },
    orderOperClick(index) { // 订单操作
      let target = event.target;
      // if(target.classList.contains('drawback')) { // 申请退款
      //   this.go('/after-sale?code=' + this.orderList[index].code + '&toCode=' + this.orderDetail.code + '&jfMount=' + this.orderDetail.cnyDeductAmount + '&postalFee=' + this.orderDetail.postalFee);
      //   // sessionStorage.setItem('toBank', '/store-order');
      //   // sessionStorage.setItem('storetype', 'store');
      // }
      if(target.classList.contains('change-site')) { // 修改地址
        this.go('/address?shopCode=' + this.orderList[index].code);
        sessionStorage.setItem('toBank', '/store-order');
        sessionStorage.setItem('storetype', 'store');
      }
      if(target.classList.contains('remove')) { // 取消订单
        this.loading = true;
        this.loadingText = '';
        removeMoreOrder({
          updater: getUserId(),
          code: this.orderList[index].code
        }).then(data => {
          this.textMsg = '已取消订单';
          this.$refs.toast.show();
          this.loading = false;
          this.loadingText = '正在加载...';
          this.start = 1;
          this.orderList = [];
          this.morePageOrderFn();
        }, () => {
          this.loadingText = '正在加载...';
          this.loading = false;
        });
      }
      if(target.classList.contains('topay')) { // 待付款-去付款
        let shopMsgList = [this.orderList[index]];
        sessionStorage.setItem('shopMsgList', JSON.stringify(shopMsgList));
        this.go('/pay?code=' + this.orderList[index].code + '&type=one');
      }
      if(target.classList.contains('after-sale')) { // 申请售后
        this.go('/after-sale?code=' + this.orderList[index].code);
      }
      if(target.classList.contains('look-wl')) { // 查看物流
        let logisData = {
          statusTxt: this.orderStatus[this.orderList[index].status],
          shopPic: this.orderList[0].detailList[0].listPic,
          logicPany: this.logisCompany[this.orderList[index].logisticsCompany],
          orderCode: this.orderList[index].code,
          status: this.orderList[index].status
        };
        sessionStorage.setItem('logisticData', JSON.stringify(logisData));
        this.go(`/logistics?expCode=${this.orderList[index].logisticsCompany}&expNo=${this.orderList[index].logisticsNumber}`);
      }
      if(target.classList.contains('order-pj')) { // 发表评论
        this.loading = true;
        this.go('/user-pj?code=' + this.orderList[index].commodityCode + '&toCode=' + this.orderList[index].code);
      }
      if(target.classList.contains('order-take')) { // 确认收货
        this.loading = true;
        // this.affrimConfig.code = this.orderList[index].orderCode;
        this.affrimConfig.shopCode = this.orderList[index].shopCode;
        this.affrimConfig.code = this.orderList[index].code;
        affirmOrder(this.affrimConfig).then(data => {
          this.textMsg = '操作成功';
          this.$refs.toast.show();
          if(this.currentIndex !== 0) {
            this.orderConfig.status = '2';
          }
          this.start = 1;
          this.orderList = [];
          this.morePageOrderFn();
        }, () => {
          this.loading = false;
        });
      }
    },
    morePageOrderFn() {  // 获取订单
      this.orderConfig.start = this.start;
      onePageOrder(this.orderConfig).then(data => {
        this.operHtmlList = [];
        this.loading = false;
        if (data.totalPage <= this.start) {
          this.hasMore = false;
        }
        if(this.currentIndex !== 7) {
          this.orderList = [...this.orderList, ...data.list];
          for(let i = 0, len = this.orderList.length; i < len; i++) {
            this.orderOperFn(this.orderList[i].status);
          }
        }
        this.start ++;
      }, () => {
        this.loading = false;
      });
    },
    toOrderDet(orderCode) {
      this.loading = true;
      this.go(`/store-order_detail?code=${orderCode}`);
    }
  },
  components: {
    FullLoading,
    Toast,
    Scroll,
    NoResult,
    CategoryScroll,
    MFooterSjdMall
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
  .on{
        color: #23AD8C !important;
        border-color: #23AD8C !important;
    }
  .content {
    position: absolute;
    top: 0;
    bottom: 0.98rem;
    left: 0;
    right: 0;
    font-family: PingFangSC-Regular;
    .head-nav{
        height: 0.8rem;
        line-height: 0.8rem;
        background-color: #fff;
        border-bottom: 0.01rem solid #e5e5e5;
        font-size: 0.32rem;
        .nav-list{
            display: flex;
            justify-content: space-between;
            padding-bottom: 0.1rem;
            li{
                width: 20%;
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
    .main{
        height: calc(100% - 0.8rem);
        overflow: scroll;
    }
    .order-sing{
      margin-bottom: 0.2rem;
      padding: 0 0.3rem;
      background-color: #fff;
      font-family: PingFang-SC-Medium;
      box-shadow: 0 -0.02rem 0 0 #EBEBEB;
      .sing-head{
          height: 0.8rem;
          line-height: 0.8rem;
          font-size: 0.26rem;
          color: #666;
        .time{
          margin-right: 0.2rem;
        }
      }
      .sing-con{
        height: 2.1rem;
        width: 100%;
        /*padding: 0 0.3rem;*/
        display: flex;
        align-items: center;
        .s-con_left{
          width: 1.6rem;
          height: 1.6rem;
          flex: 0 0 1.6rem;
          .l-img{
            width: 100%;
            height: 100%;
            background-size: 100% 100%;
            background-image: url('./shop.png');
          }
        }
        .s-con_right{
          flex: 1;
          height: 1.6rem;
          padding-left: 0.2rem;
          box-sizing: border-box;
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
              color: #333333;
              letter-spacing: 0.0025rem;
              font-weight: 600;
              span{
                font-size: 0.26rem;
                color: #999999;
                font-weight: 400;
              }
            }
            .sp-b{
              font-family: DIN-Bold;
              font-size: 0.26rem;
              color: #333333;
              letter-spacing: 0.0023rem;
              font-weight: 600;
            }
          }
        }
      }
      .order-all{
        font-size: 0.3rem;
        color: #333;
        margin-top: -0.3rem;
        padding-bottom: 0.18rem;
        text-align: right;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .sing-foo{
        height: 0.9rem;
        padding: 0.18rem 0;
        display: flex;
        border-top: 0.02rem solid #EBEBEB;
        flex-direction: row-reverse;
        .foo-btn{
            width: 1.5rem;
            height: 0.56rem;
            text-align: center;
            line-height: 0.56rem;
            border: 0.02rem solid #979797;
            border-radius: 0.06rem;
            font-size: 0.26rem;
            color: #999;
        }
      }
    }
  }

}
</style>

