<template>
  <div id="calendar">
    <!-- 年份 月份 -->
    <div class="month">
      <ul>
        <!--点击会触发pickpre函数，重新刷新当前日期 @click(vue v-on:click缩写) -->
        <!-- <li class="arrow" @click="pickPre(currentYear,currentMonth)">❮</li> -->
        <li class="year-month" v-show="whichMonth">
            <span class="choose-year">{{ currentYear }} 年</span>
            <span class="choose-month">{{ currentMonth}} 月</span>
        </li>
        <!-- <li class="arrow" @click="pickNext(currentYear,currentMonth)">❯</li> -->
      </ul>
    </div>
    <div class="weekPannel">
      <ul class="weekdays">
        <li>日</li>
        <li>一</li>
        <li>二</li>
        <li>三</li>
        <li>四</li>
        <li>五</li>
        <li>六</li>
      </ul>
      <!-- 日期 -->
      <div class="dayPanel">
        <ul class="days">
        <li v-for="dayobject in days">
          <!--<span v-if="isGray(dayobject)">-->
            <!--<span class="other-month" :class="getClass(dayobject)">{{ dayobject.day.getDate() }}</span>-->
          <!--</span>-->
          <span v-if="!isGray(dayobject)">
            <span :class="getClass(dayobject)" v-if="dayobject.day.toString() === curTime.toString()" class="today">今天</span>
            <span :class="getClass(dayobject)" v-if="dayobject.day.toString() !== curTime.toString()">{{ dayobject.day.getDate() }}</span>
          </span>
        </li>
      </ul>
      </div>
    </div>
    <!-- 星期 -->
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      dates: {
        type: Array,
        default: function () {
          return [];
        }
      },
      whichMonth: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        currentDay: 1,
        currentMonth: 1,
        currentYear: 1970,
        days: [],
        curTime: null
      };
    },
    created: function() {  // 在vue初始化时调用
      this.initData();
    },
    methods: {
      initData: function() {
        let currentWeek = 1;
        this.d = new Date();
        let day = this.d.getDate();
        this.d.setDate(1);
        this.currentDay = this.d.getDate();
        this.currentYear = this.d.getFullYear();
        this.currentMonth = this.d.getMonth() + 1;
        currentWeek = this.d.getDay(); // 1...6,0
        if (currentWeek === 0) {
          currentWeek = 7;
        }
        this.str = this.d.getTime();

        for (let i = currentWeek; i > 0; i--) {
          let d = new Date(this.str);
          d.setDate(d.getDate() - i);
          this.days.push({
            day: d
          });
        }
        for (let i = 0; i <= 41 - currentWeek; i++) {
          let d = new Date(this.str);
          d.setDate(d.getDate() + i);
          this.days.push({
            day: d,
            sign: false
          });
        }
        this.currentIndex = day + currentWeek - 1;
        this.curTime = new Date();
      },
      isGray(dayobject) {
        return dayobject.day.getMonth() + 1 !== this.currentMonth;
      },
      // 返回 类似 2016-01-02 格式的字符串
      formatDate: function(year, month, day) {
        var y = year;
        var m = month;
        if(m < 10) m = '0' + m;
        var d = day;
        if(d < 10) d = '0' + d;
        return y + '-' + m + '-' + d;
      },
      getClass(item) {
        let classArr = [];
        this.active = false;
        if(item.sign) {
          classArr.push('active');
          this.active = true;
        }
        if(item.first === '1' && item.sign && item.day.getDay() !== 6 || (item.sign && item.day.getDay() === 0 && item.last === '0')) {
          classArr.push('f');
        }
        if(item.last === '1' && item.day.getDay() !== 0) {
          // 最后一个： 1。数组的最后一个 且不是周一
          //           2。周六签到
          classArr.push('l');
        }
        if(item.sign && item.first === '0' && item.last === '0' && item.day.getDay() !== 6 && item.sign && item.day.getDay() !== 0) {
          classArr.push('middle');
        }
        return classArr.join(' ');
      }
    },
    watch: {
      dates(newVal) {
        for (let i = 0; i <= this.currentIndex && i < this.days.length; i++) {
          let day = this.days[i].day;
          let str = this.formatDate(day.getFullYear(), day.getMonth() + 1, day.getDate());
          for (let j = 0; j < newVal.length; j++) {
            if(newVal[j] instanceof Array) {
              newVal[j].map((item, index) => {
                if (item === str) {
                  this.days.splice(i, 1, {
                    day,
                    sign: true,
                    first: index === 0 ? '1' : '0',
                    last: index === newVal[j].length - 1 ? '1' : '0'
                  });
                }
              });
            } else {
              if (newVal[j] === str) {
                this.days.splice(i, 1, {
                  day,
                  sign: true
                });
                break;
              }
            }
          }
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  #calendar{
    /*margin: 0.3rem;*/
    text-align: center;
    font-size: $font-size-medium;

    .weekPannel{
      /*padding: 0.28rem;*/
      .weekdays{
      width: 100%;
      height: 0.42rem;
      line-height: 0.42rem;
      padding: 0 0.26rem;
      /*background-color: #F2F2F2;*/
      /*border-radius: 0.21rem;*/
      display: flex;
      justify-content: space-around;
        li{
          float: left;
          margin-right: 0.64rem;
          &:last-child{
            margin-right: 0;
          }
        }
      }
      .dayPanel{
        margin-top: 0.3rem;
        .days{
          width: 100%;
          height: 5rem;
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          .today-li {
            padding: 0.2rem 0;
          }
          li{
            float: left;
            width: 0.8rem;
            height: 0.9rem;
            line-height: 0.5rem;
            padding: 0.2rem;
            span{
              display: inline-block;
              width: 100%;
              height: 100%;
              text-align: center;
            }
            i{
              position: absolute;
              top: 0;
              left: 0.5rem;
              display: inline-block;
              width: 0.3rem;
              height: 0.3rem;
              text-align: center;
              font-style:normal;
              background-repeat: no-repeat;
              background-size: 0.3rem;
              @include bg-image('tick');
            }
            .other-month{
              color: #CED1C6;
            }
            .active{
              position: relative;
              top: -0.2rem;
              left: -0.2rem;
              display: inline-block;
              width: 0.46rem;
              height: 0.46rem;
              margin: 0.2rem;
              border-radius: 2rem;
              background: $primary-color;
              color: $color-highlight-background;
            }
            .first {
              border-bottom-right-radius: 0;
              border-top-right-radius: 0;
            }
            .last {
              border-bottom-left-radius: 0;
              border-top-left-radius: 0;
            }
            .middle {
              border-radius: 0;
              width: 320%;
              position: relative;
              left: -160%;
            }
            .first_2 {
              border-bottom-right-radius: 0;
              border-top-right-radius: 0;
              width: 200%;
              position: relative;
              left: -80%;
            }
            .last_2 {
              border-bottom-left-radius: 0;
              border-top-left-radius: 0;
              width: 200%;
              position: relative;
              left: -100%;
            }




            .f {
              width: 300%;
              position: relative;
              left: -132%;
            }
            .l {
              width: 300%;
              position: relative;
              left: -160%;
            }
          }
          .today {
            font-size: 0.22rem;
            transform: scale(0.8);
            white-space: nowrap;
          }
        }
      }
    }
  }
</style>
