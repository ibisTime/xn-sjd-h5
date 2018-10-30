<template>
  <div class="me-wrapper">
    <div class="bg">
      <m-header class="cate-header" title="我的碳泡泡" actText="碳泡泡规则" @action="action"></m-header>
      <div class="content">
        <div class="in-content">
          <div class="card">
            <p>碳泡泡数量</p>
            <p><span>{{formatAmount(amount)}}</span></p>
          </div>
          <div class="money-list">
            <scroll ref="scroll"
              :data="carbonList"
              :hasMore="hasMore"
              @pullingUp="getInitData">
              <div class="money-item" v-for="(item, index) in carbonList" :key="index">
                <div class="img-cont">
                  <img :src="getIcon(item)">
                </div>
                <div class="text">
                  <div class="text-top">
                    <p>{{item.bizNote}}</p>
                    <span class="money">{{parseInt(item.transAmountString) > 0 ? '+' : ''}}{{formatAmount(item.transAmountString)}}</span>
                  </div>
                  <div class="text-bottom">{{formatDate(item.createDatetime).toLocaleString()}}</div>
                </div>
              </div>
              <no-result v-show="!hasMore && !(carbonList && carbonList.length)" title="暂无认养" class="no-result-wrapper"></no-result>
            </Scroll>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import {getAccountList} from 'api/account';
  import { getAccount } from 'api/biz';
  import { formatAmount, formatDate } from 'common/js/util';
  import { getCookie } from 'common/js/cookie';
  import NoResult from 'base/no-result/no-result';

  export default {
    data() {
      return {
        amount: 0,
        start: 1,
        limit: 10,
        hasMore: true,
        carbonList: []
      };
    },
    mounted() {
      this.accountNumber = this.$route.query.accountNumber;
      this.amount = +this.$route.query.amount;
      this.userId = getCookie('userId');
      // 请求流水
      if(this.accountNumber) {
        this.getCarbonBubble();
      } else {
        getAccount({
          userId: this.userId
        }).then((res) => {
          res.list.map((item) => {
            if(item.currency === 'TPP') {
              this.amount = item.amount;
              this.accountNumber = item.accountNumber;
            }
          });
          this.getCarbonBubble();
        });
      }
    },
    methods: {
      getInitData() {
        this.getCarbonBubble();
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
      action() {
        this.go('/tpp-rules');
      },
      getCarbonBubble() {
        if(this.hasMore) {
          getAccountList({
            accountNumber: this.accountNumber,
            start: this.start,
            limit: this.limit
          }).then((res) => {
            if (res.totalPage <= this.start) {
              this.hasMore = false;
            }
            this.carbonList = [...this.carbonList, ...res.list];
            this.start ++;
          });
        }
      },
      getIcon(item) {
        return parseInt(item.transAmountString) > 0 ? require('./../../common/image/in@2x.png') : require('./../../common/image/out@2x.png');
      }
    },
    components: {
      Scroll,
      MHeader,
      NoResult
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
        margin: 0.88rem 0.3rem;
        margin-bottom: 0.98rem;
        .in-content {
          border-top-left-radius: 0.12rem;
          border-top-right-radius: 0.12rem;
          background: #fff;
          position: fixed;
          top: 0.88rem;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 0 0.3rem;
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
            position: absolute;
            top: 3.05rem;
            bottom: 0;
            left: 0.3rem;
            right: 0.3rem;
            overflow: auto;
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
