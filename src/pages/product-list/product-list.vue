<template>
  <div class="home-wrapper">
    <div class="search-wrapper">
      <search :left="searchLeft"></search>
    </div>
    <div class="header clearfix category-wrapper">
      <!--<category-scroll :currentIndex="currentIndex"-->
                       <!--:categorys="categorys"-->
                       <!--@select="selectCategory"></category-scroll>-->
      <!--<category-scroll :currentIndex="currentIndexSub"-->
                       <!--:categorys="categorysSub"-->
                       <!--@select="selectCategorySub"></category-scroll>-->
      <category-sjd-pro-list :provinceList="provinceList"
                             @getPageOrder="getPageOrders"
                             @filterConfirm="filterConfirm"
                             @ageConfirm="ageConfirm"
                             @cityConfirm="cityConfirm"
                             @smallConfirm="smallConfirm"
      ></category-sjd-pro-list>
    </div>
    <div class="content">
      <div class="hot" v-show="proList.length">
        <Scroll :data="proList"
                :hasMore="hasMore"
                @pullingUp="getPageOrders">
          <div class="proList">
            <div class="item" @click="go('/product-list/product-detail?code='+item.code)" v-for="item in proList">
              <div class="item-top">
                <div class="sell-type">{{sellTypeObj[item.sellType]}}</div>
                <div class="sell-type-right" :style="{background: canAdopt(item).canAdoptFlag ? '' : '#999'}">{{canAdopt(item).noAdoptReason}}</div>
                <img :src="formatImg(item.listPic)" class="hot-pro-img">
                <div class="prograss-bar" v-if="item.sellType === '4'">
                  <div class="nowCount" :style="{width: getWidth(item)+'%'}"></div>
                  <div class="totalCount"></div>
                  <div class="prograss-text"><span>{{item.nowCount}}/{{item.raiseCount}}</span></div>
                </div>
              </div>
              <div class="hot-pro-text">
                <p class="hot-pro-title">{{item.name}}</p>
                <p><span class="hot-pro-price">¥{{formatAmount(item.minPrice)}}<span v-if="item.productSpecsList.length > 1">起</span></span><span class="hot-pro-introduction">{{item.province}} {{item.city}}</span></p>
              </div>
            </div>
          </div>
        </Scroll>
      </div>
      <div class="mall-content">
        <no-result v-show="!proList.length && !hasMore" class="no-result-wrapper" title="抱歉，暂无商品"></no-result>
      </div>
    </div>
    <full-loading v-show="loading" :title="title"></full-loading>
    <toast ref="toast" :text="text"></toast>
    <router-view></router-view>
  </div>
