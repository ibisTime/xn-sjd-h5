<template>
  <transition name="filter-fade">
    <div v-show="showFlag" class="filters-wrapper" @click="hide">
      <div class="content" @click.stop>
        <scroll :pullUpLoad="pullUpLoad" ref="scroll">
          <div class="items">
            <div class="title">树级</div>
            <div class="item" :class="can1" @click="choseCan(1)">一级</div>
            <div class="item" :class="can2" @click="choseCan(2)">二级</div>
            <div class="item" :class="can3" @click="choseCan(3)">三级</div>
          </div>
          <div class="items">
            <div class="title">树种</div>
            <!--<div class="item">樟树</div>-->
            <!--<div class="item">柏树</div>-->
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
  import { getPinzhongList } from 'api/biz';

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
        can: '4',
        variety: ''
      };
    },
    computed: {
      can1() {
        return this.can === '1' ? 'active' : '';
      },
      can2() {
        return this.can === '2' ? 'active' : '';
      },
      can3() {
        return this.can === '3' ? 'active' : '';
      }
    },
    created() {
      this.pullUpLoad = null;
      this.getPinzhongList();
    },
    methods: {
      getPinzhongList() {
        getPinzhongList().then((res) => {
          this.varietyList = res;
        }).catch(() => {});
      },
      isUndefined(value) {
        return isUnDefined(value);
      },
      initData() {

      },
      choseFree() {
        this.isFree = !this.isFree;
      },
      choseCan(index) {
        if(index === 1) {
          if(this.can === '1') {
            this.can = '4';
          } else {
            this.can = '1';
          }
        } else if(index === 2) {
          if(this.can === '2') {
            this.can = '4';
          } else {
            this.can = '2';
          }
        } else if(index === 3) {
          if(this.can === '3') {
            this.can = '4';
          } else {
            this.can = '3';
          }
        }
        console.log(this.can);
      },
      choseVariety(item) {
        this.variety = item.variety;
      },
      varietyClass(item) {
        return this.variety === item.variety ? 'active' : '';
      },
      reset() {
        this.variety = '';
        this.can = '2';
      },
      confirm() {
        this.hide();
        this.$emit('confirm', this.can, this.variety);
      },
      hide() {
        this.showFlag = false;
      },
      show() {
        this.showFlag = true;
        this.initData();
      },
      priceCls(index) {
        return this.priceIndex === index ? 'active' : '';
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
