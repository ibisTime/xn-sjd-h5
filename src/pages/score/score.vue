<template>
  <div class="me-wrapper full-screen-wrapper">
    <div class="bg">
      <m-header class="cate-header" title="积分" actText="积分规则" @action="action"></m-header>
      <div class="content">
        <div class="in-content">
          <div class="card">
            <p>当前积分</p>
            <p><span>2480</span></p>
          </div>
          <div class="money-list">
            <div class="money-item">
              <div class="img-cont">
                <img src="./in@2x.png" alt="">
              </div>
              <div class="text">
                <div class="text-top">
                  <p>某种方式的收益</p>
                  <span class="money">+1000</span>
                </div>
                <div class="text-bottom">今天  12:34</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import {setTitle} from 'common/js/util';

  export default {
    data() {
      return {
        content: '',
        telephone: '',
        time: '',
        loadingFlag: true,
        protocol: '<table><tbody><tr><td width="240px" height="240px"><img id="qrimage" src="//qr.api.cli.im/qr?data=http%253A%252F%252F192.168.1.162%253A8033%252F%2523%252Fregister&amp;level=H&amp;transparent=false&amp;bgcolor=%23ffffff&amp;forecolor=%23000000&amp;blockpixel=12&amp;marginblock=1&amp;logourl=&amp;size=260&amp;kid=cliim&amp;key=9ee0765087ace26c717af8d86bd50a6e"></td></tr></tbody></table>'
      };
    },
    created() {
      setTitle('积分');
    },
    methods: {
      getTel() {
        if (this.telephone) {
          return `tel://${this.telephone}`;
        } else {
          return '';
        }
      },
      go(url) {
        this.$router.push(url);
      },
      action() {
        this.go('/score/score-rules');
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
    .fl {
      float: left;
    }
    .fr {
      float: right;
    }
    .bg {
      background: url("./top@2x.png") no-repeat;
      background-size: contain;
      .title {
        font-size: 0.36rem;
        color: #fff;
        padding-top: 0.19rem;
        text-align: center;
      }
      .content {
        padding: 0.96rem 0.3rem;
        margin-bottom: 0.98rem;
        .in-content {
          border-top-left-radius: 0.12rem;
          border-top-right-radius: 0.12rem;
          background: #fff;
          .card {
            height: 2.8rem;
            border-radius: 0.12rem;
            box-shadow: 0 8px 16px 0 #EBEFED;
            margin-bottom: 0.25rem;
            padding: 0.5rem 0.5rem 0 0.5rem;
            background: url("./decoration@2x.png") no-repeat;
            background-size: contain;
            background-position: bottom;
            text-align: center;
            p {
              text-align: center;
              font-size: $font-size-medium-s;
              margin-bottom: 0.55rem;
              span{
                font-size: $font-size-large-xxxx;
                font-weight:bold;
              }
            }
          }
          .money-list {
            background: $color-highlight-background;
            .money-item {
              display: flex;
              align-items: center;
              width: 100%;
              padding: 0.34rem 0;
              border-bottom: 1px solid #eee;
              font-size: $font-size-medium-x;
              .img-cont {
                height: 0.66rem;
                width: 0.66rem;
                flex: 0 0 0.66rem;
                img {
                  height: 100%;
                  width: 100%;
                }
              }
              .text {
                flex: 1;
                padding-left: 0.3rem;
                .text-top {
                  display: flex;
                  p {
                    flex: 1;
                  }
                  .money {
                    font-size: 0.3rem;
                    color: #151515;
                  }
                }
                .text-bottom {
                  padding-top: 0.15rem;
                  font-size: $font-size-small-s;
                  color: $color-text-l;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
