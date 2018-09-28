<template>
  <div class="adopt-list-wrapper">
    <m-header class="cate-header" title="礼物"></m-header>
    <div class="adopt-list">
      <Scroll :pullUpLoad="pullUpLoad">
        <div class="item" @click="go('/claim-gift')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="top"><span class="name">礼物名称</span><span class="status">待领取</span></p>
            <p class="date">2018.09.14</p>
          </div>
        </div>
        <div class="item" @click="go('/carbon-bubble')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="top"><span class="name">礼物名称</span><span class="status">待领取</span></p>
            <p class="date">2018.09.14</p>
          </div>
        </div>
        <div class="item" @click="go('/carbon-bubble')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="top"><span class="name">礼物名称</span><span class="status">待领取</span></p>
            <p class="date">2018.09.14</p>
          </div>
        </div>
        <div class="item" @click="go('/carbon-bubble')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="top"><span class="name">礼物名称</span><span class="status">待领取</span></p>
            <p class="date">2018.09.14</p>
          </div>
        </div>
        <div class="item" @click="go('/carbon-bubble')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="top"><span class="name">礼物名称</span><span class="status">待领取</span></p>
            <p class="date">2018.09.14</p>
          </div>
        </div>
        <div class="item" @click="go('/carbon-bubble')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="top"><span class="name">礼物名称</span><span class="status">待领取</span></p>
            <p class="date">2018.09.14</p>
          </div>
        </div>
        <div class="item" @click="go('/carbon-bubble')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="top"><span class="name">礼物名称</span><span class="status">待领取</span></p>
            <p class="date">2018.09.14</p>
          </div>
        </div>
        <div class="item" @click="go('/carbon-bubble')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="top"><span class="name">礼物名称</span><span class="status">待领取</span></p>
            <p class="date">2018.09.14</p>
          </div>
        </div>
        <div class="item" @click="go('/carbon-bubble')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="top"><span class="name">礼物名称</span><span class="status">待领取</span></p>
            <p class="date">2018.09.14</p>
          </div>
        </div>
        <div class="item" @click="go('/carbon-bubble')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="top"><span class="name">礼物名称</span><span class="status">待领取</span></p>
            <p class="date">2018.09.14</p>
          </div>
        </div>
        <div class="item" @click="go('/carbon-bubble')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="top"><span class="name">礼物名称</span><span class="status">待领取</span></p>
            <p class="date">2018.09.14</p>
          </div>
        </div>
      </Scroll>
    </div>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';

  export default {
    data() {
      return {
        showBack: false
      };
    },
    created() {
      this.pullUpLoad = null;
    },
    methods: {
      go(url) {
        this.$router.push(url);
      }
    },
    components: {
      Scroll,
      MHeader
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  .adopt-list-wrapper {
    background: #fff;
    position: fixed;
    width: 100%;
    bottom: 0;
    top: 0;
    left: 0;
    .fl {
      float: left;
    }
    .fr {
      float: right;
    }
    .adopt-list {
      background: $color-highlight-background;
      position: absolute;
      top: 0.88rem;
      bottom: 0;
      left: 0.3rem;
      right: 0.3rem;
      .item {
        width: 100%;
        /*height: 2.3rem;*/
        font-size: $font-size-medium-x;
        line-height: 1.1rem;
        border-bottom: 1px solid #eee;
        padding: 0.3rem 0;
        display: flex;
        align-items: center;
        img {
          width: 2rem;
          height: 1.7rem;
          margin-right: 0.2rem;
          border-radius: 0.08rem;
        }
        .info {
          display: inline-block;
          font-size: 0;
          flex: 1;
          .top {
            font-size: 0.3rem;
            line-height: 0.42rem;
            margin-bottom: 0.95rem;
            display: flex;
            justify-content: space-between;
            .name {
              flex: 1;
            }
            .status {
              font-size: $font-size-small;
            }
          }
          .date {
            font-size: 0.24rem;
            line-height: 0.33rem;
            color: #999;
          }
        }
      }
    }
  }
</style>
