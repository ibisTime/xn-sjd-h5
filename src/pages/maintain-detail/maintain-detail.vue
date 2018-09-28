<template>
  <div class="adopt-list-wrapper">
    <m-header class="cate-header" title="文章详情"></m-header>
    <div class="content">
      <Scroll :pullUpLoad="pullUpLoad">
        <div class="title">在林空间里，我的古树第一次修剪了树干</div>
        <div class="info">
          <div class="author">
            <img src="./head.png" alt="">
            <span>张三</span>
          </div>
          <span class="datetime">2018-08-12 12:00:00</span>
        </div>
        <div class="context" v-html="context"></div>
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
        context: '<table><tbody><tr><td width="240px" height="240px"><img id="qrimage" src="//qr.api.cli.im/qr?data=http%253A%252F%252F192.168.1.162%253A8033%252F%2523%252Fregister&amp;level=H&amp;transparent=false&amp;bgcolor=%23ffffff&amp;forecolor=%23000000&amp;blockpixel=12&amp;marginblock=1&amp;logourl=&amp;size=260&amp;kid=cliim&amp;key=9ee0765087ace26c717af8d86bd50a6e"></td></tr></tbody></table>'
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
      .info {
        display: flex;
        align-items: center;
        margin-bottom: 0.4rem;
       .author {
         flex: 1;
         align-items: center;
         display: flex;
         img {
           width: 0.64rem;
           height: 0.64rem;
           margin-right: 0.2rem;
           border-radius: 50%;
         }
         span {
           font-size: $font-size-medium-xx;
         }
       }
      }
      .datetime {
        color: $color-text-l;
        font-size: $font-size-small;
        line-height: $font-size-medium;
      }
    }
  }
</style>
