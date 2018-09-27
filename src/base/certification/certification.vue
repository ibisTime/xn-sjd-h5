<template>
  <div class="all">
    <div class="check-in-wrapper"></div>
    <img src="./close@2x.png" class="close" @click="close">
    <div class="full-loading">
      <img src="./head.png" class="head">
      <p class="name">哈哈哈</p>
      <p class="description">你已于2018年4月21日认养的樟树，已被认领，将种植到鄂尔多斯地区。</p>
      <div class="code">
        <span>No.3333333333</span>
      </div>
    </div>
    <div class="full-loading">
      <img src="./close@2x.png" class="close" @click="close">
      <img src="./head.png" class="head">
      <p class="name">哈哈哈</p>
      <p class="description">你已于2018年4月21日认养的樟树，已被认领，将种植到鄂尔多斯地区。</p>
      <div class="code">
        <span>No.3333333333</span>
      </div>
    </div>
    <div class="full-loading">
      <img src="./close@2x.png" class="close" @click="close">
      <img src="./head.png" class="head">
      <p class="name">哈哈哈</p>
      <p class="description">你已于2018年4月21日认养的樟树，已被认领，将种植到鄂尔多斯地区。</p>
      <div class="code">
        <span>No.3333333333</span>
      </div>
    </div>
    <div class="full-loading">
      <img src="./close@2x.png" class="close" @click="close">
      <img src="./head.png" class="head">
      <p class="name">哈哈哈</p>
      <p class="description">你已于2018年4月21日认养的樟树，已被认领，将种植到鄂尔多斯地区。</p>
      <div class="code">
        <span>No.3333333333</span>
      </div>
    </div>
    <div class="full-loading">
      <img src="./close@2x.png" class="close" @click="close">
      <img src="./head.png" class="head">
      <p class="name">哈哈哈</p>
      <p class="description">你已于2018年4月21日认养的樟树，已被认领，将种植到鄂尔多斯地区。</p>
      <div class="code">
        <span>No.3333333333</span>
      </div>
    </div>
    <div class="full-loading">
      <img src="./close@2x.png" class="close" @click="close">
      <img src="./head.png" class="head">
      <p class="name">哈哈哈</p>
      <p class="description">你已于2018年4月21日认养的樟树，已被认领，将种植到鄂尔多斯地区。</p>
      <div class="code">
        <span>No.3333333333</span>
      </div>
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
      }
    }
  };
</script>
<style scoped lang="scss">
  @import "~common/scss/variable";

  .all {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    height: 100%;
    overflow-x: auto;
    padding: 0 0.4rem;
    .close {
      width: 0.5rem;
      position: absolute;
      right: 0.5rem;
      top: 1rem;
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
      flex: 0 0 6rem;
      font-size: 0;
      background: #fff;
      z-index: 1;
      text-align: center;
      margin-right: 0.5rem;
      background: url("./bg@2x.png") no-repeat;
      background-size: 100% 100%;
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
