<template>
  <transition name="filter-fade">
    <div v-show="showFlag" class="filters-wrapper" @click="hide">
      <div class="content" @click.stop>
        <scroll :pullUpLoad="pullUpLoad" ref="scroll">
          <div class="items">
            <div class="item" :class="can1" @click="choseCan(1)">从大到小</div>
            <div class="item" :class="can0" @click="choseCan(0)">从小到大</div>
          </div>
        </scroll>
      </div>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import {isUnDefined} from 'common/js/util';

  export default {
    props: {
      orderColumn: {
        type: String,
        default: ''
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
        can: '2',
        variety: ''
      };
    },
    computed: {
      can1() {
        return this.can === '1' ? 'active' : '';
      },
      can0() {
        return this.can === '0' ? 'active' : '';
      }
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
      choseFree() {
        this.isFree = !this.isFree;
      },
      choseCan(index) {
        if(index === 0) {
          if(this.can === '0') {
            this.can = '2';
          } else {
            this.can = '0';
          }
        } else {
          if(this.can === '1') {
            this.can = '2';
          } else {
            this.can = '1';
          }
        }
        this.order = this.can;
        this.hide();
        let params = {};
        if(this.can !== '2') {
          params = {
            orderDir: this.can === '1' ? 'desc' : 'asc',
            orderColumn: this.orderColumn
          };
        }
        this.$emit('ageConfirm', params);
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

      .title {
        padding-left: 0.2rem;
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
          /*display: inline-block;*/
          /*margin-left: 0.2rem;*/
          margin-bottom: 0.2rem;
          min-width: 1.8rem;
          height: 0.6rem;
          line-height: 0.6rem;
          border-radius: 0.06rem;
          text-align: center;
          background: #fff;
          /*<!--border: 1px solid $second-color;-->*/

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
