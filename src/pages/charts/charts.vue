<template>
  <div class="adopt-list-wrapper">
    <m-header class="cate-header" title="好友排行榜"></m-header>
    <div class="me">
      <div class="item" @click="go('/carbon-bubble')">
        <div class="order">
          <img src="./no1@2x.png" alt="">
        </div>
        <img src="./avatar@2x.png" alt="">
        <div class="info">
          <p class="name">你是我的教科书</p>
          <p class="date">获得了10个环保证书</p>
        </div>
        <span class="price fr">9.8kg</span>
      </div>
    </div>
    <div class="gray"></div>
    <div class="adopt-list">
      <Scroll :pullUpLoad="pullUpLoad">
        <div class="item" @click="go('/carbon-bubble')">
          <div class="order">
            <img src="./no1@2x.png" alt="">
          </div>
          <img src="./avatar@2x.png" alt="">
          <div class="info">
            <p class="name">你是我的教科书</p>
            <p class="date">获得了10个环保证书</p>
          </div>
          <span class="price fr">9.8kg</span>
        </div>
        <div class="item" @click="go('/carbon-bubble')">
          <div class="order">
            <img src="./no1@2x.png" alt="">
          </div>
          <img src="./avatar@2x.png" alt="">
          <div class="info">
            <p class="name">你是我的教科书</p>
            <p class="date">获得了10个环保证书</p>
          </div>
          <span class="price fr">9.8kg</span>
        </div>
        <div class="item" @click="go('/carbon-bubble')">
          <div class="order">
            <img src="./no1@2x.png" alt="">
          </div>
          <img src="./avatar@2x.png" alt="">
          <div class="info">
            <p class="name">你是我的教科书</p>
            <p class="date">获得了10个环保证书</p>
          </div>
          <span class="price fr">9.8kg</span>
        </div>
        <div class="item" @click="go('/carbon-bubble')">
          <div class="order">
            <img src="./no1@2x.png" alt="">
          </div>
          <img src="./avatar@2x.png" alt="">
          <div class="info">
            <p class="name">你是我的教科书</p>
            <p class="date">获得了10个环保证书</p>
          </div>
          <span class="price fr">9.8kg</span>
        </div><div class="item" @click="go('/carbon-bubble')">
        <div class="order">
          <img src="./no1@2x.png" alt="">
        </div>
        <img src="./avatar@2x.png" alt="">
        <div class="info">
          <p class="name">你是我的教科书</p>
          <p class="date">获得了10个环保证书</p>
        </div>
        <span class="price fr">9.8kg</span>
      </div><div class="item" @click="go('/carbon-bubble')">
        <div class="order">
          <img src="./no1@2x.png" alt="">
        </div>
        <img src="./avatar@2x.png" alt="">
        <div class="info">
          <p class="name">你是我的教科书</p>
          <p class="date">获得了10个环保证书</p>
        </div>
        <span class="price fr">9.8kg</span>
      </div>
        <div class="item" @click="go('/carbon-bubble')">
          <div class="order">
            <img src="./no1@2x.png" alt="">
          </div>
          <img src="./avatar@2x.png" alt="">
          <div class="info">
            <p class="name">你是我的教科书</p>
            <p class="date">获得了10个环保证书</p>
          </div>
          <span class="price fr">9.8kg</span>
        </div>
        <div class="item" @click="go('/carbon-bubble')">
          <div class="order">
            <img src="./no1@2x.png" alt="">
          </div>
          <img src="./avatar@2x.png" alt="">
          <div class="info">
            <p class="name">你是我的教科书</p>
            <p class="date">获得了10个环保证书</p>
          </div>
          <span class="price fr">9.8kg</span>
        </div>
        <div class="item" @click="go('/carbon-bubble')">
          <div class="order">
            <img src="./no1@2x.png" alt="">
          </div>
          <img src="./avatar@2x.png" alt="">
          <div class="info">
            <p class="name">你是我的教科书</p>
            <p class="date">获得了10个环保证书</p>
          </div>
          <span class="price fr">9.8kg</span>
        </div>
        <div class="item" @click="go('/carbon-bubble')">
          <div class="order">
            <img src="./no1@2x.png" alt="">
          </div>
          <img src="./avatar@2x.png" alt="">
          <div class="info">
            <p class="name">你是我的教科书</p>
            <p class="date">获得了10个环保证书</p>
          </div>
          <span class="price fr">9.8kg</span>
        </div>
        <div class="item" @click="go('/carbon-bubble')">
          <div class="order">
            <img src="./no1@2x.png" alt="">
          </div>
          <img src="./avatar@2x.png" alt="">
          <div class="info">
            <p class="name">你是我的教科书</p>
            <p class="date">获得了10个环保证书</p>
          </div>
          <span class="price fr">9.8kg</span>
        </div>
        <div class="item" @click="go('/carbon-bubble')">
          <div class="order">
            <img src="./no1@2x.png" alt="">
          </div>
          <img src="./avatar@2x.png" alt="">
          <div class="info">
            <p class="name">你是我的教科书</p>
            <p class="date">获得了10个环保证书</p>
          </div>
          <span class="price fr">9.8kg</span>
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
    .me {
      background: $color-highlight-background;
      margin-top: 0.88rem;
      padding: 0 0.3rem;
      .item {
        width: 100%;
        height: 1.3rem;
        font-size: $font-size-medium-x;
        line-height: 1.1rem;
        padding: 0.3rem 0;
        display: flex;
        align-items: center;
        .order {
          align-items: center;
          display: flex;
          img {
            width: 0.41rem;
            height: 0.51rem;
          }
        }
        img {
          width: 0.8rem;
          height: 0.8rem;
          margin-right: 0.2rem;
        }
        .info {
          display: inline-block;
          font-size: 0;
          flex: 1;
          .name {
            font-size: 0.3rem;
            line-height: 0.42rem;
            margin-bottom: 0.14rem;
          }
          .date {
            font-size: 0.24rem;
            line-height: 0.33rem;
            color: #999
          }
        }
        .price {

        }
      }
    }
    .gray {
      width: 100%;
      height: 0.2rem;
      padding: 0;
      background: $color-background;
    }
    .adopt-list {
      background: $color-highlight-background;
      position: absolute;
      top: 2.48rem;
      bottom: 0;
      left: 0.3rem;
      right: 0.3rem;
      .item {
        width: 100%;
        height: 1.3rem;
        font-size: $font-size-medium-x;
        border-bottom: 1px solid #eee;
        line-height: 1.1rem;
        padding: 0.3rem 0;
        display: flex;
        align-items: center;
        .order {
          align-items: center;
          display: flex;
          img {
            width: 0.41rem;
            height: 0.51rem;
          }
        }
        img {
          width: 0.8rem;
          height: 0.8rem;
          margin-right: 0.2rem;
        }
        .info {
          display: inline-block;
          font-size: 0;
          flex: 1;
          .name {
            font-size: 0.3rem;
            line-height: 0.42rem;
            margin-bottom: 0.14rem;
          }
          .date {
            font-size: 0.24rem;
            line-height: 0.33rem;
            color: #999
          }
        }
        .price {

        }
      }
    }
  }
</style>
