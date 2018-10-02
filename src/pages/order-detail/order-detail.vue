<template>
  <div class="adopt-list-wrapper">
    <m-header class="cate-header" title="订单详情"></m-header>
    <div class="status">
      <img src="./overdue@1.5x.png" class="icon">
      <p class="status-text">订单已过期</p>
    </div>
    <div class="gray"></div>
    <div class="order-list" v-show="type === 0">
      <Scroll :pullUpLoad="pullUpLoad">
        <div class="item" @click="go('/article-detail')">
          <div class="top">
            <span class="item-code">D2986508238869</span>
            <span class="item-status">待支付</span>
          </div>
          <div class="info">
            <img src="./tree@3x.png">
            <div class="text">
              <p class="title">古树名称</p>
              <p class="position">浙江 杭州</p>
              <div class="props"><span class="duration">年限：1年</span><span class="price">¥2480.00</span></div>
            </div>
          </div>
          <div class="gray"></div>
        </div>
      </Scroll>
    </div>
    <div class="duration">
      <div class="duration-item"><span class="name">起始时间</span><span>2018-10-10</span></div>
      <div class="duration-item"><span class="name">终止时间</span><span>2018-10-10</span></div>
    </div>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';

  export default {
    data() {
      return {
        type: 0,
        status: 0
      };
    },
    created() {
      this.pullUpLoad = null;
    },
    methods: {
      go(url) {
        this.$router.push(url);
      },
      changeType(index) {
        this.type = index;
      },
      changeStatus(index) {
        this.status = index;
      },
      goProductDetail() {
        this.$router.push('/product-detaul');
      }
    },
    components: {
      Scroll,
      MHeader
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  .adopt-list-wrapper {
    background: #fff;
    position: fixed;
    width: 100%;
    bottom: 0;
    top: 0;
    left: 0;
    .fl {
      float: left;
    }
    .fr {
      float: right;
    }
    .status {
      padding: 0.56rem;
      margin-top: 0.88rem;
      text-align: center;
      left: 0;
      .icon {
        width: 0.96rem;
        height: 0.96rem;
        margin-bottom: 0.2rem;
      }
      .status-text {
        font-family: 'PingFangSC-Semibold';
        color: #2D2D2D;
        font-size: $font-size-medium-x;
        line-height: 0.42rem;
      }
    }
    .gray {
      width: 100%;
      height: 0.2rem;
      padding: 0;
      background: #f5f5f5;
    }
    .order-list {
      background: $color-highlight-background;
      /*position: absolute;*/
      /*top: 3.9rem;*/
      /*bottom: 0;*/
      /*left: 0;*/
      /*right: 0;*/
      .item {
        width: 100%;
        font-size: $font-size-medium-x;
        line-height: 1.1rem;
        border-bottom: 1px solid #eee;
        .top {
          padding: 0.17rem 0.3rem;
          font-size: $font-size-small;
          line-height: 0.33rem;
          color: #666;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid $color-border;
          .item-status {
            color: #FE5656;
            line-height: 0.33rem;
            display: inline;
          }
        }
        .info {
          display: flex;
          font-size: 0;
          padding: 0.3rem;
          img {
            width: 1.5rem;
            height: 1.5rem;
            flex: 0 0 1.5rem;
            margin-right: 0.2rem;
            border-radius: 0.08rem;
          }
          .text {
            display: flex;
            flex-direction: column;
            width: 100%;
            .title {
              font-size: 0.3rem;
              line-height: 0.42rem;
              margin-bottom: 0.17rem;
              display: flex;
              justify-content: space-between;
              flex: 1;
            }
            .position {
              font-size: 0.24rem;
              line-height: 0.33rem;
              color: #999;
              margin-bottom: 0.25rem;
            }
            .props {
              font-size: $font-size-small;
              line-height: 0.33rem;
              color: #999;
              display: flex;
              justify-content: space-between;
              .duration {

              }
              .price {
                font-family: DIN-Bold;
                font-size: $font-size-medium-x;
                color: #151515;
              }
            }
          }
        }
      }
    }
    .duration {
      font-size: $font-size-medium-s;
      line-height: 0.37rem;
      font-family: 'PingFangSC-Medium';
      .duration-item {
        padding: 0.37rem 0.3rem;
        border-bottom: 1px solid $color-border;
        .name {
          margin-right: 0.76rem;
        }
      }
    }
  }
</style>
