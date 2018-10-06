<template>
  <div class="home-wrapper">
    <m-header class="cate-header" title="产品详情"></m-header>
    <div class="content">
      <Scroll :pullUpLoad="pullUpLoad">
      <div class="slider-wrapper">
        <img :src="formatImg(detail.bannerPic)" class="banner-default">
      </div>
      <div class="info">
        <div class="item">
          <span>产品名称</span><span>{{detail.name}}</span>
        </div>
        <div class="item" v-show="detail.sellType !== '0' && detail.sellType !== '1'">
          <span>募集时间</span><span>{{formatDate(detail.raiseStartDatetime, 'yyyy-MM-dd')}}至{{formatDate(detail.raiseEndDatetime, 'yyyy-MM-dd')}}</span>
        </div>
        <div class="item" v-show="detail.sellType !== '0' && detail.sellType !== '1'">
          <span>已募集数量</span><span>{{detail.nowCount}}/{{detail.raiseCount}}</span>
        </div>
        <div class="item">
          <span>古树产地</span><span>{{detail.province}}{{detail.city}}{{detail.area}}</span>
        </div>
        <div class="item">
          <span>古树学名</span><span>{{detail.scientificName}}</span>
        </div>
        <div class="item">
          <span>古树品种</span><span>{{detail.variety}}</span>
        </div>
        <!--<div class="item" @click="go('/invitation')">-->
          <!--<span>古树定位</span>-->
          <!--<img src="./more@2x.png" alt="" class="fr more">-->
        <!--</div>-->
        <div class="item" @click="go('/adopt-list?code=' + code)">
          <span>已认养名单</span>
          <img src="./more@2x.png" alt="" class="fr more">
        </div>
        <div class="item" @click="go('/productTree-list?code=' + code)">
          <span>树木查看</span>
          <img src="./more@2x.png" alt="" class="fr more">
        </div>
      </div>
      <div class="gray"></div>
      <div class="description">
        <div class="description-title">
          <div class="border"></div>
          <span>图文详情</span>
          <div class="description-detail" v-html="detail.description">{{detail.description}}</div>
        </div>
      </div>
      <!--<div class="mall-content">-->
        <!--<no-result v-show="!currentList.length && !hasMore" class="no-result-wrapper" title="抱歉，暂无商品"></no-result>-->
      <!--</div>-->
      </Scroll>
    </div>
    <div class="footer">
      <!--<button @click="showPopUp">集体下单</button>-->
      <!--<button @click="showPopUp">捐赠下单</button>-->
      <button @click="showPopUp">申请认养</button>
    </div>
    <div :class="['mask',flag ? 'show' : '']" @click="genghuan"></div>
    <div :class="['buypart',flag ? 'show' : '']">
      <div class="title">
        <div class="title-pic">
          <img :src="formatImg(detail.bannerPic)" alt="">
        </div>
        <div class="title-right">
          <p>{{detail.scientificName}}</p>
          <i @click="genghuan">X</i>
          <p class="position"><img src="./position@2x.png">{{detail.province}}{{detail.city}}{{detail.area}}</p>
        </div>
      </div>
      <div class="packaging">
        <p class="packaging-title">认养年限(年)</p>
        <div class="select">
          <div class="select-item" v-for="(item, index) in detail.productSpecsList" @click="chooseSpecs(index)" :key="index">
            <span>{{item.name}}：{{formatDate(item.startDatetime, 'yyyy-MM-dd')}}至{{formatDate(item.endDatetime, 'yyyy-MM-dd')}}</span>
            <img src="./choosed@2x.png" v-show="choosedIndex === index">
            <img src="./unchoosed@2x.png" v-show="!choosedIndex === index">
          </div>
        </div>
      </div>
      <div class="number">
        <span>认养份数</span>
        <div class="right">
          <img class="diamonds right-item" @click="add" src="./add@2x.png">
          <input class="num right-item" v-model="number">
          <img class="diamonds right-item" @click="sub" src="./sub@2x.png">
        </div>
      </div>
      <div class="other" v-show="detail.sellType === '3'">
        <span>下单识别码</span>
        <input type="text" v-model="identifyCode">
      </div>
      <div class="buypart-bottom">
        <div class="confirm" @click="confirm()">确定(总额：¥{{formatAmount(detail.productSpecsList[choosedIndex].price) * number}})</div>
      </div>
    </div>
    <toast ref="toast" :text="text"></toast>
    <full-loading v-show="loading"></full-loading>
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
import { formatAmount, formatImg, formatDate } from 'common/js/util';
import { getCookie } from 'common/js/cookie';
import { getProductDetail } from 'api/biz';
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
      proList: [{

      }],
      showCheckIn: false,
      pullUpLoad: null,
      descriptionDetail: '',
      flag: false,
      number: 1,
      idCode: '',
      detail: {},
      choosedIndex: 0,
      code: '',   // 产品code
      identifyCode: '' // 下单识别码
    };
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    },
    formatImg(img) {
      return formatImg(img);
    },
    formatDate(date, format) {
      return formatDate(date, format);
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
    add() {
      this.number++;
    },
    sub() {
      if (this.number >= 2) {
        this.number--;
      }
    },
    confirm() {
      let userId = getCookie('userId');
      if(userId) {
        let proCode = this.detail.code;
        let specsCode = this.detail.productSpecsList[this.choosedIndex].code;
        let quantity = this.number;
        if(this.detail.sellType !== '3') {
          let type = this.detail.sellType;
          this.go('/protocol?sign=1&proCode=' + proCode + '&specsCode=' + specsCode + '&quantity=' + quantity + '&type=' + type);
        } else {
          // 集体认养
          let identifyCode = this.identifyCode || '';
          this.go('/protocol?sign=1&proCode=' + proCode + '&specsCode=' + specsCode + '&quantity=' + quantity + '&identifyCode=' + identifyCode);
        }
      } else {
        this.text = '您未登录';
        this.$refs.toast.show();
        setTimeout(() => {
          this.$router.push('/login');
        }, 1000);
      }
    },
    chooseSpecs(index) {
      this.choosedIndex = index;
    }
  },
  mounted() {
    this.pullUpLoad = null;
    this.code = this.$route.query.code;
    this.loading = true;
    Promise.all([
      getProductDetail({
        code: this.code
      })
    ]).then(([res1]) => {
      this.loading = false;
      this.detail = res1;
    }).catch(() => { this.loading = false; });
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
  bottom: 0.98rem;
  width: 100%;
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .gray {
    width: 100%;
    height: 0.2rem;
    padding: 0;
    background: #f5f5f5;
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
    .slider-wrapper {
      background: $color-highlight-background;
    }
    .info {
      background: $color-highlight-background;
      padding: 0 0.3rem;
      .item {
        width: 100%;
        height: 1.1rem;
        font-size: $font-size-medium-x;
        line-height: 1.1rem;
        border-bottom: 1px solid #eee;
        span:first-child {
          margin-right: 0.3rem;
        }
        img {
          height: 0.21rem;
          margin-top: 0.4rem;
        }
        &:last-child{
          border-bottom: none;
        }
      }
    }
    .description {
      background: #fff;
      padding: 0.3rem;
      .description-title {
        font-size: 0;
        .border {
          border: 2px solid $primary-color;
          height: 0.26rem;
          width: 0;
          display: inline-block;
          margin-right: 0.08rem;
        }
        span {
          font-size: $font-size-medium-x;
          line-height: 0.42rem;
        }
      }
      .description-detail{
        padding: 0.2rem 0;
        img{
          max-width: 100%;
          vertical-align: bottom;
        }
      }
    }
  }
  .footer {
    width: 100%;
    height: 0.98rem;
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 0 0.3rem;
    display: flex;
    justify-content: space-between;
    background: $color-highlight-background;
    border-top: 1px solid $color-border;
    align-items: center;
    button {
      display: inline-block;
      /*width: 3.2rem;*/
      width: 100%;
      height: 0.9rem;
      background: $primary-color;
      border-radius: 0.08rem;
      color: $color-highlight-background;
      font-size: 0.32rem;
    }
  }
  .mask {
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000000, $alpha: 0.7);
    position: absolute;
    top: 0;
    left: 0;
    display: none;
  }
  .show {
    display: block;
  }
  .buypart {
    width: 100%;
    height: 7.7rem;
    position: fixed;
    bottom: 0;
    background-color: #fff;
    display: none;
    z-index: 9;
    &.show {
      display: block;
    }
    // padding: 0 0.3rem;
    .title {
      height: 1.5rem;
      position: relative;
      border-bottom: 1px solid #eee;
      margin: 0 0.3rem;
      .title-pic {
        position: absolute;
        left: 0;
        bottom: 0.28rem;
        padding: 0.03rem;
        border-radius: 0.1rem;
        background-color: #fff;
        img {
          width: 1.6rem;
          height: 1.6rem;
        }
      }
      .title-right {
        margin-left: 2.14rem;
        position: relative;
        overflow: hidden;
        p {
          margin-top: 0.27rem;
          font-size: $font-size-medium-x;
          line-height: 0.42rem;
          color: #333;
        }
        span {
          margin-top: 0.4rem;
          font-size: $font-size-medium;
          color: #999;
        }
        i {
          width: 0.34rem;
          line-height: 0.34rem;
          line-height: 0.34rem;
          font-size: $font-size-medium;
          text-align: center;
          color: #333;
          border: 1px solid #333;
          border-radius: 50%;
          position: absolute;
          top: 0.2rem;
          right: 0;
        }
        .position {
          font-size: 0.24rem;
          line-height: 0.33rem;
          color: $color-text-l;
          img {
            width: 0.16rem;
            height: 0.2rem;
            margin-right: 0.08rem;
          }
        }
      }
    }
    .packaging {
      height: 1.74rem;
      border-bottom: 1px solid #eee;
      margin: 0.3rem;
      overflow: scroll;
      .packaging-title {
        font-size: $font-size-medium-x;
        line-height: 0.42rem;
        margin: 0 0 0.3rem 0;
      }
      p {
        margin-top: 0.3rem;
        margin-bottom: 0.4rem;
        font-size: $font-size-medium-xx;
        color: #333;
      }
      .select {
        .select-item {
          display: flex;
          align-items: center;
          margin-bottom: 0.28rem;
          span {
            float: left;
            min-width: 1.18rem;
            padding: 0 0.1rem;
            font-size: $font-size-medium-s;
            border-radius: 0.1rem;
            flex: 1;
            color: #666;
            line-height: 0.37rem;
          }
          img {
            width: 0.36rem;
          }
          span + span {
            margin-left: 0.2rem;
          }
        }
      }
    }
    .number {
      height: 1.1rem;
      border-bottom: 1px solid #eee;
      margin: 0 0.3rem;
      display: flex;
      align-items: center;
      span {
        font-size: 0.3rem;
      }
      .right {
        flex: 1;
        display: inline-block;
        .right-item {
          float: right;
          text-align: center;
          line-height: 0.5rem;
        }
        .diamonds {
          width: 0.36rem;
          height: 0.36rem;
        }
        .num {
          width: 0.9rem;
          font-size: $font-size-medium-x;
          color: #333;
          height: 0.36rem;
        }
      }
    }
    .other {
      height: 1.1rem;
      border-bottom: 1px solid #eee;
      margin: 0 0.3rem;
      display: flex;
      align-items: center;
      font-size: 0.3rem;
      span {
        margin-right: 0.2rem;
      }
    }
    .buypart-bottom {
      height: 0.98rem;
      line-height: 0.9rem;
      color: #fff;
      font-size: $font-size-medium-x;
      position: absolute;
      bottom: 0;
      width: 100%;
      left: 0;
      padding: 0 0.3rem;
      border-top: 1px solid $color-border;
      display: flex;
      align-items: center;
      div {
        display: inline-block;
        width: 50%;
        text-align: center;
      }
      .confirm {
        border-radius: 0.08rem;
        background: $primary-color;
        width: 100%;
        height: 0.9rem;
        line-height: 0.98rem;
      }
    }
  }
}
</style>
