<template>
  <div class="me-wrapper">
    <div class="bg">
      <div class="top">
        <div class="info">
          <div class="avatar">
            <img :src="src" class="head" @click.stop="go(`/userAvatar`)">
          </div>
          <div class="text">
            <p class="name">{{userDetail.nickname|| '未设置昵称'}}</p>
            <p class="autograph">简介：{{cut(userDetail.introduce, 20) || '此人很懒，没什么留言'}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="gray"></div>
    <div class="me-list" ref="description">
      <Scroll :pullUpLoad="pullUpLoad" ref="scroll">
        <div class="item" @click="go('/mall-shopCart')">
          <img src="./cart@2x.png"  class="me-list-icon">
          <span>我的购物车</span>
          <img src="./more@2x.png" class="fr more">
        </div>
        <div class="wing"></div>
        <div class="item" @click="go('/store-order')">
          <img src="./order@2x.png" class="me-list-icon">
          <span>我的商场订单</span>
          <img src="./more@2x.png" class="fr more">
        </div>
        <div class="wing"></div>
        <div class="item" @click="go('/store-message')">
          <img src="./message@2x.png" class="me-list-icon">
          <span>我的商场消息</span>
          <img src="./more@2x.png" class="fr more">
        </div>
        <div class="item" @click="go('/address')">
          <img src="./address@2x.png" class="me-list-icon">
          <span>我的收货地址</span>
          <img src="./more@2x.png" class="fr more">
        </div>
        <div class="item" @click="go('/settings')">
          <img src="./setting@2x.png" class="me-list-icon">
          <span>设置</span>
          <img src="./more@2x.png" class="fr more">
        </div>
      </Scroll>
    </div>
    <full-loading v-show="loading"></full-loading>
    <toast ref="toast" :text="text"></toast>
    <m-footer-sjd-mall></m-footer-sjd-mall>
  </div>
</template>
<script>
  import Toast from 'base/toast/toast';
  import FullLoading from 'base/full-loading/full-loading';
  import MHeader from 'components/m-header/m-header';
  import MFooterSjdMall from 'components/m-footer-sjd-mall/m-footer-sjd-mall';
  import Scroll from 'base/scroll/scroll';
  import { formatImg, setTitle, getUserId, clearUser, cut } from 'common/js/util';
  import {getCookie} from 'common/js/cookie';
  import {getUserDetail} from 'api/user';

  export default {
    data() {
      return {
        loading: false,
        showBack: false,
        userDetail: {},
        text: '',
        src: '',
        config: {
          user1: getUserId()
        },
        isLogin: false
      };
    },
    created() {
      this.pullUpLoad = null;
      this._refreshScroll();
    },
    methods: {
      cut(str, num) {
        return cut(str, num);
      },
      getUserId() {
        return getUserId();
      },
      go(url) {
        if(getUserId()) {
          this.$router.push(url);
        } else {
          this.text = '您未登录！';
          this.$refs.toast.show();
          clearUser();
          setTimeout(() => {
            this.$router.push('/login');
          }, 1000);
        }
      },
      _refreshScroll() {
        setTimeout(() => {
          this.$refs.scroll.refresh();
          let imgs = this.$refs.description.getElementsByTagName('img');
          for (let i = 0; i < imgs.length; i++) {
            let _img = imgs[i];
            if (_img.complete) {
              setTimeout(() => {
                this.$refs.scroll.refresh();
              }, 20);
              continue;
            }
            _img.onload = () => {
              setTimeout(() => {
                this.$refs.scroll.refresh();
              }, 20);
            };
          }
        }, 20);
      },
      toAuth() { // 认证
        this.go('/auth?rzStatus=' + this.rzStatus);
      }
    },
    mounted() {
      setTitle('我的');
      let userId = getCookie('userId');
      if(userId) {
        this.loading = true;
        Promise.all([
          getUserDetail({userId: userId})
        ]).then(([res1]) => {
          this.userDetail = res1;
          this.src = formatImg(this.userDetail.photo) || require('./../../common/image/avatar@2x.png');
          this.loading = false;
        }).catch(() => { this.loading = false; });
      } else {
        this.text = '您未登录';
        this.$refs.toast.show();
        setTimeout(() => {
          this.$router.push('/login');
        }, 1000);
      }
    },
    components: {
      MFooterSjdMall,
      Toast,
      Scroll,
      FullLoading,
      MHeader
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  .me-wrapper {
    /*background: #fff;*/
    position: fixed;
    width: 100%;
    bottom: 0.98rem;
    top: 0;
    left: 0;
    .fl {
      float: left;
    }
    .fr {
      float: right;
    }
    .gray {
      width: 100%;
      height: 0.2rem;
      padding: 0;
      background: transparent;
    }
    .bg {
      overflow: auto;
      background: url("./top@2x.png") no-repeat;
      background-size: 100% 100%;
      color: $color-highlight-background;
      .top {
        padding: 0.64rem 0 0;
        .info {
          width: 100%;
          text-align: center;
          margin-bottom: 0.64rem;
          .avatar {
            img {
              width: 1.4rem;
              height: 1.4rem;
              border-radius: 50%;
              margin-bottom: 0.28rem;
            }
          }

          .text {
            .name {
              font-size: 0.32rem;
              margin-bottom: 0.2rem;
            }
            .autograph {
              font-size: 0.24rem;
            }
          }
        }
        .wing {
          height: 0.3rem;
          width: 0rem;
          border-left: 1px solid rgba(255, 255, 255, 0.5);
        }
      }
    }
    .me-list {
      background: $color-highlight-background;
      position: absolute;
      top: 4.2rem;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: auto;
      padding: 0 0.3rem;
      .item {
        width: 100%;
        height: 1.1rem;
        font-size: $font-size-medium-x;
        font-family: PingFangSC-Semibold;
        line-height: 1.1rem;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
        .me-list-icon {
          margin-right: 0.1rem;
          }
        }
        img {
          height: 0.34rem;
        }
        span {
          flex: 1;
          position: relative;
          .msg{
            display: inline-block;
            position: absolute;
            right: 0.1rem;
            top: 50%;
            -webkit-transform: translateY(-50%);
            -moz-transform: translateY(-50%);
            -ms-transform: translateY(-50%);
            -o-transform: translateY(-50%);
            transform: translateY(-50%);
            width: 0.2rem;
            height: 0.2rem;
            -webkit-border-radius: 100%;
            -moz-border-radius: 100%;
            border-radius: 100%;
            background-color: red;
        }
      }
    }
    .white {
      width: 100%;
      height: 0.3rem;
      padding: 0;
    }
  }
</style>
