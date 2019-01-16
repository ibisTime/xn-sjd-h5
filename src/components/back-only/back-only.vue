<template>
  <div class="head-wrapper" @click.stop :style="{top: top}">
    <div class="inner" :class="innerCls">
      <i v-if="showBack" class="icon-back" @click="back"></i>
      <h2>{{title}}</h2>
      <div v-if="actText" @click="handleAction" class="action">{{actText}}</div>
      <img :src="actImg" v-if="actImg" @click="handleAction" class="icon-img">
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      showBack: {
        type: Boolean,
        default: true
      },
      border: {
        type: Boolean,
        default: true
      },
      title: {
        type: String,
        default: ''
      },
      actText: {
        type: String,
        default: ''
      },
      actImg: {
        type: String,
        default: ''
      },
      top: {
        type: String,
        default: '0'
      }
    },
    computed: {
      innerCls() {
        return this.border ? 'border-bottom-1px' : '';
      }
    },
    methods: {
      back() {
        this.$router.back();
      },
      handleAction() {
        this.$emit('action');
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .head-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 0.88rem;
    background-color: transparent;
    z-index: 101;

    .inner {

      .icon-back {
        position: absolute;
        left: 0;
        top: 0;
        width: 1rem;
        height: 0.88rem;
        background-size: 0.44rem;
        background-position: 0.3rem 50%;
        background-repeat: no-repeat;
        @include bg-image('back');
      }
      .icon-img {
        position: absolute;
        right: 0.19rem;
        top: .19rem;
        width: 0.5rem;
      }

      h2 {
        text-align: center;
        padding: 0 2rem;
        line-height: 0.88rem;
        font-size: $font-size-large-s;
      }

      .action {
        position: absolute;
        right: 0;
        top: 0;
        height: 0.88rem;
        padding: 0 0.3rem;
        line-height: 0.88rem;
        font-size: $font-size-medium-xx;
      }
    }
  }
</style>
