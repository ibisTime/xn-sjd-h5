<template>
  <div class="home-wrapper">
    <div class="content">
      <Scroll :pullUpLoad="pullUpLoad" ref="scroll">
        <div class="search-wrapper">
          <search :right="searchRight" @focus="go('/search')"></search>
        </div>
        <div class="slider-wrapper">
          <slider :loop="loop">
            <div class="home-slider" v-for="item in banners" :key="item.code">
              <a :href="item.url||'javascript:void(0)'" :style="getImgSyl(item.pic)"></a>
            </div>
          </slider>
        </div>
        <div class="notices">
          <img class="tit" src="./notice@2x.png">
          <div class="notice-wrap">
            <!--<div class="border"></div>-->
            <div class="title notice" v-for="item in noticeList" v-show="noticeList.length" @click="go(`/notice-detail?code=${item.code}`)">{{cut(item.title, 15)}}</div>
            <div class="title notice" v-show="!noticeList.length">暂无公告</div>
          </div>
          <div class="more" @click="go('/notices')">更多</div>
        </div>
        <div class="navigation">
          <div class="icons" @click="go(item.url)" v-for="item in navigateList">
            <img :src="formatImg(item.pic)">
            <p>{{item.name}}</p>
          </div>
          <!--<category-scroll-->
            <!--:Type="'mall'"-->
            <!--:currentIndex="currentIndex"-->
            <!--:categorys="proType"-->
            <!--@select="selectCategory"-->
          <!--&gt;</category-scroll>-->
        </div>
        <!--<div class="navigation">-->
          <!--<div class="icons">-->
            <!--<img src="./tree@2x.png">-->
            <!--<p>古树名木</p>-->
          <!--</div>-->
          <!--<div class="icons" @click="go('/mall')">-->
            <!--<img src="./mall@2x.png">-->
            <!--<p>商场</p>-->
          <!--</div>-->
          <!--<div class="icons">-->
            <!--<img src="./chart@2x.png">-->
            <!--<p>排行榜</p>-->
          <!--</div>-->
        <!--</div>-->
        <div class="emotion-article" @click="go('/emotion-channel')">
          <div class="emotion-top">
            <span class="emotion-title">情感推文</span>
            <span class="emotion-more">查看更多<img src="./more@2x.png"/></span>
          </div>
          <div class="emotion-img">
            <img :src="formatImg(articlePic)">
          </div>
        </div>
        <scroll-y :contentArr="bulletinList" v-show="bulletinList.length"></scroll-y>
        <div class="gray" v-show="!bulletinList.length"></div>
        <div class="hot" v-show="proList.length">
        <div class="title">
          <span class="fl hot-title">古树认养</span>
          <span class="fr more" @click="go('/product-list')">查看更多<img src="./more@2x.png"/></span>
        </div>
        <div class="proList">
          <div class="item"  v-for="item in proList" @click="go('/product-detail?code='+item.code)">
            <div class="item-top">
              <div class="sell-type">{{sellTypeObj[item.sellType]}}</div>
              <div class="sell-type-right">{{canAdopt(item).noAdoptReason}}</div>
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
      </div>
      <!--<div class="mall-content">-->
        <!--<no-result v-show="!currentList.length && !hasMore" class="no-result-wrapper" title="抱歉，暂无商品"></no-result>-->
      <!--</div>-->
      </Scroll>
      <!--<div class="sign" @click="action"></div>-->
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
import Search from 'components/search/search';
import { formatAmount, formatImg, formatDate, setTitle, getUserId } from 'common/js/util';
import { getCookie } from 'common/js/cookie';
import { getBanner, getDictList, getConfigPage } from 'api/general';
import { getProductPage, getProductType, signIn, getMessagePage } from 'api/biz';
import { getUserDetail } from 'api/user';
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
      projectStatusObj: {},
      signTpp: '0',
      signDays: 0,
      userDetail: {},
      searchRight: {},
      navigateList: [],
      articlePic: ''
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
    cut(str, num) {
      if(str.length > num) {
        return str.slice(0, num) + '...';
      } else {
        return str;
      }
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
        getBanner({
          type: '2'
        }),
        getProductPage({
          location: '1',
          orderDir: 'asc',
          orderColumn: 'buyable',
          statusList: [4, 5, 6]
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
        getDictList('sell_type'),
        getDictList('product_status'),
        getBanner({
          type: '8'
        }),
        getConfigPage({type: 'SYS_TXT', ckey: 'ARTICLE_PIC'})
      ]).then(([res1, res2, res3, res4, res5, res6, res7, res8, res9]) => {
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
        this.noticeList = res4.list.slice(0, 1);
        this.bulletinList = res5.list;
        this.loading = false;
        res6.map((item) => {
          this.sellTypeObj[item.dkey] = item.dvalue;
        });
        res7.map((item) => {
          this.projectStatusObj[item.dkey] = item.dvalue;
        });
        this.navigateList = res8;
        this.articlePic = res9.list[0].cvalue;
      }).catch(() => { this.loading = false; });
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
        if(item.directObject) {
          item.directObject.split(',').map((i) => {
            if(i === this.userDetail.userId) {
              this.directFlag = true;
            }
          });
        }
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
    this.searchRight = {
      cancel: false,
      sign: true
    };
    setTitle('氧林');
    this.pullUpLoad = null;
    this.loading = true;
    if(getUserId()) {
      getUserDetail({userId: getUserId()}).then((res) => {
        if(res.mobile) {
          if(res.status === '0') {
            this.$router.push('/home');
          } else {
            alert('您的账号已被锁定，请联系管理员');
          }
        } else {
          this.$router.push('/wx-bind-mobile');
        }
      }).catch(() => {
        this.loading = false;
        this.relogin = true;
      });
    }
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
    CategoryScroll,
    Search
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
    .search-wrapper {
      height: 0.88rem;
      background: $primary-color;
    }
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
      background: #ebf6f3;
      .tit {
        width: 0.74rem;
        height: 0.25rem;
        position: absolute;
        top: 50%;
        left: 0.3rem;
        transform: translateY(-50%);
        z-index: 99;
        border-left: 3px solid $primary-color;
        padding-left: 0.14rem;
      }
      .more {
        line-height: 0.33rem;
        color: #23AD8C;
        position: absolute;
        top: 50%;
        right: 0.3rem;
        transform: translateY(-50%);
        z-index: 99;
        font-size: 0.24rem;
        padding-left: 0.2rem;
        border-left: 1px solid #23ad8c;
      }
      .notice-wrap{
        display: flex;
        align-items: center;
        font-size: 0.24rem;
        padding: 0.24rem 0.77rem 0.24rem 1.2rem;
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
        flex: 1;
        .title {
          line-height: 0.33rem;
          flex: 1;
        }
      }
    }
    .navigation {
      width: 100%;
      background: #fff;
      display: flex;
      justify-content: space-around;
      padding-bottom: 0.2rem;
      .icons {
        display: inline;
        text-align: center;
        img {
          width: 0.66rem;
          height: 0.66rem;
          border-radius: 50%;
        }
        p {
          font-size: 0.24rem;
        }
      }
    }
    .emotion-article {
      background: $color-highlight-background;
      padding-bottom: 0.4rem;
      .emotion-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .emotion-title {
          font-size: 0.3rem;
          padding: 0.18rem 0.3rem;
          font-weight: 500;
        }
        .emotion-more {
          font-size: 0.24rem;
          padding: 0.18rem 0.3rem;
          img {
            margin-left: 0.2rem;
            height: 0.18rem;
          }
        }
      }
      .emotion-img {
        width: 100%;
        height: 2rem;
        padding: 0 0.3rem;
        border-radius: 0.3rem;
        img {
          width: 100%;
          height: 100%;
        }
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
          font-size: 0.24rem;
          padding: 0.18rem 0.3rem;
          img {
            margin-left: 0.2rem;
            height: 0.18rem;
          }
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
      padding: 0.18rem 0.3rem;
      background: $color-highlight-background;
      .title {
        height: 0.45rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .hot-title {
        font-size: $font-size-medium-xx;
        line-height: $font-size-large-x;
        font-weight: 500;
      }
      .more {
        font-size: 0.24rem;
        img {
          margin-left: 0.2rem;
          height: 0.18rem;
        }
      }
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
