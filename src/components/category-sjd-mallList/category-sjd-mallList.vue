<template>
  <div class="category">
    <!--<div class="check-in-wrapper"></div>-->
    <div class="consignment-category">
      <div class="type">
        <span @click="all" :style="{color: allFilter ? '#f68646' : ''}">全部</span>
        <span @click="priceClick" :style="{color: priceFilter ? '#f68646' : ''}">价格<img src="./down-unchoosed@2x.png"/></span>
        <span @click="sellCountClick" :style="{color: sellCountFilter ? '#f68646' : ''}">销量<img src="./down-unchoosed@2x.png"/></span>
        <span @click="filterClick" :style="{color: filterFilter ? '#f68646' : ''}">筛选<img src="./down-unchoosed@2x.png"/></span>
      </div>
    </div>
    <category-filter-mall ref="filterCategoryMall"
                     @confirm="handleFilter"
                     :outMinPrice="minPrice"
                     :outMaxPrice="maxPrice"
                     :outPriceIndex="priceIndex"
                     :outIsFree="isFree"
                     :outIsNew="isNew"
                     :originList="origin"
                     :deliverList="deliver"
    ></category-filter-mall>
    <category-age ref="priceCategory"
                  :orderColumn="orderColumn"
                  @ageConfirm="priceConfirm"></category-age>
    <category-age ref="sellCountCategory"
                  :orderColumn="orderColumn"
                  @ageConfirm="sellCountConfirm"></category-age>
  </div>
</template>

<script type="text/ecmascript-6">
  // import BScroll from 'better-scroll';
  import { getOriginDeliverList } from 'api/biz';
  import CategoryCity from 'components/category-city/category-city';
  import CategoryFilterMall from 'components/category-filter-mall/category-filter-mall';
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
        bigCode: this.$route.query.code || '0',
        smallCode: '',
        origin: [],
        deliver: [],
        orderColumn: '',
        filterFilter: false,
        priceFilter: false,
        sellCountFilter: false,
        allFilter: false
      };
    },
    mounted() {
      this.getInitData();
    },
    methods: {
      getInitData() {
        this.loading = true;
        Promise.all([
          getOriginDeliverList('originalPlace'),
          getOriginDeliverList('deliverPlace')
        ]).then(([res1, res2]) => {
          this.origin = res1.placeList;
          this.deliver = res2.placeList;
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        });
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
        this.$emit('cityConfirm', prov, city, area);
      },

      filterClick() {
        this.$refs.priceCategory.hide();
        this.$refs.sellCountCategory.hide();
        this.$refs.filterCategoryMall.show();
      },

      handleFilter(params) {
        if(JSON.stringify(params) !== '{}') {
          this.allFilter = false;
          this.filterFilter = true;
        } else {
          this.filterFilter = false;
        }
        this.$emit('filterConfirm', params);
      },
      all () {
        this.allFilter = true;
        this.$refs.priceCategory.hide();
        this.$refs.sellCountCategory.hide();
        this.$refs.filterCategoryMall.hide();
        this.priceFilter = false;
        this.sellCountFilter = false;
        this.filterFilter = false;
        this.$emit('all');
      },

      priceClick() {
        this.orderColumn = 'min_price';
        this.$refs.filterCategoryMall.hide();
        this.$refs.priceCategory.show();
      },
      sellCountClick() {
        this.orderColumn = 'month_sell_count';
        this.$refs.filterCategoryMall.hide();
        this.$refs.sellCountCategory.show();
      },
      resetQuery() {
        this.start = 1;
        this.$emit('getPageOrder');
      },
      // ageClick() {
      //   this.$refs.ageCategory.show();
      // },
      priceConfirm(params) {
        this.allFilter = false;
        this.priceFilter = true;
        this.$emit('ageConfirm', params);
      },
      sellCountConfirm(params) {
        this.allFilter = false;
        this.sellCountFilter = true;
        this.$emit('ageConfirm', params);
      }
    },
    components: {
      CategoryCity,
      CategoryFilterMall,
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
