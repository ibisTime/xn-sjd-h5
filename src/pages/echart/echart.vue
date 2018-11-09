<template>
  <div class="echart-wrapper">
    <category-chart></category-chart>
    <div id="main" class="e-chart"></div>
    <div class="me-list" ref="description">
      <Scroll
        :pullUpLoad="pullUpLoad"
        ref="scroll"
        :data="list"
        :hasMore="hasMore"
        @pullingUp="getPageOrders"
      >
        <table>
          <tr class="first"><th>名称</th><th>成交价格</th><th>波动</th><th>成交时间</th></tr>
          <tr v-for="item in proList"><td>{{item.productName}}</td><td>{{formatAmount(item.price)}}</td><td class="wave">{{item.wave}}</td><td>{{formatDate(item.createDatetime)}}</td></tr>
        </table>
      </Scroll>
    </div>
    <full-loading v-show="loading"></full-loading>
    <toast ref="toast" :text="text"></toast>
  </div>
</template>
<script>
  import echarts from 'echarts';
  import Toast from 'base/toast/toast';
  import FullLoading from 'base/full-loading/full-loading';
  import Scroll from 'base/scroll/scroll';
  import CategoryChart from 'components/category-chart/category-chart';
  import { formatAmount, setTitle, getUserId, formatDate } from 'common/js/util';
  import { getDeriveZichanPage } from 'api/biz';

  export default {
    data() {
      return {
        loading: false,
        showBack: false,
        userDetail: {},
        text: '',
        cny: 0,
        cnyAccountNumber: '',
        jf: 0,
        jfAccountNumber: '',
        tpp: 0,
        tppAccountNumber: '',
        src: '',
        charts: '',
        opinion: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
        opinionData: [
          {value: 335, name: '直接访问'},
          {value: 310, name: '邮件营销'},
          {value: 234, name: '联盟广告'},
          {value: 135, name: '视频广告'},
          {value: 1548, name: '搜索引擎'}
        ],
        proList: [],
        start: 1,
        limit: 10,
        hasMore: true
      };
    },
    created() {
      this.pullUpLoad = null;
      this._refreshScroll();
    },
    methods: {
      getUserId() {
        return getUserId();
      },
      formatDate(date) {
        return formatDate(date);
      },
      formatAmount(amount) {
        return formatAmount(amount);
      },
      go(url) {
        if(getUserId()) {
          this.$router.push(url);
        } else {
          this.text = '您未登录！';
          this.$refs.toast.show();
        }
      },
      _refreshScroll() {
        setTimeout(() => {
          this.$refs.scroll.refresh();
          let imgs = this.$refs.description.getElementsByTagName('img');
          for (let i = 0; i < imgs.length; i++) {
            let _img = imgs[i];
            if (_img.complete) {
              setTimeout(() => {
                this.$refs.scroll.refresh();
              }, 20);
              continue;
            }
            _img.onload = () => {
              setTimeout(() => {
                this.$refs.scroll.refresh();
              }, 20);
            };
          }
        }, 20);
      },
      drawPie(id) {
        this.charts = echarts.init(document.getElementById(id));
        this.charts.setOption({
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true
          }]
        });
      },
      getPageOrders() {
        this.loading = true;
        Promise.all([
          getDeriveZichanPage({
            start: this.start,
            limit: this.limit,
            status: 0,
            type: 2,
            minQuantity: 0,
            variety: this.variety || '',
            orderColumn: this.orderColumn || '',
            orderDir: 'asc'
          })
        ]).then(([res1]) => {
          // debugger;
          if (res1.list.length < this.limit || res1.totalCount <= this.limit) {
            this.hasMore = false;
          }
          this.proList = this.proList.concat(res1.list);
          this.start++;
          console.log(this.proList);
          this.loading = false;
        }).catch(() => { this.loading = false; });
      }
    },
    mounted() {
      this.$nextTick(function() {
        this.drawPie('main');
      });
      setTitle('我的');
      this.getPageOrders();
    },
    components: {
      Toast,
      Scroll,
      FullLoading,
      CategoryChart
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  .echart-wrapper {
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
    .e-chart {
      width: 100%;
      height: 4.76rem;
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
          background: $color-highlight-background;
          .card {
            height: 3.2rem;
            background: $color-highlight-background;
            border-radius: 0.12rem;
            box-shadow: 0 8px 16px 0 #EBEFED;
            margin-bottom: 0.25rem;
            padding: 0.5rem;
            .info {
              height: 1.1rem;
              img {
                width: 1.1rem;
                vertical-align: middle;
              }
              .head {
                height: 1.1rem;
                border-radius: 50%;
              }
              .text {
                display: inline-block;
                vertical-align: middle;
                p:first-child{
                  margin-bottom: 0.06rem;
                  font-size: 0;
                  display: flex;
                  align-items: center;
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
            .noUser {
              width: 100%;
              text-align: center;
              font-size: 0;
              height: 100%;
              button {
                width: 1.54rem;
                height: 0.62rem;
                border-radius: 0.04rem;
                font-size: 0.3rem;
                border: 1px solid $primary-color;
                margin-top: 0.79rem;
              }
              .login {
                background: $primary-color;
                color: $color-highlight-background;
              }
              .register {
                background: $color-highlight-background;
                color: $primary-color;
                margin-left: 0.4rem;
              }
            }
          }
          .card-bg {
            background: url("./decoration@2x.png") no-repeat;
            background-size: contain;
            background-position: bottom;
          }
        }
      }
    }
    .me-list {
      background: $color-highlight-background;
      position: absolute;
      top: 5.56rem;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: auto;
      table {
        font-size: 0.22rem;
        width: 100%;
        td {
          text-align: center;
        }
        tr.first {
          background: #edf8f5;
          color: #2d2d2d;
          /*display: flex;*/
          /*justify-content: space-between;*/
          width: 100%;
          height: 0.76rem;
          line-height: 0.76rem;
          padding: 0 0.3rem;
        }
        tr {
          /*display: flex;*/
          /*justify-content: space-between;*/
          width: 100%;
          height: 1rem;
          line-height: 1rem;
          padding: 0 0.3rem;
          border-bottom: 1px solid $color-border;
          .wave {
            .red {
              color: #E15252;
            }
            .green {
              color: #23AD8C;
            }
          }
        }
      }
      .item {
        width: 100%;
        height: 1.1rem;
        font-size: $font-size-medium-x;
        font-family: PingFangSC-Semibold;
        line-height: 1.1rem;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
        .me-list-icon {
          margin-right: 0.1rem;
        }
        img {
          height: 0.34rem;
        }
        span {
          flex: 1;
        }
      }
    }
    .white {
      width: 100%;
      height: 0.3rem;
      padding: 0;
    }
  }
</style>
