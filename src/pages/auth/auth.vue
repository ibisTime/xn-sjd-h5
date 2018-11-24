<template>
  <div class="auth-wrapper">
    <div class="content">
      <div class="info">
        <div class="item" @click="toPerAuth">
          <span>个人认证</span>
          <div class="is-auth">
            <span>{{rzPerText}}</span>
            <img src="./more@2x.png" alt="" class="fr more">
          </div>
        </div>
        <div class="item" @click="toPramAuth">
          <span>企业认证</span>
          <div class="is-auth">
            <span>{{rzPramText}}</span>
            <img src="./more@2x.png" alt="" class="fr more">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { setTitle } from 'common/js/util';
export default {
  data() {
    return {
      rzStatus: '',
      rzPerText: '未认证',
      rzPramText: '未认证',
      perStatus: '0',
      pramStatus: '0'
    };
  },
  created() {
    this.rzStatus = this.$route.query.rzStatus;
    switch(this.rzStatus) {
      case '0':  // 都未认证
        this.rzPerText = '未认证';
        this.rzPramText = '未认证';
        break;
      case '1':  // 都已认证
        this.rzPerText = '已认证';
        this.rzPramText = '已认证';
        this.perStatus = '1';
        this.pramStatus = '1';
        break;
      case '2':  // 个人认证
        this.rzPerText = '已认证';
        this.rzPramText = '未认证';
        this.perStatus = '1';
        break;
      case '3': // 企业认证
        this.rzPerText = '未认证';
        this.rzPramText = '已认证';
        this.pramStatus = '1';
        break;
    }
  },
  methods: {
    go(url) {
      this.$router.push(url);
    },
    goLogin() {
      if(this.noAdoptReason === '您未登录') {
        this.go('/login');
      }
    },
    goTreeList() {
      if(this.detail.sellType === '3' || this.detail.sellType === '4') {
        this.go(`/productTree-detail?code=${this.detail.treeList[0].code}`);
      } else {
        this.go(`/productTree-list?code=${this.code}`);
      }
    },
    toPerAuth() {
      this.go(`/person-auth?perStatus=${this.perStatus}`);
    },
    toPramAuth() {
      this.go(`/company-auth?pramStatus=${this.pramStatus}`);
    }
  },
  mounted() {
    setTitle('实名认证');
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/mixin.scss";
@import "../../common/scss/variable.scss";
.auth-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0rem;
  width: 100%;
  z-index: 101;
  background: $color-highlight-background;
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .content {
    /*margin: 0.88rem 0;*/
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    .info {
      background: $color-highlight-background;
      padding: 0 0.3rem;
      .item {
        width: 100%;
        height: 1.1rem;
        font-size: $font-size-medium-x;
        line-height: 1.1rem;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        .is-auth {
          display: inline-block;
        }
        span:first-child {
          margin-right: 0.3rem;
        }
        img {
          height: 0.21rem;
          margin-top: 0.45rem;
        }
      }
    }
  }
  .show {
    display: block;
  }
}
</style>
