<template>
  <div class="mall-wrapper">
    <!--<m-header class="cate-header" title="首页" :showBack="showBack" actText="签到" @action="action"></m-header>-->
    <div class="content">
      <div class="slider-wrapper">
        <slider :loop="loop">
          <div class="home-slider" v-for="item in banners" :key="item.code">
            <a :href="item.url||'javascript:void(0)'" :style="getImgSyl(item.pic)"></a>
          </div>
        </slider>
      </div>
    </div>
    <m-footer></m-footer>
    <router-view></router-view>
  </div>
</template>
<script>
import MFooter from 'components/m-footer/m-footer';
import Slider from 'base/slider/slider';
import MHeader from 'components/m-header/m-header';
import { formatAmount, formatImg, formatDate } from 'common/js/util';
export default {
  // name: "home",
  data() {
    return {
      // showDots: false,
      loop: true,
      banners: [
        {
          code: 'mall1',
          pic: require('./mall1.png')
        },
        {
          code: 'mall2',
          pic: require('./mall2.png')},
        {
          code: 'mall3',
          pic: require('./mall3.png')},
        {
          code: 'mall4',
          pic: require('./mall4.png')}
      ]
    };
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    },
    formatImg(img) {
      return formatImg(img);
    },
    formatDate(date, format) {
      return formatDate(date, format);
    },
    go(url) {
      this.$router.push(url);
    },
    getImgSyl(imgs) {
      return {
        // backgroundImage: `url(${formatImg(imgs)})`
        backgroundImage: `url(${imgs})`
      };
    }
  },
  mounted() {
  },
  components: {
    MFooter,
    Slider,
    MHeader
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/mixin.scss";
@import "../../common/scss/variable.scss";
.mall-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0.98rem;
  width: 100%;
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .banner-default {
    width: 100%;
    height: 3rem;
  }
  .content {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    .slider-wrapper {
      padding-bottom: 0.2rem;
      background: $color-highlight-background;
      height: 100%;
      width: 100%;
      overflow: hidden;
      .slider {
        .dots {
          .dot {
            background: #eee;
          }
        }
      }
      .home-slider {
        height: 100%;
      }
      a {
        display: block;
        height: 100%;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
