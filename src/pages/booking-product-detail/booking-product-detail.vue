<template>
  <div class="product-detail-wrapper">
    <div class="content">
      <Scroll ref='scroll' :pullUpLoad="pullUpLoad">
        <div class="slider-wrapper">
          <slider :loop="loop">
            <div class="home-slider" v-for="item in banners" :key="item">
              <a :style="getImgSyl(item)"></a>
            </div>
          </slider>
        </div>
      <div class="info">
        <div class="item">
          <span>产品名称</span><span>{{detail.name}}</span>
        </div>
        <div class="item">
          <span>产品学名</span><span>{{detail.scientificName}}</span>
        </div>
        <div class="item">
          <span>产品级别</span><span>{{detail.rank}}</span>
        </div>
        <div class="item">
          <span>产品品种</span><span>{{detail.variety}}</span>
        </div>
        <div class="item">
          <span>产品区域</span><span>{{detail.province}}{{detail.city}}{{detail.area}}</span>
        </div>
        <div class="item">
          <span>乡镇/街道</span><span>{{detail.town}}</span>
        </div>
        <div class="item">
          <span>产品产地</span><span>{{detail.originPlace}}</span>
        </div>
        <div class="item">
          <span>预售产出产量</span><span>{{detail.totalOutput}}{{outputUnitObj[detail.outputUnit]}}/年</span>
        </div>
        <div class="item">
          <span>单棵树产量</span><span>{{detail.singleOutput}}{{outputUnitObj[detail.outputUnit]}}</span>
        </div>
        <div class="item">
          <span>树木总数</span><span>{{detail.treeList.length}}</span>
        </div>
        <div class="item">
          <span>年限</span><span>{{detail.adoptYear}}年</span>
        </div>
        <div class="item">
          <span>预计收获时间</span><span>{{formatDate(detail.harvestDatetime, 'yyyy-MM-dd')}}</span>
        </div>
        <div class="item" @click="go(`/booking-product-list/booking-product-detail/tree-code?buy=1&code=${detail.code}`)">
          <span>树编号</span><span>{{detail.treeList.length}}棵</span>
          <img src="./more@2x.png" class="fr more">
        </div>
        <div class="item" @click="go(`/booking-product-list/booking-product-detail/booking-already-list?code=${detail.code}`)">
          <span>已预售名单</span>
          <img src="./more@2x.png" class="fr more">
        </div>
        <div class="item" @click="go(`/booking-product-list/booking-product-detail/ownerInfo?code=${detail.code}`)">
          <span>产权信息</span>
          <img src="./more@2x.png" class="fr more">
        </div>
      </div>
      <div class="gray"></div>
      <div class="description">
        <div class="description-title">
          <div class="border"></div>
          <span>图文详情</span>
          <div class="description-detail rich-text-description" v-html="detailDescription" ref="description"></div>
        </div>
      </div>
      </Scroll>
    </div>
    <div class="footer">
      <span v-show="detail.minPrice !== detail.maxPrice">¥{{formatAmount(detail.minPrice)}}～¥{{formatAmount(detail.maxPrice)}}</span>
      <span v-show="detail.minPrice === detail.maxPrice">¥{{formatAmount(detail.minPrice)}}</span>
      <button @click="showPopUp" v-if="canAdopt()">确认购买</button>
      <button class="disabled" v-if="!canAdopt()" @click="goLogin()">{{noAdoptReason}}</button>
    </div>
    <div :class="['mask',flag ? 'show' : '']" @click="genghuan"></div>
    <div :class="['buypart',flag ? 'show' : '']">
      <div>
        <div class="title">
          <div class="title-pic">
            <img :src="formatImg(detail.bannerPic)">
          </div>
          <div class="title-right">
            <p>{{detail.scientificName}}</p>
            <i @click="genghuan">X</i>
            <p class="kucun">剩余产量：{{detail.totalOutput - detail.nowCount}}{{outputUnitObj[detail.outputUnit]}}</p>
            <p class="position"><img src="./position@2x.png">{{detail.originPlace}}</p>
          </div>
        </div>
      </div>
      <div class="packaging">
        <p class="packaging-title">预售规格</p>
        <div class="select">
          <Scroll
            :pullUpLoad="pullUpLoad"
          >
            <div class="select-item" v-for="(item, index) in detail.presellSpecsList" @click="chooseSpecs(index)" :key="index">
              <span class="item-name">{{item.name}}({{detail.packWeight}}{{outputUnitObj[detail.outputUnit]}}/{{packUnitObj[detail.packUnit]}},共{{item.packCount}}{{packUnitObj[detail.packUnit]}})</span>
              <div class="item-price-isSelect">
                <span>¥{{formatAmount(item.price)}}</span>
                <img src="./choosed@2x.png" v-show="choosedIndex === index">
                <img src="./unchoosed@2x.png" v-show="choosedIndex !== index">
              </div>
            </div>
          </Scroll>
        </div>
      </div>
      <div class="number">
        <span>数量</span>
        <div class="right">
          <img class="diamonds right-item" @click="add" src="./add@2x.png">
          <input class="num right-item" v-model="number" type="number">
          <img class="diamonds right-item" @click="sub" src="./sub@2x.png">
        </div>
      </div>
      <div class="buypart-bottom">
        <div class="confirm" @click="confirm()">确定(总额：¥{{formatAmount(formatAmount(detail.presellSpecsList[choosedIndex].price) * number * 1000)}})</div>
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
import { formatAmount, formatImg, formatDate, setTitle, getUserId } from 'common/js/util';
import { getCookie } from 'common/js/cookie';
import {initShare} from 'common/js/weixin';
import { getBookingProDetail, share } from 'api/biz';
import { getUserDetail } from 'api/user';
import { getDictList } from 'api/general';
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
      code: '',   // 产品code
      banners: [],
      loop: false,
      userDetail: {},
      noAdoptReason: '',
      outputUnitObj: {},
      packUnitObj: {}
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
    canAdopt() {
      let curTime = new Date();
      // 2把字符串格式转换为日期类
      let startTime = new Date(Date.parse(this.detail.adoptStartDatetime));
      let endTime = new Date(Date.parse(this.detail.adoptEndDatetime));
      // 3进行比较
      if(curTime <= startTime || curTime >= endTime) {
        this.noAdoptReason = '当前不在预售期内';
        return false;
      }
      if(!this.userDetail.level) {
        this.noAdoptReason = '您未登录';
        return false;
      }
      if(this.detail.totalOutput <= this.detail.nowCount) {
        this.noAdoptReason = '无法购买';
        return false;
      }
      return true;
    },
    goLogin() {
      if(this.noAdoptReason === '您未登录') {
        this.go('/login');
      }
    },
    goTreeList() {
      if(this.detail.sellType === '3' || this.detail.sellType === '4') {
        this.go(`/productTree-detail?code=${this.detail.treeList[0].code}`);
      } else {
        this.go(`/productTree-list?code=${this.code}`);
      }
    },
    confirm() {
      if(this.userId) {
        let proCode = this.detail.code;
        let specsCode = this.detail.presellSpecsList[this.choosedIndex].code;
        let quantity = this.number;
        if(quantity * this.detail.packWeight * this.detail.presellSpecsList[this.choosedIndex].packCount > this.detail.totalOutput - this.detail.nowCount) {
          this.text = '库存不足，无法下单';
          this.$refs.toast.show();
          return;
        }
        this.go('/protocol?sign=1&pre=1&proCode=' + proCode + '&specsCode=' + specsCode + '&quantity=' + quantity);
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
    },
    getImgSyl(imgs) {
      return {
        backgroundImage: `url(${formatImg(imgs)})`
      };
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
    },
    getInitWXSDKConfig() {
      this.loading = true;
      initShare({
        title: this.detail.name,
        desc: '提前订制，专属美味',
        link: location.href.split('#')[0] + '/#/booking-product-list/booking-product-detail?code=' + this.code + '&userReferee=' + this.userDetail.mobile + '&type=U',
        // link: location.href + '/#/booking-product-list/booking-product-detail?code=' + this.code + '&userReferee=' + this.userDetail.mobile + '&type=U',
        imgUrl: formatImg(this.detail.listPic),
        success: (res) => {
          this.channel = '';
          if(res.errMsg.indexOf('sendAppMessage') !== -1) {
            this.channel = 0;
          } else if(res.errMsg.indexOf('shareTimeline') !== -1) {
            this.channel = 1;
          } else if(res.errMsg.indexOf('shareQQ') !== -1) {
            this.channel = 2;
          } else if(res.errMsg.indexOf('shareQZone') !== -1) {
            this.channel = 3;
          }
          share(this.channel, '预售产品').then((res) => {
            if(res.code) {
              this.text = '分享成功';
              this.$refs.toast.show();
            }
          }).then(() => {});
        }
      }, (data) => {
        this.isWxConfiging = false;
        this.wxData = data;
        this.loading = false;
      }, (msg) => {
        alert(msg);
        this.isWxConfiging = false;
        this.wxData = null;
        this.loading = false;
      });
    }
  },
  mounted() {
    this.userReferee = this.$route.query.userReferee;
    if(this.userReferee && !getUserId()) {
      this.$router.push(`/register?userReferee=${this.userReferee}&type=U&back=1`);
    } else {
      // ************************************不分享*********************************
      this.isWxConfiging = false;
      this.wxData = null;
      this.pullUpLoad = null;
      this.userId = getCookie('userId');
      this.code = this.$route.query.code;
      this.loading = true;
      setTitle('预售详情');
      if(this.userId) {
        Promise.all([
          getBookingProDetail({
            code: this.code
          }),
          getUserDetail({
            userId: this.userId
          }),
          getDictList('output_unit'),
          getDictList('pack_unit')
        ]).then(([res1, res2, res3, res4]) => {
          this.loading = false;
          this.detail = res1;
          this.detailDescription = res1.description;
          this.banners = this.detail.bannerPic.split('||');
          if(this.banners.length >= 2) {
            this.loop = true;
          }
          this.userDetail = res2;
          res3.map((item) => {
            this.outputUnitObj[item.dkey] = item.dvalue;
          });
          res4.map((item) => {
            this.packUnitObj[item.dkey] = item.dvalue;
          });
          if(!this.isWxConfiging && !this.wxData) {
            this.getInitWXSDKConfig();
          }
        }).catch(() => { this.loading = false; });
      } else {
        Promise.all([
          getBookingProDetail({
            code: this.code
          }),
          getDictList('output_unit'),
          getDictList('pack_unit')
        ]).then(([res1, res2, res3]) => {
          this.loading = false;
          this.detail = res1;
          this.detailDescription = res1.description;
          this.banners = this.detail.bannerPic.split('||');
          if(this.banners.length >= 2) {
            this.loop = true;
          }
          res2.map((item) => {
            this.outputUnitObj[item.dkey] = item.dvalue;
          });
          res3.map((item) => {
            this.packUnitObj[item.dkey] = item.dvalue;
          });
          if(!this.isWxConfiging && !this.wxData) {
            this.getInitWXSDKConfig();
          }
        }).catch(() => { this.loading = false; });
      }
    }
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
.product-detail-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0.98rem;
  width: 100%;
  z-index: 101;
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
    /*height: 7.7rem;*/
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
          /*margin-top: 0.27rem;*/
          font-size: $font-size-medium-x;
          line-height: 0.42rem;
          color: #333;
        }
        p:first-child {
          margin-top: 0.27rem;
        }
        span {
          margin-top: 0.4rem;
          font-size: $font-size-medium;
          color: #999;
        }
        i {
          width: 0.34rem;
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
        .kucun {
          margin-top: 0;
          font-size: 0.24rem;
          color: gray;
        }
      }
    }
    .packaging {
      /*height: 1.74rem;*/
      border-bottom: 1px solid #eee;
      margin: 0.3rem;
      overflow: scroll;
      position: relative;
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
        /*position: absolute;*/
        /*top: 0.42rem;*/
        /*bottom: 0;*/
        /*left: 0;*/
        /*right: 0;*/
        overflow: auto;
        /*padding: 0 0.1rem;*/
        .select-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.28rem;
          font-family: 'PingFang-SC-Medium';
          font-size: 0.26rem;
          color: #666;
          .item-name {
          }
          .item-price-isSelect {
            display: flex;
            align-items: center;
            img {
              width: 0.36rem;
              height: 0.36rem;
              margin-right: 0.1rem;
            }
            span {
              flex: 1;
              margin-right: 0.4rem;
            }
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
        display: table-cell;
        vertical-align: middle;
        text-align: center;
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
    .buypart-bottom {
      height: 0.98rem;
      line-height: 0.9rem;
      color: #fff;
      font-size: $font-size-medium-x;
      /*position: absolute;*/
      /*bottom: 0;*/
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
