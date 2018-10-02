<template>
  <div class="adopt-list-wrapper">
    <m-header class="cate-header" title="我的订单"></m-header>
    <div class="type">
      <span @click="changeType(0)" :class="type === 0 ? 'active' : ''">全部</span>
      <span @click="changeType(1)" :class="type === 1 ? 'active' : ''">个人</span>
      <span @click="changeType(2)" :class="type === 2 ? 'active' : ''">定向</span>
      <span @click="changeType(3)" :class="type === 3 ? 'active' : ''">集体</span>
      <span @click="changeType(4)" :class="type === 4 ? 'active' : ''">捐赠</span>
    </div>
    <div class="status">
      <span @click="changeStatus(0)" :class="status === 0 ? 'active' : ''">待支付</span>
      <span @click="changeStatus(1)" :class="status === 1 ? 'active' : ''">已支付</span>
      <span @click="changeStatus(2)" :class="status === 2 ? 'active' : ''">已取消</span>
      <span @click="changeStatus(3)" :class="status === 3 ? 'active' : ''">已到期</span>
    </div>
    <div class="gray"></div>
    <div class="order-list" v-show="type === 0">
      <Scroll :pullUpLoad="pullUpLoad">
        <div class="item" @click="go('/order-detail')">
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
        </div>
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
        </div>
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
        </div>
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
        </div>
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
        </div>
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
        </div>
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
        </div>
      </Scroll>
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
        this.$router.push('/product-detail');
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
    .type {
      height: 0.8rem;
      margin-top: 0.88rem;
      font-size: 0;
      display: flex;
      align-items: center;
      justify-content: space-around;
      border-bottom: 1px solid $color-border;
      .active {
        color: $primary-color;
        border-bottom: 1px solid $primary-color;
      }
      span {
        font-size: $font-size-medium-x;
        line-height: 0.42rem;
      }
    }
    .status {
      height: 0.9rem;
      font-size: 0;
      display: flex;
      align-items: center;
      justify-content: space-around;
      border-bottom: 1px solid $color-border;
      .active {
        background: $primary-color;
        color: $color-highlight-background;
      }
      span {
        display: inline-block;
        padding: 0.1rem 0.33rem;
        background: #F0F0F0;
        border-radius: 1rem;
        font-size: $font-size-small;
        line-height: 0.33rem;
        color: #999;
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
      position: absolute;
      top: 2.88rem;
      bottom: 0;
      left: 0;
      right: 0;
      .item {
        width: 100%;
        /*height: 2.3rem;*/
        font-size: $font-size-medium-x;
        line-height: 1.1rem;
        border-bottom: 1px solid #eee;
        /*display: flex;*/
        /*align-items: center;*/
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
  }
</style>
