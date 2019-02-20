<template>
  <div class="mall-wrapper" @click.stop>
    <Scroll
      :pullUpLoad="pullUpLoad">
      <img :src="formatImg(activityPic)">
    </Scroll>
    <full-loading v-show="loading" :title="loadingText"></full-loading>
    <toast ref="toast" :text="textMsg"></toast>
  </div>
</template>
<script>
import FullLoading from 'base/full-loading/full-loading';
import Scroll from 'base/scroll/scroll';
import Slider from 'base/slider/slider';
import CategoryScroll from 'base/category-scroll/category-scroll';
import Toast from 'base/toast/toast';
import { formatImg, setTitle, getUserId } from 'common/js/util';
import { getConfigPage } from 'api/general';
export default {
  data() {
    return {
      loading: false,
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
      shopCode: '',
      banners: [],
      activityPic: ''
    };
  },
  created() {
    setTitle('商城');
    this.loading = true;
    getConfigPage({type: 'SYS_TXT', ckey: 'INNER_ACTIVITY_PIC'}).then((res) => {
      this.loading = false;
      this.activityPic = res.list[0].cvalue;
    }).catch(() => {
      this.loading = false;
    });
  },
  methods: {
    formatImg(img) {
      return formatImg(img);
    }
  },
  components: {
    FullLoading,
    Toast,
    Scroll,
    CategoryScroll,
    Slider
  },
  watch: {
    '$route.path': function (newVal, oldVal) {
      this.loading = true;
      if(newVal === '/mall') {
        this.isAll = false;
        setTitle('商城');
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
  bottom: 0;
  width: 100%;
  background-color: #fff;
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  img {
    width: 100%;
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
                .price {
                  color: $mall-color;
                }
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
                  .price {
                    color: $mall-color;
                  }
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
