<template>
  <div class="home-wrapper">
    <m-header class="cate-header" title="我的树"></m-header>
    <div class="content">
      <Scroll :pullUpLoad="pullUpLoad">
      <div class="tree-panel">
        <img src="./certification@2x.png" class="certification">
        <div class="me" @click="change">
          <img src="./head.png" alt="">
          <span>礼物</span>
        </div>
        <div class="icons">
          <img src="./map@2x.png">
          <img src="./prop@2x.png">
          <img src="./strategy@2x.png" @click="go('/strategy')">
          <img src="./give@2x.png">
        </div>
        <img src="./romantic-story@2x.png" class="romantic-story">
      </div>
      <div class="tab">
        <span :class="tab === 0 ? 'active' : ''" @click="changeTab(0)">最新动态</span>
        <span :class="tab === 1 ? 'active' : ''" @click="changeTab(1)">认养人介绍</span>
        <span :class="tab === 2 ? 'active' : ''" @click="changeTab(2)">古树详情</span>
      </div>
      <div class="tab-panel">
        <div class="dynamic">
          <div class="heads">
            <div class="head-item">
              <img src="./head.png" alt="">
              <span class="number">10g</span>
            </div>
            <div class="head-item">
              <img src="./head.png" alt="">
              <span class="number">10g</span>
            </div>
            <div class="head-item">
              <img src="./head.png" alt="">
              <span class="number">10g</span>
            </div>
            <div class="head-item">
              <img src="./head.png" alt="">
              <span class="number">10g</span>
            </div>
            <div class="head-item">
              <img src="./head.png" alt="">
              <span class="number">10g</span>
            </div>
            <div class="head-item">
              <img src="./head.png" alt="">
              <span class="number">10g</span>
            </div>
          </div>
          <div class="dynamic-info">
            <div class="dynamic-info-item">
              <p><span class="name">空荡荡</span><span class="activity">收取8g</span><span class="time">1小时前</span></p>
            </div>
            <div class="dynamic-info-item">
              <p><span class="name">空荡荡</span><span class="activity">收取8g</span><span class="time">1小时前</span></p>
            </div>
            <div class="dynamic-info-item">
              <p><span class="name">空荡荡</span><span class="activity">收取8g</span><span class="time">1小时前</span></p>
            </div>
            <div class="dynamic-info-item">
              <p><span class="name">空荡荡</span><span class="activity">收取8g</span><span class="time">1小时前</span></p>
            </div>
          </div>
          <div class="more">查看更多</div>
        </div>
      </div>
      </Scroll>
    </div>
    <!--<div class="footer">-->
      <!--<button @click="showPopUp">集体下单</button>-->
      <!--<button @click="showPopUp">捐赠下单</button>-->
    <!--</div>-->
    <div :class="['mask',flag ? 'show' : '']" @click="genghuan"></div>
    <!--<div :class="['buypart',flag ? 'show' : '']">-->
      <!--<div class="title">-->
        <!--<div class="title-pic">-->
          <!--<img src="./emotion@2x.png" alt="">-->
        <!--</div>-->
        <!--<div class="title-right">-->
          <!--<p>樟子松</p>-->
          <!--<i @click="genghuan">X</i>-->
          <!--<p class="position"><img src="./position@2x.png" alt="">四川</p>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="packaging">-->
        <!--<p class="packaging-title">认养年限(年)</p>-->
        <!--<div class="select">-->
          <!--<div class="select-item">-->
            <!--<span>一年：2018-01-01至2018-12-31</span>-->
            <!--<img src="./choosed@2x.png" v-show="wechat">-->
            <!--<img src="./unchoosed@2x.png" v-show="!wechat">-->
          <!--</div>-->
          <!--<div class="select-item">-->
            <!--<span>一年：2018-01-01至2018-12-31</span>-->
            <!--<img src="./choosed@2x.png" v-show="wechat">-->
            <!--<img src="./unchoosed@2x.png" v-show="!wechat">-->
          <!--</div>-->
          <!--<div class="select-item">-->
            <!--<span>一年：2018-01-01至2018-12-31</span>-->
            <!--<img src="./choosed@2x.png" v-show="wechat">-->
            <!--<img src="./unchoosed@2x.png" v-show="!wechat">-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="number">-->
        <!--<span>认养份数</span>-->
        <!--<div class="right">-->
          <!--<img class="diamonds right-item" @click="add" src="./add@2x.png">-->
          <!--<input class="num right-item" v-model="number">-->
          <!--<img class="diamonds right-item" @click="sub" src="./sub@2x.png">-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="other">-->
        <!--<span>下单识别码</span>-->
        <!--<input type="text" v-model="idCode">-->
      <!--</div>-->
      <!--<div class="buypart-bottom">-->
        <!--<div class="confirm" @click="confirm()">确定(总额：¥2999)</div>-->
      <!--</div>-->
    <!--</div>-->
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
      pullUpLoad: false,
      flag: false,
      tab: 0

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
    },
    genghuan() {
      this.flag = !this.flag;
    },
    changeTab(index) {
      this.tab = index;
      console.log(this.tab);
    }
  },
  mounted() {
    this.pullUpLoad = null;
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
  bottom: 0;
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
    .tree-panel {
      height: 7.66rem;
      background: url("./tree-bg@2x.png") no-repeat;
      background-size: 100% 100%;
      padding: 0.58rem 0.3rem 0.25rem;
      position: relative;
      .certification {
        width: 0.92rem;
        height: 0.82rem;
      }
      .me {
        width: 1.5rem;
        height: 0.78rem;
        background: #fff;
        display: inline-block;
        border-top-left-radius: 0.5rem;
        border-bottom-left-radius: 0.5rem;
        opacity: 0.8;
        position: absolute;
        right: 0;
        top: 0.58rem;
        font-size: 0;
        img {
          width: 0.6rem;
          height: 0.6rem;
          border-radius: 50%;
          border: 1px solid $primary-color;
          position: absolute;
          top: 0.1rem;
          left: 0.1rem;
        }
        span {
          font-size: 0.3rem;
          color: #23AD8C;
          line-height: 0.78rem;
          position: absolute;
          right: 0.1rem;
        }
      }
      .icons {
        width: 4.1rem;
        display: flex;
        justify-content: space-between;
        position: absolute;
        bottom: 0.28rem;
        img {
          width: 0.72rem;
          height: 0.76rem;
        }
      }
      .romantic-story {
        width: 1.16rem;
        height: 0.93rem;
        position: absolute;
        bottom: 0.28rem;
        right: 0.3rem
      }
    }
    .tab {
      height: 0.9rem;
      padding: 0 0.6rem;
      display: flex;
      justify-content: space-between;
      background: $color-highlight-background;
      border-bottom: 1px solid $color-border;
      span {
        font-size: 0.3rem;
        line-height: 0.9rem;
      }
      .active {
        color: $primary-color;
        border-bottom: 1px solid $primary-color;
      }
    }
    .tab-panel {
      background: $color-highlight-background;
      padding: 0.3rem 0.3rem 0 0.3rem;
      .dynamic {
        .heads {
          display: flex;
          justify-content: space-between;
          .head-item {
            display: inline;
            position: relative;
            img {
              width: 0.8rem;
              height: 0.8rem;
              border-radius: 50%;
            }
            .number {
              display: inline-block;
              width: 0.36rem;
              height: 0.36rem;
              line-height: 0.36rem;
              color: $color-highlight-background;
              background: $primary-color;
              border-radius: 50%;
              font-size: 0.03rem;
              letter-spacing: -0.89px;
              position: absolute;
              right: -0.1rem;
              bottom: 0.15rem;
              border: 2px solid #fff;
              box-sizing: content-box;
            }
          }
        }
        .dynamic-info {
          border-bottom: 1px solid $color-border;
          .dynamic-info-item {
            font-size: $font-size-medium;
            padding: 0.3rem 0;
            p {
              display: flex;
              align-items: center;
              .name {
                font-family: PingFangSC-Medium;
                margin-right: 0.2rem;
              }
              .activity {
                flex: 1;
              }
              .time {
                font-size: $font-size-small;
                color: #999;
              }
            }
          }
        }
        .more {
          height: 0.8rem;
          color: #666;
          font-size: $font-size-medium-s;
          line-height: 0.8rem;
          text-align: center;
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
        span:first-child {
          margin-right: 0.3rem;
        }
        img {
          height: 0.21rem;
          margin-top: 0.4rem;
        }
      }
    }
    .gray {
      width: 100%;
      height: 0.2rem;
      padding: 0;
      background: #f5f5f5;
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
      width: 3.2rem;
      height: 0.9rem;
      background: $primary-color;
      border-radius: 0.08rem;
      color: $color-highlight-background;
      font-size: 0.32rem;
    }
  }
  .mask {
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000000, $alpha: 0.7);
    position: absolute;
    top: 0;
    left: 0;
    display: none;
  }
  .show {
    display: block;
  }
}
</style>
