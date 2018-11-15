<template>
  <div class="mall-wrapper" @click.stop>
    <div class="content">
        <div class="det-head">
            <div class="det-img"></div>
            <div>订单待收货</div>
        </div>
        <p class="back-co"></p>
        <div class="det-con">
            <div class="con-left">
                <div class="l-img"></div>
            </div>
            <div class="con-right">
                <p>王大锤 <span>15083962283</span></p>
                <p>北京市朝阳区蓬莱东路1001号</p>
            </div>
        </div>
        <p class="back-co"></p>
        <div class="sing-order" v-for="(storeItem, storeIndex) in storeList" :key="storeIndex">
          <div class="det-list">
            <div class="list-head">
                <p>{{storeItem.shopName}} <span class="fr">{{logistics[orderDetail.expressType]}}</span></p>
            </div>
            <div class="shop-det" v-for="(shopItem, shopIndex) in storeItem.detailList" :key="shopIndex">
                <div class="shop-left">
                    <div class="shop-img" :style="getImgSyl(shopItem.listPic ? shopItem.listPic : '')"></div>
                </div>
                <div class="shop-right">
                    <p>{{shopItem.commodityName}} <span class="fr">x{{shopItem.quantity}}</span></p>
                    <p>规格分类：{{shopItem.specsName}}</p>
                    <p>合计{{shopItem.quantity}}件商品 <span class="fr price">¥{{formatAmount(shopItem.amount)}}</span></p>
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
                <p><span>订单号</span>{{orderDetail.code}}</p>
                <p><span>订单金额</span>¥{{formatAmount(orderDetail.amount)}}</p>
                <p><span>卖家</span>{{orderDetail.sellersName}}</p>
                <p><span>支付流水号</span>{{orderDetail.jourCode}}</p>
            </div>
        </div>
        <div class="sing-foo">
            <div class="foo-btn set-btn">
              删除订单
            </div>
        </div>
    </div>
  </div>
</template>
<script>
import FullLoading from 'base/full-loading/full-loading';
import Toast from 'base/toast/toast';
import { formatAmount, formatImg, formatDate, setTitle, getUrlParam } from 'common/js/util';
import { moreStoreOrder } from 'api/store';
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
      logistics: {}   // 邮寄方式
    };
  },
  created() {
    setTitle('订单详情');
    this.code = getUrlParam('code');
    this.orderType = getUrlParam('type');
    getDictList('logistics_type').then(data => {
      data.forEach(item => {
        this.logistics[item.dkey] = item.dvalue;
      });
    });
    if(this.orderType === 'one') {
      moreStoreOrder(this.code).then(data => {
        this.orderDetail = data;
        this.loading = false;
        this.storeList = data.shopOrderList;
      }, () => {
        this.loading = false;
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
    }
  },
  components: {
    FullLoading,
    Toast
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
  .back-co{
    height: 0.2rem;
    background-color: #f5f5f5;
  }
  .content {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background-color: #fff;
    font-family: PingFangSC-Regular;
    .sing-foo{
        height: 1rem;
        padding: 0.2rem 0.3rem;
        display: flex;
        box-shadow: 0 -0.02rem 0 0 #EBEBEB;
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
        .set-btn{
          color: #23AD8C;
          border: 1px solid #23AD8C;
        }
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
        box-shadow: 0 0.02rem 0 0 #EBEBEB;
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

