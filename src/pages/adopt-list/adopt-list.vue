<template>
  <div class="adopt-list-wrapper">
    <m-header class="cate-header" title="已认养名单"></m-header>
    <div class="adopt-list">
      <Scroll :pullUpLoad="pullUpLoad">
        <div class="item" @click="go('/carbon-bubble')">
          <img src="./avatar@2x.png" alt="">
          <div class="info">
            <p class="name">你是我的教科书</p>
            <p class="date">2018.09.14</p>
          </div>
          <span class="price fr">¥2000.00</span>
        </div>
        <div class="item" @click="go('/carbon-bubble')">
          <img src="./avatar@2x.png" alt="">
          <div class="info">
            <p class="name">你是我的教科书</p>
            <p class="date">2018.09.14</p>
          </div>
          <span class="price fr">¥2000.00</span>
        </div>
        <div class="item" @click="go('/carbon-bubble')">
          <img src="./avatar@2x.png" alt="">
          <div class="info">
            <p class="name">你是我的教科书</p>
            <p class="date">2018.09.14</p>
          </div>
          <span class="price fr">¥2000.00</span>
        </div>
        <div class="item" @click="go('/carbon-bubble')">
          <img src="./avatar@2x.png" alt="">
          <div class="info">
            <p class="name">你是我的教科书</p>
            <p class="date">2018.09.14</p>
          </div>
          <span class="price fr">¥2000.00</span>
        </div><div class="item" @click="go('/carbon-bubble')">
        <img src="./avatar@2x.png" alt="">
        <div class="info">
          <p class="name">你是我的教科书</p>
          <p class="date">2018.09.14</p>
        </div>
        <span class="price fr">¥2000.00</span>
      </div><div class="item" @click="go('/carbon-bubble')">
        <img src="./avatar@2x.png" alt="">
        <div class="info">
          <p class="name">你是我的教科书</p>
          <p class="date">2018.09.14</p>
        </div>
        <span class="price fr">¥2000.00</span>
      </div>
        <div class="item" @click="go('/carbon-bubble')">
          <img src="./avatar@2x.png" alt="">
          <div class="info">
            <p class="name">你是我的教科书</p>
            <p class="date">2018.09.14</p>
          </div>
          <span class="price fr">¥2000.00</span>
        </div>
        <div class="item" @click="go('/carbon-bubble')">
          <img src="./avatar@2x.png" alt="">
          <div class="info">
            <p class="name">你是我的教科书</p>
            <p class="date">2018.09.14</p>
          </div>
          <span class="price fr">¥2000.00</span>
        </div>
        <div class="item" @click="go('/carbon-bubble')">
          <img src="./avatar@2x.png" alt="">
          <div class="info">
            <p class="name">你是我的教科书</p>
            <p class="date">2018.09.14</p>
          </div>
          <span class="price fr">¥2000.00</span>
        </div>
        <div class="item" @click="go('/carbon-bubble')">
          <img src="./avatar@2x.png" alt="">
          <div class="info">
            <p class="name">你是我的教科书</p>
            <p class="date">2018.09.14</p>
          </div>
          <span class="price fr">¥2000.00</span>
        </div><div class="item" @click="go('/carbon-bubble')">
        <img src="./avatar@2x.png" alt="">
        <div class="info">
          <p class="name">你是我的教科书</p>
          <p class="date">2018.09.14</p>
        </div>
        <span class="price fr">¥2000.00</span>
      </div>
      </Scroll>
    </div>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import {setTitle} from 'common/js/util';

  export default {
    data() {
      return {
        showBack: false
      };
    },
    created() {
      this.pullUpLoad = null;
      setTitle('我的');
      // this.pullUpLoad = null;
      // Promise.all([
      //   getUserSystemConfig('aboutUs'),
      //   getUserSystemConfig('telephone'),
      //   getUserSystemConfig('serviceTime')
      // ]).then(([aboutus, telephone, time]) => {
      //   this.loadingFlag = false;
      //   this.telephone = telephone.cvalue;
      //   this.time = time.cvalue;
      //   this.content = protocol.cvalue;
      // }).catch(() => {
      //   this.loadingFlag = false;
      // });
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
        height: 1.6rem;
        font-size: $font-size-medium-x;
        line-height: 1.1rem;
        border-bottom: 1px solid #eee;
        padding: 0.3rem 0;
        display: flex;
        align-items: center;
        img {
          height: 1rem;
          margin-right: 0.2rem;
        }
        .info {
          display: inline-block;
          font-size: 0;
          flex: 1;
          .name {
            font-size: 0.3rem;
            line-height: 0.42rem;
            margin-bottom: 0.25rem;
          }
          .date {
            font-size: 0.24rem;
            line-height: 0.33rem;
          }
        }
        .price {

        }
      }
    }
  }
</style>
