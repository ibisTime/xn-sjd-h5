<template>
  <div class="home-wrapper">
    <m-header class="cate-header" title="认养列表"></m-header>
    <div class="header clearfix">
      <div @click="changeIndex('')" :class="[index == '' ? 'active' : '']">
        <i>全部</i>
      </div>
      <div @click="changeIndex('0')" :class="[index == '0' ? 'active' : '']">
        <i>个人</i>
      </div>
      <div @click="changeIndex('1')" :class="[index == '1' ? 'active' : '']">
        <i>定向</i>
      </div>
      <div @click="changeIndex('2')" :class="[index == '2' ? 'active' : '']">
        <i class="width">集体</i>
      </div>
      <div @click="changeIndex('2')" :class="[index == '2' ? 'active' : '']">
        <i class="width">捐赠</i>
      </div>
    </div>
    <div class="content">
      <div class="bulletin">
        <div class="title">恭喜Bluce，成功参加See的传承认养</div>
      </div>
      <div class="hot">
        <Scroll :pullUpLoad="pullUpLoad">
        <div class="proList">
          <div class="item" @click="goTreeDetail">
            <img src="./emotion@2x.png" alt="" class="hot-pro-img">
            <div class="hot-pro-text">
              <p class="hot-pro-title">捐赠认养古树</p>
              <p class="hot-pro-place"><span class="hot-pro-introduction">四川 成都</span><img src="./emotion@2x.png" alt="" class="fr"></p>
              <p><span class="hot-pro-price">¥2480.00</span></p>
            </div>
          </div>
          <div class="item">
            <img src="./emotion@2x.png" alt="" class="hot-pro-img">
            <div class="hot-pro-text">
              <p class="hot-pro-title">捐赠认养古树</p>
              <p class="hot-pro-place"><span class="hot-pro-introduction">四川 成都</span><img src="./emotion@2x.png" alt="" class="fr"></p>
              <p><span class="hot-pro-price">¥2480.00</span></p>
            </div>
          </div>
          <div class="item">
            <img src="./emotion@2x.png" alt="" class="hot-pro-img">
            <div class="hot-pro-text">
              <p class="hot-pro-title">捐赠认养古树</p>
              <p class="hot-pro-place"><span class="hot-pro-introduction">四川 成都</span><img src="./emotion@2x.png" alt="" class="fr"></p>
              <p><span class="hot-pro-price">¥2480.00</span></p>
            </div>
          </div>
          <div class="item">
            <img src="./emotion@2x.png" alt="" class="hot-pro-img">
            <div class="hot-pro-text">
              <p class="hot-pro-title">捐赠认养古树</p>
              <p class="hot-pro-place"><span class="hot-pro-introduction">四川 成都</span><img src="./emotion@2x.png" alt="" class="fr"></p>
              <p><span class="hot-pro-price">¥2480.00</span></p>
            </div>
          </div>
          <div class="item">
            <img src="./emotion@2x.png" alt="" class="hot-pro-img">
            <div class="hot-pro-text">
              <p class="hot-pro-title">捐赠认养古树</p>
              <p class="hot-pro-place"><span class="hot-pro-introduction">四川 成都</span><img src="./emotion@2x.png" alt="" class="fr"></p>
              <p><span class="hot-pro-price">¥2480.00</span></p>
            </div>
          </div>
        </div>
        </Scroll>
      </div>
      <!--<div class="mall-content">-->
        <!--<no-result v-show="!currentList.length && !hasMore" class="no-result-wrapper" title="抱歉，暂无商品"></no-result>-->
      <!--</div>-->
    </div>
    <toast ref="toast" :text="text"></toast>
    <router-view></router-view>
  </div>
