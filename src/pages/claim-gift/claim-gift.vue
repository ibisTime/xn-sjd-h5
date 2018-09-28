<template>
  <div class="home-wrapper" :style="{ bottom: wait ? '0.98rem' : '0' }">
    <m-header class="cate-header" title="认领礼物"></m-header>
    <div class="content">
      <Scroll :pullUpLoad="pullUpLoad">
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
      <div class="info-wait" v-show="wait">
        <div class="item">
          <span>樟子松</span><span class="price">¥1245.0</span>
        </div>
      </div>
      <div class="info" v-show="!wait">
        <div class="item">
          <span>礼物名称</span><span>樟子松</span>
        </div>
        <div class="item">
          <span>礼物价格</span><span class="price">¥1245.0</span>
        </div>
        <div class="item">
          <span>收货人</span><span>张三</span>
        </div>
        <div class="item">
          <span>手机号码</span><span>18899990000</span>
        </div>
        <div class="item">
          <span>认领时间</span><span>2018-08-23</span>
        </div>
      </div>
      <div class="description">
        <div class="description-title">
          <div class="border"></div>
          <span>图文详情</span>
          <div class="description-detail" v-html="descriptionDetail"></div>
        </div>
      </div>
      </Scroll>
    </div>
    <div class="footer" v-show="wait">
      <button @click="go('/gift-address')">认领礼物</button>
    </div>
    <toast ref="toast" :text="text"></toast>
    <router-view></router-view>
  </div>
</template>
<script>
import Toast from 'base/toast/toast';
import Scroll from 'base/scroll/scroll';
import FullLoading from 'base/full-loading/full-loading';
import Slider from 'base/slider/slider';
import NoResult from 'base/no-result/no-result';
import MHeader from 'components/m-header/m-header';
import { formatAmount } from 'common/js/util';
export default {
  data() {
    return {
      title: '正在加载...',
      loading: true,
      toastText: '',
      currentList: [],
      hasMore: false,
      text: '',
      showBack: false,
      proList: [{

      }],
      showCheckIn: false,
      pullUpLoad: null,
      descriptionDetail: '<table><tbody><tr><td width="240px" height="240px"><img id="qrimage" src="//qr.api.cli.im/qr?data=http%253A%252F%252F192.168.1.162%253A8033%252F%2523%252Fregister&amp;level=H&amp;transparent=false&amp;bgcolor=%23ffffff&amp;forecolor=%23000000&amp;blockpixel=12&amp;marginblock=1&amp;logourl=&amp;size=260&amp;kid=cliim&amp;key=9ee0765087ace26c717af8d86bd50a6e"></td></tr></tbody></table>',
      flag: false,
      number: 1,
      idCode: '',
      wait: true  // 是否为待认领，true为待认领，false为已认领
    };
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    },
    go(url) {
      this.$router.push(url);
    },
    showPopUp() {
      this.flag = true;
      console.log(this.flag);
    },
    genghuan() {
      this.flag = !this.flag;
    },
    add() {
      this.number++;
    },
    sub() {
      if (this.number >= 2) {
        this.number--;
      }
    },
    confirm() {
      this.go('/protocol?sign=1');
    }
  },
  mounted() {
    this.pullUpLoad = null;
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
    Slider,
    NoResult,
    MHeader,
    Scroll
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/mixin.scss";
@import "../../common/scss/variable.scss";
.home-wrapper {
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
    height: 4rem;
  }
  .content {
    /*margin: 0.88rem 0;*/
    position: absolute;
    top: 0.88rem;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    .slider-wrapper {
      background: $color-highlight-background;
    }
    .info-wait {
      background: $color-highlight-background;
      padding: 0 0.3rem;
      .item {
        width: 100%;
        height: 1.1rem;
        font-size: $font-size-large-ss;
        line-height: 1.1rem;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        span:first-child {
          margin-right: 0.3rem;
          color: #333;
        }
        img {
          height: 0.21rem;
          margin-top: 0.4rem;
        }
        .price {
          color: $primary-color;
          font-family: DINAlternate-Bold;
        }
      }
    }
    .info {
      background: $color-highlight-background;
      padding: 0 0.3rem;
      .item {
        width: 100%;
        height: 1.1rem;
        font-size: $font-size-medium-x;
        line-height: 1.1rem;
        border-bottom: 1px solid #eee;
        display: flex;
        /*justify-content: space-between;*/
        span:first-child {
          margin-right: 0.3rem;
          color: #333;
          width: 1.21rem;
        }
        span:nth-child(2) {
          /*flex: 1;*/
        }
        img {
          height: 0.21rem;
          margin-top: 0.4rem;
        }
        .price {
          color: $primary-color;
          font-family: DINAlternate-Bold;
        }
      }
    }
    .description {
      background: #fff;
      padding: 0.3rem;
      .description-title {
        font-size: 0;
        .border {
          border: 2px solid $primary-color;
          height: 0.26rem;
          width: 0;
          display: inline-block;
          margin-right: 0.08rem;
        }
        span {
          font-size: $font-size-medium-x;
          line-height: 0.42rem;
        }
      }
    }
  }
  .footer {
    width: 100%;
    height: 0.98rem;
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 0 0.3rem;
    display: flex;
    justify-content: space-between;
    background: $color-highlight-background;
    border-top: 1px solid $color-border;
    align-items: center;
    button {
      display: inline-block;
      width: 100%;
      height: 0.9rem;
      background: $primary-color;
      border-radius: 0.08rem;
      color: $color-highlight-background;
      font-size: 0.32rem;
    }
  }
}
</style>
