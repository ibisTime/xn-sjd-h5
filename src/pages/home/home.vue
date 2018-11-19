<template>
  <div class="home-wrapper">
    <!--<m-header class="cate-header" title="首页" :showBack="showBack" actText="签到" @action="action"></m-header>-->
    <div class="content">
      <Scroll :pullUpLoad="pullUpLoad" ref="scroll">
        <div class="slider-wrapper">
          <slider :loop="loop">
            <div class="home-slider" v-for="item in banners" :key="item.code">
              <a :href="item.url||'javascript:void(0)'" :style="getImgSyl(item.pic)"></a>
            </div>
          </slider>
          <!--<img src="./../../common/image/banner-default.png" class="banner-default">-->
        </div>
        <div class="notices">
          <img class="tit" src="./notice@2x.png">
          <div class="notice-wrap">
            <div class="border"></div>
            <div class="title notice" v-for="item in noticeList" v-show="noticeList.length" @click="go(`/notice-detail?code=${item.code}`)">{{item.title}}</div>
            <div class="title notice" v-show="!noticeList.length">暂无公告</div>
          </div>
          <div class="more" @click="go('/notices')">更多</div>
        </div>
        <div class="mall-list">
          <!--<div class="icon-item" @click="goProList(item)" v-for="item in proType">-->
            <!--<img :src="formatImg(item.pic)">-->
            <!--<p>{{item.name}}</p>-->
          <!--</div>-->
          <category-scroll
            :Type="'mall'"
            :currentIndex="currentIndex"
            :categorys="proType"
            @select="selectCategory"
          ></category-scroll>
        </div>
        <div class="emotion-article" @click="go('/emotion-channel')">
          <img src="./emotion@2x.png">
          <div class="text">
            <p class="Chinese">优选推文，情感频道</p>
            <p class="English">Preferred tweets, emotional channels</p>
          </div>
          <!--<img src="./emotion@2x.png" class="emotion">-->
          <img src="./more@2x.png" class="more">
        </div>
        <!--<div class="bulletin" v-for="item in bulletinList">-->
          <!--<img src="./bulletin@2x.png">-->
          <!--<div class="border"></div>-->
          <!--<div class="title">{{item.title}}</div>-->
          <!--<div class="more">更多</div>-->
        <!--</div>-->
        <scroll-y :contentArr="bulletinList" v-show="bulletinList.length"></scroll-y>
        <div class="gray" v-show="!bulletinList.length"></div>
        <div class="hot" v-show="proList.length">
        <div class="title">
          <span class="fl hot-title">热门推荐</span>
          <span class="fr more" @click="go('/hot-product-list')">更多</span>
        </div>
        <div class="proList">
          <div class="item"  v-for="item in proList" @click="go('/product-detail?code='+item.code)">
            <div class="item-top">
              <div class="sell-type">{{sellTypeObj[item.sellType]}}</div>
              <div class="sell-type-right" :style="{background: canAdopt(item).canAdoptFlag ? '#23ad8c' : ''}">{{canAdopt(item).noAdoptReason}}</div>
              <img :src="formatImg(item.listPic)" class="hot-pro-img">
              <div class="prograss-bar" v-if="item.sellType === '4'">
                <div class="nowCount" :style="{width: getWidth(item)+'%'}"></div>
                <div class="totalCount"></div>
                <div class="prograss-text"><span>{{item.nowCount}}/{{item.raiseCount}}</span></div>
              </div>
            </div>
            <div class="hot-pro-text">
              <p class="hot-pro-title">{{item.name}}</p>
              <p class="hot-pro-introduction">{{formatDate(item.updateDatetime, 'yyyy-MM-dd')}}</p>
              <p><span class="hot-pro-introduction">{{item.province}} {{item.city}}</span><span class="hot-pro-price">¥{{formatAmount(item.minPrice)}}</span></p>
            </div>
          </div>
        </div>
      </div>
      <!--<div class="mall-content">-->
        <!--<no-result v-show="!currentList.length && !hasMore" class="no-result-wrapper" title="抱歉，暂无商品"></no-result>-->
      <!--</div>-->
      </Scroll>
      <div class="sign" @click="action"></div>
    </div>
    <full-loading v-show="loading"></full-loading>
    <m-footer></m-footer>
    <toast ref="toast" :text="text"></toast>
    <check-in v-show="showCheckIn" @close="close" :signTpp="signTpp" :signDays="signDays"></check-in>
  </div>
