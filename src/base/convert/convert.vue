<template>
  <div>
    <div class="check-in-wrapper"></div>
    <div class="full-loading">
      <img src="./close@2x.png" class="close" @click="close">
      <p class="title">保护罩</p>
      <p class="tradition">每天限量50万</p>
      <p class="description">使用后保护碳泡泡<span>1</span>天内不被收取</p>
      <p class="know-more">了解详情<img src="./more-green@2x.png"></p>
      <button @click="convertSuccess">200积分兑换</button>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '正在载入...'
      }
    },
    methods: {
      close() {
        this.$emit('close');
      },
      convertSuccess() {
        this.$emit('convertSuccess');
      }
    }
  };
</script>
<style scoped lang="scss">
  @import "~common/scss/variable";

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
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5.6rem;
    height: 5.2rem;
    transform: translate(-50%, -50%);
    border-radius: 0.5rem;
    font-size: 0;
    background: $color-highlight-background;
    text-align: center;
    padding: 0.6rem 0.52rem;
    .close {
      width: 0.5rem;
      position: absolute;
      right: 0;
      top: -0.8rem;
    }
    .title {
      font-size: $font-size-large-s;
      line-height: $font-size-large-s;
      margin-bottom: 0.23rem;
    }
    .tradition {
      color: #FFA40F;
      font-size: $font-size-small;
      line-height: 0.33rem;
      border-radius: 1rem;
      border: 1px solid #FFA40F;
      margin-bottom: 0.38rem;
      padding: 0.08rem 0.23rem;
      display: inline-block;
    }
    .description {
      font-size: $font-size-medium-x;
      line-height: 0.42rem;
      color: #666;
      margin-bottom: 0.22rem;
      span {
        color: $primary-color;
        margin: 0 0.1rem;
      }
    }
    .know-more {
      color: $primary-color;
      font-size: $font-size-medium;
      line-height: 0.4rem;
      margin-bottom: 0.55rem;
      img {
        width: 0.13rem;
        height: 0.24rem;
        margin-left: 0.1rem;
      }
    }
    button {
      width: 4.2rem;
      height: 0.9rem;
      background: $primary-color;
      border-radius: 0.08rem;
      display: inline-block;
      color: $color-highlight-background;
      font-size: $font-size-medium-xx;
      line-height: 0.9rem;
    }
  }
</style>
