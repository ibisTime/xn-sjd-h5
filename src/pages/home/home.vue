<template>
  <div class="home-wrapper">
    <m-header class="cate-header" title="首页" :showBack="showBack" actText="签到" @action="action"></m-header>
    <div class="content">
      <Scroll :pullUpLoad="pullUpLoad">
      <div class="slider-wrapper">
        <slider v-if="banners.length">
          <div class="home-slider" v-for="item in banners" :key="item.code">
          <a :href="item.url||'javascript:void(0)'" :style="getImgSyl(item.pic)"></a>
        </div>
        </slider>
        <!--<img src="./../../common/image/banner-default.png" class="banner-default">-->
        <router-link tag="div" to="/home/sign" class="sign-wrapper">
          <i class="sign-icon"></i>
        </router-link>
      </div>
      <div class="notice">
        <img src="./notice@2x.png">
        <div class="border"></div>
        <div class="title">古树名木认养，10月8日启动！</div>
        <div class="more">更多</div>
      </div>
      <div class="icons">
        <div class="icon-item" @click="goTreeList">
          <img src="./old-tree@2x.png">
          <p>古树认养</p>
        </div>
        <div class="icon-item">
          <img src="./water-source-forest@2x.png">
          <p>水源林</p>
        </div>
        <div class="icon-item">
          <img src="./emotion-forest@2x.png">
          <p>情感林</p>
        </div>
        <div class="icon-item">
          <img src="./booking@2x.png">
          <p>果树预售</p>
        </div>
      </div>
      <div class="emotion-article" @click="go('/emotion-channel')">
        <div class="text">
          <p class="Chinese">优选推文，情感频道</p>
          <p class="English">Preferred tweets, emotional channels</p>
        </div>
        <img src="./emotion@2x.png" class="emotion">
        <img src="./more@2x.png" class="more">
      </div>
      <div class="bulletin">
        <img src="./bulletin@2x.png">
        <div class="border"></div>
        <div class="title">恭喜Bluce，成功参加See的传承认养</div>
        <div class="more">更多</div>
      </div>
      <div class="hot">
        <div class="title">
          <span class="fl hot-title">热门推荐</span>
          <span class="fr more">更多</span>
        </div>
        <div class="proList">
          <div class="item">
            <img src="./emotion@2x.png" class="hot-pro-img">
            <div class="hot-pro-text">
              <p class="hot-pro-title">捐赠认养古树</p>
              <p class="hot-pro-introduction">2018-09-11</p>
              <p><span class="hot-pro-introduction">四川 成都</span><span class="hot-pro-price fr">¥2480.00</span></p>
            </div>
          </div>
          <div class="item">
            <img src="./emotion@2x.png" class="hot-pro-img">
            <div class="hot-pro-text">
              <p class="hot-pro-title">捐赠认养古树</p>
              <p class="hot-pro-introduction">2018-09-11</p>
              <p><span class="hot-pro-introduction">四川 成都</span><span class="hot-pro-price fr">¥2480.00</span></p>
            </div>
          </div>
          <div class="item">
            <img src="./emotion@2x.png" class="hot-pro-img">
            <div class="hot-pro-text">
              <p class="hot-pro-title">捐赠认养古树</p>
              <p class="hot-pro-introduction">2018-09-11</p>
              <p><span class="hot-pro-introduction">四川 成都</span><span class="hot-pro-price fr">¥2480.00</span></p>
            </div>
          </div>
          <div class="item">
            <img src="./emotion@2x.png" class="hot-pro-img">
            <div class="hot-pro-text">
              <p class="hot-pro-title">捐赠认养古树</p>
              <p class="hot-pro-introduction">2018-09-11</p>
              <p><span class="hot-pro-introduction">四川 成都</span><span class="hot-pro-price fr">¥2480.00</span></p>
            </div>
          </div>
          <div class="item">
            <img src="./emotion@2x.png" class="hot-pro-img">
            <div class="hot-pro-text">
              <p class="hot-pro-title">捐赠认养古树</p>
              <p class="hot-pro-introduction">2018-09-11</p>
              <p><span class="hot-pro-introduction">四川 成都</span><span class="hot-pro-price fr">¥2480.00</span></p>
            </div>
          </div>
        </div>
      </div>
      <!--<div class="mall-content">-->
        <!--<no-result v-show="!currentList.length && !hasMore" class="no-result-wrapper" title="抱歉，暂无商品"></no-result>-->
      <!--</div>-->
      </Scroll>
    </div>
    <toast ref="toast" :text="text"></toast>
    <m-footer></m-footer>
    <check-in :title="title" v-show="showCheckIn" @close="close"></check-in>
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
import CheckIn from 'base/check-in/check-in';
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
      banners: [
        {
          pic: require('./banner1.jpeg'),
          code: 1
        }, {
          pic: require('./banner2.jpeg'),
          code: 2
        }
      ]
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
    goTreeList() {
      this.go('/treeList');
    },
    go(url) {
      this.$router.push(url);
    },
    getImgSyl(imgs) {
      return {
        // backgroundImage: `url(${formatImg(imgs)})`
        backgroundImage: `url(${imgs})`
      };
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
    CheckIn,
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
    .slider-wrapper {
      padding-bottom: 0.2rem;
      background: $color-highlight-background;
      height: 3rem;
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
      .title {
        height: 0.45rem;
      }
      .hot-title {
        font-size: $font-size-medium-xx;
        line-height: $font-size-large-x;
      }
      .more {
        line-height: 0.33rem;
        color: #999;
        font-size: $font-size-small;
      }
      .proList {
        background: $color-highlight-background;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        font-size: 0;
        .item {
          width: 3.3rem;
          height: 3.98rem;
          margin-top: 0.24rem;
          border: 1px solid #e6e6e6;
          border-radius: 0.04rem;
          display: inline-block;
          .hot-pro-img {
            height: 2.3rem;
            width: 100%;
          }
          .hot-pro-text {
            padding: 0 0.2rem;
            p {
              font-size: 0;
            }
            .hot-pro-title {
              font-size: $font-size-medium-x;
              line-height: 0.42rem;
              margin-bottom: 0.1rem;
            }
            .hot-pro-introduction {
              color: $color-text-l;
              font-size: $font-size-small;
              line-height: $font-size-medium-xx;
              margin-bottom: 0.1rem;
              /*font-family: 'PingFangSC-Medium';*/
            }
            .hot-pro-price {
              color: $primary-color;
              font-size: $font-size-small;
              line-height: 0.29rem;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
}
</style>
