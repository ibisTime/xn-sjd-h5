<template>
  <div>
    <div class="check-in-wrapper"></div>
    <div class="full-loading">
      <img src="./close@2x.png" class="close" @click="close">
      <img src="./juanzeng@2x.png" class="juanzeng">
      <p class="title">给好友捐赠</p>
      <p class="description">帮助好友的古树快快成长</p>
      <p class="info">将自己的<span>10g碳泡泡</span>赠送给好友</p>
      <button @click="juanzengSuccess">确认捐赠</button>
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
      juanzengSuccess() {
        this.$emit('juanzengSuccess');
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
    height: 5.94rem;
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
    .juanzeng {
      width: 1.2rem;
      height: 1.1rem;
      margin-bottom: 0.2rem;
    }
    .title {
      font-size: $font-size-large-s;
      line-height: $font-size-large-s;
      margin-bottom: 0.3rem;
    }
    .description {
      font-size: $font-size-medium-x;
      line-height: 0.3rem;
      color: #999;
      margin-bottom: 0.59rem;
      font-family: PingFangSC-Light;
    }
    .info {
      font-size: $font-size-medium-x;
      line-height: 0.42rem;
      color: #666;
      margin-bottom: 0.57rem;
      span {
        color: #2A2A2A;
        font-family: PingFangSC-Semibold;
        margin: 0 0.1rem;
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
