<template>
  <div class="sign-wrapper">
  	<div class="jf-wrapper">
      <back-only class="cate-header" title="签到"></back-only>
      <!--<router-link to="/home/sign/rules" tag="div" class="signRule border-bottom-1px">签到规则</router-link>-->
      <!--<div class="signIntegral">-->
        <!--<div class="integralContent">-->
          <!--&lt;!&ndash;<h3>{{mark}}</h3>&ndash;&gt;-->
          <!--&lt;!&ndash;<h4>{{jfOwn}}</h4>&ndash;&gt;-->
          <!--&lt;!&ndash;<p>{{jfText}}</p>&ndash;&gt;-->
          <!--<h3>签到成功</h3>-->
          <!--<h4>12</h4>-->
          <!--<p>已获积分</p>-->
        <!--</div>-->
      <!--</div>-->
      <div class="top">
        <div class="title">
          <span class="real-title">每日签到</span>
          <span class="info">本月已连续签到3天，累计5天</span>
        </div>
        <div class="tips">连续签到越多，奖励越丰富</div>
        <div class="prograssBar"></div>
      </div>
    </div>
    <div class="date-wrapper">
      <calendar :dates="signDateList" :whichMonth="whichMonth"></calendar>
    </div>
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
  // import {formatAmount, formatDate} from 'common/js/util';

  // const LIMIT = 30;

  export default {
    data () {
      return {
        activeClass: '',
        text: '',
        mark: '',
        jfOwn: '',
        jfText: '',
        start: 1,
        signDateList: [],
        loadingFlag: false,
        whichMonth: false
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
      },
      signIn () {
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
    height: 6.2rem;
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

      }
      .prograssBar {
        height: 1rem;
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
	}
}
</style>
