<template>
  <div class="me-wrapper">
    <div class="bg">
      <div class="top">
        <div class="info">
          <div class="avatar">
            <img :src="src" class="head" @click.stop="go(`/userInfo`)">
            <div class="auth" @click="toAuth" v-show="isLogin">
              <img src="./auth@2x.png">
              <span>{{rzText}}</span>
            </div>
          </div>
          <div class="text">
            <p class="name">{{userDetail.nickname|| '未设置昵称'}}</p>
            <p class="autograph">简介：{{cut(userDetail.introduce, 20) || '此人很懒，没什么留言'}}</p>
          </div>
        </div>
        <div class="asset">
          <div class="asset-item" @click.stop="go('/money?accountNumber=' + cnyAccountNumber + '&amount=' + cny)">
            <span class="asset-name">余额</span>
            <span class="asset-num">{{formatAmount(cny)}}</span>
          </div>
          <div class="wing"></div>
          <div class="asset-item carbon-bubble" @click="go('/carbon-bubble?accountNumber=' + tppAccountNumber + '&amount=' + tpp)">
            <span class="asset-name">碳泡泡</span>
            <span class="asset-num">{{formatAmount(tpp)}}</span>
          </div>
          <div class="wing"></div>
          <div class="asset-item" @click.stop="go('/score')">
            <span class="asset-name">积分</span>
            <span class="asset-num">{{formatAmount(jf)}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="gray"></div>
    <div class="me-list" ref="description">
      <Scroll :pullUpLoad="pullUpLoad" ref="scroll">
        <div class="wing"></div>
        <div class="item" @click="go('/homepage')">
          <img src="./adopt@2x.png" class="me-list-icon">
          <span>我的认养</span>
          <img src="./more@2x.png" class="fr more">
        </div>
        <div class="wing"></div>
        <div class="item" @click="go('/my-order')">
          <img src="./order@2x.png" class="me-list-icon">
          <span>我的认养订单</span>
          <img src="./more@2x.png" class="fr more">
        </div>
        <div class="item" @click="go('/my-article')">
          <img src="./article@2x.png" class="me-list-icon">
          <span>我的文章</span>
          <img src="./more@2x.png" class="fr more">
        </div>
        <div class="item" @click="go('/my-collect')">
        <img src="./collection@2x.png" class="me-list-icon">
        <span>我的收藏</span>
        <img src="./more@2x.png" class="fr more">
        </div>
        <div class="item" @click="go('/invitation')">
          <img src="./invitation@2x.png" class="me-list-icon">
          <span>邀请有礼</span>
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
    <m-footer :ismsg="ismsg"></m-footer>
  </div>
</template>
<script>
  import Toast from 'base/toast/toast';
  import FullLoading from 'base/full-loading/full-loading';
  import MHeader from 'components/m-header/m-header';
  import MFooter from 'components/m-footer/m-footer';
  import Scroll from 'base/scroll/scroll';
  import { formatAmount, formatImg, setTitle, getUserId, clearUser, cut } from 'common/js/util';
  import {getCookie} from 'common/js/cookie';
  import {getUserDetail} from 'api/user';
  import { getAccount } from 'api/biz';
  import { isThreeMsg } from 'api/store';

  export default {
    data() {
      return {
        loading: false,
        showBack: false,
        userDetail: {
          introduce: ''
        },
        text: '',
        cny: 0,
        cnyAccountNumber: '',
        jf: 0,
        jfAccountNumber: '',
        tpp: 0,
        tppAccountNumber: '',
        src: '',
        config: {
          user1: getUserId()
        },
        ismsg: false,
        rzText: '未认证',
        rzStatus: '0',
        isLogin: false
      };
    },
    created() {
      this.pullUpLoad = null;
      this._refreshScroll();
      if(getUserId()) {
        this.isLogin = true;
        isThreeMsg(this.config).then(data => {
          if(data.existsUnread !== '0') {
            this.ismsg = true;
          }
        });
      }
    },
    methods: {
      cut(str, num) {
        return cut(str, num);
      },
      getUserId() {
        return getUserId();
      },
      formatAmount(amount) {
        return formatAmount(amount);
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
          getUserDetail({userId: userId}),
          getAccount({
            userId: userId
          })
        ]).then(([res1, res2]) => {
          this.userDetail = res1;
          if(res1.userExt) {
            if(res1.userExt.personAuthStatus) {
              this.rzText = '已个人认证';
              this.rzStatus = '2';
            }else if(res1.userExt.companyAuthStatus) {
              this.rzText = '已企业认证';
              this.rzStatus = '3';
            }else {
              this.rzText = '未认证';
              this.rzStatus = '0';
            }
          }
          this.src = formatImg(this.userDetail.photo) || require('./../../common/image/avatar@2x.png');
          res2.list.map((item) => {
            if(item.currency === 'CNY') {
              this.cny = item.amount;
              this.cnyAccountNumber = item.accountNumber;
            }
            if(item.currency === 'JF') {
              this.jf = item.amount;
              this.jfAccountNumber = item.accountNumber;
            }
            if(item.currency === 'TPP') {
              this.tpp = item.amount;
              this.tppAccountNumber = item.accountNumber;
            }
          });
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
      Toast,
      Scroll,
      FullLoading,
      MFooter,
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
        padding: 0.64rem 0 0.3rem;
        .info {
          width: 100%;
          text-align: center;
          margin-bottom: 0.56rem;
          .avatar {
            img {
              width: 1.4rem;
              height: 1.4rem;
              border-radius: 50%;
              margin-bottom: 0.28rem;
            }
            .auth {
              min-width: 1.72rem;
              height: 0.6rem;
              background: #418670;
              display: flex;
              align-items: center;
              position: absolute;
              right: 0;
              top: 1.1rem;
              text-align: center;
              padding: 0.2rem;
              border-top-left-radius: 0.3rem;
              border-bottom-left-radius: 0.3rem;
              img {
                width: 0.3rem;
                height: 0.3rem;
                margin-right: 0.1rem;
                margin-bottom: 0;
              }
              span {
                font-size: 0.24rem;
                color: $color-highlight-background;
              }
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
        .asset {
          display: flex;
          align-items: center;
          justify-content: space-around;
          .asset-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            .asset-name {
              font-size: 0.24rem;
              margin-bottom: 0.14rem;
              color: rgba(255, 255, 255, 0.8)
            }
            .asset-num {
              font-size: 0.3rem;
            }
          }
        }
        .wing {
          height: 0.3rem;
          width: 0rem;
          border-left: 1px solid rgba(255, 255, 255, 0.5);
        }
        /*<!--.carbon-bubble {-->*/
          /*<!--border-left: 1px solid $color-highlight-background;-->*/
          /*<!--border-right: 1px solid $color-highlight-background;-->*/
        /*<!--}-->*/
      }
      /*.title {*/
        /*font-size: 0.36rem;*/
        /*color: #fff;*/
        /*padding-top: 0.19rem;*/
        /*text-align: center;*/
      /*}*/
      /*<!--.content {-->*/
        /*<!--padding: 0.88rem 0.3rem 0;-->*/
        /*<!--.in-content {-->*/
          /*<!--background: $color-highlight-background;-->*/
          /*<!--.card {-->*/
            /*<!--height: 3.2rem;-->*/
            /*<!--background: $color-highlight-background;-->*/
            /*<!--border-radius: 0.12rem;-->*/
            /*<!--box-shadow: 0 8px 16px 0 #EBEFED;-->*/
            /*<!--margin-bottom: 0.25rem;-->*/
            /*<!--padding: 0.5rem;-->*/
            /*<!--position: relative;-->*/
            /*<!--.info {-->*/
              /*<!--height: 1.1rem;-->*/
              /*<!--img {-->*/
                /*<!--width: 1.1rem;-->*/
                /*<!--vertical-align: middle;-->*/
              /*<!--}-->*/
              /*<!--.head {-->*/
                /*<!--height: 1.1rem;-->*/
                /*<!--border-radius: 50%;-->*/
              /*<!--}-->*/
              /*<!--.text {-->*/
                /*<!--display: inline-block;-->*/
                /*<!--vertical-align: middle;-->*/
                /*<!--p:first-child{-->*/
                  /*<!--margin-bottom: 0.06rem;-->*/
                  /*<!--font-size: 0;-->*/
                  /*<!--display: flex;-->*/
                  /*<!--align-items: center;-->*/
                  /*<!--span:first-child {-->*/
                    /*<!--font-size: $font-size-medium-xx;-->*/
                    /*<!--color: #333;-->*/
                  /*<!--}-->*/
                /*<!--}-->*/
                /*<!--.mobile {-->*/
                  /*<!--font-size: $font-size-medium;-->*/
                  /*<!--color: #666;-->*/
                  /*<!--line-height: 0.4rem;-->*/
                /*<!--}-->*/
                /*<!--.lv {-->*/
                  /*<!--background: #FEAE62;-->*/
                  /*<!--border-radius: 0.06rem;-->*/
                  /*<!--width: 0.67rem;-->*/
                  /*<!--height: 0.33rem;-->*/
                  /*<!--display: inline-block;-->*/
                  /*<!--color: #fff;-->*/
                  /*<!--font-size: 0.24rem;-->*/
                  /*<!--margin-left: 0.23rem;-->*/
                  /*<!--text-align: center;-->*/
                  /*<!--padding-top: 0.03rem;-->*/
                /*<!--}-->*/
              /*<!--}-->*/
              /*<!--.me-more {-->*/
                /*<!--width: 0.21rem;-->*/
                /*<!--margin-top: 0.4rem;-->*/
              /*<!--}-->*/
            /*<!--}-->*/
            /*<!--.account {-->*/
              /*<!--padding-top: 0.4rem;-->*/
              /*<!--height: 1.5rem;-->*/
              /*<!--div {-->*/
                /*<!--display: inline-block;-->*/
                /*<!--width: 49%;-->*/
                /*<!--text-align: center;-->*/
              /*<!--}-->*/
              /*<!--.line {-->*/
                /*<!--height: 0.32rem;-->*/
                /*<!--border-right: 1px solid #ebebeb;-->*/
                /*<!--display: inline;-->*/
                /*<!--width: 0;-->*/
                /*<!--margin-top: 0.2rem;-->*/
              /*<!--}-->*/
              /*<!--.number {-->*/
                /*<!--color: #333;-->*/
                /*<!--font-weight:bold;-->*/
                /*<!--font-size: $font-size-large-s;-->*/
                /*<!--line-height: $font-size-large-x;-->*/
                /*<!--margin-bottom: 0.1rem;-->*/
              /*<!--}-->*/
              /*<!--.text {-->*/
                /*<!--font-size: $font-size-small;-->*/
                /*<!--line-height: $font-size-medium-xx;-->*/
                /*<!--color: #666;-->*/
              /*<!--}-->*/
            /*<!--}-->*/
            /*<!--.auth {-->*/
              /*<!--min-width: 1.72rem;-->*/
              /*<!--height: 0.6rem;-->*/
              /*<!--background: #d8eee8;-->*/
              /*<!--display: flex;-->*/
              /*<!--align-items: center;-->*/
              /*<!--position: absolute;-->*/
              /*<!--right: 0;-->*/
              /*<!--!*top: 0.75rem;*!-->*/
              /*<!--top: 0.1rem;-->*/
              /*<!--text-align: center;-->*/
              /*<!--padding: 0.2rem;-->*/
              /*<!--border-top-left-radius: 0.3rem;-->*/
              /*<!--border-bottom-left-radius: 0.3rem;-->*/
              /*<!--img {-->*/
                /*<!--width: 0.3rem;-->*/
                /*<!--height: 0.3rem;-->*/
                /*<!--margin-right: 0.1rem;-->*/
              /*<!--}-->*/
              /*<!--span {-->*/
                /*<!--font-size: 0.24rem;-->*/
                /*<!--color: #999;-->*/
              /*<!--}-->*/
            /*<!--}-->*/
            /*<!--.noUser {-->*/
              /*<!--width: 100%;-->*/
              /*<!--text-align: center;-->*/
              /*<!--font-size: 0;-->*/
              /*<!--height: 100%;-->*/
              /*<!--button {-->*/
                /*<!--width: 1.54rem;-->*/
                /*<!--height: 0.62rem;-->*/
                /*<!--border-radius: 0.04rem;-->*/
                /*<!--font-size: 0.3rem;-->*/
                /*<!--border: 1px solid $primary-color;-->*/
                /*<!--margin-top: 0.79rem;-->*/
              /*<!--}-->*/
              /*<!--.login {-->*/
                /*<!--background: $primary-color;-->*/
                /*<!--color: $color-highlight-background;-->*/
              /*<!--}-->*/
              /*<!--.register {-->*/
                /*<!--background: $color-highlight-background;-->*/
                /*<!--color: $primary-color;-->*/
                /*<!--margin-left: 0.4rem;-->*/
              /*<!--}-->*/
            /*<!--}-->*/
          /*<!--}-->*/
          /*<!--.card-bg {-->*/
            /*<!--background: url("./decoration@2x.png") no-repeat;-->*/
            /*<!--background-size: contain;-->*/
            /*<!--background-position: bottom;-->*/
          /*<!--}-->*/
        /*<!--}-->*/
      /*<!--}-->*/
    }
    .me-list {
      background: $color-highlight-background;
      position: absolute;
      top: 4.9rem;
      bottom: 0;
      left: 0rem;
      right: 0rem;
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
