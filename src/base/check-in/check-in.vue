<template>
  <div>
    <div class="check-in-wrapper"></div>
    <div class="full-loading">
      <img src="./check-in-success@2x.png" alt="">
      <p class="success">签到成功</p>
      <p class="info">获得<span>{{signTpp}}</span>碳泡泡，已连续签到<span>{{signDays}}</span>天</p>
      <p class="info" v-if="remainDays !== 0">再连续签到<span>{{remainDays}}</span>天有惊喜哦</p>
      <button @click="close">知道了</button>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      signTpp: {
        type: String,
        default: '0'
      },
      signDays: {
        type: Number,
        default: 0
      },
      remainDays: {
        type: Number,
        default: 0
      },
      giftList: {
        type: Array,
        default: () => {
          return [];
        }
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
    width: 6.9rem;
    height: 6.34rem;
    transform: translate(-50%, -50%);
    border-radius: 0.12rem;
    font-size: 0;
    background: $color-highlight-background;
    text-align: center;
    img {
      width: 3.59rem;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      margin-bottom: 0.67rem;
    }
    .success {
      font-size: $font-size-large-xx;
      line-height: 0.67rem;
      margin-top: 2.5rem;
      margin-bottom: 0.18rem;
    }
    .info {
      font-size: $font-size-large-s;
      line-height: 0.5rem;
      margin-bottom: 0.2rem;
      span {
        color: $primary-color;
      }
    }
    .info:last-child {
      margin-bottom: 0.4rem;
    }
    button {
      width: 5.7rem;
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
