<template>
  <div class="home-wrapper">
    <div class="content">
      <div class="me" @click.stop.prevent="change">
        <img :src="src">
      </div>
      <img src="./charts@2x.png" class="charts" @click.stop.prevent="go('/allCharts')">
      <div @click="go('/homepage')" class="block t1"></div>
      <div @click="go('/charts')" class="block t2"></div>
      <div @click="go('/my-article')" class="block t3"></div>
      <!--<div @click="go('/homepage?type=4')" class="block t4"></div>-->
    </div>
    <div class="side" v-show="flag">
      <div class="mask" @click="change"></div>
      <div class="me-content" v-show="flag">
        <div class="me-info">
          <img :src="src" @click="go(`/userAvatar`)">
          <div class="text">
            <p><span>{{user.nickname ? user.nickname : '未设置昵称'}}</span><span class="lv">LV {{user.level}}</span></p>
          </div>
        </div>
        <div class="me-content-list">
          <!--<div class="item" @click="go('/userInfo')">-->
            <!--<img src="./change-avatar@2x.png">-->
            <!--<span>完善资料</span>-->
          <!--</div>-->
          <div class="item" @click="go('/carbon-bubble')">
            <img src="./carbon-bubble@2x.png">
            <span>我的碳泡泡<img src="./new@2x.png"/></span>
          </div>
          <!--<div class="item" @click="go('/my-article')">-->
            <!--<img src="./romantic-story@2x.png">-->
            <!--<span>我的浪漫故事<img src="./new@2x.png"/></span>-->
          <!--</div>-->
          <div class="item" @click="go('/gift')">
            <img src="./gift@2x.png">
            <span>我的礼物<img src="./new@2x.png"/></span>
          </div>
          <div class="item" @click="go('/message')">
            <img src="./notice@2x.png">
            <span>我的通知<img src="./new@2x.png"/></span>
          </div>
          <div class="item" @click="go('/settings')">
            <img src="./setting@2x.png">
            <span>设置</span>
          </div>
          <!--<div class="item" @click="go('/charts')">-->
            <!--<img src="./notify@2x.png">-->
            <!--<span>我的好友<img src="./new@2x.png"/></span>-->
          <!--</div>-->
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
import { formatImg, setTitle, getUserId, clearUser } from 'common/js/util';
import { getCookie } from 'common/js/cookie';
import {initShare} from 'common/js/weixin';
import { getUserDetail } from 'api/user';
import { share } from 'api/biz';
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
      if(getUserId() || url === '/allCharts') {
        this.$router.push(url);
      } else {
        this.text = '您未登录';
        this.$refs.toast.show();
        setTimeout(() => {
          this.$router.push('/login');
        }, 1000);
      }
    },
    change() {
      if(getUserId()) {
        this.flag = !this.flag;
      } else {
        this.text = '您未登录';
        this.$refs.toast.show();
        clearUser();
        setTimeout(() => {
          this.$router.push('/login');
        }, 1000);
      }
    },
    getInitWXSDKConfig() {
      this.loading = true;
      initShare({
        title: '我的氧圈',
        desc: '加入氧林，寄情古树，探寻更多古韵风情\n',
        link: location.href.split('#')[0] + '/#/froest-space?userReferee=' + this.userDetail.mobile + '&type=U',
        imgUrl: 'http://image.tree.hichengdai.com/FhDuAJ9CVvOGGgLV6CxfshkWzV9g?imageMogr2/auto-orient/thumbnail/!300x300',
        success: (res) => {
          this.channel = '';
          if(res.errMsg.indexOf('sendAppMessage') !== -1) {
            this.channel = 0;
          } else if(res.errMsg.indexOf('shareTimeline') !== -1) {
            this.channel = 1;
          } else if(res.errMsg.indexOf('shareQQ') !== -1) {
            this.channel = 2;
          } else if(res.errMsg.indexOf('shareQZone') !== -1) {
            this.channel = 3;
          }
          share(this.channel, '我的氧圈').then((res) => {
            if(res.code) {
              this.text = '分享成功';
              this.$refs.toast.show();
            }
          }).then(() => {});
        }
      }, (data) => {
        this.isWxConfiging = false;
        this.wxData = data;
        this.loading = false;
      }, (msg) => {
        alert(msg);
        this.isWxConfiging = false;
        this.wxData = null;
        this.loading = false;
      });
    }
  },
  mounted() {
    this.pullUpLoad = null;
    this.isWxConfiging = false;
    this.wxData = null;
    setTitle('我的氧圈');
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
    if(!this.isWxConfiging && !this.wxData && getUserId()) {
      this.getInitWXSDKConfig();
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
  /*overflow-x: scroll;*/
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
      position: relative;
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
      top: 3.5rem;
    }
    .t3 {
      top: 4rem;
      right: 0rem;
    }
    /*.t4 {*/
      /*right: 0.5rem;*/
      /*top: 7rem;*/
    /*}*/
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
            position: relative;
            img {
              width: 0.26rem;
              height: 0.16rem;
              position: absolute;
              top: 0.2rem;
              right: -0.6rem;
            }
          }
        }
      }
    }
  }
}
</style>
