<template>
  <div class="adopt-list-wrapper">
    <div class="content">
      <Scroll ref="scroll" :pullUpLoad="pullUpLoad">
        <div class="title">{{detail.projectName}}</div>
        <div class="info">
          <div class="author">
            <!--<img src="./head.png">-->
            <span>{{detail.maintainerName}}</span>
          </div>
          <span class="datetime">{{formatDate(detail.updateDatetime)}}</span>
        </div>
        <div class="context rich-text-description" v-html="context" ref="description"></div>
        <img :src="formatImg(item)" v-for="item in detail.photolist" class="mr-img">
        <!--<div class="context" ref="description">-->
          <!--<div class="context-content">-->
            <!--<p v-for="item in contextList">{{item}}</p>-->
          <!--</div>-->
          <!--<img :src="formatImg(item)" v-for="item in detail.photolist">-->
        <!--</div>-->
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
        pullUpLoad: null,
        code: '',
        detail: {},
        contextList: [],
        context: ''
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
          this.context = res.description;
          this.detail = res;
          this.detail.photolist = this.detail.pic.split('||');
          // this.contextList = this.detail.description.split(/\n/);
        }).catch(() => {});
      },
      _refreshScroll() {
        setTimeout(() => {
          this.$refs.scroll.refresh();
          let imgs = this.$refs.description.getElementsByTagName('img');
          for (let i = 0; i < imgs.length; i++) {
            let _img = imgs[i];
            if (_img.complete) {
              setTimeout(() => {
                this.$refs.scroll.refresh();
              }, 20);
              continue;
            }
            _img.onload = () => {
              setTimeout(() => {
                this.$refs.scroll.refresh();
              }, 20);
            };
          }
        }, 20);
      }
    },
    watch: {
      context() {
        this._refreshScroll();
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
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0.3rem;
      overflow: auto;
      .context {
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
    .mr-img {
      max-width: 100%;
    }
  }
</style>
