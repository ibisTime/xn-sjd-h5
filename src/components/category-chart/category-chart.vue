<template>
  <div class="category-chart">
    <!--<div class="check-in-wrapper"></div>-->
    <div class="consignment-category">
      <div class="type">
        <!--<div @click="showOrder"><span>{{orderText}}</span><img :src="getOrderImg()"/></div>-->
        <div @click="showType"><span>{{typeText}}</span><img :src="getTypeImg()"/></div>
        <!--<div class="my-consignment" @click="go('/consignment-hall/my-consignment')">我的寄售订单</div>-->
      </div>
      <div class="more" v-show="order">
        <p v-for="(item, index) in orderList" @click="checkedOrder(index)" :class="{active: orderIndex === index}"><span>{{item.value}}</span><img
          src="./choosed.png" v-show="orderIndex === index"></p>
      </div>
      <div class="more" v-show="type">
        <p v-for="(item, index) in typeList" @click="checkedType(index)" :class="{active: typeIndex === index}"><span>{{item.value}}</span><img
          src="./choosed.png" v-show="typeIndex === index"></p>
      </div>
      <div class="black" v-show="order || type" @click="close"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import BScroll from 'better-scroll';
  import { getVarietyList } from 'api/biz';

  export default {
    props: {
      // categorys: {
      //   type: Array,
      //   default: []
      // },
      currentIndex: {
        type: Number,
        default: 0
      },
      deColor: {
        type: String,
        default: ''
      },
      acColor: {
        type: String,
        default: ''
      },
      bgColor: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        order: false,
        type: false,
        more: false,
        orderText: '',
        typeText: '',
        moreList: [],
        orderIndex: 0,
        typeIndex: 0,
        orderList: [{
          key: 0,
          value: '全部'
        }, {
          key: 1,
          value: '按时间排'
        }, {
          key: 2,
          value: '按价格排'
        }, {
          key: 3,
          value: '按数量排'
        }],
        typeList: [{
          key: 'all',
          value: '全部品种'
        }]
      };
    },
    mounted() {
      this.orderText = this.orderList[0].value;
      this.getVariety();
    },
    methods: {
      showOrder() {
        if (this.type) {
          this.type = !this.type;
        }
        this.order = !this.order;
      },
      showType() {
        if (this.order) {
          this.order = !this.order;
        }
        this.type = !this.type;
      },
      checkedOrder(index) {
        this.orderIndex = index;
        this.orderBy = this.orderList[index].key;
        this.orderText = this.orderList[index].value;
        this.order = !this.order;
        this.sendMessage();
      },
      checkedType(index) {
        this.typeIndex = index;
        this.pinzhong = this.typeList[index].value;
        this.typeText = this.typeList[index].value;
        this.type = !this.type;
        this.sendMessage();
      },
      getOrderImg() {
        return this.order ? require('./down-unchoosed@2x.png') : require('./up-choosed@2x.png');
      },
      getTypeImg() {
        return this.type ? require('./down-unchoosed@2x.png') : require('./up-choosed@2x.png');
      },
      close() {
        this.order = false;
        this.type = false;
      },
      go(url) {
        this.close();
        this.$router.push(url);
      },
      getVariety() {
        getVarietyList({
          status: 0,
          type: 2,
          minQuality: 0
        }).then((res) => {
          res.map((item, index) => {
            this.typeList.push({
              key: index,
              value: item.variety
            });
          });
          this.typeText = this.typeList[0].value;
        }).catch(() => {});
      },
      sendMessage() {
        this.$emit('sendMessage', this.orderBy, this.pinzhong);
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "~common/scss/variable";

  .category-chart {
    .black {
      /*position: absolute;*/
      /*top: 0;*/
      /*left: 0;*/
      width: 100%;
      height: 15rem;
      background: #000;
      opacity: 0.5;
      z-index: 1;
    }
    .consignment-category {
      z-index: 999;
      .type {
        font-size: 0;
        background: #fff;
        height: 0.8rem;
        text-align: center;
        display: flex;
        align-items: center;
        border-bottom: 1px solid $color-border;
        div {
          width: 100%;
          font-size: 0.3rem;
          color: #666;
          letter-spacing: 0.25px;
          display: flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          overflow: hidden;
          line-height: 0.8rem;
        }
        img {
          width: 0.18rem;
          height: 0.12rem;
          margin-left: 0.2rem;
        }
        .my-consignment {
          border-left: 1px solid $color-border;
        }
        .active {
          color: $primary-color;
          font-family: PingFangSC-Semibold;
        }
      }
      .more {
        z-index: 1;
        position: relative;
        font-size: 0.3rem;
        /*line-height: 1rem;*/
        background: #ffffff;
        p {
          height: 1rem;
          padding: 0.3rem;
          border-bottom: 1px solid $color-border;
          display: flex;
          align-items: center;
          justify-content: space-between;
          img {
            width: 0.34rem;
          }
        }
      }
    }
  }
  .active {
    color: $primary-color;
    font-family: PingFangSC-Semibold;
  }
</style>
