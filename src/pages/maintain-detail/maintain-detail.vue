<template>
  <div class="adopt-list-wrapper">
    <m-header class="cate-header" title="养护详情"></m-header>
    <div class="content">
      <Scroll>
        <div class="title">{{detail.projectName}}</div>
        <div class="info">
          <div class="author">
            <!--<img src="./head.png">-->
            <span>{{detail.maintainerName}}</span>
          </div>
          <span class="datetime">{{formatDate(detail.updateDatetime)}}</span>
        </div>
        <!--<div class="context" v-html="context"></div>-->
        <div class="context" ref="description">
          <div class="context-content">
            <p v-for="item in contextList">{{item}}</p>
          </div>
          <img :src="formatImg(item)" v-for="item in detail.photolist">
        </div>
      </Scroll>
    </div>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import {setTitle, formatDate, formatImg} from 'common/js/util';
  import { getMaintainRecordsDetail } from 'api/biz';

  export default {
    data() {
      return {
        code: '',
        detail: {},
        contextList: [],
        context: '<table><tbody><tr><td width="240px" height="240px"><img id="qrimage" src="//qr.api.cli.im/qr?data=http%253A%252F%252F192.168.1.162%253A8033%252F%2523%252Fregister&amp;level=H&amp;transparent=false&amp;bgcolor=%23ffffff&amp;forecolor=%23000000&amp;blockpixel=12&amp;marginblock=1&amp;logourl=&amp;size=260&amp;kid=cliim&amp;key=9ee0765087ace26c717af8d86bd50a6e"></td></tr></tbody></table>'
      };
    },
    mounted() {
      setTitle('养护详情');
      this.code = this.$route.query.code;
      this.getDetail();
    },
    methods: {
      formatDate(date) {
        return formatDate(date, 'yyyy-MM-dd');
      },
      formatImg(img) {
        return formatImg(img);
      },
      go(url) {
        this.$router.push(url);
      },
      getDetail() {
        getMaintainRecordsDetail({
          code: this.code
        }).then((res) => {
          this.detail = res;
          this.detail.photolist = this.detail.pic.split('||');
          this.contextList = this.detail.content.split(/\n/);
        }).catch(() => {});
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
      .context {
        padding-top: 0.3rem;
        font-size: $font-size-medium-s;
        line-height: 0.37rem;
        .context-content {
          margin-bottom: 0.3rem;
        }
        img {
          width: 100%;
        }
      }
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
