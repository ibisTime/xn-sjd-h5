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
        <div class="shop-list">
            <div class="shop-singer" @click="toShopDet">
                <div class="sing-img"></div>
                <div class="shop-det">
                    <h5>樟子松商品商品商品商品</h5>
                    <p>￥2425 <span class="fr icon"></span></p>
                </div>
            </div>
            <div class="shop-singer">
                <div class="sing-img"></div>
                <div class="shop-det">
                    <h5>樟子松商品商品商品商品</h5>
                    <p>￥2425 <span class="fr icon"></span></p>
                </div>
            </div>
            <div class="shop-singer">
                <div class="sing-img"></div>
                <div class="shop-det">
                    <h5>樟子松商品商品商品商品</h5>
                    <p>￥2425 <span class="fr icon"></span></p>
                </div>
            </div>
        </div>
    </div>
    <full-loading v-show="loading" :title="loadingText"></full-loading>
    <toast ref="toast" :text="textMsg"></toast>
    <m-footer></m-footer>
  </div>
</template>
<script>
import MFooter from 'components/m-footer/m-footer';
import FullLoading from 'base/full-loading/full-loading';
import Toast from 'base/toast/toast';
import { formatAmount, formatImg, formatDate, setTitle } from 'common/js/util';
export default {
  data() {
    return {
      loading: true,
      textMsg: '',
      loadingText: '正在加载中...',
      isset: '1'
    };
  },
  created() {
    setTitle('商场');
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
        backgroundImage: `url(${imgs})`
      };
    },
    toShopDet() {
      this.go('/mall-shop_detail');
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
    }
  },
  components: {
    MFooter,
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
