<template>
  <transition name="filter-fade">
    <div v-show="showFlag" class="filters-wrapper" @click="hide">
      <div class="content" @click.stop>
        <scroll :pullUpLoad="pullUpLoad" ref="scroll">
          <div class="items">
            <div class="title">发货地</div>
            <div class="item" v-for="item in deliverList" @click="choseDeliver(item)" :class="deliverClass(item)">{{item}}</div>
          </div>
          <div class="items">
            <div class="title">产地</div>
            <div class="item" v-for="item in originList" @click="choseOrigin(item)" :class="originClass(item)">{{item}}</div>
          </div>
          <div class="items price">
            <div class="title">价格区间</div>
            <div class="input">
              <input type="text" v-model="minPrice" name="minPrice"> - <input type="text" v-model="maxPrice" name="maxPrice">
            </div>
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
      originList: {
        type: Array,
        default: () => {
          return [];
        }
      },
      deliverList: {
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
        origin: '',
        deliver: ''
      };
    },
    created() {
      this.pullUpLoad = null;
    },
    methods: {
      isUndefined(value) {
        return isUnDefined(value);
      },
      initData() {

      },
      choseOrigin(item) {
        this.origin = item;
      },
      choseDeliver(item) {
        this.deliver = item;
      },
      originClass(item) {
        return this.origin === item ? 'active' : '';
      },
      deliverClass(item) {
        return this.deliver === item ? 'active' : '';
      },
      reset() {
        this.origin = '';
        this.deliver = '';
        this.minPrice = '';
        this.margin = '';
      },
      confirm() {
        this.hide();
        let params = {};
        if(this.origin) {
          params.originPlace = this.origin;
        }
        if(this.deliver) {
          params.deliverPlace = this.deliver;
        }
        if(this.minPrice) {
          params.minSpecPrice = this.minPrice * 1000;
        }
        if(this.maxPrice) {
          params.maxSpecPrice = this.maxPrice * 1000;
        }
        this.$emit('confirm', params);
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
    top: 1.68rem;
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
      padding-top: 0.3rem;
      .scroll-content {
        padding-top: 0.3rem;
      }
      .title {
        padding-left: 0.2rem;
        margin-bottom: 0.2rem;
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
        .input {
          padding: 0 0.3rem;
          /*display: flex;*/
          /*align-items: center;*/
          width: 100%;
          input {
            width: 40%;
            height: 0.6rem;
            border: 1px solid $color-border;
            border-radius: 0.2rem;
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
