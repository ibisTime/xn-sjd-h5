<template>
  <transition name="slide">
    <div class="cate-wrapper" @click.stop>
      <m-header class="cate-header" title="宝贝分类"></m-header>
      <div class="content">
        <scroll class="left-menu"
                ref="leftScroll"
                :pullUpLoad="pullUpLoad"
                :data="list">
          <loading v-show="!list.length" class="loading" title=""></loading>
          <div v-for="(item,index) in list"
               class="menu-item"
               :class="leftCls(item.code)"
               @click="choseMenu(item.code,index)"
               ref="leftMenu">{{item.name}}</div>
        </scroll>
        <scroll class="right-menu"
                ref="rightScroll"
                :data="rightList"
                :pullUpLoad="pullUpLoad">
          <loading v-show="rLoadingFlag" class="loading" title=""></loading>
          <div class="right-item"
               :class="rightCls(item.code)"
               v-for="(item,index) in rightList"
               @click="choseCate(item,index)"
               ref="rightMenu">
            <img :src="formatImg(item.pic)" class="right-icon">
            <span>{{item.name}}</span>
          </div>
        </scroll>
      </div>
      <m-footer-sjd-mall></m-footer-sjd-mall>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import Loading from 'base/loading/loading';
  import MHeader from 'components/m-header/m-header';
  import MFooterSjdMall from 'components/m-footer-sjd-mall/m-footer-sjd-mall';
  import { getProductType } from 'api/biz';
  import { formatImg } from 'common/js/util';
  // import {mapMutations, mapGetters} from 'vuex';
  // import {SET_PUBLISH_CATEGORY} from 'store/mutation-types';
  // import {getCategories} from 'api/biz';

  export default {
    data() {
      return {
        list: [],
        rightData: {},
        leftCode: '',
        rightCode: '',
        rLoadingFlag: true,
        rightList: []     // {
                          //   code: 3,
                          //   name: '分类3'
                          // }, {
                          //   code: 4,
                          //   name: '分类4'
                          // }
      };
    },
    created() {
      this.pullUpLoad = null;
      this.getInitData();
    },
    // computed: {
    //   ...mapGetters([
    //     'publishCategory'
    //   ])
    // },
    methods: {
      formatImg(img) {
        return formatImg(img);
      },
      getInitData() {
        // if (this.publishCategory) {
        //   this.leftCode = this.publishCategory.parentCode;
        //   Promise.all([
        //     getCategories(0),
        //     this.getSmallCategories(this.publishCategory.parentCode)
        //   ]).then(([left]) => {
        //     this.list = left;
        //     this.list = ['分类1', '分类2'];
        //   }).catch(() => {
        //     this.rLoadingFlag = false;
        //   });
        // } else {
        //   getCategories(0).then((data) => {
        //     this.list = data;
        //     if (data.length) {
        //       this.leftCode = data[0].code;
        //       this.getSmallCategories(data[0].code);
        //     }
        //   });
        // }
        Promise.all([
          getProductType({
            type: 2,
            status: 1,
            orderDir: 'asc',
            orderColumn: 'order_no',
            level: 1
          })
        ]).then(([res1]) => {
          if(res1.length) {
            res1.map((item) => {
              this.list.push({
                code: item.code,
                name: item.name
              });
            });
            this.leftCode = this.list[0].code;
            this.getSmallCategories(this.list[0].code);
          }
        });
      },
      getSmallCategories(code) {
        // if (this.rightData[code]) {
        //   this.rightList = this.rightData[code];
        //   this.rLoadingFlag = false;
        //   return Promise.resolve(this.rightData[code]);
        // }
        this.rightList = [];
        this.rLoadingFlag = true;
        return getProductType({
          type: 2,
          status: 1,
          orderDir: 'asc',
          orderColumn: 'order_no',
          level: 2,
          parentCode: code
        }).then((data) => {
          this.rightData[code] = data;
          if (!this.list || this.leftCode === code) {
            this.rightList = data;
          }
          this.rLoadingFlag = false;
          if (this.publishCategory && this.publishCategory.parentCode === code) {
            this.rightCode = this.publishCategory.code;
          } else {
            this.rightCode = '';
          }
        }).catch(() => {
          this.rLoadingFlag = false;
        });
      },
      choseMenu(code, index) {
        this.leftCode = code;
        this.getSmallCategories(code);
        this.$refs.leftScroll.scrollToElement(this.$refs.leftMenu[index], 200, false, true);
      },
      choseCate(item, index) {
        this.$refs.rightScroll.scrollToElement(this.$refs.rightMenu[index], 200, false, true);
        // this.setCategory(item);
        setTimeout(() => {
          // this.$router.back();
          this.$router.push(`/mall-shopList?categoryCode=${item.code}`);
        }, 210);
      },
      leftCls(code) {
        return code === this.leftCode ? 'active' : '';
      },
      rightCls(code) {
        return code === this.rightCode ? 'active' : '';
      }
      // ...mapMutations({
      //   setCategory: SET_PUBLISH_CATEGORY
      // })
    },
    components: {
      MHeader,
      Scroll,
      Loading,
      MFooterSjdMall
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";

  .cate-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .cate-header {
      position: absolute;
    }

    .content {
      position: absolute;
      top: 0.88rem;
      left: 0;
      bottom: 0;
      width: 100%;
      display: flex;
      font-size: $font-size-medium-s;

      .left-menu {
        flex: 0 0 1.8rem;
        background: $color-background;
        color: $color-text-l;

        .menu-item {
          height: 0.8rem;
          line-height: 0.8rem;
          padding-left: 0.3rem;

          &.active {
            background: #fff;
            color: $color-text;
          }
        }
      }

      .right-menu {
        flex: 1;
        background: #fff;
        color: $color-text-l;
        padding-top: 0.3rem;

        .right-item {
          /*height: 0.8rem;*/
          /*line-height: 0.8rem;*/
          padding-left: 0.6rem;
          display: inline-flex;
          align-items: center;
          flex-direction: column;
          margin-bottom: 0.2rem;
          .right-icon {
            width: 1.12rem;
            height: 1.12rem;
            margin-bottom: 0.1rem;
          }

          &.active {
            color: $color-text;
          }
        }
      }

      .loading {
        padding-top: 0.2rem;
      }
    }

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }

    &.slide-enter, &.slide-leave-to {
      left: 100%;
    }
  }
</style>