</template>
<script>
import Toast from 'base/toast/toast';
import Scroll from 'base/scroll/scroll';
import FullLoading from 'base/full-loading/full-loading';
import MFooter from 'components/m-footer/m-footer';
import Slider from 'base/slider/slider';
import NoResult from 'base/no-result/no-result';
import MHeader from 'components/m-header/m-header';
import CheckIn from 'base/check-in/check-in';
import ScrollY from 'base/scroll-y/scroll-y';
import CategoryScroll from 'base/category-scroll/category-scroll';
import { formatAmount, formatImg, formatDate, setTitle, getUserId } from 'common/js/util';
import { getCookie } from 'common/js/cookie';
import { getBanner, getDictList } from 'api/general';
import { getProductPage, getProductType, signIn, getMessagePage } from 'api/biz';
import { getUserDetail } from 'api/user';
// import ScrollY from "../../base/scroll-y/scroll-y";
export default {
  // name: "home",
  data() {
    return {
      title: '正在加载...',
      loading: true,
      toastText: '',
      currentIndex: 0,
      hasMore: false,
      text: '',
      showBack: false,
      proList: [],
      proType: [],
      showCheckIn: false,
      pullUpLoad: null,
      banners: [],
      // proType: [],
      loop: false,
      noticeList: [],
      bulletinList: [],
      sellTypeObj: {},
      signTpp: '0',
      signDays: 0,
      userDetail: {}
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
    getWidth(item) {
      return (item.nowCount / item.raiseCount) * 100;
    },
    // 签到
    action() {
      let userId = getCookie('userId');
      if(userId) {
        this.loading = true;
        signIn({
          userId: userId,
          client: 'h5'
        }).then((res) => {
          this.signTpp = formatAmount(res.tppAmount);
          this.signDays = res.signDays;
          this.showCheckIn = true;
          this.loading = false;
        }).catch(() => { this.loading = false; });
      } else {
        this.text = '您未登录';
        this.$refs.toast.show();
        setTimeout(() => {
          this.$router.push('/login');
        }, 1000);
      }
    },
    close() {
      this.showCheckIn = false;
    },
    go(url) {
      this.$router.push(url);
    },
    selectCategory(index) {
      this.currentIndex = index;
      this.$refs.scroll.scrollTo(0, 0);
      this.goProList(this.proType[index]);
    },
    goProList(item) {
      console.log(item);
      if(item.value === '果树预售') {
        this.go('/booking-product-list?typeCode=' + item.code);
      } else {
        this.go('/product-list?typeCode=' + item.code);
      }
    },
    getImgSyl(imgs) {
      return {
        backgroundImage: `url(${formatImg(imgs)})`
      };
    },
    getInitData() {
      Promise.all([
        getBanner(),
        getProductPage({
          location: '1',
          orderDir: 'asc',
          orderColumn: 'order_no',
          statusList: [4, 5]
        }),
        getProductType({
          orderDir: 'asc',
          orderColumn: 'order_no',
          status: 1,
          level: 1,
          typeList: ['0', '1']
        }),
        getMessagePage({
          status: '1',
          type: '1',
          object: 'C',
          orderColumn: 'create_datetime',
          orderDir: 'desc'
        }),
        getMessagePage({
          status: '1',
          type: '3',
          orderColumn: 'create_datetime',
          orderDir: 'desc'
        }),
        // getBulletinList(),
        getDictList('sell_type')
      ]).then(([res1, res2, res3, res4, res5, res6]) => {
        this.banners = res1;
        if(this.banners.length > 1) {
          this.loop = true;
        }
        this.proList = res2.list;
        res3.map((item, index) => {
          this.proType.push({
            key: index,
            value: item.name,
            code: item.code,
            pic: item.pic
          });
        });
        // res3.map((item) => {
        //   if(!item.parentCode) {
        //     this.proType.push(item);
        //   }
        // });
        this.noticeList = res4.list.slice(0, 1);
        this.bulletinList = res5.list;
        this.loading = false;
        res6.map((item) => {
          this.sellTypeObj[item.dkey] = item.dvalue;
        });
      }).catch(() => { this.loading = false; });
    },
    canAdopt(item) {
      item.canAdoptFlag = true;
      if(!this.userDetail.level) {
        item.canAdoptFlag = false;
        item.noAdoptReason = '您未登录';
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
        if(item.directObject !== this.userId) {
          item.canAdoptFlag = false;
          item.noAdoptReason = '不可认养';
        } else {
          item.noAdoptReason = '可认养';
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
    getUserDetail() {
      getUserDetail({
        userId: getUserId()
      }).then((res) => {
        this.userDetail = res;
      });
    }
  },
  mounted() {
    if (this.$route.path === '/product-detail') {
      return;
    }
    setTitle('氧林');
    this.pullUpLoad = null;
    this.loading = true;
    // setInterval(() => {
    //   console.log('Hello');
    // }, 1000);
    this.getInitData();
    if(getUserId()) {
      this.getUserDetail();
    }
  },
  components: {
    ScrollY,
    FullLoading,
    Toast,
    MFooter,
    Slider,
    NoResult,
    MHeader,
    CheckIn,
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
  top: 0;
  left: 0;
  bottom: 0.98rem;
  width: 100%;

  @-webkit-keyframes anim1{
    0% {top: 0.7rem;opacity: 1}
    50% {top: -0.7rem;opacity: 1}
    75% {top: -0.7rem;opacity: 0}
    100%{top:0.7rem;opacity: 0}
  }

  @-webkit-keyframes anim2{
    0% {transform: translateX(-0.25rem);}
    100%{transform: translateX(-100%);}
  }
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .banner-default {
    width: 100%;
    height: 3rem;
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
      height: 3rem;
      width: 100%;
      overflow: hidden;
      .home-slider {
        height: 100%;
      }
      a {
        width: 100%;
        height: 100%;
        display: block;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }
    }
    .notices {
      position: relative;
      width: 100%;
      height: 0.7rem;
      /*display: -webkit-box;*/
      /*overflow-x: scroll;*/
      /*-webkit-overflow-scrolling:touch;*/
      .tit {
        width: 0.6rem;
        height: 0.25rem;
        position: absolute;
        top: 50%;
        left: 0.3rem;
        transform: translateY(-50%);
        z-index: 99;
      }
      .more {
        line-height: 0.33rem;
        color: #999;
        position: absolute;
        top: 50%;
        right: 0.3rem;
        transform: translateY(-50%);
        z-index: 99;
        font-size: 0.24rem;
      }
      .notice-wrap{
        display: flex;
        align-items: center;
        font-size: 0.24rem;
        padding: 0.24rem 0.77rem 0.24rem 1.2rem;
        background: $color-highlight-background;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9;

        .border {
          display: inline;
          width: 0;
          height: 0.15rem;
          border-right: 1px solid #ccc;
          margin-right: 0.2rem;
        }
      }
      .notice {
        align-items: center;
        font-size: 0.24rem;
        /*padding: 0.24rem 0.3rem;*/
        padding: 0.24rem 0;
        background: $color-highlight-background;
        flex: 1;
        /*position: absolute;*/
        /*left: 1.24rem;*/
        /*width: calc(100% - 2.5rem);*/
        /*overflow: scroll;*/
        .title {
          line-height: 0.33rem;
          flex: 1;
        }
      }
      /*.notice:nth-child(1){*/
        /*-webkit-animation: anim1 3s linear infinite;*/
      /*}*/

      /*.notice:nth-child(2){*/
        /*-webkit-animation: anim2 3s linear infinite;*/
      /*}*/
    }
    .icons {
      width: 100%;
      height: 2.25rem;
      /*padding-top: 0.26rem;*/
      padding: 0.26rem 0.3rem;
      background: #fff;
      display: flex;
      margin-bottom: 0.2rem;
      .icon-item {
        display: inline;
        flex: 1;
        text-align: center;
        img {
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
        }
        p {
          color: #666;
          font-size: 0.24rem;
        }
      }
    }
    .emotion-article {
      height: 1.94rem;
      padding: 0 0.3rem;
      display: flex;
      align-items: center;
      background: $color-highlight-background;
      justify-content: space-between;
      .text {
        .Chinese {
          font-size: $font-size-medium-xx;
          margin-bottom: 0.11rem;
        }
        .English {
          color: #666;
          font-size: $font-size-small-s;
          line-height: $font-size-medium-x;
        }
      }
      img {
        width: 1.06rem;
      }
      .more{
        width: 0.3rem;
        /*position: absolute;*/
        /*right: 0.3rem;*/
        /*line-height: 1.94rem;*/
        /*margin-top: 0.5rem;*/
      }
    }
    .bulletins {
      position: relative;
      width: 100%;
      height: 0.7rem;
      overflow: hidden;
      .bulletin {
        display: flex;
        align-items: center;
        font-size: 0.24rem;
        padding: 0.24rem 0.3rem;
        background: #fdf4f3;
        position: absolute;
        width: 100%;
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
      .bulletin:nth-child(1){
        -webkit-animation: anim1 3s linear infinite;
      }

      .bulletin:nth-child(2){
        -webkit-animation: anim2 3s linear infinite;
      }
    }

    .hot {
      padding: 0.4rem 0.3rem;
      background: $color-highlight-background;
      .title {
        height: 0.45rem;
      }
      .hot-title {
        font-size: $font-size-medium-xx;
        line-height: $font-size-large-x;
      }
      .more {
        line-height: 0.33rem;
        color: #999;
        font-size: $font-size-small;
      }
      .proList {
        background: $color-highlight-background;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        font-size: 0;
        .item {
          width: 3.3rem;
          /*height: 4.98rem;*/
          margin-top: 0.24rem;
          border: 1px solid #e6e6e6;
          border-radius: 0.04rem;
          display: inline-block;
          position: relative;
          .item-top {
            position: relative;
            .sell-type {
              position: absolute;
              left: 0;
              top: 0;
              background: #F7B524;
              /*opacity: 0.5;*/
              padding: 0 0.1rem;
              height: 0.4rem;
              font-size: 0.24rem;
              line-height: 0.4rem;
              text-align: center;
              color: $color-highlight-background;
              border-radius: 0.05rem;
            }
            .sell-type-right {
              position: absolute;
              right: 0;
              top: 0;
              background: #969998;
              /*opacity: 0.5;*/
              padding: 0 0.1rem;
              height: 0.4rem;
              font-size: 0.24rem;
              line-height: 0.4rem;
              text-align: center;
              color: $color-highlight-background;
              border-radius: 0.05rem;
            }
            .hot-pro-img {
              height: 3.3rem;
              width: 100%;
            }
            .prograss-bar {
              width: 100%;
              height: 0.5rem;
              border: 1px solid;
              position: absolute;
              bottom: 0;
              .nowCount {
                display: inline-block;
                background: #23AD8C;
                height: 100%;
                max-width: 100%;
              }
              .totalCount {
                display: inline;
              }
              .prograss-text {
                font-size: 0.24rem;
                color: black;
                position: absolute;
                top: 0;
                width: 100%;
                text-align: center;
                height: 100%;
                span {
                  line-height: 0.5rem;
                }
              }
            }
          }
          .hot-pro-text {
            padding: 0 0.2rem;
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
              font-size: $font-size-small;
              line-height: $font-size-medium-xx;
              margin-bottom: 0.1rem;
              /*font-family: 'PingFangSC-Medium';*/
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
    .sign {
      width: 1.24rem;
      height: 1.24rem;
      position: fixed;
      right: 0.3rem;
      bottom: 1.3rem;
      background: url('./sign@2x.png') no-repeat;
      background-size: 100% 100%;
    }
  }
  .gray {
    width: 100%;
    height: 0.2rem;
    padding: 0;
    background: #f5f5f5;
  }
}
</style>
