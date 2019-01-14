<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag" @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p v-if="isHtml" class="text" :class="textCls" v-html='text'></p>
          <div v-else class="text" :class="textCls">
            <p class="title">{{title}}</p>
            <p class="content" v-for="item in content">{{item}}</p>
          </div>
          <div class="operate">
            <div v-if="!isAlert" @click="cancel" class="operate-btn left">{{cancelBtnText}}</div>
            <div @click="confirm" class="operate-btn right">{{confirmBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      content: {
        type: Array,
        default: () => {
          return [];
        }
      },
      confirmBtnText: {
        type: String,
        default: '确定'
      },
      cancelBtnText: {
        type: String,
        default: '取消'
      },
      isAlert: {
        type: Boolean,
        default: false
      },
      isHtml: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        showFlag: false
      };
    },
    computed: {
      textCls() {
        return this.isAlert ? 'alert' : '';
      }
    },
    methods: {
      show() {
        this.showFlag = true;
      },
      hide() {
        this.showFlag = false;
      },
      cancel() {
        this.hide();
        this.$emit('cancel');
      },
      confirm() {
        this.hide();
        this.$emit('confirm');
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~common/scss/variable";

  .confirm {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 998;
    background-color: $color-background-d;

    &.confirm-fade-enter-active {
      animation: confirm-fadein 0.3s;
      .confirm-content {
        animation: confirm-zoom 0.3s;
      }
    }

    .confirm-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 999;
      .confirm-content {
        width: 6.4rem;
        height: 6rem;
        border-radius: 0.16rem;
        background: $color-highlight-background;

        .text {
          padding: 0.94rem 0.38rem 0;
          line-height: 0.44rem;
          text-align: center;
          font-size: $font-size-large-s;
          color: rgb(51,51,51);
          .title {
            margin-bottom: 0.48rem;
            font-size: 0.36rem;
            font-weight: 500;
          }
          .content {
            font-size: 0.28rem;
            margin-bottom: 0.4rem;
            text-align: left;
            &:last-child {
              margin-bottom: 0;
            }
          }
          &.alert {
            font-size: 0.3rem;
          }
        }

        .operate {
          display: flex;
          align-items: center;
          text-align: center;
          font-size: $font-size-large-s;
          position: fixed;
          left: 0;
          bottom: 0;
          width: 100%;

          .operate-btn {
            flex: 1;
            line-height: 0.44rem;
            padding: 0.2rem 0;
            border-top: 1px solid $color-border;
            color: $color-text-d;

            &.left {
              border-right: 1px solid $color-background-d;
              background: $color-highlight-background;
              color: $color-gray;
              border-bottom-left-radius: 0.16rem;
            }

            &.right {
              background: $primary-color;
              color: $color-highlight-background;
              border-bottom-right-radius: 0.16rem;
            }
          }
        }
      }
    }
  }
  @keyframes confirm-fadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes confirm-zoom {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
