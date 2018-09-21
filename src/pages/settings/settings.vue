<template>
  <div class="me-wrapper full-screen-wrapper">
    <m-header class="cate-header" title="设置"></m-header>
    <div class="settings-list">
      <div class="item" @click="go('/change-mobile')">
        <span>修改手机号</span>
        <img src="./more@2x.png" alt="" class="fr more">
      </div>
      <div class="item" @click="go('/bankcard')">
        <span>我的银行卡</span>
        <img src="./more@2x.png" alt="" class="fr more">
      </div>
      <div class="item" @click="go('/userInfo')">
        <span>完善资料</span>
        <img src="./more@2x.png" alt="" class="fr more">
      </div>
      <div class="item" @click="go('/address')">
        <span>收货地址</span>
        <img src="./more@2x.png" alt="" class="fr more">
      </div>
    </div>
    <div class="btn">
      <button>退出登录</button>
    </div>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import {setTitle} from 'common/js/util';
  import MFooter from 'components/m-footer/m-footer';

  export default {
    data() {
      return {};
    },
    created() {
      this.pullUpLoad = null;
      setTitle('我的');
      // this.pullUpLoad = null;
      // Promise.all([
      //   getUserSystemConfig('aboutUs'),
      //   getUserSystemConfig('telephone'),
      //   getUserSystemConfig('serviceTime')
      // ]).then(([aboutus, telephone, time]) => {
      //   this.loadingFlag = false;
      //   this.telephone = telephone.cvalue;
      //   this.time = time.cvalue;
      //   this.content = protocol.cvalue;
      // }).catch(() => {
      //   this.loadingFlag = false;
      // });
    },
    methods: {
      go(url) {
        this.$router.push(url);
      }
    },
    components: {
      Scroll,
      MFooter,
      MHeader
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  .me-wrapper {
    background: #fff;
    position: fixed;
    width: 100%;
    bottom: 0.98rem;
    top: 0;
    left: 0;
    .fl {
      float: left;
    }
    .fr {
      float: right;
    }
    .settings-list {
      background: $color-highlight-background;
      margin-top: 0.88rem;
      padding: 0 0.3rem;
      margin-bottom: 1.63rem;
      /*position: absolute;*/
      /*top: 4.26rem;*/
      /*bottom: 0;*/
      /*left: 0.3rem;*/
      /*right: 0.3rem;*/
      .item {
        width: 100%;
        height: 1.1rem;
        font-size: $font-size-medium-xx;
        line-height: 1.1rem;
        border-bottom: 1px solid #eee;
        img {
          height: 0.34rem;
        }
        .more {
          margin-top: 0.3rem;
        }
      }
    }
    .btn {
      padding: 0 0.3rem;
      button {
        width: 100%;
        height: 0.84rem;
        border: 1px solid $primary-color;
        color: $primary-color;
        border-radius: 0.08rem;
        font-size: $font-size-medium-x;
        background: $color-highlight-background;
      }
    }
  }
</style>
