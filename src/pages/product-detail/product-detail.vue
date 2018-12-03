<template>
  <div class="product-detail-wrapper">
    <!--<m-header class="cate-header" title="产品详情"></m-header>-->
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
        <div class="item" v-show="detail.sellType === '3'">
          <span>募集时间</span><span>{{formatDate(detail.raiseStartDatetime, 'yyyy-MM-dd')}}至{{formatDate(detail.raiseEndDatetime, 'yyyy-MM-dd')}}</span>
        </div>
        <div class="item" v-show="detail.sellType === '3'">
          <span>认养时间</span><span>{{formatDate(detail.productSpecsList[0].startDatetime, 'yyyy-MM-dd')}}至{{formatDate(detail.productSpecsList[0].endDatetime, 'yyyy-MM-dd')}}</span>
        </div>
        <div class="item" v-show="detail.sellType === '4'">
          <span>已募集份数</span><span>{{detail.nowCount}}份/{{detail.raiseCount}}份</span>
        </div>
        <div class="item">
          <span>古树学名</span><span>{{detail.scientificName}}</span>
        </div>
        <div class="item">
          <span>古树级别</span><span>{{detail.rank}}</span>
        </div>
        <div class="item">
          <span>古树品种</span><span>{{detail.variety}}</span>
        </div>
        <div class="item">
          <span>古树区域</span><span>{{detail.province}}{{detail.city}}{{detail.area}}</span>
        </div>
        <div class="item">
          <span>乡镇/街道</span><span>{{detail.town}}</span>
        </div>
        <div class="item">
          <span>古树产地</span><span>{{detail.originPlace}}</span>
        </div>
        <div class="item" @click="go(`/adopt-list?code=${code}&type=${detail.sellType}`)">
          <span v-show="detail.sellType !== '3'">已认养名单</span>
          <span v-show="detail.sellType === '3'">已捐赠名单</span>
          <img src="./more@2x.png" alt="" class="fr more">
        </div>
        <div class="item" @click="goTreeList()">
          <span>树木查看</span>
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
      <button @click="showPopUp" v-show="canAdopt()">申请认养</button>
      <button class="disabled" v-show="!canAdopt()" @click="goLogin()">{{noAdoptReason}}</button>
    </div>
    <div :class="['mask',flag ? 'show' : '']" @click="genghuan"></div>
    <div :class="['buypart',flag ? 'show' : '']">
      <div class="title">
        <div class="title-pic">
          <img :src="formatImg(detail.bannerPic)">
        </div>
        <div class="title-right">
          <p>{{detail.scientificName}}</p>
          <i @click="genghuan">X</i>
          <p class="position"><img src="./position@2x.png">{{detail.originPlace}}</p>
        </div>
      </div>
      <div class="packaging">
        <p class="packaging-title">认养规格</p>
        <div class="select">
          <Scroll
            :pullUpLoad="pullUpLoad"
          >
            <div class="select-item" v-for="(item, index) in detail.productSpecsList" @click="chooseSpecs(index)" :key="index">
              <span v-show="detail.sellType !== '3'">{{item.name}}：{{formatDate(item.startDatetime, 'yyyy-MM-dd')}}至{{formatDate(item.endDatetime, 'yyyy-MM-dd')}}</span>
              <span v-show="detail.sellType === '3'">{{item.name}}：价格：¥{{formatAmount(item.price)}}</span>
              <img src="./choosed@2x.png" v-show="choosedIndex === index">
              <img src="./unchoosed@2x.png" v-show="choosedIndex !== index">
            </div>
          </Scroll>
        </div>
      </div>
      <div class="number">
        <span>认养份数</span>
        <div class="right">
          <img class="diamonds right-item" @click="add" src="./add@2x.png">
          <input class="num right-item" v-model="number" type="number">
          <img class="diamonds right-item" @click="sub" src="./sub@2x.png">
        </div>
      </div>
      <div class="other" v-show="showIdentifyCode()">
        <span>下单识别码</span>
        <input type="text" v-model="identifyCode" placeholder="请输入正确的下单识别码" >
      </div>
      <div class="other tip" v-if="detail.sellType === '4' && !detail.identifyCode">它还没被认养，快发起集体认养，邀请小伙伴一同参与</div>
      <div class="other tip" v-if="detail.sellType === '4' && detail.identifyCode">此树已经开启集体认养！发起人：<span>{{detail.collectFirstUserName}}</span>，获得识别码即可一同参与</div>
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
import { formatAmount, formatImg, formatDate, setTitle } from 'common/js/util';
import { getCookie } from 'common/js/cookie';
import {initShare} from 'common/js/weixin';
import { getProductDetail, share } from 'api/biz';
import { getUserDetail } from 'api/user';
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
        area: ''
      },
      choosedIndex: 0,
      code: '',   // 产品code
      identifyCode: '', // 下单识别码
      banners: [],
      loop: false,
      userDetail: {},
      noAdoptReason: '',
      freeScroll: true,
      click: false
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
    // 是否可被认养
    canAdopt() {
      if(!this.userId) {
        this.noAdoptReason = '您未登录';
        return false;
      }
      if(this.detail.sellType === '1' && this.detail.raiseCount === this.detail.nowCount) {
        // 销售类型为专属且未到认养量
        this.noAdoptReason = '已被认养';
        return false;
      }
      if(this.detail.sellType === '3') {
        let curTime = new Date();
        // 2把字符串格式转换为日期类
        let startTime = new Date(Date.parse(this.detail.raiseStartDatetime));
        let endTime = new Date(Date.parse(this.detail.raiseEndDatetime));
        // 3进行比较
        if(curTime <= startTime || curTime >= endTime) {
          this.noAdoptReason = '当前不在募集期内';
          return false;
        }
      }
      if(this.detail.directType && this.detail.directType === '1') {
        if(this.detail.raiseCount === this.detail.nowCount) {
          this.noAdoptReason = '已被认养';
          return false;
        }
        // 等级定向且用户为该等级
        if(this.detail.directObject !== this.userDetail.level) {
          this.noAdoptReason = '您不属于该产品定向的等级';
          return false;
        }
      }
      if(this.detail.directType && this.detail.directType === '2') {
        if(this.detail.raiseCount === this.detail.nowCount) {
          this.noAdoptReason = '已被认养';
          return false;
        }
        // this.directFlag = false;
        // item.directObject.split(',').map((item) => {
        //   if(item === this.userId) {
        //     this.directFlag = true;
        //   }
        // });
        // if(this.directFlag) {
        //   item.noAdoptReason = '可认养';
        // } else {
        //   item.canAdoptFlag = false;
        //   item.noAdoptReason = '不可认养';
        // }
        // return item;
        this.directFlag = false;
        this.detail.directObject.split(',').map((item) => {
          if(item === this.userId) {
            this.directFlag = true;
          }
        });
        if(!this.directFlag) {
          this.noAdoptReason = '您不是该产品定向的用户';
          return false;
        }
        // if(this.detail.directObject !== this.userId) {
        //   this.noAdoptReason = '您不是该产品定向的用户';
        //   return false;
        // }
        // 用户定向且是定向用户
      }
      if(this.detail.sellType === '4' && this.detail.raiseCount === this.detail.nowCount) {
        // 销售类型为集体且未到认养量
        this.noAdoptReason = '已满标';
        return false;
      }
      return true;
    },
    // 是否展示识别码
    showIdentifyCode() {
      // 集体捐赠且非第一人下单
      return this.detail.sellType === '4' && this.detail.nowCount !== 0;
    },
    confirm() {
      if(this.userId) {
        let proCode = this.detail.code;
        let specsCode = this.detail.productSpecsList[this.choosedIndex].code;
        let quantity = this.number;
        // 判断是否在认养期内 **********************
        if(this.detail.sellType !== '3') {
          // 非捐赠，判断认养时间
          let curTime = new Date();
          // 2把字符串格式转换为日期类
          let startTime = new Date(Date.parse(this.detail.productSpecsList[this.choosedIndex].startDatetime));
          let endTime = new Date(Date.parse(this.detail.productSpecsList[this.choosedIndex].endDatetime));
          // 3进行比较
          if(curTime <= startTime || curTime >= endTime) {
            this.text = '当前不在您选择的规格的认养期内';
            this.$refs.toast.show();
            return;
          }
        } else {
          // 捐赠产品判断募集时间
          let curTime = new Date();
          // 2把字符串格式转换为日期类
          let startTime = new Date(Date.parse(this.detail.productSpecsList[this.choosedIndex].raiseStartDatetime));
          let endTime = new Date(Date.parse(this.detail.productSpecsList[this.choosedIndex].raiseEndDatetime));
          // 3进行比较
          if(curTime <= startTime || curTime >= endTime) {
            this.text = '当前不在该捐赠产品的募集期内';
            this.$refs.toast.show();
            return;
          }
        }
        if(this.detail.sellType !== '4') {
          let type = this.detail.sellType;
          this.go('/protocol?sign=1&proCode=' + proCode + '&specsCode=' + specsCode + '&quantity=' + quantity + '&type=' + type);
        } else {
          // 集体认养
          let type = this.detail.sellType;
          let identifyCode = this.identifyCode || '';
          if(this.detail.identifyCode && !identifyCode) {
            this.text = '请输入识别码';
            this.$refs.toast.show();
            return;
          }
          if(this.detail.identifyCode && identifyCode !== this.detail.identifyCode) {
            // 非第一人下单，识别码错误
            this.text = '识别码错误';
            this.$refs.toast.show();
          } else {
            this.go('/protocol?sign=1&proCode=' + proCode + '&specsCode=' + specsCode + '&quantity=' + quantity + '&identifyCode=' + identifyCode + '&type=' + type);
          }
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
        title: '氧林',
        desc: this.detail.name,
        link: location.href.split('#')[0] + '/#/product-detail?code=' + this.code,
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
          share(this.channel).then((res) => {
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
    setTitle('产品详情');
    this.isWxConfiging = false;
    this.wxData = null;
    this.pullUpLoad = null;
    this.userId = getCookie('userId');
    this.code = this.$route.query.code;
    this.loading = true;
    if(this.userId) {
      Promise.all([
        getProductDetail({
          code: this.code
        }),
        getUserDetail({
          userId: this.userId
        })
      ]).then(([res1, res2]) => {
        this.loading = false;
        this.detail = res1;
        console.log(res1.identifyCode);
        this.detailDescription = res1.description;
        this.banners = this.detail.bannerPic.split('||');
        if(this.banners.length >= 2) {
          this.loop = true;
        }
        this.userDetail = res2;
        if(!this.isWxConfiging && !this.wxData) {
          this.getInitWXSDKConfig();
        }
      }).catch(() => { this.loading = false; });
    } else {
      Promise.all([
        getProductDetail({
          code: this.code
        })
      ]).then(([res1]) => {
        this.loading = false;
        this.detail = res1;
        this.detailDescription = res1.description;
        this.banners = this.detail.bannerPic.split('||');
        if(this.banners.length >= 2) {
          this.loop = true;
        }
        if(!this.isWxConfiging && !this.wxData) {
          this.getInitWXSDKConfig();
        }
      }).catch(() => { this.loading = false; });
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
        height: 1.1rem;
        font-size: $font-size-medium-x;
        line-height: 1.1rem;
        border-bottom: 1px solid #eee;
        span:first-child {
          margin-right: 0.3rem;
          width: 25%;
          display: inline-block;
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
      .description-detail.rich-text-description{
        padding: 0.2rem 0;
        p {
          img {
            max-width: 100%;
            vertical-align: top !important;
          }
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
    /*min-height: 8rem;*/
    position: fixed;
    bottom: 0;
    background-color: #fff;
    display: none;
    /*z-index: 9;*/
    &.show {
      display: block;
    }
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
        /*height: 2rem;*/
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
    .other {
      height: 1.1rem;
      /*border-bottom: 1px solid #eee;*/
      margin: 0 0.3rem;
      display: flex;
      align-items: center;
      font-size: 0.3rem;
      span {
        display: inline-block;
        margin-right: 0.2rem;
      }
      input {
        flex: 1;
        height: 70%;
        border: 1px solid $color-border;
      }
    }
    .other.tip {
      color: #999;
      font-size: 0.24rem;
      line-height: 0.36rem;
      display: block;
      margin-top: 0.2rem;
      span {
        color: $primary-color;
      }
    }
    .buypart-bottom {
      height: 0.98rem;
      line-height: 0.9rem;
      color: #fff;
      font-size: $font-size-medium-x;
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
