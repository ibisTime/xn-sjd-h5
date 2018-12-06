<template>
  <div class="owner-info-wrapper">
    <div class="content">
      <Scroll ref='scroll' :pullUpLoad="pullUpLoad">
        <div class="info">
          <div class="item">
            <span>名称</span><span>{{detail.ownerCompany.name}}</span>
          </div>
          <div class="item">
            <span>负责人</span><span>{{detail.ownerCompany.charger}}</span>
          </div>
          <div class="item">
            <span>负责人手机号</span><span>{{detail.ownerCompany.chargeMobile}}</span>
          </div>
          <div class="item">
            <span>地址</span><span>{{detail.ownerCompany.address}}</span>
          </div>
          <div class="item">
            <span>简介</span><span>{{detail.ownerCompany.description}}</span>
          </div>
        </div>
      </Scroll>
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
import { formatAmount, formatImg, formatDate, setTitle } from 'common/js/util';
import { getCookie } from 'common/js/cookie';
import { getBookingProDetail } from 'api/biz';
export default {
  data() {
    return {
      title: '正在加载...',
      loading: false,
      toastText: '',
      currentList: [],
      hasMore: false,
      text: '',
      pullUpLoad: null,
      detailDescription: '',
      flag: false,
      number: 1,
      idCode: '',
      detail: {
        productSpecsList: [{price: 0}],
        province: '',
        city: '',
        area: '',
        treeList: []
      },
      choosedIndex: 0,
      code: ''   // 产品code
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
    // 富文本滚动
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
    this.isWxConfiging = false;
    this.wxData = null;
    this.pullUpLoad = null;
    this.userId = getCookie('userId');
    this.code = this.$route.query.code;
    this.loading = true;
    setTitle('产权信息');
    Promise.all([
      getBookingProDetail({
        code: this.code
      })
    ]).then(([res1]) => {
      this.loading = false;
      this.detail = res1;
      this.detailDescription = res1.description;
    }).catch(() => { this.loading = false; });
  },
  watch: {
    detailDescription() {
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
.owner-info-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0.98rem;
  width: 100%;
  background: $color-highlight-background;
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
    height: 7.5rem;
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
      padding-bottom: 0.2rem;
      background: $color-highlight-background;
      height: 7.5rem;
      width: 100%;
      overflow: hidden;
      .slider {
        .dots {
          .dot {
            background: #eee;
          }
        }
      }
      .home-slider {
        height: 100%;
      }
      a {
        display: block;
        height: 100%;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
      }
    }
    .info {
      background: $color-highlight-background;
      padding: 0 0.3rem;
      .item {
        width: 100%;
        font-size: $font-size-medium-x;
        line-height: 1.1rem;
        border-bottom: 1px solid #eee;
        display: flex;
        span:first-child {
          margin-right: 0.3rem;
          display: inline-block;
          width: 30%;
        }
        span:nth-child(2) {
          flex: 1;
        }
        img {
          height: 0.21rem;
          margin-top: 0.4rem;
          position: absolute;
          right: 0.3rem;
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
        font-size: 0.26rem;
        line-height: 1.8;
        padding: 0.2rem 0;
        img{
          max-width: 100%;
          vertical-align: bottom;
        }
      }
    }
  }
  .footer {
    height: 0.98rem;
    padding: 0.07rem 0.3rem;
    border-top: 1px solid #eee;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    font-size: $font-size-medium-x;
    line-height: 0.7rem;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      color: $primary-color;
      font-size: $font-size-medium-xx;
    }
    button {
      width: 2.96rem;
      height: 0.84rem;
      border-radius: 0.08rem;
      background: $primary-color;
      color: $color-highlight-background;
      font-size: 0.3rem;
    }
    .disabled {
      background: #969998;
    }
  }
}
</style>
