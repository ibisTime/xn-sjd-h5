<template>
  <div class="home-wrapper" :style="{ bottom: wait ? '0.98rem' : '0' }">
    <div class="content">
      <Scroll :pullUpLoad="pullUpLoad" ref="scroll">
        <div class="slider-wrapper">
          <!--<slider v-if="!banners.length" :loop="loop">-->
          <!--<div class="home-slider" v-for="item in banners" :key="item.code">-->
          <!--<a :href="item.url||'javascript:void(0)'" :style="getImgSyl(item.pic)"></a>-->
          <!--</div>-->
          <!--</slider>-->
          <img :src="formatImg(giftDetail.listPic)" class="banner-default">
          <router-link tag="div" to="/home/sign" class="sign-wrapper">
            <i class="sign-icon"></i>
          </router-link>
        </div>
        <div class="info-wait" v-show="!already">
          <div class="item">
            <span>{{giftDetail.name}}</span><span class="price">¥{{formatAmount(giftDetail.price)}}</span>
          </div>
        </div>
        <div class="info" v-show="already">
          <div class="item">
            <span>礼物名称</span><span>{{giftDetail.name}}</span>
          </div>
          <div class="item">
            <span>礼物价格</span><span class="price">¥{{formatAmount(giftDetail.price)}}</span>
          </div>
          <div class="item">
            <span>收货人</span><span>{{giftDetail.receiver}}</span>
          </div>
          <div class="item">
            <span>手机号码</span><span>{{giftDetail.reMobile}}</span>
          </div>
          <div class="item">
            <span>认领时间</span><span>{{formatDate(giftDetail.claimDatetime)}}</span>
          </div>
        </div>
        <div class="description">
        <div class="description-title">
          <div class="border"></div>
          <span>图文详情</span>
        </div>
        <div class="description-detail rich-text-description" v-html="descriptionDetail" ref="description"></div>
      </div>
      </Scroll>
    </div>
    <div class="footer" v-show="wait">
      <button @click="go('/gift-address2?code=' + code)">认领礼物</button>
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
import { formatAmount, formatImg, formatDate, setTitle } from 'common/js/util';
import { getGiftDetail } from 'api/biz';
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
      descriptionDetail: '<table><tbody><tr><td width="240px" height="240px"><img id="qrimage" src="//qr.api.cli.im/qr?data=http%253A%252F%252F192.168.1.162%253A8033%252F%2523%252Fregister&amp;level=H&amp;transparent=false&amp;bgcolor=%23ffffff&amp;forecolor=%23000000&amp;blockpixel=12&amp;marginblock=1&amp;logourl=&amp;size=260&amp;kid=cliim&amp;key=9ee0765087ace26c717af8d86bd50a6e"></td></tr></tbody></table>',
      flag: false,
      number: 1,
      idCode: '',
      already: false,  // 是否已认领，true为已认领，false为未认领
      giftDetail: {}
    };
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    },
    formatImg(img) {
      return formatImg(img);
    },
    formatDate(date) {
      return formatDate(date, 'yyyy-MM-dd');
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
      this.go('/protocol?sign=1');
    },
    getGiftDetail() {
      getGiftDetail({
        code: this.code
      }).then((res) => {
        this.giftDetail = res;
        this.descriptionDetail = res.description;
        if(this.giftDetail.status === '1') {
          this.already = true;
          setTitle('认领礼物');
        } else {
          setTitle('礼物详情');
        }
      }).catch(() => {});
    },
    _refreshScroll() {
      setTimeout(() => {
        this.$refs.scroll.refresh();
        let imgs = this.$refs.description.getElementsByTagName('img');
        for (let i = 0; i < imgs.length; i++) {
          let _img = imgs[i];
          if (_img.complete) {
            setTimeout(() => {
              this.$refs.scroll.refresh();
            }, 20);
            continue;
          }
          _img.onload = () => {
            setTimeout(() => {
              this.$refs.scroll.refresh();
            }, 20);
          };
        }
      }, 20);
    }
  },
  mounted() {
    this.pullUpLoad = null;
    this.code = this.$route.query.code;
    this.getGiftDetail();
  },
  watch: {
    descriptionDetail() {
      this._refreshScroll();
    }
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
  .banner-default {
    width: 100%;
    height: 4rem;
  }
  .content {
    /*margin: 0.88rem 0;*/
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    .slider-wrapper {
      background: $color-highlight-background;
    }
    .info-wait {
      background: $color-highlight-background;
      padding: 0 0.3rem;
      .item {
        width: 100%;
        height: 1.1rem;
        font-size: $font-size-large-ss;
        line-height: 1.1rem;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        span:first-child {
          margin-right: 0.3rem;
          color: #333;
        }
        img {
          height: 0.21rem;
          margin-top: 0.4rem;
        }
        .price {
          color: $primary-color;
          font-family: DINAlternate-Bold;
        }
      }
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
        display: flex;
        /*justify-content: space-between;*/
        span:first-child {
          margin-right: 0.3rem;
          color: #333;
          width: 1.21rem;
        }
        span:nth-child(2) {
          /*flex: 1;*/
        }
        img {
          height: 0.21rem;
          margin-top: 0.4rem;
        }
        .price {
          color: $primary-color;
          font-family: DINAlternate-Bold;
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
      width: 100%;
      height: 0.9rem;
      background: $primary-color;
      border-radius: 0.08rem;
      color: $color-highlight-background;
      font-size: 0.32rem;
    }
  }
}
</style>
