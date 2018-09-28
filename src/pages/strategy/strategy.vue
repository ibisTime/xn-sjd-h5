<template>
  <div class="home-wrapper">
    <m-header class="cate-header" title="攻略"></m-header>
    <div class="content">
      <Scroll :pullUpLoad="pullUpLoad">
      <div class="in">
        <div class="in-title">
          <img src="./in@2x.png">
        </div>
        <p class="p1">你的以下行为，可以获得碳泡泡。</p>
        <p class="p2">（北京环交所，大自然保护协会等提供碳减排，碳汇量科学算法）</p>
        <div class="icons">
          <div class="icon-item">
            <img src="./walk@2x.png">
            <div class="icon-item-info">
              <p class="icon-item-title">行走捐</p>
              <p class="icon-item-text">行走捐赠</p>
            </div>
          </div>
          <div class="icon-item">
            <img src="./bike@2x.png">
            <div class="icon-item-info">
              <p class="icon-item-title">共享单车</p>
              <p class="icon-item-text">限ofo,哈罗单车</p>
            </div>
          </div>
          <div class="icon-item">
            <img src="./pay@2x.png">
            <div class="icon-item-info">
              <p class="icon-item-title">线下支付</p>
              <p class="icon-item-text">支持收款码</p>
            </div>
          </div>
          <div class="icon-item">
            <img src="./ding@2x.png">
            <div class="icon-item-info">
              <p class="icon-item-title">绿色办公</p>
              <p class="icon-item-text">钉钉绿色办公</p>
            </div>
          </div>
        </div>
        <div class="tip">
          <p class="tip-title"> <img src="./tip@2x.png" alt=""> <span>小提醒</span></p>
          <p class="tip-content">碳泡泡积蓄需要时间，完成上述行为后，记得第二天来收集碳泡泡。告诉你个小秘密，睡觉前打开步行数据，步行能量会更准确哦～</p>
        </div>
      </div>
      <div class="out">
        <div class="out-title">
          <img src="./out@2x.png">
        </div>
        <p class="p1">通过浇水可以把自己的碳泡泡赠送给对方；
          每天可以给同一个好友捐赠3次</p>
        <div class="tree">
          <img src="./tree@2x.png">
        </div>
      </div>
      </Scroll>
    </div>
    <toast ref="toast" :text="text"></toast>
    <router-view></router-view>
  </div>
</template>
<script>
import Toast from 'base/toast/toast';
import Scroll from 'base/scroll/scroll';
import FullLoading from 'base/full-loading/full-loading';
import Slider from 'base/slider/slider';
import NoResult from 'base/no-result/no-result';
import MHeader from 'components/m-header/m-header';
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
      showBack: false,
      pullUpLoad: null,
      flag: false,
      tab: 0

    };
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    },
    go(url) {
      this.$router.push(url);
    },
    showPopUp() {
      this.flag = true;
    },
    genghuan() {
      this.flag = !this.flag;
    },
    changeTab(index) {
      this.tab = index;
      console.log(this.tab);
    }
  },
  mounted() {
    this.pullUpLoad = null;
  },
  components: {
    FullLoading,
    Toast,
    Slider,
    NoResult,
    MHeader,
    Scroll
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/mixin.scss";
@import "../../common/scss/variable.scss";
.home-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .banner-default {
    width: 100%;
    height: 4rem;
  }
  .content {
    /*margin: 0.88rem 0;*/
    position: absolute;
    top: 0.88rem;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: $primary-color;
    padding: 0.3rem;
    .in {
      background: $color-highlight-background;
      border-radius: 0.15rem;
      padding: 0.3rem 0.3rem 0.78rem 0.3rem;
      margin-bottom: 0.3rem;
      .in-title {
        text-align: center;
        img {
          width: 3.72rem;
          height: 0.84rem;
          margin-bottom: 0.54rem;
        }
      }
      .p1 {
        font-size: $font-size-medium-xx;
        line-height: $font-size-large-xx;
        margin-bottom: 0.14rem;
      }
      .p2 {
        color: $color-text-l;
        font-size: $font-size-small;
        line-height: 0.33rem;
        margin-bottom: 0.5rem;
      }
      .icons {
        font-size: 0;
        .icon-item {
          display: inline-block;
          width: 50%;
          margin-bottom: 0.4rem;
          /*display: flex;*/
          /*align-items: center;*/
          img {
            width: 1.06rem;
            height: 1.06rem;
            margin-right: 0.2rem;
          }
          .icon-item-info {
            display: inline-block;
            .icon-item-title {
              font-size: $font-size-medium;
              margin-bottom: 0.2rem;
            }
            .icon-item-text {
              font-size: $font-size-medium-s;
              color: #999;
            }
          }
        }
      }
      .tip {
        height: 2.71rem;
        background: url("./tip-bg@2x.png") no-repeat;
        background-size: 100% 100%;
        padding: 0.3rem;
        .tip-title {
          font-size: 0;
          display: flex;
          align-items: center;
          margin-bottom: 0.33rem;
          img {
            width: 0.34rem;
            height: 0.34rem;
            margin-right: 0.12rem;
          }
          span {
            color: #666;
            font-size: $font-size-medium-xx;
          }
        }
        .tip-content {
          font-size: $font-size-medium;
          line-height: 0.4rem;
          color: #666;
        }
      }
    }
    .out {
      background: $color-highlight-background;
      border-radius: 0.15rem;
      padding: 0.3rem;
      .out-title {
        text-align: center;
        img {
          width: 3.72rem;
          height: 0.84rem;
          margin-bottom: 0.54rem;
        }
      }
      .p1 {
        font-size: $font-size-medium-xx;
        line-height: $font-size-large-xx;
        margin-bottom: 0.81rem;
      }
      .tree {
        text-align: center;
        img {
          width: 3.8rem;

        }
      }
    }
  }
}
</style>
