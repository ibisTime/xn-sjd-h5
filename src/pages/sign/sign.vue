<template>
  <div class="sign-wrapper">
    <back-only class="cate-header" title="签到"></back-only>
    <scroll ref="scroll" :pullUpLoad="pullUpLoad">
      <div class="jf-wrapper">
        <div class="top">
          <div class="title">
            <span class="real-title">每日签到</span>
            <span class="info">本月已连续签到{{continueSignCount}}天，累计{{monthSignCount}}天</span>
          </div>
          <div class="tips">连续签到越多，奖励越丰富</div>
          <div class="prograssBar">
            <!--<div class="gifts">-->
              <!--<span class="gift-icon" v-for="item in giftList"></span>-->
            <!--</div>-->
            <!--<div class="line">-->
              <!--<div class="nowCount" :style="{width: getWidth()+'%'}"></div>-->
              <!--<div class="totalCount"></div>-->
            <!--</div>-->
            <div class="giftList">
              <div class="giftItem" v-for="(item, index) in giftList">
                <span class="gift-icon"></span>
                <div class="line">
                  <div class="nowCount" :style="{width: item.width+'%'}" :class="getLineClass(index)"></div>
                  <div class="totalCount" :class="getLineClass(index)"></div>
                  <span class="dot"></span>
                </div>
                <p class="gift-day">{{item.day}}天</p>
                <p class="gift-gift">{{item.number}}{{item.gift}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="date-wrapper">
      <calendar :dates="signDateList" :whichMonth="whichMonth"></calendar>
      <button class="sign" @click="signIn">马上签到</button>
    </div>
    </scroll>
    <router-view></router-view>
    <sign-mask ref="mask" :text="text" :isHtml="isHtml"></sign-mask>
    <full-loading v-show="loadingFlag"></full-loading>
    <check-in v-show="showCheckIn" @close="close" :signTpp="signTpp" :signDays="signDays"></check-in>
  </div>
</template>
<script>
  import calendar from 'base/calendar/calendar';
  import SignMask from 'components/sign-mask/sign-mask';
  import FullLoading from 'base/full-loading/full-loading';
  import BackOnly from 'components/back-only/back-only';
  import { monthSignCount, signIn, getContinueSignList } from 'api/biz';
  import { getSystemConfigPage } from 'api/general';
  import {formatAmount, formatDate, getUserId} from 'common/js/util';
  import Scroll from 'base/scroll/scroll';
  import CheckIn from 'base/check-in/check-in';

  export default {
    data () {
      return {
        pullUpLoad: null,
        activeClass: '',
        text: '',
        mark: '',
        jfOwn: '',
        jfText: '',
        start: 1,
        signDateList: [],
        loadingFlag: false,
        whichMonth: false,
        nowDay: 25,
        giftList: [{
          day: 3,
          gift: '碳泡泡',
          width: 0
        }, {
          day: 5,
          gift: '碳泡泡',
          width: 0
        }, {
          day: 7,
          gift: '积分',
          width: 0
        }, {
          day: 15,
          gift: '积分',
          width: 0
        }, {
          day: 30,
          gift: '积分',
          width: 0
        }, {
          day: 90,
          gift: '碳泡泡',
          width: 0
        }, {
          day: 180,
          gift: '积分',
          width: 0
        }],
        continueSignCount: 0,
        monthSignCount: 0,
        showCheckIn: false,
        signTpp: '0',
        signDays: 0
      };
    },
    created() {
      this.isHtml = true;
      this.getInitData();
    },
    methods: {
      getInitData() {
        // let curTime = formatDate(new Date());
        let startTime = formatDate(this.getMonth().firstDay);
        let endTime = formatDate(this.getMonth().lastDay);
        this.loading = true;
        Promise.all([
          monthSignCount({
            createStartDatetime: startTime,
            createEndDatetime: endTime
          }),
          getContinueSignList({
            createStartDatetime: startTime,
            createEndDatetime: endTime
          }),
          getSystemConfigPage({
            start: 1,
            limit: 10,
            type: 'SIGN_RULE',
            orderColumn: 'id',
            orderDir: 'asc'
          })
        ]).then(([res1, res2, res3]) => {
          this.loading = false;
          this.monthSignCount = res1.monthSignCount;
          this.continueSignCount = res1.continueSignCount;
          // this.handleSignList(res2);
          // this.signDateList = [['2019-01-03', '2019-01-04', '2019-01-05'], ['2019-01-09', '2019-01-10'], '2019-01-13'];
          this.signDateList = this.handleSignList(res2);
          res3.list.map((item, index) => {
            this.giftList[index].gift = `${item.cvalue}${this.giftList[index].gift}`;
          });
          this.getWidth();
        }).catch(() => {
          this.loading = false;
        });
      },
      handleSignList(list) {
        let newArr = [];
        list.map((item) => {
          if(item.signResList.length > 1) {
            let insideArr = [];
            item.signResList.map((realDay) => {
              insideArr.push(this.formatDate(realDay));
            });
            insideArr.reverse();
            newArr.push(insideArr);
          } else {
            newArr.push(this.formatDate(item.signResList[0]));
          }
        });
        newArr = newArr.reverse();
        return newArr;
      },
      close() {
        this.showCheckIn = false;
        this.getInitData();
      },
      formatDate(date) {
        return formatDate(date, 'yyyy-MM-dd');
      },
      getMonth() {
        let date = new Date();
        let y = date.getFullYear();
        let m = date.getMonth();
        let firstDay = new Date(y, m, 1);
        let lastDay = new Date(y, m + 1, 0);
        return {
          firstDay: firstDay,
          lastDay: lastDay
        };
      },
      getLineClass(index) {
        if(index === 0) {
          return 'line-first';
        }
        if(index === this.giftList.length - 1) {
          return 'line-last';
        }
        return '';
      },
      signIn () {
        // this.signDateList = ['2019-01-01', '2019-01-02', '2019-01-03'];
        // this.signDateList = [['2018-12-31', '2019-01-01'], ['2019-01-04', '2019-01-05', '2019-01-06']];
        if (getUserId()) {
          this.loading = true;
          signIn({
            client: 'h5'
          }).then((res) => {
            this.signTpp = formatAmount(res.tppAmount);
            this.signDays = res.signDays;
            this.showCheckIn = true;
            this.loading = false;
          }).catch(() => {
            this.loading = false;
          });
        } else {
          this.text = '您未登录';
          this.$refs.toast.show();
          setTimeout(() => {
            this.$router.push('/login');
          }, 1000);
        }
      },
      getWidth() {
        // this.continueSignCount;  // 连续签到天数
        // _this.continueSignCount = 25;
        let _this = this;
        _this.count = _this.continueSignCount;
        let daysList = [];
        _this.giftList.map((item) => {
          daysList.push(item.day);
        });
        let x;
        let y;
        daysList.map((z, index) => {
          if(daysList[index] === this.count) {
            // 正好在某一节点
            if(index === 0) {
              y = '0';
            } else {
              y = index;
            }
          } else if(daysList[index] < this.count && daysList[index + 1] > this.count) {
            // 在两节点之间
            if(index === 0) {
              x = '0';
            } else {
              x = index;
            }
          }
        });
        console.log(x, y);
        if(x) {
          x = x === '0' ? 0 : x;
          let realPrecent = (_this.count - daysList[x]) / (daysList[x + 1] - daysList[x]);
          _this.giftList.map((item, index) => {
            if(index < x) {
              item.width = 100;
            } else if(index > x + 1) {
              item.width = 0;
            } else if(index === x) {
              if(realPrecent > 0.5) {
                item.width = 100;
              } else if (realPrecent < 0.5) {
                item.width = 50 + (_this.count - _this.giftList[index].day) / ((_this.giftList[index + 1].day - _this.giftList[index].day) / 2) * 50;
              } else {
                item.width = 100;
              }
            } else if(index === x + 1) {
              if(realPrecent > 0.5) {
                item.width = 50 * (realPrecent - 0.5);
              } else{
                item.width = 0;
              }
            }
          });
        } else if(y) {
          y = y === '0' ? 0 : y;
          _this.giftList.map((item, index) => {
            if(index < y) {
              item.width = 100;
            } else if(index > y) {
              item.width = 0;
            } else if(index === y) {
              item.width = 50;
            }
          });
        } else {
          if(_this.count < daysList[0]) {
            _this.giftList.map((item) => {
              item.width = 0;
            });
            _this.giftList[0].width = 50 * (_this.count / _this.giftList[0].day);
          } else if(_this.count > daysList[daysList.length - 1]) {
            _this.giftList.map((item) => {
              item.width = 100;
            });
            _this.giftList[_this.giftList.length - 1].width = 75;
          }
        }
      }
    },
    components: {
      Scroll,
      calendar,
      SignMask,
      FullLoading,
      BackOnly,
      CheckIn
    }
  };
</script>
<style lang="scss" scoped>
@import "~common/scss/mixin";
@import "~common/scss/variable";

.sign-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;

	.jf-wrapper {
		width: 100%;
    height: 5.6rem;
		background-size: 100% 100%;
  	@include bg-image('background');
  	color: #fff;
  	font-size: $font-size-medium;

  	/*<!--.signRule {-->*/
  		/*<!--position: absolute;-->*/
  		/*<!--top: 0.4rem;-->*/
  		/*<!--right: 0.3rem;-->*/
  	/*<!--}-->*/

  	/*<!--.signIntegral {-->*/
  		/*<!--position: absolute;-->*/
  		/*<!--top: 0.4rem;-->*/
  		/*<!--left: 37%;-->*/
  		/*<!--width: 2.2rem;-->*/
  		/*<!--height: 2.2rem;-->*/
  		/*<!--border-radius: 50%;-->*/
  		/*<!--background: #65BDFC;-->*/

  		/*<!--.integralContent{-->*/
        /*<!--display: flex;-->*/
        /*<!--flex-direction: column;-->*/
        /*<!--justify-content: center;-->*/
			  /*<!--position: absolute;-->*/
    		/*<!--top: 0.12rem;-->*/
    		/*<!--left: 0.12rem;-->*/
    		/*<!--width: 1.96rem;-->*/
    		/*<!--height: 1.96rem;-->*/
    		/*<!--border-radius: 50%;-->*/
    		/*<!--background: #fff;-->*/
        /*<!--color: #48b0fb;-->*/
        /*<!--text-align: center;-->*/

        /*<!--h3 {-->*/
          /*<!--font-size: $font-size-medium;-->*/
        /*<!--}-->*/

        /*<!--h4 {-->*/
          /*<!--margin-top: 0.22rem;-->*/
          /*<!--font-size: $font-size-large-s;-->*/
        /*<!--}-->*/

        /*<!--p {-->*/
          /*<!--margin-top: 0.11rem;-->*/
          /*<!--font-size: $font-size-small-ss;-->*/
        /*<!--}-->*/
  		/*<!--}-->*/
  	/*<!--}-->*/
    .top {
      padding: 1.2rem 0.3rem;
      color: $color-highlight-background;
      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.3rem;
        .real-title {
          font-size: 0.48rem;
        }
        .info {
          font-size: 0.24rem;
          padding: 0.1rem 0.2rem;
          background: #357369;
          border-radius: 0.5rem;
        }
      }
      .tips {
        margin-bottom: 0.4rem;
      }
      .prograssBar {
        .giftList {
          display: flex;
          justify-content: space-around;
          .giftItem {
            display: inline-block;
            text-align: center;
            flex: 1;
            .gift-icon {
              display: inline-block;
              width: 0.46rem;
              height: 0.46rem;
              @include bg-image('gift');
              background-size: 100% 100%;
              margin-bottom: 0.1rem;
            }
            .line {
              margin-bottom: 0.2rem;
              position: relative;
              .line-first {
                border-bottom-left-radius: 0.04rem;
                border-top-left-radius: 0.04rem;
              }
              .line-last {
                border-bottom-right-radius: 0.04rem;
                border-top-right-radius: 0.04rem;
              }
              .totalCount {
                /*border-radius: 0.4rem;*/
                background: rgba(255, 255, 255, 0.3);
                height: 0.1rem;
              }
              .nowCount {
                background: $color-highlight-background;
                height: 0.1rem;
                position: absolute;
                /*border-radius: 0.04rem;*/
              }
              .dot {
                display: inline-block;
                width: 0.24rem;
                height: 0.24rem;
                border-radius: 50%;
                /*background: rgba(255, 255, 255, 0.3);*/
                background: #fff;
                position: relative;
                top :-0.16rem
              }
            }
            .gift-day {
              margin-bottom: 0.1rem;
              position: relative;
              top :-0.16rem
            }
            .gift-gift {
              display: inline;
              font-size: 0.22rem;
              padding: 0.01rem;
              border-radius: 0.06rem;
              background: rgb(25, 118, 112);
              position: relative;
              top :-0.16rem
            }
          }
        }
        /*<!--height: 1rem;-->*/
        /*<!--.gifts {-->*/
          /*<!--display: flex;-->*/
          /*<!--align-items: center;-->*/
          /*<!--justify-content: space-between;-->*/
          /*<!--margin-bottom: 0.2rem;-->*/
          /*<!--.gift-icon {-->*/
            /*<!--display: inline-block;-->*/
            /*<!--width: 0.46rem;-->*/
            /*<!--height: 0.46rem;-->*/
            /*<!--@include bg-image('gift');-->*/
            /*<!--background-size: 100% 100%;-->*/
          /*<!--}-->*/
        /*<!--}-->*/
        /*<!--.totalCount {-->*/
          /*<!--border-radius: 0.4rem;-->*/
          /*<!--background: rgba(255, 255, 255, 0.3);-->*/
          /*<!--height: 0.1rem;-->*/
        /*<!--}-->*/
        /*<!--.nowCount {-->*/
          /*<!--background: $color-highlight-background;-->*/
          /*<!--height: 0.1rem;-->*/
          /*<!--position: absolute;-->*/
          /*<!--border-radius: 0.04rem;-->*/
        /*<!--}-->*/
      }
    }
	}

  .operate-btn {
    border-top: none;
  }

	.date-wrapper {
    border: 1px solid $color-border;
    width: 90%;
    margin: 0 auto;
    position: relative;
    top: -1rem;
    background: $color-highlight-background;
    border-radius: 0.1rem;
    padding: 0.3rem;
    overflow: hidden;

		.active {
      position: relative;
      top:-0.3rem;;
      left: -0.3rem;
      display: inline-block;
      width: 0.7rem;
      height: 0.7rem;
      margin: 0.2rem;
      padding: 0.1rem;
      border: 0.02rem solid #48b0fb;
      border-radius: 50%;
    }
    .sign {
      background: $second-color;
      color: $color-highlight-background;
      font-size: 0.3rem;
      border-radius: 0.08rem;
      width: 100%;
      height: 0.9rem;
    }
	}
}
</style>
