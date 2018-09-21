<template>
  <div class="me-wrapper">
    <div class="bg">
      <m-header class="cate-header" title="余额" :showBack="showBack"></m-header>
      <div class="content">
        <div class="in-content">
          <div class="card">
            <div class="info" @click="go('/userInfo')">
              <img src="./../../common/image/avatar@2x.png" alt="">
              <div class="text">
                <p><span>KOALA</span><span class="lv">LV 1</span></p>
                <p class="mobile">13958092396</p>
              </div>
              <img src="./more@2x.png" alt="" class="me-more fr">
            </div>
            <div class="account">
              <div class="money fl" @click="go('/money')">
                <p class="number">4280</p>
                <p class="text">余额</p>
              </div>
              <div class="line fl"></div>
              <div class="score fl" @click="go('/score')">
                <p class="number">2680</p>
                <p class="text">积分</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="me-list">
      <Scroll :pullUpLoad="pullUpLoad">
        <div class="item" @click="go('/carbon-bubble')">
          <img src="./carbon-bubble@2x.png" alt="">
          <span>我的碳泡泡</span>
          <img src="./more@2x.png" alt="" class="fr more">
        </div>
        <div class="item">
          <img src="./adopt@2x.png" alt="">
          <span>我的认养</span>
          <img src="./more@2x.png" alt="" class="fr more">
        </div>
        <div class="item">
          <img src="./order@2x.png" alt="">
          <span>我的订单</span>
          <img src="./more@2x.png" alt="" class="fr more">
        </div>
        <div class="item">
          <img src="./article@2x.png" alt="">
          <span>我的文章</span>
          <img src="./more@2x.png" alt="" class="fr more">
        </div>
        <div class="item">
          <img src="./collection@2x.png" alt="">
          <span>我的收藏</span>
          <img src="./more@2x.png" alt="" class="fr more">
        </div>
        <div class="item" @click="go('/invitation')">
          <img src="./invitation@2x.png" alt="">
          <span>邀请有礼</span>
          <img src="./more@2x.png" alt="" class="fr more">
        </div>
        <div class="item" @click="go('/settings')">
          <img src="./setting@2x.png" alt="">
          <span>设置</span>
          <img src="./more@2x.png" alt="" class="fr more">
        </div>
      </Scroll>
    </div>
    <m-footer></m-footer>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import {setTitle} from 'common/js/util';
  import MFooter from 'components/m-footer/m-footer';

  export default {
    data() {
      return {
        showBack: false
      };
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
    .bg {
      overflow: auto;
      background: url("./top@2x.png") no-repeat;
      background-size: contain;
      .title {
        font-size: 0.36rem;
        color: #fff;
        padding-top: 0.19rem;
        text-align: center;
      }
      .content {
        padding: 0.88rem 0.3rem 0;
        .in-content {
          .card {
            height: 3.2rem;
            background: $color-highlight-background;
            border-radius: 0.12rem;
            box-shadow: 0 8px 16px 0 #EBEFED;
            margin-bottom: 0.25rem;
            padding: 0.5rem 0.5rem 0 0.5rem;
            .info {
              height: 1.1rem;
              img {
                width: 1.1rem;
                vertical-align: middle;
              }
              .text {
                display: inline-block;
                vertical-align: middle;
                p:first-child{
                  margin-bottom: 0.06rem;
                  font-size: 0;
                  span:first-child {
                    font-size: $font-size-medium-xx;
                    color: #333;
                  }
                }
                .mobile {
                  font-size: $font-size-medium;
                  color: #666;
                  line-height: 0.4rem;
                }
                .lv {
                  background: #FEAE62;
                  border-radius: 0.06rem;
                  width: 0.67rem;
                  height: 0.33rem;
                  display: inline-block;
                  color: #fff;
                  font-size: 0.24rem;
                  margin-left: 0.23rem;
                  text-align: center;
                  padding-top: 0.03rem;
                }
              }
              .me-more {
                width: 0.21rem;
                margin-top: 0.4rem;
              }
            }
            .account {
              padding-top: 0.4rem;
              height: 1.5rem;
              div {
                display: inline-block;
                width: 49%;
                text-align: center;
              }
              .line {
                height: 0.32rem;
                border-right: 1px solid #ebebeb;
                display: inline;
                width: 0;
                margin-top: 0.2rem;
              }
              .number {
                color: #333;
                font-weight:bold;
                font-size: $font-size-large-s;
                line-height: $font-size-large-x;
                margin-bottom: 0.1rem;
              }
              .text {
                font-size: $font-size-small;
                line-height: $font-size-medium-xx;
                color: #666;
              }
            }
          }
        }
      }
    }
    .me-list {
      background: $color-highlight-background;
      position: absolute;
      top: 4.26rem;
      bottom: 0;
      left: 0.3rem;
      right: 0.3rem;
      .item {
        width: 100%;
        height: 1.1rem;
        font-size: $font-size-medium-x;
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
  }
</style>
