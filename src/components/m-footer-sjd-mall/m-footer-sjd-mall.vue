<template>
  <div class="foot-mall-wrapper" @click.stop>
    <router-link tag="div" class="foot-item item-0" to="/mall">
      <i></i>
      <p>首页</p>
    </router-link>
    <router-link tag="div" class="foot-item item-1" to="/mall-type">
      <i></i>
      <p>商品分类</p>
    </router-link>
    <router-link tag="div" class="foot-item item-2" to="/mall-shopCart">
      <i></i>
      <p>购物车</p>
    </router-link>
    <router-link tag="div" class="foot-item item-3" to="/mall-me">
      <b class="msg" v-show="ismsg"></b>
      <i></i>
      <p>我的</p>
    </router-link>
  </div>
</template>
<script>
  // import {mapGetters} from 'vuex';
  // import Badge from 'base/badge/badge';
  // import {getUserId} from 'common/js/util';

  export default {
    props: {
      currentIndex: {
        type: Number,
        default: 0
      },
      ismsg: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      // count() {
      //   let userId = getUserId();
      //   if (this.chatData[userId]) {
      //     let unRead = this.chatData[userId].unRead;
      //     return unRead === 0 ? '' : unRead + '';
      //   }
      //   return '';
      // },
      // ...mapGetters([
      //   'chatData'
      // ])
    },
    methods: {
      goPublish() {
        this.$emit('goPublish');
      }
    },
    components: {
      // Badge
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .foot-mall-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    height: 0.98rem;
    width: 100%;
    border-top: 1px solid #dedede;
    background: #fff;
    color: $color-text-l;
    z-index: 100000;

    .foot-item {
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      .msg{
        position: absolute;
        top: 2%;
        right: 35%;
        display: inline-block;
        width: 0.2rem;
        height: 0.2rem;
        background-color: red;
        border-radius: 100%;
      }
      >i {
        display: inline-block;
        width: 0.42rem;
        height: 0.42rem;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
      }

      &.router-link-active {
        color: $mall-color;
      }

      .pub-item {
        position: absolute;
        width: 100%;
        height: 100%;
        padding: 0.07rem;
        text-align: center;
        border: 1px solid #dedede;
        border-radius: 50%;
        border-left: none;
        border-right: none;
        background: #fff;
        border-bottom: none;
        width: 0.92rem;
        height: 0.94rem;
        font-size: 0;
        top: -0.34rem;
        left: 50%;
        transform: translate(-50%, 0);

        i {
          display: inline-block;
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          background-size: 100%;
        }
      }

      p {
        font-size: $font-size-small-s;
        padding-top: 0.12rem;
      }

      .badge-wrapper {
        position: absolute;
        top: 0.04rem;
        left: 50%;
        font-size: 0;
      }

      &.item-0 {
        i {
          @include bg-image('home');
        }

        &.router-link-active {
          i {
            @include bg-image('home-act');
          }
        }
      }

      &.item-1 {
        i {
          @include bg-image('type');
        }

        &.router-link-active {
          i {
            @include bg-image('type-act');
          }
        }
      }

      &.item-2 {
        i {
          @include bg-image('cart');
        }

        &.router-link-active {
          i {
            @include bg-image('cart-act');
          }
        }
      }

      &.item-3 {
        i {
          @include bg-image('me');
        }

        &.router-link-active {
          i {
            @include bg-image('me-act');
          }
        }
      }
    }
  }
</style>
