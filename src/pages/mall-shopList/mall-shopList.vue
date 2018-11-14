<template>
  <div class="mall-wrapper" @click.stop>
    <div class="content">
        <div class="head-nav">
            <ul class="nav-list" @click="changStu">
                <li><span :class="{'on': isset == '1'}">全部</span></li>
                <li><span :class="{'on': isset == '2'}">个人</span></li>
                <li><span :class="{'on': isset == '3'}">定向</span></li>
                <li><span :class="{'on': isset == '4'}">集体</span></li>
                <li><span :class="{'on': isset == '5'}">捐赠</span></li>
            </ul>
        </div>
        <div class="con-list">
          <Scroll 
            :data="hotShopList"
            :hasMore="hasMore"
            @pullingUp="getHotShop">
            <div class="shop-list">
              <div class="shop-singer" @click="toShopDet(item.code, item.shopCode)" v-for="(item, index) in hotShopList" :key="index">
                  <div class="sing-img" :style="getImgSyl(item.bannerPic ? item.bannerPic : '')"></div>
                  <div class="shop-det">
                      <h5>{{item.name}}</h5>
                      <p>￥{{formatAmount(item.minPrice)}} 起<span class="fr icon"></span></p>
                  </div>
              </div>
            </div>
          </Scroll>
          <div class="mall-content">
            <no-result v-show="!hotShopList.length && !hasMore" class="no-result-wrapper" title="抱歉，暂无商品"></no-result>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import MFooter from 'components/m-footer/m-footer';
import FullLoading from 'base/full-loading/full-loading';
import Toast from 'base/toast/toast';
import Scroll from 'base/scroll/scroll';
import NoResult from 'base/no-result/no-result';
import { formatAmount, formatImg, formatDate, setTitle } from 'common/js/util';
import { getAllShopData } from 'api/store';
export default {
  data() {
    return {
      loading: true,
      hasMore: true,
      textMsg: '',
      loadingText: '正在加载中...',
      isset: '1',
      start: 1,
      config: {
        start: 1,
        limit: 8,
        status: '4',
        location: '1'
      },
      hotShopList: []
    };
  },
  created() {
    setTitle('全部商品');
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
    getImgSyl(imgs, type) {
      let pic = imgs ? formatImg(imgs) : type === 'u' ? 'static/avatar@2x.png' : 'static/default.png';
      return {
        backgroundImage: `url(${pic})`
      };
    },
    toShopDet(code, shopCode) {
      this.go(`/mall-shop_detail?code=${code}&shopCode=${shopCode}`);
    },
    changStu() {
      let target = event.target;
      switch(target.innerText) {
        case '全部':
          this.isset = '1';
          break;
        case '个人':
          this.isset = '2';
          break;
        case '定向':
          this.isset = '3';
          break;
        case '集体':
          this.isset = '4';
          break;
        case '捐赠':
          this.isset = '5';
          break;
      }
    },
    // 获取热门商品
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
    MFooter,
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
  .icon{
    display: inline-block;
    width: 0.38rem;
    height: 0.33rem;
    background-size: 100% 100%;
    background-image: url('./shopCart.png');
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
    .head-nav{
        height: 0.8rem;
        line-height: 0.8rem;
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
    .con-list{
      height: 13rem;
      padding-bottom: 2rem;
      overflow: scroll;
    }
    .shop-list{
        padding: 0.4rem 0.3rem;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .shop-singer{
            width: 48%;
            padding-bottom: 0.3rem;
            margin-bottom: 0.3rem;
            border: 0.01rem solid #E6E6E6;
            border-radius: 0.06rem;
            overflow: hidden;
            .sing-img{
                height: 2.3rem;
                background-image: url('./shop.png');
                background-size: 100%;
                background-clip: center;
                margin-bottom: 0.3rem;
            }
            .shop-det{
                padding: 0 0.3rem 0 0.2rem;
                >h5{
                    font-size: 0.34rem;
                    font-weight: 600;
                    margin-bottom: 0.3rem;
                    letter-spacing: 0.02rem;
                }
                p{
                    font-size: 0.32rem;
                    color: #23AD8C;
                    font-weight: 600;
                }
            }
        }
    }
  }

}
</style>
