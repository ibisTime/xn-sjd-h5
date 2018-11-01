<template>
  <div class="home-wrapper">
    <div class="content" >
      <Scroll :pullUpLoad="pullUpLoad" ref='scroll'>
        <div class="content-wrap rich-text-description" v-html="detail" ref="description"></div>
      </Scroll>
    </div>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll';
import FullLoading from 'base/full-loading/full-loading';
import Slider from 'base/slider/slider';
import NoResult from 'base/no-result/no-result';
import MHeader from 'components/m-header/m-header';
import { setTitle } from 'common/js/util';
import { getSystemConfigCkey } from 'api/general';

export default {
  data() {
    return {
      title: '正在加载...',
      loading: true,
      text: '',
      showBack: false,
      pullUpLoad: null,
      flag: false,
      tab: 0,
      detail: {}
    };
  },
  mounted() {
    setTitle('攻略');
    this.getInitData();
  },
  methods: {
    getInitData() {
      // STRATEGY
      getSystemConfigCkey('STRATEGY').then((data) => {
        this.loading = false;
        this.detail = data.cvalue;
      }).catch(() => { this.loading = false; });
    },
    // 富文本滚动
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
    detail() {
      this._refreshScroll();
    }
  },
  components: {
    FullLoading,
    Slider,
    NoResult,
    MHeader,
    Scroll
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/mixin.scss";
@import "../../common/scss/variable.scss";
.home-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .banner-default {
    width: 100%;
    height: 4rem;
  }
  .content {
    /*margin: 0.88rem 0;*/
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: $primary-color;
    padding: 0.3rem;

    .content-wrap {
      /*width: 100%;*/
      /*height: 100%;*/
      /*overflow-x: hidden;*/
      /*overflow-y: auto;*/
      background-color: #fff;
      border-radius: 0.2rem;
      /*font-size: 0.26rem;*/
      /*line-height: 1.8;*/
      /*padding: 0.3rem;*/
    }

  }
}
</style>
