<template>
  <div class="home-wrapper">
    <m-header class="cate-header" title="首页" :showBack="showBack"></m-header>
    <div class="content">
      <div class="slider-wrapper">
        <!--<slider v-if="!banners.length" :loop="loop">-->
        <!--<div class="home-slider" v-for="item in banners" :key="item.code">-->
        <!--<a :href="item.url||'javascript:void(0)'" :style="getImgSyl(item.pic)"></a>-->
        <!--</div>-->
        <!--</slider>-->
        <img src="./../../common/image/banner-default.png" alt="" class="banner-default">
        <router-link tag="div" to="/home/sign" class="sign-wrapper">
          <i class="sign-icon"></i>
        </router-link>
      </div>
      <div class="notice">
        <img src="./notice@2x.png" alt="">
        <div class="border"></div>
        <div class="title">古树名木认养，10月8日启动！</div>
        <div class="more">更多</div>
      </div>
      <div class="icons">
        <div class="icon-item">
          <img src="./old-tree@2x.png" alt="">
          <p>古树认养</p>
        </div>
        <div class="icon-item">
          <img src="./water-source-forest@2x.png" alt="">
          <p>水源林</p>
        </div>
        <div class="icon-item">
          <img src="./emotion-forest@2x.png" alt="">
          <p>情感林</p>
        </div>
        <div class="icon-item">
          <img src="./booking@2x.png" alt="">
          <p>果树预售</p>
        </div>
      </div>
      <div class="emotion-article">
        <div class="text">
          <p class="Chinese">优选推文，情感频道</p>
          <p class="English">Preferred tweets, emotional channels</p>
        </div>
        <img src="./emotion@2x.png" alt="" class="emotion">
        <img src="./more@2x.png" alt="" class="more">
      </div>
      <div class="bulletin">
        <img src="./bulletin@2x.png" alt="">
        <div class="border"></div>
        <div class="title">恭喜Bluce，成功参加See的传承认养</div>
        <div class="more">更多</div>
      </div>
      <div class="hot">
        <div class="title">
          <span class="fl hot-title">热门推荐</span>
          <span class="fr more">更多</span>
        </div>
        <div v-for="item in proList">
          
        </div>
      </div>
      <!--<div class="cates-wrapper">-->
      <!--<router-link tag="div" to="/category/list?act=1" class="cate-item">-->
      <!--<i class="cate-icon activity-icon"></i>-->
      <!--<p>优惠活动</p>-->
      <!--</router-link>-->
      <!--<router-link tag="div" to="/home/charge" class="cate-item">-->
      <!--<i class="cate-icon recharge-icon"></i>-->
      <!--<p>充值</p>-->
      <!--</router-link>-->
      <!--<router-link to="/home/recommend" class="cate-item" tag="div">-->
      <!--<i class="cate-icon invitation-icon"></i>-->
      <!--<p>邀请好友</p>-->
      <!--</router-link>-->
      <!--</div>-->
      <div class="mall-content">
        <no-result v-show="!currentList.length && !hasMore" class="no-result-wrapper" title="抱歉，暂无商品"></no-result>
      </div>
    </div>
    <toast ref="toast" :text="text"></toast>
    <m-footer></m-footer>
    <router-view></router-view>
  </div>
