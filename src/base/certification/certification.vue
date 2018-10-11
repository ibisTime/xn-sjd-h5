<template>
  <div>
    <div class="all">
      <div class="check-in-wrapper"></div>
      <div class="cert-content">
        <img src="./close@2x.png" class="close" @click="close">
        <div ref="prop">
          <div ref="propGroup">
            <div class="full-loading" v-for="item in certificationArr" ref="propItem">
              <img :src="head" class="head">
              <p class="name">{{name}}</p>
              <p class="description">你已于{{formatDate(item.startDatetime)}}认养的{{item.tree.scientificName}}，已被认领，种植在{{item.tree.province}}{{item.tree.city}}{{item.tree.area}}。</p>
              <div class="code">
                <span>No.{{item.tree.treeNumber}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {formatDate} from 'common/js/util';
  import BScroll from 'better-scroll';
  export default {
    props: {
      certificationArr: {
        type: Array,
        default: []
      },
      head: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: ''
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
      _setSliderWidth() {
        let width = 0;
        let len = this.certificationArr.length;
        for (let i = 0; i < len; i++) {
          width += Number(window.getComputedStyle(this.$refs.propItem[i]).width.split('px')[0]);
        }
        this.$refs.propGroup.style.width = width + 25 * (len - 1) + 1 + 'px';
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
      },
      formatDate(date) {
        return formatDate(date, 'yyyy-MM-dd');
      },
      close() {
        this.$emit('close');
      }
    },
    watch: {
      prop() {
        setTimeout(() => {
          this._setSliderWidth();
        }, 20);
      }
    }
  };
</script>
<style scoped lang="scss">
  @import "~common/scss/variable";

  .all {
    .cert-content {
      height: 9.5rem;
      position: absolute;
      top: 0;
      width: 100%;
      bottom: 0;
      margin: auto;
      padding: 0 0.4rem;
    }
    .close {
      width: 0.5rem;
      position: absolute;
      right: 0.6rem;
      top: -1rem;
    }
    .check-in-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #000;
      opacity: 0.5;
    }
    .full-loading {
      width: 6rem;
      height: 9.37rem;
      float: left;
      font-size: 0;
      background: #fff;
      z-index: 1;
      text-align: center;
      margin-right: 25px;
      background: url("./bg@2x.png") no-repeat;
      background-size: 100% 100%;
      &:last-child {
        margin-right: 0;
      }
      .head {
        width: 0.94rem;
        height: 0.94rem;
        border-radius: 50%;
        margin-top: 2.6rem;
        margin-bottom: 0.24rem;
      }
      .name {
        font-size: 0.28rem;
        margin-bottom: 0.3rem;
      }
      .description {
        font-size: 0.23rem;
        line-height: 0.42rem;
        color: #666;
        margin: 0 0.66rem 1.14rem;
        text-align: left;
      }
      .code {
        display: inline-block;
        width: 3rem;
        height: 1rem;
        background: url("./code@2x.png") no-repeat;
        background-size: 100% 100%;
        font-size: 0.2rem;
        color: $primary-color;
        span {
          line-height: 1rem;
        }
      }
      .buttons {
        display: flex;
        justify-content: space-between;
        button {
          height: 0.9rem;
          padding: 0.22rem 0.4rem;
          background: $primary-color;
          border-radius: 0.08rem;
          display: inline-block;
          color: $color-highlight-background;
          font-size: $font-size-medium-xx;
        }
      }
    }
  }
</style>
