<template>
  <div class="category">
    <!--<div class="check-in-wrapper"></div>-->
    <div class="consignment-category">
      <div class="type">
        <span @click="areaClick">所在地区<img src="./down-unchoosed@2x.png"/></span>
        <span @click="smallClick">树级<img src="./down-unchoosed@2x.png"/></span>
        <span @click="ageClick">树龄排序<img src="./down-unchoosed@2x.png"/></span>
        <span @click="filterClick">筛选<img src="./down-unchoosed@2x.png"/></span>
      </div>
    </div>
    <category-city ref="cityPicker"
                    @hide="handleHide"
                    :outProvIndex="provIndex"
                    :outCityIndex="cityIndex"
                    :outAreaIndex="areaIndex"
                    @cityChose="cityChose"
                    top="1.6rem"
                    :cityData1="provinceList"></category-city>
    <category-filter ref="filterCategory"
                     @confirm="handleFilter"
                     :outMinPrice="minPrice"
                     :outMaxPrice="maxPrice"
                     :outPriceIndex="priceIndex"
                     :outIsFree="isFree"
                     :outIsNew="isNew"
                     :varietyList="varietyList"
    ></category-filter>
    <category-small ref="smallCategory"
                    @hide="handleSmallHide"
                    @confirm="handleConfirm"
                    @firstUpdateBigName="firstUpdateBigName"
                    :outSmallCode="smallCode"
                    :outBigCode="bigCode"></category-small>
    <category-age ref="ageCategory"
                     @confirm="handleAge"
                     orderColunm="age"
    ></category-age>
  </div>
</template>

<script type="text/ecmascript-6">
  // import BScroll from 'better-scroll';
  import { getPinzhongList } from 'api/biz';
  import CategoryCity from 'components/category-city/category-city';
  import CategoryFilter from 'components/category-filter/category-filter';
  import CategoryAge from 'components/category-age/category-age';
  import CategorySmall from 'components/category-small/category-small';

  export default {
    props: {
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
      },
      provinceList: {
        type: Array,
        default: function () {
          return [];
        }
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
        bigCode: this.$route.query.code || 'ALL',
        smallCode: '',
        varietyList: []
      };
    },
    mounted() {
      console.log(this.provinceList);
      this.orderText = this.orderList[0].value;
      this.getPinzhongList();
    },
    methods: {
      getPinzhongList() {
        getPinzhongList().then((res) => {
          this.varietyList = res;
        }).catch(() => {});
      },
      handleHide() {
        this.areaActive = false;
      },
      handleSmallHide() {
        this.smallActive = false;
      },
      handleConfirm(bigCode, smallCode, smallName) {
        this.$emit('smallConfirm', bigCode);
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
        this.$emit('cityConfirm', prov, city, area);
      },

      filterClick() {
        this.$refs.cityPicker.hide();
        this.$refs.ageCategory.hide();
        this.$refs.filterCategory.show();
        // this.$refs.smallCategory.hide();
      },

      handleFilter(can, variety) {
        this.$emit('filterConfirm', can, variety);
      },

      areaClick() {
        this.areaActive = !this.areaActive;
        this.$refs.filterCategory.hide();
        this.$refs.ageCategory.hide();
        this.$refs.smallCategory.hide();
        if (this.areaActive) {
          this.$refs.cityPicker.show();
          this.$refs.cityPicker.initScroll();
        } else {
          this.$refs.cityPicker.hide();
        }
      },

      smallClick() {
        this.smallActive = !this.smallActive;
        this.$refs.filterCategory.hide();
        this.$refs.cityPicker.hide();
        this.$refs.ageCategory.hide();
        if (this.smallActive) {
          this.$refs.smallCategory.show();
          this.$refs.smallCategory.initData();
        } else {
          this.$refs.smallCategory.hide();
        }
      },
      resetQuery() {
        this.start = 1;
        this.$emit('getPageOrder');
      },
      ageClick() {
        this.$refs.filterCategory.hide();
        this.$refs.cityPicker.hide();
        this.$refs.smallCategory.hide();
        this.$refs.ageCategory.show();
      },
      handleAge(params) {
        this.$emit('ageConfirm', params);
      }
    },
    components: {
      CategoryCity,
      CategoryFilter,
      CategorySmall,
      CategoryAge
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
        justify-content: space-around;
        padding: 0 0.2rem;
        span {
          font-size: 0.3rem;
          color: #cdcdce;
          display: flex;
          align-items: center;
          img {
            width: 0.1rem;
            height: 0.1rem;
          }
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
