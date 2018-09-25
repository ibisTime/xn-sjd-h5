<template>
  <div class="home-wrapper">
    <m-header class="cate-header" title="我的林空间" :showBack="showBack" actText="分享" @action="action"></m-header>
    <div class="content">
      <div class="me" @click="change">
        <img src="./avatar@2x.png" alt="">
      </div>
      <img src="./charts@2x.png" alt="" class="charts" @click="go('/charts')">
      <div @click="go('/homepage?type=1')" class="block t1"></div>
      <div @click="go('/homepage?type=2')" class="block t2"></div>
      <div @click="go('/homepage?type=3')" class="block t3"></div>
      <div @click="go('/homepage?type=4')" class="block t4"></div>
    </div>
    <div class="side" v-show="flag">
      <div class="mask" @click="change"></div>
      <div class="me-content" v-show="flag">
        <div class="me-info">
          <img src="./avatar@2x.png" alt="">
          <div class="text">
            <p><span>KOALA</span><span class="lv">LV 1</span></p>
          </div>
        </div>
        <div class="me-content-list">
          <div class="item">
            <img src="./change-avatar@2x.png" alt="">
            <span>修改头像</span>
          </div>
          <div class="item" @click="go('/carbon-bubble')">
            <img src="./carbon-bubble@2x.png" alt="">
            <span>我的碳泡泡</span>
          </div>
          <div class="item">
            <img src="./romantic-story@2x.png" alt="">
            <span>我的浪漫故事</span>
          </div>
          <div class="item" @click="go('/gift')">
            <img src="./gift@2x.png" alt="">
            <span>我的礼物</span>
          </div>
          <div class="item">
            <img src="./notify@2x.png" alt="">
            <span>我的通知</span>
          </div>
        </div>
      </div>
    </div>
    <toast ref="toast" :text="text"></toast>
    <m-footer></m-footer>
    <router-view></router-view>
  </div>
</template>
<script>
import Toast from 'base/toast/toast';
import Scroll from 'base/scroll/scroll';
import FullLoading from 'base/full-loading/full-loading';
import MFooter from 'components/m-footer/m-footer';
import Slider from 'base/slider/slider';
import NoResult from 'base/no-result/no-result';
import MHeader from 'components/m-header/m-header';
import { formatAmount } from 'common/js/util';
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
      showBack: false,
      proList: [{

      }],
      showCheckIn: false,
      pullUpLoad: false,
      flag: false
    };
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    },
    action() {
      this.showCheckIn = true;
    },
    close() {
      this.showCheckIn = false;
    },
    go(url) {
      this.$router.push(url);
    },
    change() {
      this.flag = !this.flag;
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
    MFooter,
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
    height: 3rem;
  }
  .content {
    /*margin: 0.88rem 0;*/
    position: absolute;
    top: 0.88rem;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: url("./bg@2x.png") no-repeat;
    background-size: 100% 100%;
    .me {
      width: 1rem;
      height: 0.78rem;
      background: $color-highlight-background;
      display: inline-block;
      border-top-right-radius: 50%;
      border-bottom-right-radius: 50%;
      margin-top: 0.28rem;
      opacity: 0.8;
      position: relative;
      img {
        width: 0.6rem;
        height: 0.6rem;
        border-radius: 50%;
        border: 1px solid $primary-color;
        position: absolute;
        top: 0.1rem;
        right: 0.1rem;
      }
    }
    .charts {
      position: absolute;
      top: 0.3rem;
      right: 0.3rem;
      width: 0.72rem;
    }
    .block {
      display: inline-block;
      width: 1.4rem;
      height: 1.5rem;
      /*border: 1px solid black;*/
      position: absolute;
    }
    .t1 {
      top: 0.8rem;
      left: 3rem;
    }
    .t2 {
      left: 0.5rem;
      top: 4.5rem;
    }
    .t3 {
      top: 4rem;
      right: 1.5rem;
    }
    .t4 {
      right: 1.5rem;
      top: 7rem;
    }
  }
  .side {
    width: 100%;
    z-index: 1000;
    position: absolute;
    top: -0.88rem;
    bottom: -0.98rem;
    left: 0;
    right: 0;
    overflow: auto;
    .mask {
      width: 100%;
      height: 100%;
      background: #000;
      opacity: 0.5;
      position: absolute;
      top: 0;
      left: 0;
    }
    .me-content {
      width: 5.78rem;
      height: 100%;
      background: $color-highlight-background;
      position: absolute;
      padding: 2rem 0.3rem;
      .me-info {
        text-align: center;
        img {
          width: 1.3rem;
          height: 1.3rem;
          margin-bottom: 0.34rem;
        }
        .text {
          vertical-align: middle;
          margin-bottom: 0.32rem;
          p:first-child{
            margin-bottom: 0.06rem;
            font-size: 0;
            span:first-child {
              font-size: $font-size-medium-xx;
              color: #333;
            }
          }
          .lv {
            background: #FEAE62;
            border-radius: 0.06rem;
            width: 0.67rem;
            height: 0.33rem;
            display: inline-block;
            color: #fff;
            font-size: 0.24rem;
            margin-left: 0.23rem;
            text-align: center;
            padding-top: 0.03rem;
          }
        }
      }
      .me-content-list {
        height: 1.1rem;
        .item {
          font-size: 0;
          border-bottom: 1px solid $color-border;
          display: flex;
          align-items: center;
          img {
            width: 0.34rem;
            margin-right: 0.26rem;
            margin-left: 0.1rem;
            line-height: 1.1rem;
          }
          span {
            font-size: 0.3rem;
            display: inline-block;
            height: 1.1rem;
            line-height: 1.1rem;
          }
        }
      }
    }
  }
}
</style>
