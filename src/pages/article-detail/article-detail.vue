<template>
  <div class="adopt-list-wrapper">
    <m-header class="cate-header" title="文章详情"></m-header>
    <div class="content">
      <Scroll :pullUpLoad="pullUpLoad">
        <div class="title">在林空间里，我的古树第一次修剪了树干</div>
        <p class="prop"><span class="date">2018.09.14</span><span class="collect">收藏 280</span><span class="laud">赞 280</span></p>
        <div class="context" v-html="context"></div>
      </Scroll>
    </div>
    <div class="footer">
      <div class="collect">
        <img src="./uncollect@2x.png" v-show="!collectFlag" @click="collect">
        <img src="./collect@2x.png" v-show="collectFlag">
        <span>120</span>
      </div>
      <div class="border"></div>
      <div class="laud">
        <img src="./unlaud@2x.png" v-show="!laudFlag" @click="laud">
        <img src="./laud@2x.png" v-show="laudFlag">
        <span>120</span>
      </div>
    </div>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';

  export default {
    data() {
      return {
        collectFlag: false,
        laudFlag: false,
        context: '<table><tbody><tr><td width="240px" height="240px"><img id="qrimage" src="//qr.api.cli.im/qr?data=http%253A%252F%252F192.168.1.162%253A8033%252F%2523%252Fregister&amp;level=H&amp;transparent=false&amp;bgcolor=%23ffffff&amp;forecolor=%23000000&amp;blockpixel=12&amp;marginblock=1&amp;logourl=&amp;size=260&amp;kid=cliim&amp;key=9ee0765087ace26c717af8d86bd50a6e"></td></tr></tbody></table>'
      };
    },
    created() {
      this.pullUpLoad = null;
    },
    methods: {
      go(url) {
        this.$router.push(url);
      },
      collect() {
        // 调接口收藏
        this.collectFlag = true;
        // 收藏数+1
      },
      laud() {
        // 调接口点赞
        this.laudFlag = true;
        // 点赞数+1
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
    bottom: 0.98rem;
    top: 0;
    left: 0;
    .fl {
      float: left;
    }
    .fr {
      float: right;
    }
    .content {
      background: $color-highlight-background;
      position: absolute;
      top: 0.88rem;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0.3rem;
      .title {
        font-size: 0.4rem;
        line-height: 0.56rem;
        margin-bottom: 0.4rem;
      }
      .prop {
        font-size: $font-size-small;
        line-height: 0.33rem;
        color: #999;
        display: flex;
        padding-bottom: 0.3rem;
        border-bottom: 1px solid $color-border;
        .date {
          flex: 1;
        }
        .collect {
          margin-right: 0.3rem;
        }
      }
      .context {
        padding-top: 0.3rem;
        font-size: $font-size-medium-s;
        line-height: 0.37rem;
        img {
          padding: 0 0.3rem;
          width: 100%;
        }
      }
    }
    .footer {
      background: #fff;
      position: fixed;
      width: 100%;
      bottom: 0;
      left: 0;
      height: 0.98rem;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      border-top: 1px solid $color-border;
      .border {
        width: 0;
        height: 0.4rem;
        border-right: 1px solid $color-border;
      }
      div {
        font-size: 0;
        display: flex;
        align-items: center;
        img {
          width: 0.38rem;
          height: 0.38rem;
          margin-right: 0.1rem;
        }
        span {
          font-size: $font-size-small;
          line-height: 0.33rem;
          color: #999;
        }
      }
    }
  }
</style>
