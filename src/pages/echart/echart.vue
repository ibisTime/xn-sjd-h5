<template>
  <div class="echart-wrapper">
    <category-chart @sendMessage="sendMessage"></category-chart>
    <div id="main" class="e-chart"></div>
    <div class="me-list" ref="description">
      <Scroll
        ref="scroll"
        :data="proList"
        :hasMore="hasMore"
        @pullingUp="getPageOrders"
      >
        <table>
          <tr class="first"><th>名称</th><th>成交价格</th><th>波动</th><th>成交时间</th></tr>
          <tr v-for="item in proList">
            <td>{{item.productName}}</td>
            <td>{{formatAmount(item.price)}}</td>
            <td class="wave"><img src="./up@2x.png" v-if="+item.wave > 0"><img src="./down@2x.png" v-if="+item.wave < 0">{{item.wave}}</td>
            <td>{{formatDate(item.claimDatetime)}}</td>
          </tr>
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
        proList: [],
        proList2: [],
        start: 1,
        limit: 10,
        hasMore: true,
        dataArr: [],
        xArr: []
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
      formatDate(date, format) {
        return formatDate(date, format);
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
          // backgroundColor: '#23AD8C',
          color: '#23AD8C',
          areaStyle: {},
          grid: {
            top: '10px',
            bottom: '20px'
          },
          xAxis: {
            type: 'category',
            data: this.xArr
            // boundaryGap: false
            // show: false
          },
          yAxis: {
            type: 'value'
            // boundaryGap: false
            // show: false
          },
          series: [{
            data: this.dataArr,
            type: 'line',
            smooth: true,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#23AD8C' // 0% 处的颜色
                }, {
                  offset: 1, color: '#fff' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }
            }
          }]
        });
      },
      getPageOrders() {
        this.loading = true;
        Promise.all([
          getDeriveZichanPage({
            start: this.start,
            limit: this.limit,
            status: 1,
            type: 2,
            variety: this.variety || '',
            orderColumn: 'claim_datetime',
            orderDir: 'desc'
          }),
          getDeriveZichanPage({
            start: this.start,
            limit: this.limit,
            status: 1,
            type: 2,
            variety: this.variety || '',
            orderColumn: 'claim_datetime',
            orderDir: 'asc'
          })
        ]).then(([res1, res2]) => {
          if (res1.list.length < this.limit || res1.totalCount <= this.limit) {
            this.hasMore = false;
          }
          this.proList = this.proList.concat(res1.list);
          this.proList2 = this.proList2.concat(res2.list);
          this.start++;
          res2.list.map((item) => {
            this.dataArr.push(formatAmount(item.price));
            this.xArr.push(formatDate(item.claimDatetime, 'hh:mm:ss'));
          });
          console.log(this.dataArr);
          this.drawPie('main');
          this.loading = false;
        }).catch(() => { this.loading = false; });
      },
      sendMessage(pinzhong) {
        // debugger;
        this.variety = pinzhong;
        this.start = 1;
        this.limit = 10;
        this.proList = [];
        this.dataArr = [];
        this.xArr = [];
        this.getPageOrders();
      }
    },
    mounted() {
      // this.$nextTick(function() {
      //   this.drawPie('main');
      // });
      setTitle('交易动态');
      // this.getPageOrders();
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
    .me-list {
      background: $color-highlight-background;
      position: absolute;
      top: 5.56rem;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: auto;
      z-index: -1;
      table {
        font-size: 0.22rem;
        width: 100%;
        td {
          text-align: center;
        }
        tr.first {
          background: #edf8f5;
          color: #2d2d2d;
          width: 100%;
          height: 0.76rem;
          line-height: 0.76rem;
          padding: 0 0.3rem;
        }
        tr {
          width: 100%;
          height: 1rem;
          line-height: 1rem;
          padding: 0 0.3rem;
          border-bottom: 1px solid $color-border;
          .wave {
            img {
              width: 0.16rem;
              height: 0.2rem;
              margin-right: 0.1rem;
            }
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
