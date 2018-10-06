<template>
  <div class="prop-wrap" ref="prop">
    <!--<div class="prop-item">-->
      <!--<div class="prop-item-title">保护罩</div>-->
      <!--<div class="prop-item-condition">每天限量50万</div>-->
      <!--<div class="prop-item-img">-->
        <!--<img src="./cover-small@2x.png">-->
        <!--<span>2天</span>-->
      <!--</div>-->
      <!--<div class="prop-item-score enable" @click="convert">200积分</div>-->
    <!--</div>-->
    <!--<div class="prop-item">-->
      <!--<div class="prop-item-title">钻石保护罩</div>-->
      <!--<div class="prop-item-condition">钻石会员尊享</div>-->
      <!--<div class="prop-item-img">-->
        <!--<img src="./cover-small@2x.png">-->
        <!--<span>3天</span>-->
      <!--</div>-->
      <!--<div class="prop-item-score">200积分</div>-->
    <!--</div>-->
    <div class="prop-group" ref="propGroup">
      <div
        v-for="(item, index) in dataList"
        :key="index"
        ref="propItem"
        @click="_selectItem($event, index)"
        class="prop-item"
        :class="{active: index===currentIndex}">
        <div class="item-wrap">
          <div class="prop-item-title">保护罩</div>
          <div class="prop-item-condition">每天限量50万</div>
          <div class="prop-item-img">
            <div class="userPhoto" :style="getImgSyl('')"></div>
            <span>2天</span>
          </div>
          <div class="prop-item-score enable" @click="_convert()">200积分</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import { formatImg } from 'common/js/util';
  import defaltImg from './cover-small@2x.png';

  export default {
    props: {
      dataList: {
        type: Array,
        default: []
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    mounted() {
      this.getInit();
    },
    methods: {
      getInit() {
        setTimeout(() => {
          this._setSliderWidth();
          this._initSlider();
          let ele = this.$refs.propItem && this.$refs.propItem[this.currentIndex];
          ele && this.scroll.scrollToElement(ele, 200, true);
        }, 20);

        window.addEventListener('resize', () => {
          if (!this.scroll) {
            return;
          }
          this._setSliderWidth();
        });
      },
      getImgSyl(imgs) {
        let img = imgs ? formatImg(imgs) : defaltImg;
        return {
          backgroundImage: `url(${img})`
        };
      },
      _selectItem(e, index) {
        if (!e._constructed) {
          return;
        }
        this.scroll.scrollToElement(this.$refs.propItem[index], 200, true);
        this.$emit('select', index);
      },
      scrollToEleByIndex(index) {
        this.scroll.scrollToElement(this.$refs.propItem[index], 200, true);
      },
      _setSliderWidth() {
        let width = 0;
        for (let i = 0; i < this.dataList.length; i++) {
          width += Number(window.getComputedStyle(this.$refs.propItem[i]).width.split('px')[0]);
        }
        this.$refs.propGroup.style.width = width + 1 + 'px';
        if (this.scroll) {
          setTimeout(() => {
            this.scroll.refresh();
          }, 20);
        }
      },
      _initSlider() {
        this.scroll = new BScroll(this.$refs.prop, {
          scrollX: true,
          scrollY: false,
          click: true
        });
      }
    },
    watch: {
      prop() {
        setTimeout(() => {
          this._setSliderWidth();
        }, 20);
      }
    },
    _convert() {
      return false;
    }
  };
</script>

<style scoped lang="scss">
  @import "~common/scss/variable";

  .prop-wrap {
    .prop-group {
      position: relative;
      overflow: hidden;
    }
    .prop-item {
      float: left;
      width: 3.04rem;
      height: 4.08rem;
      padding: 0 0.15rem;

      .item-wrap{
        width: 100%;
        height: 100%;
        border: 1px solid #e5e5e5;
        border-radius: 0.15rem;
        padding: 0.3rem;
        text-align: center;
      }
      .prop-item-title {
        font-size: $font-size-medium;
        line-height: 0.4rem;
        margin-bottom: 0.08rem;
      }
      .prop-item-condition {
        color: #FFA40F;
        border: 1px solid #FFA40F;
        border-radius: 1rem;
        font-size: $font-size-small;
        line-height: 0.33rem;
        margin-bottom: 0.25rem;
      }
      .prop-item-img {
        position: relative;
        margin-bottom: 0.25rem;
        .userPhoto {
          width: 1.37rem;
          height: 1.37rem;
        }
        span {
          color: #438A0F;
          font-size: $font-size-small;
          line-height: 0.33rem;
          position: absolute;
          bottom: 0.15rem;
          left: 0.85rem;
        }
      }
      .prop-item-score {
        height: 0.64rem;
        background: #ccc;
        color: $color-highlight-background;
        font-size: $font-size-medium-x;
        line-height: 0.64rem;
        border-radius: 0.05rem;
      }
      .enable {
        background: $primary-color;
      }
    }
  }
</style>
