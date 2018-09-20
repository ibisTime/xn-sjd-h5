<template>
  <div class="score-rules-wrapper full-screen-wrapper">
    <div class="bg">
      <m-header class="cate-header" title="积分规则"></m-header>
      <div class="content">
        <div class="title">
          <span class="name">产生项</span>
          <span class="score">分值</span>
        </div>
        <div class="item">
          <span class="name">注册成功</span>
          <span class="score">50</span>
        </div>
        <div class="item">
          <span class="name">注册成功</span>
          <span class="score">50</span>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import MHeader from 'components/m-header/m-header';
  export default {
    data() {
      return {
      };
    },
    components: {
      MHeader
    }
  };
</script>

<style lang="scss" scoped>
  @import "~common/scss/variable";
  .score-rules-wrapper {
    background: $color-highlight-background;
    margin-top: 0.88rem;
    .fl {
      float: left;
    }
    .fr {
      float: right;
    }
    .bg {
      .content {
        padding: 0.62rem 0.3rem;
        .title {
          font-size: $font-size-medium-x;
          color: #333;
          display: flex;
          .name {
            flex: 1;
          }
          .score {
            width: 0.7rem;
          }
        }
        .item {
          padding: 0.37rem 0;
          font-size: $font-size-medium-s;
          line-height: 0.37rem;
          display: flex;
          border-bottom: 1px solid $color-border;
          .name {
            flex: 1;
          }
          .score {
            width: 0.7rem;
          }
        }
      }
    }
  }

</style>
