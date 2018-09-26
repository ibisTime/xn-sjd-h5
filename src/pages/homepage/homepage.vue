<template>
  <div class="me-wrapper">
    <m-header class="cate-header" title="我的主页" actText="分享" @action="action"></m-header>
    <div class="out-content">
      <Scroll :pullUpLoad="pullUpLoad">
      <div class="bg">
        <div class="content">
          <div class="in-content">
            <div class="card">
              <div class="me-info">
                <img src="./avatar@2x.png" alt="">
                <div class="text">
                  <p><span>KOALA</span><span class="lv">LV 1</span></p>
                </div>
              </div>
              <div class="type">
                <span @click="changeType(0)">全部</span>
                <span @click="changeType(1)">古树名木</span>
                <span @click="changeType(4)">水源林</span>
                <span @click="changeType(3)">情感林</span>
                <span @click="changeType(2)">果园林</span>
              </div>
              <div class="type triangle">
                <img :class="!type ? 'active' : ''" src="./triangle@2x.png">
                <img :class="type === 1 ? 'active' : ''" src="./triangle@2x.png">
                <img :class="type === 4 ? 'active' : ''" src="./triangle@2x.png">
                <img :class="type === 3 ? 'active' : ''" src="./triangle@2x.png">
                <img :class="type === 2 ? 'active' : ''" src="./triangle@2x.png">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="emotion-forest-type" v-show="type === 3">
        <span :class="emotion === 1 ? 'active' : ''" @click="changeEmotion(1)">爱情林</span>
        <span :class="emotion === 2 ? 'active' : ''" @click="changeEmotion(2)">亲子林</span>
      </div>
      <div class="tree-list" :style="{ top: type === 3 ? '5.46rem' : '4.66rem' }">
        <!--<Scroll :pullUpLoad="pullUpLoad">-->
          <div class="item">
            <div class="tree-info" @click="go('/my-tree')">
              <p class="tree-name">银杏树</p>
              <p class="tree-about">5,000亩  25,000棵树</p>
            </div>
            <div class="map">
              <img src="./map@2x.png" alt="">
              <p>查看地图</p>
            </div>
          </div>
          <div class="item" @click="go('/carbon-bubble')">
            <div class="tree-info">
              <p class="tree-name">银杏树</p>
              <p class="tree-about">5,000亩  25,000棵树</p>
            </div>
            <div class="map">
              <img src="./map@2x.png" alt="">
              <p>查看地图</p>
            </div>
          </div>
          <div class="item" @click="go('/carbon-bubble')">
            <div class="tree-info">
              <p class="tree-name">银杏树</p>
              <p class="tree-about">5,000亩  25,000棵树</p>
            </div>
            <div class="map">
              <img src="./map@2x.png" alt="">
              <p>查看地图</p>
            </div>
          </div>
        <!--</Scroll>-->
      </div>
      <div class="gray"></div>
      <div class="dynamic">
        <div class="dynamic-title">
          <div class="border"></div>
          <span>我的动态</span>
        </div>
        <div class="daily">
          <div class="daily-title">今天</div>
          <div class="daily-content">
            <div class="daily-content-item">
              <div class="daily-content-item-info">
                <img src="./steal@2x.png" alt="">
                <p class="activity"><span>珊珊</span>收取1g</p>
                <p class="time">19:00</p>
              </div>
              <div class="border"></div>
            </div>
            <div class="daily-content-item">
              <div class="daily-content-item-info">
                <img src="./protect@2x.png" alt="">
                <p class="activity"><span>珊珊</span>使用了保护罩</p>
                <p class="time">19:00</p>
              </div>
              <div class="border"></div>
            </div>
            <div class="daily-content-item">
              <div class="daily-content-item-message">
                <div class="message-border">
                  <img src="./head.png" alt="" class="head">
                  <div class="message-text">
                    <p class="name">珊珊</p>
                    <p class="activity">来收取能量，被保护罩阻挡了</p>
                  </div>
                  <img src="./cover@2x.png" alt="" class="cover">
                </div>
                <p class="time">19:00</p>
              </div>
              <div class="border"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="mask" @click="change" v-show="share"></div>
      </Scroll>
    </div>
    <div class="share" v-show="share">
      <div class="share-text"><span>- </span><span>分享到</span><span> -</span></div>
      <div class="share-type">
        <div class="share-type-item">
          <img src="./wechat@2x.png" alt="">
          <p>微信</p>
        </div>
        <div class="share-type-item">
          <img src="./pyq@2x.png" alt="">
          <p>朋友圈</p>
        </div>
      </div>
      <div class="share-cancel" @click="change">取消</div>
    </div>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import {setTitle} from 'common/js/util';

  export default {
    data() {
      return {
        type: 0,
        emotion: 1,
        share: false
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
    mounted() {
      this.type = +this.$route.query.type || 0;
    },
    methods: {
      go(url) {
        this.$router.push(url);
      },
      changeType(index) {
        this.type = index;
        console.log(this.type);
      },
      changeEmotion(index) {
        this.emotion = index;
      },
      action() {
        this.share = true;
      },
      change() {
        this.share = !this.share;
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
  .me-wrapper {
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
    .head-wrapper {
      background: url("./bg@2x.png") no-repeat;
      /*background-position: left;*/
      /*<!--background-position: -0.2rem;-->*/
    }
    .out-content {
      position: absolute;
      top: 0.88rem;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: auto;
      .bg {
        background: url("./bg@2x.png") no-repeat;
        background-size: 100% 100%;
        .title {
          font-size: 0.36rem;
          color: #fff;
          padding-top: 0.19rem;
          text-align: center;
        }
        .content {
          padding: 0.43rem 0.3rem 0;
          .in-content {
            .card {
              /*height: 3.2rem;*/
              border-radius: 0.12rem;
              /*margin-bottom: 0.25rem;*/
              padding: 0.2rem 0 0 0;
              .me-info {
                text-align: center;
                img {
                  width: 1.3rem;
                  height: 1.3rem;
                  margin-bottom: 0.34rem;
                  border-radius: 50%;
                  border: 2px solid $color-highlight-background;
                }
                .text {
                  vertical-align: middle;
                  margin-bottom: 0.32rem;
                  p {
                    margin-bottom: 0.69rem;
                    font-size: 0;
                    span:first-child {
                      font-size: $font-size-medium-xx;
                      color: $color-highlight-background;
                    }
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
              }
              .triangle {
                padding: 0 0.3rem;
              }
              .type {
                font-size: $font-size-medium-x;
                line-height: 0.42rem;
                color: $color-highlight-background;
                display: flex;
                justify-content: space-between;
                img {
                  visibility: hidden;
                  width: 0.22rem;
                  height: 0.12rem;
                }
                img.active {
                  visibility: visible;
                }
              }
            }
          }
        }
      }
      .emotion-forest-type {
        height: 0.8rem;
        font-size: 0.28rem;
        line-height: 0.4rem;
        padding: 0 0.3rem;
        background: #FCFCFC;
        box-shadow: 0 1px 0 0 rgba(235,235,235,0.50);
        span {
          line-height: 0.8rem;
          display: inline-block;
          margin-right: 1rem;
        }
        .active {
          color: $primary-color;
          border-bottom: 1px solid $primary-color;
        }
      }
      .tree-list {
        background: $color-highlight-background;
        padding: 0 0.3rem;
        /*position: absolute;*/
        /*top: 5.66rem;*/
        /*bottom: 0;*/
        /*left: 0.3rem;*/
        /*right: 0.3rem;*/
        .item {
          width: 100%;
          height: 1.6rem;
          font-size: $font-size-medium-x;
          line-height: 1.6rem;
          border-bottom: 1px solid #eee;
          display: flex;
          padding: 0.3rem 0;
          .tree-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .tree-name {
              font-size: $font-size-medium-x;
              line-height: $font-size-medium-x;
              margin-bottom: 0.21rem;
              font-family: PingFangSC-Semibold;
            }
            .tree-about {
              color: #666;
              font-size: $font-size-small;
              line-height: $font-size-small;
            }
          }
          .map {
            display: flex;
            flex-direction: column;
            align-items: center;
            img {
              width: 0.57rem;
              height: 0.57rem;
              margin-bottom: 0.2rem;
            }
            p {
              color: $primary-color;
              font-size: $font-size-small;
              line-height: $font-size-small;
            }
          }
        }
      }
      .gray {
        width: 100%;
        height: 0.2rem;
        padding: 0;
        background: #f5f5f5;
      }
      .dynamic {
        background: #fff;
        padding: 0.3rem;
        .dynamic-title {
          font-size: 0;
          margin-bottom: 0.54rem;
          .border {
            border: 2px solid $primary-color;
            height: 0.26rem;
            width: 0;
            display: inline-block;
            margin-right: 0.08rem;
          }
          span {
            font-size: $font-size-large-ss;
            line-height: 0.42rem;
          }
        }
        .daily {
          .daily-title {
            font-size: $font-size-large-ss;
            line-height: $font-size-large-s;
            font-family: PingFangSC-Semibold;
            margin-bottom: 0.32rem;
          }
          .daily-content {
            .daily-content-item {
              .daily-content-item-info {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-left: 0.2rem;
                img {
                  width: 0.36rem;
                  margin-right: 0.24rem;
                }
                .activity {
                  font-size: $font-size-medium;
                  flex: 1;
                  span {
                    font-family: PingFangSC-Semibold;
                    margin-right: 0.2rem;
                  }
                }
                .time {
                  font-size: $font-size-small;
                  line-height: 0.33rem;
                  color: #999;
                }
              }
              .daily-content-item-message {
                display: flex;
                justify-content: space-between;
                .message-border {
                  border: 1px solid #eee;
                  border-radius: 0.5rem;
                  display: flex;
                  align-items: center;
                  .head {
                    width: 0.64rem;
                    height: 0.64rem;
                    border-radius: 50%;
                    margin-left: 0.08rem;
                  }
                  .name {
                    color: #999;
                    font-size: 0.22rem;
                  }
                  .activity {
                    font-size: 0.28rem;
                  }
                  .cover {
                    width: 0.84rem;
                    height: 0.84rem;
                  }
                }
                .time {
                  font-size: $font-size-small;
                  line-height: 0.33rem;
                  color: #999;
                }
              }
              .border {
                width: 0;
                border-right: 1px solid #eee;
                height: 0.5rem;
                margin-left: 0.35rem;
              }
            }
          }
        }
      }
      .mask {
        width: 100%;
        height: 100%;
        background-color: rgba($color: #000000, $alpha: 0.7);
        position: absolute;
        top: 0;
        left: 0;
      }

    }
    .share {
      height: 3.8rem;
      background: $color-highlight-background;
      position: fixed;
      bottom: 0;
      width: 100%;
      .share-text {
        font-size: 0.3rem;
        text-align: center;
        margin-top: 0.3rem;
      }
      .share-type {
        padding: 0.4rem 2rem;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid $color-border;
        .share-type-item {
          img {
            width: 0.85rem;
            height: 0.85rem;
            margin-bottom: 0.2rem;
          }
          p {
            font-size: 0.24rem;
            line-height: 0.33rem;
            text-align: center;
          }
        }
      }
      .share-cancel {
        color: #666;
        font-size: $font-size-medium;
        line-height: 0.9rem;
        text-align: center;
      }
    }
  }
</style>
