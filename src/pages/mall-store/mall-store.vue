<template>
  <div class="mall-wrapper" @click.stop>
    <div class="content" v-show="!isAll">
      <div class="mall-header">
        <div class="head-search">
          <h4>商铺名称</h4>
          <p>辅助文字辅助文字辅助文字辅助文字</p>
        </div>
      </div>
      <div class="mall-list">
        <div class="mall-single" v-for="(item, index) in mallList" :key="index">
          <div class="sing-img"></div>
          <p class="sing-txt">{{item}}</p>
        </div>
      </div>
      <div class="mall-content">
        <div class="con-head">
          <h5>所有商品<span class="fr" @click="tomore">更多</span></h5>
          <div class="ml-list">
            <Scroll 
              :data="hotShopList"
              :hasMore="hasMore"
              @pullingUp="getHotShop">
              <div class="con-list">
                <div class="con-sing" @click="toShopDet">
                  <div class="con-sing_img">
                    <div class="sing-img"></div>
                    <div class="con-txt">
                      <h5>樟子松商品商品商品商品</h5>
                      <div class="con-foo">
                        <p>￥2480.00<span class="icon fr" @click.stop="addCart"></span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Scroll>
          </div>
          <div class="mall-content">
            <no-result v-show="!hotShopList.length && !hasMore" class="no-result-wrapper" title="抱歉，暂无商品"></no-result>
          </div>
        </div>
      </div>
    </div>
    <MallShopList v-show="isAll" />
    <div class="go-cart" @click.stop="addCart">
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
import MallShopList from '../mall-shopList/mall-shopList';
import { getAllShopData } from 'api/store';
import { formatAmount, formatImg, formatDate, setTitle, getUrlParam } from 'common/js/util';
export default {
  // name: "home",
  data() {
    return {
      mallList: ['分类一', '分类二', '分类三', '分类四'],
      loading: true,
      textMsg: '',
      loadingText: '正在加载中...',
      isAll: false,
      shopCode: '',
      start: 1,
      config: {
        start: 1,
        limit: 4,
        status: '4'
      },
      hasMore: true,
      hotShopList: []
    };
  },
  created() {
    setTitle('店铺名称');
    this.shopCode = getUrlParam('shopCode');
    this.getHotShop();
  },
  mounted() {
    this.loading = false;
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
    getImgSyl(imgs) {
      return {
        // backgroundImage: `url(${formatImg(imgs)})`
        backgroundImage: `url(${imgs})`
      };
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
    getHotShop() {
      this.config.start = this.start;
      getAllShopData(this.config).then(data => {
        if (data.totalPage <= this.start) {
          this.hasMore = false;
        }
        this.hotShopList = [...this.hotShopList, ...data.list];
        this.start ++;
      });
    }
  },
  components: {
    FullLoading,
    Toast,
    Scroll,
    NoResult,
    MallShopList
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
  .banner-default {
    width: 100%;
    height: 3rem;
  }
  .content {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    font-family: PingFangSC-Regular;

    .mall-header{
      width: 100%;
      height: 4.3rem;
      margin: 0 auto;
      position: relative;
      background-image: url('./banner.png');
      background-size: 100% 100%;
      .head-search{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 1.5rem;
        background-color: rgba(0, 0, 0, .5);
        padding: 0.3rem 0 0.35rem 0.3rem;
        font-family: PingFang-SC-Medium;
        color: #FFFFFF;
        h4{
            font-size: 0.34rem;
            letter-spacing: 0.0.027rem;
            margin-bottom: 0.12rem;
        }
        p{
            font-size: 0.26rem;
            letter-spacing: 0.002rem;
        }
      }
    }
    .mall-list{
      background-color: #fff;
      width: 100%;
      padding: 0.44rem 0 0.56rem;
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.2rem;
      .mall-single{
        width: 24%;
        font-family: PingFangSC-Medium;
        font-size: 0.28rem;
        color: #666666;
        letter-spacing: 0.002rem;
        text-align: center;
        .sing-img{
          width: 1rem;
          height: 1rem;
          background-size: 100%;
          margin: 0 auto;
          margin-bottom: 0.22rem;
        }
        &:nth-of-type(1) .sing-img{
          background-image: url('./fl1.png');
        }
        &:nth-of-type(2) .sing-img{
          background-image: url('./fl2.png');
        }
        &:nth-of-type(3) .sing-img{
          background-image: url('./fl3.png');
        }
        &:nth-of-type(4) .sing-img{
          background-image: url('./fl4.png');
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
          height: 5rem;
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
            background-clip: center;
            background-size: 100%;
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
    width: 1rem;
    height: 1rem;
    background-image: url('./1.png');
    background-size: 100% 100%;
  }
}
</style>
