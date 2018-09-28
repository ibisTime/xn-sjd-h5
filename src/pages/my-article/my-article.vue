<template>
  <div class="adopt-list-wrapper">
    <m-header class="cate-header" title="情感频道" actText="发布" @action="action"></m-header>
    <div class="adopt-list">
      <Scroll :pullUpLoad="pullUpLoad">
        <div class="item" @click="go('/article-detail')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="title">从小苗长到大树，其实挺好的</p>
            <p class="prop"><span class="date">2018.09.14</span><span class="collect">收藏 280</span><span class="laud">赞 280</span></p>
          </div>
        </div>
        <div class="item" @click="go('/article-detail')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="title">从小苗长到大树，其实挺好的</p>
            <p class="prop"><span class="date">2018.09.14</span><span class="collect">收藏 280</span><span class="laud">赞 280</span></p>
          </div>
        </div>
        <div class="item" @click="go('/article-detail')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="title">从小苗长到大树，其实挺好的</p>
            <p class="prop"><span class="date">2018.09.14</span><span class="collect">收藏 280</span><span class="laud">赞 280</span></p>
          </div>
        </div>
        <div class="item" @click="go('/article-detail')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="title">从小苗长到大树，其实挺好的</p>
            <p class="prop"><span class="date">2018.09.14</span><span class="collect">收藏 280</span><span class="laud">赞 280</span></p>
          </div>
        </div>
        <div class="item" @click="go('/article-detail')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="title">从小苗长到大树，其实挺好的</p>
            <p class="prop"><span class="date">2018.09.14</span><span class="collect">收藏 280</span><span class="laud">赞 280</span></p>
          </div>
        </div>
        <div class="item" @click="go('/article-detail')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="title">从小苗长到大树，其实挺好的</p>
            <p class="prop"><span class="date">2018.09.14</span><span class="collect">收藏 280</span><span class="laud">赞 280</span></p>
          </div>
        </div>
        <div class="item" @click="go('/article-detail')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="title">从小苗长到大树，其实挺好的</p>
            <p class="prop"><span class="date">2018.09.14</span><span class="collect">收藏 280</span><span class="laud">赞 280</span></p>
          </div>
        </div>
        <div class="item" @click="go('/article-detail')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="title">从小苗长到大树，其实挺好的</p>
            <p class="prop"><span class="date">2018.09.14</span><span class="collect">收藏 280</span><span class="laud">赞 280</span></p>
          </div>
        </div>
        <div class="item" @click="go('/article-detail')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="title">从小苗长到大树，其实挺好的</p>
            <p class="prop"><span class="date">2018.09.14</span><span class="collect">收藏 280</span><span class="laud">赞 280</span></p>
          </div>
        </div>
        <div class="item" @click="go('/article-detail')">
          <img src="./tree.png" alt="">
          <div class="info">
            <p class="title">从小苗长到大树，其实挺好的</p>
            <p class="prop"><span class="date">2018.09.14</span><span class="collect">收藏 280</span><span class="laud">赞 280</span></p>
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
      },
      action() {
        this.go('/write-article');
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
          .title {
            font-size: 0.3rem;
            line-height: 0.42rem;
            margin-bottom: 0.95rem;
            display: flex;
            justify-content: space-between;
            flex: 1;
          }
          .prop {
            font-size: $font-size-small;
            line-height: 0.33rem;
            color: #999;
            display: flex;
            .date {
              flex: 1;
            }
            .collect {
              margin-right: 0.3rem;
            }
          }
        }
      }
    }
  }
</style>