</template>
<script>
import Toast from 'base/toast/toast';
import FullLoading from 'base/full-loading/full-loading';
import Slider from 'base/slider/slider';
import NoResult from 'base/no-result/no-result';
import MHeader from 'components/m-header/m-header';
import Scroll from 'base/scroll/scroll';
import CategoryScroll from 'base/category-scroll/category-scroll';
import { formatAmount } from 'common/js/util';
export default {
  data() {
    return {
      title: '正在加载...',
      loading: true,
      toastText: '',
      currentList: [],
      hasMore: false,
      text: '',
      proList: [{

      }],
      categorys: [
        {value: '全部', key: 'all'},
        {value: '个人', key: '0'},
        {value: '定向', key: '2'},
        {value: '集体', key: '3'},
        {value: '捐赠', key: '4'}],
      showCheckIn: false,
      pullUpLoad: null
    };
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    },
    action() {
      this.showCheckIn = true;
    },
    close() {
      this.showCheckIn = false;
    },
    goTreeDetail() {
      this.$router.push('/treeDetail');
    }
  },
  mounted() {
    this.pullUpLoad = null;
    // let userId;
    // if (this.$route.query.userId) {
    //   userId = this.$route.query.userId;
    //   setCookie("userId", userId);
    // } else {
    //   userId = getCookie("userId");
    // }
    // Promise.all([
    //   getUser1(userId),
    //   checkRed(userId)
    // ]).then(([res1, res2]) => {
    //   this.userinfo = res1;
    //   this.balance = res1.wareAmount;
    //   setCookie("level", res1.level);
    //   getLevel(res1.level).then(item => {
    //     this.loading = false;
    //     res1.level = item[0].name;
    //   });
    //   setCookie('isWare', res2.isWare);
    //   if(this.balance < res2.redAmount) {
    //     this.toastText = '您云仓余额低于红线，请购买';
    //     this.$refs.toast.show();
    //     setTimeout(() => {
    //       this.$router.push('/threshold');
    //     }, 2000)
    //   }
    // }).catch(() => { this.loading = false });
  },
  components: {
    FullLoading,
    Toast,
    Slider,
    NoResult,
    MHeader,
    Scroll,
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
  bottom: 0.98rem;
  top: 0;
  left: 0;
  .header {
    background-color: #fff;
    position: absolute;
    top: 0.88rem;
    width: 100%;
    > div {
      float: left;
      width: 20%;
      height: 0.9rem;
      position: relative;
      text-align: center;
      i {
        font-size: $font-size-medium;
        color: #333;
        line-height: 0.9rem;
        position: absolute;
        left: 43%;
        transform: translateX(-50%);
        &.width {
          width: 1.2rem;
        }
      }
      &.active {
        i {
          color: $primary-color;
          border-bottom: 0.06rem solid $primary-color;
        }
      }
    }
  }
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .category-wrapper {
    position: absolute;
    top: 0.88rem;
    left: 0;
    width: 100%;
    z-index: 100;
    overflow: hidden;
    height: 0.8rem;
    line-height: 0.8rem;
    background: #fff;
    border-bottom: 1px solid $color-border;
  }
  .content {
    margin: 1.68rem 0 0;
    .bulletin {
      display: flex;
      align-items: center;
      font-size: 0.24rem;
      padding: 0.24rem 0.3rem;
      background: #f0f9f6;
      img {
        width: 0.6rem;
        height: 0.25rem;
        margin-right: 0.11rem;
      }
      .border {
        display: inline;
        width: 0;
        height: 0.15rem;
        border-right: 1px solid #ccc;
        margin-right: 0.11rem;
      }
      .title {
        line-height: 0.33rem;
        flex: 1;
      }
      .more {
        line-height: 0.33rem;
        color: #999;
      }
    }
    .hot {
      padding: 0 0.3rem 0.8rem;
      background: $color-highlight-background;
      position: absolute;
      top: 2.5rem;
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
          width: 3.3rem;
          height: 4.17rem;
          margin-top: 0.3rem;
          border: 1px solid #e6e6e6;
          border-radius: 0.04rem;
          display: inline-block;
          .hot-pro-img {
            height: 2.3rem;
            width: 100%;
            margin-bottom: 0.2rem;
          }
          .hot-pro-text {
            padding: 0 0.2rem;
            p {
              font-size: 0;
            }
            .hot-pro-title {
              font-size: $font-size-medium-x;
              line-height: 0.42rem;
              margin-bottom: 0.19rem;
            }
            .hot-pro-place {
              margin-bottom: 0.17rem;
              .hot-pro-introduction {
                color: $color-text-l;
                font-size: $font-size-small;
                line-height: $font-size-medium-xx;
              }
              img {
                width: 0.77rem;
                height: 0.32rem;
              }
            }
            .hot-pro-price {
              color: $primary-color;
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
