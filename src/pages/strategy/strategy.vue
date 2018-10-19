<template>
  <div class="home-wrapper">
    <m-header class="cate-header" title="攻略"></m-header>
    <div class="content">
      <div class="content-wrap" v-html="detail"></div>
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
    top: 0.88rem;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: $primary-color;
    padding: 0.3rem;

    .content-wrap {
      width: 100%;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: #fff;
      border-radius: 0.2rem;
      font-size: 0.26rem;
      line-height: 1.8;
      padding: 0.3rem;
    }

    .in {
      background: $color-highlight-background;
      border-radius: 0.15rem;
      padding: 0.3rem 0.3rem 0.78rem 0.3rem;
      margin-bottom: 0.3rem;
      .in-title {
        text-align: center;
        img {
          width: 3.72rem;
          height: 0.84rem;
          margin-bottom: 0.54rem;
        }
      }
      .p1 {
        font-size: $font-size-medium-xx;
        line-height: $font-size-large-xx;
        margin-bottom: 0.14rem;
      }
      .p2 {
        color: $color-text-l;
        font-size: $font-size-small;
        line-height: 0.33rem;
        margin-bottom: 0.5rem;
      }
      .icons {
        font-size: 0;
        .icon-item {
          display: inline-block;
          width: 50%;
          margin-bottom: 0.4rem;
          /*display: flex;*/
          /*align-items: center;*/
          img {
            width: 1.06rem;
            height: 1.06rem;
            margin-right: 0.2rem;
          }
          .icon-item-info {
            display: inline-block;
            .icon-item-title {
              font-size: $font-size-medium;
              margin-bottom: 0.2rem;
            }
            .icon-item-text {
              font-size: $font-size-medium-s;
              color: #999;
            }
          }
        }
      }
      .tip {
        height: 2.71rem;
        background: url("./tip-bg@2x.png") no-repeat;
        background-size: 100% 100%;
        padding: 0.3rem;
        .tip-title {
          font-size: 0;
          display: flex;
          align-items: center;
          margin-bottom: 0.33rem;
          img {
            width: 0.34rem;
            height: 0.34rem;
            margin-right: 0.12rem;
          }
          span {
            color: #666;
            font-size: $font-size-medium-xx;
          }
        }
        .tip-content {
          font-size: $font-size-medium;
          line-height: 0.4rem;
          color: #666;
        }
      }
    }
    .out {
      background: $color-highlight-background;
      border-radius: 0.15rem;
      padding: 0.3rem;
      .out-title {
        text-align: center;
        img {
          width: 3.72rem;
          height: 0.84rem;
          margin-bottom: 0.54rem;
        }
      }
      .p1 {
        font-size: $font-size-medium-xx;
        line-height: $font-size-large-xx;
        margin-bottom: 0.81rem;
      }
      .tree {
        text-align: center;
        img {
          width: 3.8rem;

        }
      }
    }
  }
}
</style>
