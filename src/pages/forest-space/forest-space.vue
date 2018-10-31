<template>
  <div class="home-wrapper">
    <!--<m-header class="cate-header" title="我的林空间" :showBack="showBack"></m-header>-->
    <div class="content" @click="go('/homepage?type=1')">
      <div class="me" @click.stop.prevent="change">
        <img :src="src">
      </div>
      <img src="./charts@2x.png" alt="" class="charts" @click.stop.prevent="go('/charts')">
      <!--<div @click="go('/homepage?type=1')" class="block t1"></div>-->
      <!--<div @click="go('/homepage?type=2')" class="block t2"></div>-->
      <!--<div @click="go('/homepage?type=3')" class="block t3"></div>-->
      <!--<div @click="go('/homepage?type=4')" class="block t4"></div>-->
    </div>
    <div class="side" v-show="flag">
      <div class="mask" @click="change"></div>
      <div class="me-content" v-show="flag">
        <div class="me-info">
          <img :src="src">
          <div class="text">
            <p><span>{{user.nickname ? user.nickname : '未设置昵称'}}</span><span class="lv">LV {{user.level}}</span></p>
          </div>
        </div>
        <div class="me-content-list">
          <div class="item" @click="go('/userInfo')">
            <img src="./change-avatar@2x.png" alt="">
            <span>修改头像</span>
          </div>
          <div class="item" @click="go('/carbon-bubble')">
            <img src="./carbon-bubble@2x.png" alt="">
            <span>我的碳泡泡</span>
          </div>
          <div class="item" @click="go('/my-article')">
            <img src="./romantic-story@2x.png" alt="">
            <span>我的浪漫故事</span>
          </div>
          <div class="item" @click="go('/gift')">
            <img src="./gift@2x.png" alt="">
            <span>我的礼物</span>
          </div>
          <div class="item" @click="go('/charts')">
            <img src="./notify@2x.png" alt="">
            <span>我的好友</span>
          </div>
        </div>
      </div>
    </div>
    <full-loading v-show="loading"></full-loading>
    <toast ref="toast" :text="text"></toast>
    <m-footer></m-footer>
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
import { formatImg, setTitle, getUserId } from 'common/js/util';
import { getCookie } from 'common/js/cookie';
import { getUserDetail } from 'api/user';
export default {
  // name: "home",
  data() {
    return {
      title: '正在加载...',
      loading: false,
      toastText: '',
      currentList: [],
      hasMore: false,
      text: '',
      showBack: false,
      proList: [{

      }],
      showCheckIn: false,
      pullUpLoad: null,
      flag: false,
      user: {},
      src: ''
    };
  },
  methods: {
    getUserId() {
      return getUserId();
    },
    formatImg(img) {
      return formatImg(img);
    },
    action() {
      this.showCheckIn = true;
    },
    close() {
      this.showCheckIn = false;
    },
    go(url) {
      if(getUserId()) {
        this.$router.push(url);
      } else {
        this.text = '您未登录';
        this.$refs.toast.show();
      }
    },
    change() {
      if(getUserId()) {
        this.flag = !this.flag;
      } else {
        this.text = '您未登录';
        this.$refs.toast.show();
      }
    }
  },
  mounted() {
    this.pullUpLoad = null;
    setTitle('我的林空间');
    let userId = getCookie('userId');
    this.src = require('./../../common/image/avatar@2x.png');
    if(userId) {
      this.loading = true;
      getUserDetail({userId: userId}).then((res) => {
        this.user = res;
        this.src = formatImg(this.user.photo) || require('./../../common/image/avatar@2x.png');
        this.loading = false;
      }).catch(() => { this.loading = false; });
    }
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
  overflow-x: scroll;
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
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    /*width: 15rem;*/
    /*height: 100%;*/
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
      position: fixed;
      z-index: 999;
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
      z-index: 999;
    }
    .block {
      display: inline-block;
      width: 3.4rem;
      height: 3.5rem;
      /*border: 1px solid black;*/
      position: absolute;
      z-index: 999;
    }
    .t1 {
      top: 0rem;
      left: 2rem;
    }
    .t2 {
      left: 0;
      top: 4.5rem;
    }
    .t3 {
      top: 3rem;
      right: 0.5rem;
    }
    .t4 {
      right: 0.5rem;
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
      width: 3.78rem;
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
          border-radius: 50%;
        }
        .text {
          vertical-align: middle;
          margin-bottom: 0.32rem;
          p:first-child{
            margin-bottom: 0.06rem;
            font-size: 0;
            display: flex;
            align-items: center;
            justify-content: center;
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
