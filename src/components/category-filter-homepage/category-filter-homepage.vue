<template>
  <transition name="filter-fade">
    <div v-show="showFlag" class="filters-wrapper" @click="hide">
      <div class="content" @click.stop>
        <scroll :pullUpLoad="pullUpLoad" ref="scroll">
          <div class="items">
            <div class="title">树级</div>
            <div class="item" v-for="item in treeLevel" @click="choseLevel(item)" :class="levelClass(item)">{{item.name}}</div>
          </div>
          <div class="items">
            <div class="title">树种</div>
            <div class="item" v-for="item in varietyList" @click="choseVariety(item)" :class="varietyClass(item)">{{item.variety}}</div>
          </div>
        </scroll>
        <div class="footer" @click.stop>
          <div class="reset" @click="reset">重置</div>
          <div class="confirm" @click="confirm">确认</div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import {isUnDefined} from 'common/js/util';
  // import { getPinzhongList } from 'api/biz';

  export default {
    props: {
      outMinPrice: {
        type: String,
        default: ''
      },
      outMaxPrice: {
        type: String,
        default: ''
      },
      outPriceIndex: {
        type: Number,
        default: -1
      },
      outIsFree: {
        type: Boolean,
        default: false
      },
      outIsNew: {
        type: Boolean,
        default: false
      },
      varietyList: {
        type: Array,
        default: () => {
          return [];
        }
      },
      treeLevel: {
        type: Array,
        default: () => {
          return [];
        }
      }
    },
    data() {
      return {
        showFlag: false,
        priceIndex: -1,
        minPrice: '',
        maxPrice: '',
        isFree: false,
        isNew: false,
        variety: '',
        level: ''
      };
    },
    created() {
      this.pullUpLoad = null;
      console.log(this.treeLevel);
      // this.getPinzhongList();
    },
    methods: {
      // getPinzhongList() {
      //   getPinzhongList().then((res) => {
      //     this.varietyList = res;
      //   }).catch(() => {});
      // },
      isUndefined(value) {
        return isUnDefined(value);
      },
      initData() {

      },
      choseFree() {
        this.isFree = !this.isFree;
      },
      choseVariety(item) {
        this.variety = item.variety;
      },
      choseLevel(item) {
        this.level = item.code;
      },
      varietyClass(item) {
        return this.variety === item.variety ? 'active' : '';
      },
      levelClass(item) {
        return this.level === item.code ? 'active' : '';
      },
      reset() {
        this.variety = '';
        this.level = '';
      },
      confirm() {
        this.hide();
        this.$emit('confirm', this.level, this.variety);
      },
      hide() {
        this.showFlag = false;
      },
      show() {
        this.showFlag = true;
        this.initData();
      }
    },
    components: {
      Scroll
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";

  .filters-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1;
    position: absolute;
    top: 4.48rem;
    left: 0;
    right: 0;
    font-size: 0.26rem;

    &.filter-fade-enter-active {
      animation: filter-fadein 0.3s;
      .content {
        /*animation: filter-slide 0.3s;*/
      }
    }

    .content {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 0.26rem;
      background: #fff;
      left: 0;
      height: 100%;
      padding: 0.3rem 0 0;

      .title {
        padding-left: 0.2rem;
        padding-bottom: 0.2rem;
      }

      .price-select {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 0.46rem;
        margin-top: 0.35rem;
        padding-left: 0.2rem;
        height: 0.6rem;

        .price {
          display: flex;
          align-items: center;
          padding: 0 0.1rem;
          width: 2.6rem;
          height: 100%;
          border: 1px solid #dedede;

          input {
            width: 100%;
          }
        }

        .split {
          width: 0.2rem;
          flex: 0 0 0.2rem;
          height: 1px;
          background: #dedede;
        }
      }

      .items {
        .item {
          display: inline-block;
          margin-left: 0.2rem;
          margin-bottom: 0.2rem;
          min-width: 1.8rem;
          height: 0.6rem;
          line-height: 0.6rem;
          border-radius: 0.06rem;
          text-align: center;
          background: #fff;
          border: 1px solid $second-color;

          &.active {
            color: $second-color;
            background: rgb(255, 236, 236);
          }
        }
      }

      .footer {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        width: 100%;
        height: 0.9rem;
        line-height: 0.9rem;
        font-size: 0.32rem;
        position: fixed;
        bottom: 0;

        .reset {
          flex: 1;
          text-align: center;
          color: $color-text-l;
          background: #f2f3f7;
        }

        .confirm {
          flex: 1;
          text-align: center;
          color: #fff;
          background: $second-color;
        }
      }
    }
  }

  @keyframes filter-fadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes filter-slide {
    0% {
      transform: translate3d(100%, 0, 0);
    }
    50% {
      ransform: translate3d(50%, 0, 0);
    }
    100% {
      ransform: translate3d(0, 0, 0);
    }
  }
</style>