</template>
<script>
import Toast from 'base/toast/toast';
import FullLoading from 'base/full-loading/full-loading';
import MFooter from 'components/m-footer/m-footer';
import Slider from 'base/slider/slider';
import NoResult from 'base/no-result/no-result';
import MHeader from 'components/m-header/m-header';
export default {
  // name: "home",
  data() {
    return {
      title: '正在加载...',
      loading: true,
      toastText: '',
      currentList: [],
      hasMore: false,
      text: '',
      showBack: false
    };
  },
  methods: {
    // formatAmount(amount) {
    //   return formatAmount(amount);
    // },
    // goYuncan() {
    //   this.$router.push('/yuncangzhanghu');
    // },
    // tuichu() {
    //   clearAllCookie();
    //   this.$router.push("/home");
    // },
    // dlClick(to) {
    //   if (to === '/Invitation') {
    //     location.href = location.origin + '/#/Invitation?userReferee=' + getUserId();
    //   } else {
    //     this.$router.push(to);
    //   }
    // }
  },
  mounted() {
    // let userId;
    // if (this.$route.query.userId) {
    //   userId = this.$route.query.userId;
    //   setCookie("userId", userId);
    // } else {
    //   userId = getCookie("userId");
    // }
    // Promise.all([
    //   getUser1(userId),
    //   checkRed(userId)
    // ]).then(([res1, res2]) => {
    //   this.userinfo = res1;
    //   this.balance = res1.wareAmount;
    //   setCookie("level", res1.level);
    //   getLevel(res1.level).then(item => {
    //     this.loading = false;
    //     res1.level = item[0].name;
    //   });
    //   setCookie('isWare', res2.isWare);
    //   if(this.balance < res2.redAmount) {
    //     this.toastText = '您云仓余额低于红线，请购买';
    //     this.$refs.toast.show();
    //     setTimeout(() => {
    //       this.$router.push('/threshold');
    //     }, 2000)
    //   }
    // }).catch(() => { this.loading = false });
  },
  components: {
    FullLoading,
    Toast,
    MFooter,
    Slider,
    NoResult,
    MHeader
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/mixin.scss";
@import "../../common/scss/variable.scss";
.home-wrapper {
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
    margin-top: 0.88rem;
    botton: 0.98rem;
    .slider-wrapper {
      padding-bottom: 0.2rem;
      background: $color-highlight-background;
    }
    .notice {
      display: flex;
      align-items: center;
      font-size: 0.24rem;
      padding: 0.24rem 0.3rem;
      background: $color-highlight-background;
      img {
        width: 0.6rem;
        height: 0.25rem;
        margin-right: 0.11rem;
      }
      .border {
        display: inline;
        width: 0;
        height: 0.15rem;
        border-right: 1px solid #ccc;
        margin-right: 0.11rem;
      }
      .title {
        line-height: 0.33rem;
        flex: 1;
      }
      .more {
        line-height: 0.33rem;
        color: #999;
      }
    }
    .icons {
      width: 100%;
      height: 2.25rem;
      padding-top: 0.26rem;
      background: #fff;
      display: flex;
      margin-bottom: 0.2rem;
      .icon-item {
        display: inline;
        flex: 1;
        text-align: center;
        img {
          width: 1rem;
        }
        p {
          color: #666;
          font-size: 0.24rem;
        }
      }
    }
    .emotion-article {
      height: 1.94rem;
      padding: 0 0.3rem;
      display: flex;
      align-items: center;
      background: $color-highlight-background;
      justify-content: space-between;
      margin-bottom: 0.2rem;
      .text {
        .Chinese {
          font-size: $font-size-medium-xx;
          margin-bottom: 0.11rem;
        }
        .English {
          color: #666;
          font-size: $font-size-small-s;
          line-height: $font-size-medium-x;
        }
      }
      .emotion{
        height: 100%;
        margin-right: 0.3rem;
      }
      .more{
        width: 0.3rem;
        /*position: absolute;*/
        /*right: 0.3rem;*/
        /*line-height: 1.94rem;*/
        /*margin-top: 0.5rem;*/
      }
    }
    .bulletin {
      display: flex;
      align-items: center;
      font-size: 0.24rem;
      padding: 0.24rem 0.3rem;
      background: #fdf4f3;
      img {
        width: 0.6rem;
        height: 0.25rem;
        margin-right: 0.11rem;
      }
      .border {
        display: inline;
        width: 0;
        height: 0.15rem;
        border-right: 1px solid #ccc;
        margin-right: 0.11rem;
      }
      .title {
        line-height: 0.33rem;
        flex: 1;
      }
      .more {
        line-height: 0.33rem;
        color: #999;
      }
    }
    .hot {
      padding: 0.4rem 0.3rem;
      background: $color-highlight-background;
      .hot-title {
        font-size: $font-size-medium-xx;
        line-height: $font-size-large-x;
      }
      .more {
        line-height: 0.33rem;
        color: #999;
        font-size: $font-size-small;
      }
    }
  }
}
</style>
