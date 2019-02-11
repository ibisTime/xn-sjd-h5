<template>
  <div class="category">
       <div class="consignment-category">
      <div class="type">
        <span class="title">认养的树</span>
        <div class="type-item">
          <span @click="areaClick">所在地区<img src="./down-unchoosed@2x.png"/></span>
          <span @click="filterClick">筛选<img src="./down-unchoosed@2x.png"/></span>
        </div>
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
    <category-city ref="cityPicker"
                    @hide="handleHide"
                    :outProvIndex="provIndex"
                    :outCityIndex="cityIndex"
                    :outAreaIndex="areaIndex"
                    @cityChose="cityChose"
                    top="0.8rem"></category-city>
    <category-filter-homepage ref="filterCategory"
                     @confirm="handleFilter"
                     :outMinPrice="minPrice"
                     :outMaxPrice="maxPrice"
                     :outPriceIndex="priceIndex"
                     :outIsFree="isFree"
                     :outIsNew="isNew"
                     :varietyList="varietyList"
                              :treeLevel="treeLevel"
    ></category-filter-homepage>
      </div>
</template>

<script type="text/ecmascript-6">
  import { getAdoptVarietyList } from 'api/biz';
  import { getDictList } from 'api/general';
  import CategoryCity from 'components/category-city/category-city';
  import CategoryFilterHomepage from 'components/category-filter-homepage/category-filter-homepage';

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
        }],
        province: '',
        provIndex: 1,
        city: '',
        cityIndex: 0,
        area: '',
        areaIndex: 0,
        minPrice: '',
        maxPrice: '',
        priceIndex: -1,
        isFree: false,
        isNew: false,
        bigCode: this.$route.query.code || '',
        smallCode: '',
        varietyList: [],
        treeLevel: []
      };
    },
    mounted() {
      this.orderText = this.orderList[0].value;
      this.getInitData();
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
      sendMessage() {
        this.$emit('sendMessage', this.orderBy, this.pinzhong);
      },

      handleHide() {
        this.areaActive = false;
      },

      handleSmallHide() {
        this.smallActive = false;
      },

      handleConfirm(bigCode, smallCode, smallName) {
        this.bigCode = bigCode;
        this.smallCode = smallCode;
        this.smallName = smallName;
        this.resetQuery();
      },

      firstUpdateBigName(name) {
        this.smallName = name;
      },
      cityChose(prov, city, area, provIdx, cityIdx, areaIdx) {
        this.province = prov;
        // this.provIndex = provIdx;
        this.city = city;
        // this.cityIndex = cityIdx;
        this.area = area;
        // this.areaIndex = areaIdx;
        // this.resetQuery();
        this.$emit('cityConfirm', prov, city, area);
      },

      filterClick() {
        this.$refs.cityPicker.hide();
        this.$refs.filterCategory.show();
        // this.$refs.smallCategory.hide();
      },

      handleFilter(level, variety) {
        this.$emit('filterConfirm', level, variety);
      },

      areaClick() {
        this.areaActive = !this.areaActive;
        // this.$refs.smallCategory.hide();
        if (this.areaActive) {
          this.$refs.cityPicker.show();
          this.$refs.cityPicker.initScroll();
        } else {
          this.$refs.cityPicker.hide();
        }
      },
      getInitData() {
        Promise.all([
          getAdoptVarietyList(),
          getDictList('TREE_LEVEL')
        ]).then(([res1, res2]) => {
          this.varietyList = res1;
          res2.map((item) => {
            this.treeLevel.push({
              code: item.dkey,
              name: item.dvalue
            });
          });
        }).catch(() => {});
      }
    },
    components: {
      CategoryCity,
      CategoryFilterHomepage
    }
  };
</script>

<style scoped lang="scss">
  @import "~common/scss/variable";

  .category {
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
        justify-content: space-between;
        padding: 0 0.2rem;
        .title {
          font-size: 0.3rem;
          font-weight: 500;
        }
        .type-item {
          font-size: 0.26rem;
          span:first-child {
            margin-right: 0.5rem;
          }
          span {
            display: flex;align-items: center;
            img {
              width: 0.1rem;
              height: 0.1rem;
              margin-left: 0.08rem;
            }
          }
        }
        div {
          /*width: 33.3%;*/
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
