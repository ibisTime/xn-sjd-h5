<template>
  <div class="adopt-list-wrapper">
    <m-header class="cate-header" title="养护记录"></m-header>
    <div class="adopt-list">
      <Scroll :pullUpLoad="pullUpLoad">
        <div class="item" @click="go('/maintain-detail')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="info-title">在林空间里，我的古树第一次修剪了树干</p>
            <p class="info-pic">图片：5</p>
            <p class="bottom"><span class="name">张三</span><span class="datetime">2018-01-11 12:34:00</span></p>
          </div>
        </div>
        <div class="item" @click="go('/claim-gift')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="info-title">在林空间里，我的古树第一次修剪了树干</p>
            <p class="info-pic">图片：5</p>
            <p class="bottom"><span class="name">张三</span><span class="datetime">2018-01-11 12:34:00</span></p>
          </div>
        </div>
        <div class="item" @click="go('/claim-gift')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="info-title">在林空间里，我的古树第一次修剪了树干</p>
            <p class="info-pic">图片：5</p>
            <p class="bottom"><span class="name">张三</span><span class="datetime">2018-01-11 12:34:00</span></p>
          </div>
        </div>
        <div class="item" @click="go('/claim-gift')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="info-title">在林空间里，我的古树第一次修剪了树干</p>
            <p class="info-pic">图片：5</p>
            <p class="bottom"><span class="name">张三</span><span class="datetime">2018-01-11 12:34:00</span></p>
          </div>
        </div>
        <div class="item" @click="go('/claim-gift')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="info-title">在林空间里，我的古树第一次修剪了树干</p>
            <p class="info-pic">图片：5</p>
            <p class="bottom"><span class="name">张三</span><span class="datetime">2018-01-11 12:34:00</span></p>
          </div>
        </div>
        <div class="item" @click="go('/claim-gift')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="info-title">在林空间里，我的古树第一次修剪了树干</p>
            <p class="info-pic">图片：5</p>
            <p class="bottom"><span class="name">张三</span><span class="datetime">2018-01-11 12:34:00</span></p>
          </div>
        </div>
        <div class="item" @click="go('/claim-gift')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="info-title">在林空间里，我的古树第一次修剪了树干</p>
            <p class="info-pic">图片：5</p>
            <p class="bottom"><span class="name">张三</span><span class="datetime">2018-01-11 12:34:00</span></p>
          </div>
        </div>
        <div class="item" @click="go('/claim-gift')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="info-title">在林空间里，我的古树第一次修剪了树干</p>
            <p class="info-pic">图片：5</p>
            <p class="bottom"><span class="name">张三</span><span class="datetime">2018-01-11 12:34:00</span></p>
          </div>
        </div>
        <div class="item" @click="go('/claim-gift')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="info-title">在林空间里，我的古树第一次修剪了树干</p>
            <p class="info-pic">图片：5</p>
            <p class="bottom"><span class="name">张三</span><span class="datetime">2018-01-11 12:34:00</span></p>
          </div>
        </div>
        <div class="item" @click="go('/claim-gift')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="info-title">在林空间里，我的古树第一次修剪了树干</p>
            <p class="info-pic">图片：5</p>
            <p class="bottom"><span class="name">张三</span><span class="datetime">2018-01-11 12:34:00</span></p>
          </div>
        </div>
        <div class="item" @click="go('/claim-gift')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="info-title">在林空间里，我的古树第一次修剪了树干</p>
            <p class="info-pic">图片：5</p>
            <p class="bottom"><span class="name">张三</span><span class="datetime">2018-01-11 12:34:00</span></p>
          </div>
        </div>
        <div class="item" @click="go('/claim-gift')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="info-title">在林空间里，我的古树第一次修剪了树干</p>
            <p class="info-pic">图片：5</p>
            <p class="bottom"><span class="name">张三</span><span class="datetime">2018-01-11 12:34:00</span></p>
          </div>
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
          .info-title {
            font-size: $font-size-medium-x;
            line-height: $font-size-large-s;
            margin-bottom: 0.1rem;
          }
          .info-pic {
            color: #666;
            font-size: $font-size-small;
            line-height: 0.33rem;
            margin-bottom: 0.18rem;
          }
          .bottom {
            font-size: $font-size-small;
            line-height: 0.33rem;
            .name {
              color: #666;
              margin-right: 0.4rem;
            }
            .datetime {
              color: #999;
            }
          }
        }
      }
    }
  }
</style>
