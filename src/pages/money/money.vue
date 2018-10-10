<template>
  <div class="me-wrapper full-screen-wrapper">
    <div class="bg">
      <m-header class="cate-header" title="余额"></m-header>
      <div class="content">
        <div class="in-content">
          <div class="card">
            <p>当前余额</p>
            <p><span>¥</span><span>{{formatAmount(amount)}}</span></p>
            <div class="btn">
              <button @click="go('/withdraw')">提现</button>
              <button @click="go('/recharge')">充值</button>
            </div>
          </div>
          <div class="money-list">
            <scroll ref="scroll"
              :data="accountList"
              :hasMore="hasMore"
              @pullingUp="getUserAccount">
              <div class="money-item" v-for="(item, index) in accountList" :key="index">
                <div class="img-cont">
                  <img src="./in@2x.png" alt="">
                </div>
                <div class="text">
                  <div class="text-top">
                    <p>{{item.bizNote}}</p>
                    <span class="money">{{parseInt(item.transAmountString) > 0 ? '+' : ''}}{{formatAmount(item.transAmountString)}}</span>
                  </div>
                  <div class="text-bottom">{{formatDate(item.createDatetime).toLocaleString()}}</div>
                </div>
              </div>
              <no-result v-show="!hasMore && !(accountList && accountList.length)" title="暂无资金流水" class="no-result-wrapper"></no-result>
            </Scroll>
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
  import { formatAmount, formatDate } from 'common/js/util';
  import { getAccountList } from 'api/account';
  import NoResult from 'base/no-result/no-result';

  export default {
    data() {
      return {
        content: '',
        time: '',
        amount: 0,
        start: 1,
        limit: 10,
        hasMore: true,
        loadingFlag: true,
        protocol: '<table><tbody><tr><td width="240px" height="240px"><img id="qrimage" src="//qr.api.cli.im/qr?data=http%253A%252F%252F192.168.1.162%253A8033%252F%2523%252Fregister&amp;level=H&amp;transparent=false&amp;bgcolor=%23ffffff&amp;forecolor=%23000000&amp;blockpixel=12&amp;marginblock=1&amp;logourl=&amp;size=260&amp;kid=cliim&amp;key=9ee0765087ace26c717af8d86bd50a6e"></td></tr></tbody></table>',
        accountList: []
      };
    },
    mounted() {
      this.getUserAccount();
    },
    methods: {
      getInitData() {
        this.getUserAccount();
      },
      formatDate(time) {
        return formatDate(time);
      },
      formatAmount(amount) {
        return formatAmount(amount);
      },
      go(url) {
        this.$router.push(url);
      },
      getUserAccount() {
        this.accountNumber = this.$route.query.accountNumber;
        this.amount = +this.$route.query.amount;
        // 请求流水
        if(this.accountNumber) {
          getAccountList({
            accountNumber: this.accountNumber,
            start: this.start,
            limit: this.limit
          }).then((res) => {
            if (res.totalPage <= this.start) {
              this.hasMore = false;
            }
            this.accountList = [...this.accountList, ...res.list];
            this.start++;
          });
        }
      }
    },
    components: {
      Scroll,
      MHeader,
      NoResult
    },
    watch: {
      $route() {
        this.getUserAccount();
      }
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
            height: 3.2rem;
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
              span:nth-child(2) {
                font-size: $font-size-large-xxxx;
                font-weight:bold;
              }
            }
            p:first-child {
              font-size: $font-size-medium-s;
              color: #656565;
              margin-bottom: 0.15rem;
            }
            .btn {
              font-size: 0;
              display: inherit;
              button {
                width: 1.42rem;
                height: 0.6rem;
                border: 1px solid $primary-color;
                border-radius: 0.04rem;
                background: $primary-color;
                color: $color-highlight-background;
                font-size: 0.3rem;
              }
              button:first-child {
                margin-right: 1.26rem;
                background: transparent;
                color: $primary-color;
              }
            }
          }
          .money-list {
            background: $color-highlight-background;
            position: absolute;
            top: 4.4rem;
            bottom: 0.5rem;
            width: 90%;
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
