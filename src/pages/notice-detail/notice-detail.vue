<template>
  <div class="adopt-list-wrapper">
    <div class="content">
      <Scroll ref="scroll" :pullUpLoad="pullUpLoad">
        <div class="title">{{detail.title}}</div>
        <p class="prop"><span class="date">{{formatDate(detail.publishDatetime)}}</span></p>
        <div class="context">
          <p v-html="xyText" class="rich-text-description" ref="description"></p>
        </div>
      </Scroll>
    </div>
    <full-loading v-show="loading"></full-loading>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import FullLoading from 'base/full-loading/full-loading';
  import { getMessageDetail } from 'api/biz';
  import { setTitle, formatDate, formatImg } from 'common/js/util';

  export default {
    data() {
      return {
        pullUpLoad: null,
        loading: false,
        collectFlag: false,
        laudFlag: false,
        detail: {},
        contextList: [],
        xyText: ''
      };
    },
    mounted() {
      setTitle('公告详情');
      this.pullUpLoad = null;
      let code = this.$route.query.code;
      this.loading = true;
      getMessageDetail({
        code: code
      }).then((res) => {
        this.detail = res;
        this.xyText = this.detail.content;
        this.loading = false;
      }).catch(() => { this.loading = false; });
    },
    methods: {
      formatImg(img) {
        return formatImg(img);
      },
      formatDate(date) {
        return formatDate(date);
      },
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
      xyText() {
        this._refreshScroll();
      }
    },
    components: {
      Scroll,
      MHeader,
      FullLoading
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
      text-align: center;
      .title {
        font-size: 0.48rem;
        line-height: 0.67rem;
        margin-bottom: 0.22rem;
        font-family: 'PingFangSC-Semibold';
      }
      .prop {
        font-size: $font-size-small;
        line-height: 0.33rem;
        color: #999;
        display: flex;
        padding-bottom: 0.4rem;
        .date {
          flex: 1;
        }
        .collect {
          margin-right: 0.3rem;
        }
      }
      .context {
        font-size: 0.28rem;
        line-height: 0.4rem;
        text-align: left;
        .context-content {
          margin-bottom: 0.3rem;
        }
        img {
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
