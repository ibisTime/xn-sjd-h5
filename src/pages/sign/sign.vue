<template>
  <div class="sign-wrapper">
    <back-only class="cate-header" title="签到"></back-only>
    <scroll ref="scroll" :pullUpLoad="pullUpLoad">
      <div class="jf-wrapper">
        <div class="top">
          <div class="title">
            <span class="real-title">每日签到</span>
            <span class="info">本月已连续签到3天，累计5天</span>
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
              <div class="giftItem" v-for="item in giftList">
                <span class="gift-icon"></span>
                <div class="line">
                  <!--<div class="nowCount" :style="{width: getWidth()+'%'}"></div>-->
                  <div class="totalCount"></div>
                  <span class="dot"></span>
                </div>
                <p class="gift-day">{{item.day}}天</p>
                <p class="gift-gift">{{item.gift}}</p>
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
  </div>
</template>
<script>
  import calendar from 'base/calendar/calendar';
  import SignMask from 'components/sign-mask/sign-mask';
  import FullLoading from 'base/full-loading/full-loading';
  import BackOnly from 'components/back-only/back-only';
  import {getSystemConfigCkey} from 'api/general';
  // import {sign, signNum, signQuery} from 'api/me';
  import {getAccount, getSignIntegral} from 'api/account';
  import {formatAmount} from 'common/js/util';
  import Scroll from 'base/scroll/scroll';
  // import {formatAmount, formatDate} from 'common/js/util';

  // const LIMIT = 30;

  export default {
    data () {
      return {
        pullUpLoad: false,
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
          gift: '10碳泡泡'
        }, {
          day: 5,
          gift: '30碳泡泡'
        }, {
          day: 7,
          gift: '5积分'
        }, {
          day: 15,
          gift: '15积分'
        }, {
          day: 30,
          gift: '30积分'
        }, {
          day: 90,
          gift: '200积分'
        }, {
          day: 180,
          gift: '90积分'
        }]
      };
    },
    created() {
      this.isHtml = true;
      this.getInitData();
    },
    methods: {
      getInitData() {
        // sign().finally(() => {
        //   this.signIn();
        // }).catch(() => {});
        // this.getJF();
        // this.signDateList = ['2019-01-01', '2019-01-02', '2019-01-03'];
      },
      signIn () {
        // this.signDateList = ['2019-01-01', '2019-01-02', '2019-01-03'];
        this.signDateList = [['2018-12-31', '2019-01-01'], ['2019-01-04', '2019-01-05', '2019-01-06']];
        // signQuery().then((data) => {
        //   this.getSignDate();
        //   this.loadingFlag = false;
        //   if (data.todaySign) {
        //     this.mark = '签到成功';
        //   } else {
        //     this.mark = '签到失败';
        //   }
        // }).catch(() => {
        //   this.mark = '未查询到';
        //   this.loadingFlag = false;
        // });
      },
      getWidth() {
        let daysList = [];
        this.giftList.map((item) => {
          daysList.push(item.day);
        });
        let x;
        daysList.map((z, index) => {
          if(daysList[index] < this.nowDay && daysList[index + 1] > this.nowDay) {
            x = index;
          }
        });
        return (this.nowDay - daysList[x]) / (daysList[x + 1] - daysList[x]) * 100;
      },
      getJF () {
        getAccount().then((data) => {
          getSignIntegral(data[1].accountNumber, '02').then((data) => {
            this.jfOwn = formatAmount(data.totalAmount);
            this.jfText = '已获积分';
          });
        });
      },
      getSignDate () {
        // signNum(this.start, LIMIT).then((data) => {
        //   data.list.forEach((item) => {
        //     this.signDateList.push(formatDate(item.signDatetime, 'yyyy-MM-dd'));
        //   });
        // });
      },
      showRule () {
        getSystemConfigCkey('cardsTradition').then((data) => {
          this.text = data.cvalue;
        }).catch(() => {
          this.text = '暂无';
        });
        this.$refs.mask.show();
      }
    },
    components: {
      Scroll,
      calendar,
      SignMask,
      FullLoading,
      BackOnly
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
                background: rgba(255, 255, 255, 0.3);
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
      margin-top: 0.7rem;
    }
	}
}
</style>
