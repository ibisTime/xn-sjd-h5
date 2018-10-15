<template>
  <div class="me-wrapper full-screen-wrapper">
    <div class="bg">
      <m-header class="cate-header" title="积分" actText="积分规则" @action="action"></m-header>
      <div class="content">
        <div class="in-content">
          <div class="card">
            <p>当前积分</p>
            <p><span>{{formatAmount(amount)}}</span></p>
          </div>
          <div class="money-list">
            <scroll ref="scroll"
              :data="jfAccountList"
              :hasMore="hasMore"
              @pullingUp="getInitData">
              <div class="money-item" v-for="(item, index) in jfAccountList" :key="index">
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
              <no-result v-show="!hasMore && !(jfAccountList && jfAccountList.length)" title="暂无积分流水" class="no-result-wrapper"></no-result>
            </Scroll>
          </div>
        </div>
      </div>
    </div>
    <full-loading v-show="loading"></full-loading>
    <router-view></router-view>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import NoResult from 'base/no-result/no-result';
  import FullLoading from 'base/full-loading/full-loading';
  import {getAccountList} from 'api/account';
  import { getAccount } from 'api/biz';
  import {formatAmount, formatDate} from 'common/js/util';
  import { getCookie } from 'common/js/cookie';

  export default {
    data() {
      return {
        loading: false,
        amount: 0,
        start: 1,
        limit: 10,
        hasMore: true,
        jfAccountList: []
      };
    },
    mounted() {
      // this.accountNumber = this.$route.query.accountNumber;
      // this.amount = +this.$route.query.amount;
      // 请求流水
      // if(this.accountNumber) {
      //   this.getAccountData();
      // }
      this.userId = getCookie('userId');
      this.getAccountInfo();
    },
    methods: {
      getInitData() {
        this.getAccountData();
      },
      go(url) {
        this.$router.push(url);
      },
      action() {
        this.go('/score/score-rules');
      },
      formatDate(time) {
        return formatDate(time);
      },
      formatAmount(amount) {
        return formatAmount(amount);
      },
      getAccountInfo() {
        this.loading = true;
        getAccount({
          userId: this.userId
        }).then((res) => {
          this.loading = false;
          res.list.map((item) => {
            if(item.currency === 'JF') {
              this.amount = item.amount;
              this.accountNumber = item.accountNumber;
            }
          });
          this.getAccountData();
        }).catch(() => { this.loading = false; });
      },
      getAccountData() {
        if(this.hasMore) {
          this.loading = true;
          getAccountList({
            accountNumber: this.accountNumber,
            start: this.start,
            limit: this.limit
          }).then((res) => {
            if (res.totalPage <= this.start) {
              this.hasMore = false;
            }
            this.jfAccountList = [...this.jfAccountList, ...res.list];
            this.start ++;
            this.loading = false;
          }).catch(() => { this.loading = true; });
        }
      }
    },
    components: {
      Scroll,
      MHeader,
      NoResult,
      FullLoading
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
            position: absolute;
            top: 4rem;
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