</template>
<script>
import Toast from 'base/toast/toast';
import FullLoading from 'base/full-loading/full-loading';
import Slider from 'base/slider/slider';
import NoResult from 'base/no-result/no-result';
import Scroll from 'base/scroll/scroll';
import Search from 'components/search/search';
import CategoryScroll from 'base/category-scroll/category-scroll';
import { formatAmount, formatDate, formatImg, setTitle } from 'common/js/util';
import { getCookie } from 'common/js/cookie';
import { getDictList } from 'api/general';
import { getProductPage, getProductType, getProductAreaList } from 'api/biz';
import { getUserDetail } from 'api/user';
import CategorySjdProList from 'components/category-sjd-proList/category-sjd-proList';
export default {
  data() {
    return {
      title: '正在加载...',
      loading: true,
      toastText: '',
      currentList: [],
      text: '',
      start: 1,
      limit: 10,
      hasMore: true,
      proList: [],
      categorys: [{value: '全部', key: 'all'}],
      categorysSub: [{value: '全部', key: 'all'}],
      sellTypeObj: {},
      projectStatusObj: {},
        // {value: '个人', key: '0'},
        // {value: '定向', key: '1'},
        // {value: '集体', key: '2'},
        // {value: '捐赠', key: '3'}],
      userDetail: {},
      showCheckIn: false,
      pullUpLoad: null,
      currentIndex: +this.$route.query.index || 0,
      currentIndexSub: +this.$route.query.index || 0,
      index: 0,
      indexSub: 0,
      searchLeft: {
        back: true
      },
      provinceList: [],
      province: '',   // 筛选的省
      city: '',   // 筛选的市
      area: ''   // 筛选的区
    };
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    },
    formatDate(date, format) {
      return formatDate(date, format);
    },
    formatImg(img) {
      return formatImg(img);
    },
    getWidth(item) {
      return (item.nowCount / item.raiseCount) * 100;
    },
    go(url) {
      this.$router.push(url);
    },
    canAdopt(item) {
      item.canAdoptFlag = true;
      if(!this.userDetail.level) {
        item.canAdoptFlag = false;
        // item.noAdoptReason = '您未登录';
        item.noAdoptReason = this.projectStatusObj[item.status];
        return item;
      }
      // 专属产品
      if(item.sellType === '1') {
        // 销售类型为专属且未到认养量
        if(item.raiseCount === item.nowCount) {
          item.canAdoptFlag = false;
          item.noAdoptReason = '已被认养';
        } else {
          item.noAdoptReason = '可认养';
        }
        return item;
      }
      // 定向产品
      if(item.directType && item.directType === '1') {
        // 等级定向且用户为该等级
        if(item.raiseCount === item.nowCount) {
          item.canAdoptFlag = false;
          item.noAdoptReason = '已被认养';
          return item;
        }
        if(item.directObject !== this.userDetail.level) {
          item.canAdoptFlag = false;
          item.noAdoptReason = '不可认养';
        } else {
          item.noAdoptReason = '可认养';
        }
        return item;
      }
      if(item.directType && item.directType === '2') {
        // 用户定向且是定向用户
        if(item.raiseCount === item.nowCount) {
          item.canAdoptFlag = false;
          item.noAdoptReason = '已被认养';
          return item;
        }
        this.directFlag = false;
        item.directObject.split(',').map((item) => {
          if(item === this.userId) {
            this.directFlag = true;
          }
        });
        if(this.directFlag) {
          item.noAdoptReason = '可认养';
        } else {
          item.canAdoptFlag = false;
          item.noAdoptReason = '不可认养';
        }
        return item;
      }
      // 捐赠产品
      if(item.sellType === '3') {
        let curTime = new Date();
        // 2把字符串格式转换为日期类
        let startTime = new Date(Date.parse(item.raiseStartDatetime));
        let endTime = new Date(Date.parse(item.raiseEndDatetime));
        // 3进行比较
        if(curTime <= startTime || curTime >= endTime) {
          item.canAdoptFlag = false;
          item.noAdoptReason = '不可认养';
        } else {
          item.noAdoptReason = '可认养';
        }
        return item;
      }
      // 专属产品
      if(item.sellType === '4') {
        // 销售类型为专属且未到认养量
        if(item.raiseCount === item.nowCount) {
          item.canAdoptFlag = false;
          item.noAdoptReason = '已满标';
        } else {
          item.noAdoptReason = '可认养';
        }
        return item;
      }
    },
    selectCategory(index) {
      this.index = index;
      this.indexSub = 0;
      this.currentIndexSub = 0;
      this.currentIndex = index;
      this.start = 1;
      this.limit = 10;
      this.hasMore = true;
      this.proList = [];
      this.loading = true;
      this.getSubType();
    },
    selectCategorySub(index) {
      this.indexSub = index;
      this.currentIndexSub = index;
      this.start = 1;
      this.limit = 10;
      this.proList = [];
      this.getPageOrders();
    },
    // 获取下级分类
    getSubType() {
      this.loading = true;
      getProductType({
        parentCode: this.categorys[this.index].key,
        status: '1',
        orderDir: 'asc',
        orderColumn: 'order_no'
      }).then((res) => {
        this.categorysSub = [{value: '全部', key: 'all'}];
        res.map((item) => {
          this.categorysSub.push({
            value: item.name,
            key: item.code
          });
        });
        this.selectdType = this.categorysSub[this.indexSub].key;
        this.getPageOrders();
        this.loading = false;
      }).catch(() => { this.loading = false; });
    },
    getPageOrders() {
      // if(this.categorys[this.index].key === 'all') {
      //   this.parentCategoryCode = '';
      //   this.selectdType = '';
      // } else if(this.categorysSub[this.indexSub].key === 'all') {
      //   this.parentCategoryCode = this.categorys[this.index].key;
      //   this.selectdType = '';
      // } else {
      //   this.parentCategoryCode = '';
      //   this.selectdType = this.categorysSub[this.indexSub].key;
      // }
      this.loading = true;
      let config = {
        start: this.start,
        limit: this.limit,
        // sellType: sellType,
        // parentCategoryCode: this.parentCategoryCode,
        // categoryCode: this.selectdType,
        statusList: [4, 5, 6],
        name: this.query
      };
      if(this.can !== '2') {
        config.adoptStatus = this.can;
      }
      if(this.variety !== '') {
        config.variety = this.variety;
      }
      if(this.treeLevel !== '') {
        config.treeLevel = this.treeLevel;
      }
      if(this.province && this.city && this.area) {
        config.province = this.province;
        config.city = this.city;
        config.area = this.area;
      }
      config = {
        ...config,
        ...this.ageParams
      };
      Promise.all([
        getProductPage(config)
      ]).then(([res1]) => {
        if (res1.list.length < this.limit || res1.totalCount <= this.limit) {
          this.hasMore = false;
        }
        res1.list.map(function () {
          res1.applyDatetime = formatDate(res1.applyDatetime);
        });
        this.proList = this.proList.concat(res1.list);
        this.start++;
        this.loading = false;
      }).catch(() => { this.loading = false; });
    },
    getUserDetail() {
      getUserDetail({
        userId: this.userId
      }).then((res) => {
        this.userDetail = res;
      });
    },
    filterConfirm(can, variety) {
      this.start = 1;
      this.limit = 10;
      this.proList = [];
      this.can = can;
      this.variety = variety;
      this.getPageOrders();
    },
    ageConfirm(params) {
      this.start = 1;
      this.limit = 10;
      this.proList = [];
      this.ageParams = params;
      this.getPageOrders();
    },
    cityConfirm(prov, city, area) {
      this.province = prov;
      this.city = city;
      this.area = area;
      this.start = 1;
      this.limit = 10;
      this.proList = [];
      this.getPageOrders();
    },
    smallConfirm(bigCode) {
      if(bigCode !== 'ALL') {
        this.treeLevel = bigCode;
      } else {
        this.treeLevel = '';
      }
      this.start = 1;
      this.limit = 10;
      this.proList = [];
      this.getPageOrders();
    }
  },
  mounted() {
    this.pullUpLoad = null;
    this.loading = true;
    this.userId = getCookie('userId');
    this.categoryCode = this.$route.query.typeCode || '';
    this.query = this.$route.query.query || '';
    setTitle('认养列表');
    Promise.all([
      getDictList('sell_type'),
      getProductType({
        orderDir: 'asc',
        orderColumn: 'order_no',
        status: 1,
        typeList: ['0', '1']
      }),
      getDictList('product_status'),
      getProductAreaList()
    ]).then(([res1, res2, res3, res4]) => {
      res1.map((item) => {
        this.sellTypeObj[item.dkey] = item.dvalue;
      });
      res2.map((item) => {
        if(!item.parentCode) {
          if(item.name !== '果树预售') {
            this.categorys.push({
              value: item.name,
              key: item.code
            });
          }
        }
      });
      res3.map((item) => {
        this.projectStatusObj[item.dkey] = item.dvalue;
      });
      this.categorys.map((item, index) => {
        if(item.key === this.categoryCode) {
          this.index = index;
          this.currentIndex = index;
        }
      });
      // let provinceList = [];
      // res4.map((item) => {
      //   if(provinceList.length) {
      //     this.hasProvince = false;
      //     provinceList.map((province) => {
      //       if(province.name === item.province) {
      //         // 有省
      //         let cityList = province.sub;
      //         cityList.map((city) => {
      //           if(city.name === item.city) {
      //             // 有市
      //             city.sub.push({
      //               name: item.area
      //             });
      //           } else {
      //             province.push({
      //               name: item.city,
      //               sub: [{
      //                 name: item.area
      //               }]
      //             });
      //           }
      //         });
      //         this.hasProvince = true;
      //       }
      //     });
      //     if(!this.hasProvince) {
      //       provinceList.push({
      //         name: item.province,
      //         sub: [{
      //           name: item.city,
      //           sub: [{
      //             name: item.area
      //           }]
      //         }]
      //       });
      //     }
      //   } else {
      //     provinceList.push({
      //       name: item.province,
      //       sub: [{
      //         name: item.city,
      //         sub: [{
      //           name: item.area
      //         }]
      //       }]
      //     });
      //   }
      // });
      // this.provinceList = provinceList;
      this.loading = false;
      // this.getSubType();
      this.getPageOrders();
      if(this.userId) {
        this.getUserDetail();
      }
    }).catch(() => { this.loading = false; });
  },
  components: {
    CategorySjdProList,
    FullLoading,
    Toast,
    Slider,
    NoResult,
    Scroll,
    Search,
    CategoryScroll
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/mixin.scss";
@import "../../common/scss/variable.scss";
.home-wrapper {
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
  .search-wrapper {
    background: $primary-color;
    height: 0.88rem;
  }
  .category-wrapper {
    /*position: absolute;*/
    top: 0.88rem;
    left: 0;
    width: 100%;
    z-index: 100;
    overflow: hidden;
    line-height: 0.8rem;
    background: #fff;
    border-bottom: 1px solid $color-border;
  }
  .content {
    margin: 1.6rem 0 0;
    .bulletin {
      display: flex;
      align-items: center;
      font-size: 0.24rem;
      padding: 0.24rem 0.3rem;
      background: #f0f9f6;
      .title {
        line-height: 0.33rem;
        flex: 1;
      }
    }
    .hot {
      padding: 0 0.3rem 0;
      background: $color-highlight-background;
      position: absolute;
      top: 1.7rem;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: auto;
      .proList {
        background: $color-highlight-background;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        font-size: 0;
        .item {
          width: 3.35rem;
          margin-top: 0.24rem;
          display: inline-block;
          position: relative;
          .item-top {
            position: relative;
            .sell-type {
              position: absolute;
              left: 0;
              top: 0;
              background: $primary-color;
              padding: 0 0.2rem;
              height: 0.36rem;
              font-size: 0.22rem;
              line-height: 0.36rem;
              text-align: center;
              color: $color-highlight-background;
              border-radius: 0.05rem;
            }
            .sell-type-right {
              position: absolute;
              right: 0;
              bottom: 0.4rem;
              background: #ec554e;
              padding: 0 0.1rem;
              height: 0.36rem;
              font-size: 0.22rem;
              line-height: 0.36rem;
              text-align: center;
              color: $color-highlight-background;
              border-top-left-radius: 0.1rem;
              border-bottom-left-radius: 0.1rem;
            }
            .hot-pro-img {
              height: 3.3rem;
              width: 100%;
              border-radius: 0.15rem;
            }
            .prograss-bar {
              width: 100%;
              height: 0.32rem;
              position: absolute;
              bottom: 0;
              background: rgba(0,0,0,0.5);
              .nowCount {
                display: inline-block;
                background: #23AD8C;
                height: 100%;
                max-width: 100%;
                position: absolute;
              }
              .totalCount {
                display: inline;
              }
              .prograss-text {
                font-size: 0.2rem;
                color: $color-highlight-background;
                position: absolute;
                top: 0;
                width: 100%;
                text-align: center;
                height: 100%;
                span {
                  line-height: 0.32rem;
                }
              }
            }
          }
          .hot-pro-text {
            padding: 0 0.1rem;
            p {
              font-size: 0;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            .hot-pro-title {
              font-size: $font-size-medium-x;
              line-height: 0.42rem;
              margin-bottom: 0.15rem;
              margin-top: 0.15rem;
            }
            .hot-pro-introduction {
              color: $color-text-l;
              font-size: 0.22rem;
              line-height: $font-size-medium-xx;
              margin-bottom: 0.1rem;
            }
            .hot-pro-price {
              color: #ec554e;
              font-size: $font-size-small;
              line-height: 0.29rem;
              font-weight: bold;
            }
          }
        }
      }
    }
  }

}
</style>
