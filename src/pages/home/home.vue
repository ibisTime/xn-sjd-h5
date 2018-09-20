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
  .blank {
    width: 100%;
    height: 0.2rem;
  }
  .banner-default {
    width: 100%;
    height: 3rem;
  }
  .content {
    margin-top: 0.88rem;
    botton: 0.98rem;
  }
}
</style>
