<template>
  <div class="product-detail-wrapper">
    <back-only class="cate-header"></back-only>
    <div class="content">
      <Scroll ref='scroll' :pullUpLoad="pullUpLoad" :data="adoptList">
        <div class="slider-wrapper">
          <slider :loop="loop">
            <div class="home-slider" v-for="item in banners" :key="item">
              <a :style="getImgSyl(item)"></a>
            </div>
          </slider>
        </div>
        <div class="title">
          <p>
            <span class="sell-type">{{sellTypeObj[detail.sellType]}}</span>
            {{detail.name}}
          </p>
          <div class="title-second"><span class="price">¥{{formatAmount(detail.minPrice)}}</span><span class="place">{{detail.city}} {{detail.area}}</span></div>
        </div>
        <div class="gray"></div>
        <div class="prograss-bar" v-if="detail.sellType === '4'">
          <div class="top">
            <div class="line">
              <div class="nowCount" :style="{width: getWidth()+'%'}"></div>
            </div>
            <div class="percent">{{(detail.nowCount/detail.raiseCount)*100}}%</div>
          </div>
          <div class="bottom">
            <div class="bottom-item">
              <p class="bottom-item-first">目标份数/份</p>
              <p>{{detail.raiseCount}}</p>
            </div>
            <div class="bottom-item">
              <p class="bottom-item-first">已募集份数/份</p>
              <p>{{detail.nowCount}}</p>
            </div>
          </div>
        </div>
        <div class="gray" v-if="detail.sellType === '4'"></div>
        <div class="info">
          <div class="tab">
            <span @click="tab = 1" :class="tab === 1 ? 'active' : ''">图文详情</span>
            <span @click="tab = 2" :class="tab === 2 ? 'active' : ''">树木参数</span>
            <span @click="tab = 3" :class="tab === 3 ? 'active' : ''">认养记录</span>
          </div>
          <div class="tab1" v-show='tab === 1'>
            <div class="description">
              <div class="description-title">
                <div class="description-detail rich-text-description" v-html="detailDescription" ref="description"></div>
              </div>
            </div>
          </div>
          <div class="tab2" v-show='tab === 2'>
            <div class="item">
              <span>【树木名称】</span><span>{{detail.name}}</span>
            </div>
            <div class="item">
              <span>【树木学名】</span><span>{{detail.scientificName}}</span>
            </div>
            <div class="item">
              <span>【树木级别】</span><span>{{detail.rank}}</span>
            </div>
            <div class="item">
              <span>【树木品种】</span><span>{{detail.variety}}</span>
            </div>
            <div class="item">
              <span>【所在市县】</span><span>{{detail.city}}{{detail.area}}</span>
            </div>
            <div class="item">
              <span>【乡镇街道】</span><span>{{detail.town}}</span>
            </div>
            <div class="item">
              <span>【树木产地】</span><span>{{detail.originPlace}}</span>
            </div>
            <!--<div class="item" v-show="detail.sellType === '3'">-->
              <!--<span>募集时间</span><span>{{formatDate(detail.raiseStartDatetime, 'yyyy-MM-dd')}}至{{formatDate(detail.raiseEndDatetime, 'yyyy-MM-dd')}}</span>-->
            <!--</div>-->
            <div class="item">
              <span>【认养时间】</span><span>{{formatDate(detail.productSpecsList[0].startDatetime, 'yyyy-MM-dd')}}至{{formatDate(detail.productSpecsList[0].endDatetime, 'yyyy-MM-dd')}}</span>
            </div>
            <div class="item" @click="goTreeList()">
              <span>【树木定位】</span>
              <img src="./more@2x.png" class="fr more">
            </div>
            <!--<div class="item" v-show="detail.sellType === '4'">-->
              <!--<span>已募集份数</span><span>{{detail.nowCount}}份/{{detail.raiseCount}}份</span>-->
            <!--</div>-->
            <!--<div class="item" @click="go(`/adopt-list?code=${code}&type=${detail.sellType}`)">-->
              <!--<span v-show="detail.sellType !== '3'">已认养名单</span>-->
              <!--<span v-show="detail.sellType === '3'">已捐赠名单</span>-->
              <!--<img src="./more@2x.png" alt="" class="fr more">-->
            <!--</div>-->
          </div>
          <div class="tab3" v-show='tab === 3'>
            <div class="item" v-for="(item, index) in adoptList " @click="goUserHome(item)" :key="index">
              <div class="userPhoto" :style="getImgSyl(item.user ? item.user.photo : '')"></div>
              <div class="info">
                <p class="name">{{item.user.nickname ? item.user.nickname : jiami(item.user.mobile)}}</p>
                <p class="date">{{formatDate(item.startDatetime, 'yyyy-MM-dd')}}</p>
              </div>
              <div class="amount">¥{{formatAmount(item.amount)}}</div>
              <!--<span class="price">¥{{formatAmount(item.amount)}} x{{item.userAdoptTreeCount}}</span>-->
            </div>
            <no-result v-show="!(adoptList && adoptList.length)" title="暂无认养" class="no-result-wrapper"></no-result>
          </div>
        </div>
      </Scroll>
    </div>
    <div class="footer">
      <button @click="go('/me')" class="footer-me">我的</button>
      <button class="footer-share" @click="shareBrowser">分享</button>
      <button @click="showPopUp" v-show="canAdopt()" class="footer-adopt">申请认养</button>
      <button class="footer-adopt" v-show="!canAdopt()" @click="goLogin()">{{noAdoptReason}}</button>
    </div>
    <div :class="['mask',flag ? 'show' : '']" @click="genghuan"></div>
    <div :class="['buypart',flag ? 'show' : '']">
      <div class="title">
        <div class="title-pic">
          <img :src="formatImg(detail.bannerPic)">
        </div>
        <div class="title-right">
          <p>{{detail.scientificName}}</p>
          <!--<i @click="genghuan">X</i>-->
          <img src="./close@2x.png" @click="genghuan" class="close">
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
        <div class="confirm" @click="showAuthConfirm">确定(总额：¥{{formatAmount(detail.productSpecsList[choosedIndex].price) * number}})</div>
      </div>
    </div>
    <toast ref="toast" :text="text"></toast>
    <full-loading v-show="loading"></full-loading>
    <confirm-sjd-auth ref="confirm" :title="authTitle" :content="authContent" confirmBtnText='前往认证' cancelBtnText="稍后再去" @confirm="authConfirm" @cancel="authCancel"></confirm-sjd-auth>
    <router-view></router-view>
  </div>
</template>
<script>
import Toast from 'base/toast/toast';
import Scroll from 'base/scroll/scroll';
import FullLoading from 'base/full-loading/full-loading';
import Slider from 'base/slider/slider';
import NoResult from 'base/no-result/no-result';
import BackOnly from 'components/back-only/back-only';
import ConfirmSjdAuth from 'base/confirm-sjd-auth/confirm-sjd-auth';
import { formatAmount, formatImg, formatDate, setTitle, getUserId } from 'common/js/util';
import { getCookie } from 'common/js/cookie';
import {initShare} from 'common/js/weixin';
import { getProductDetail, share, getAdoptList } from 'api/biz';
import { getUserDetail } from 'api/user';
import { getDictList, getConfig } from 'api/general';
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
      click: false,
      tab: 1,
      adoptList: [],
      authTitle: '完成操作，需进行实名认证',
      authContent: '',
      sellTypeObj: {}
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
    getWidth() {
      return (this.detail.nowCount / this.detail.raiseCount) * 100;
    },
    goLogin() {
      if(this.noAdoptReason === '您未登录') {
        this.go('/login');
      }
    },
    showAuthConfirm() {
      if(!this.userDetail.userExt.personAuthStatus && !this.userDetail.userExt.companyAuthStatus) {
        this.$refs.confirm.show();
      } else {
        this.confirm();
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
          this.noAdoptReason = ' 您不是此树的预约认养人';  // 您不属于该产品定向的等级
          return false;
        }
      }
      if(this.detail.directType && this.detail.directType === '2') {
        if(this.detail.raiseCount === this.detail.nowCount) {
          this.noAdoptReason = '已被认养';
          return false;
        }
        this.directFlag = false;
        this.detail.directObject.split(',').map((item) => {
          if(item === this.userId) {
            this.directFlag = true;
          }
        });
        if(!this.directFlag) {
          this.noAdoptReason = ' 您不是此树的预约认养人';  // 您不是该产品定向的用户
          return false;
        }
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
          this.go(`/protocol?sign=1&proCode=${proCode}&specsCode=${specsCode}&quantity=${quantity}&type=${type}&price=${formatAmount(this.detail.productSpecsList[this.choosedIndex].price) * this.number}&start=${this.detail.productSpecsList[this.choosedIndex].startDatetime}&end=${this.detail.productSpecsList[this.choosedIndex].endDatetime}`);
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
            this.go(`/protocol?sign=1&proCode${proCode}&specsCode=${specsCode}&quantity=${quantity}&identifyCode=${identifyCode}&type=${type}&price=${formatAmount(this.detail.productSpecsList[this.choosedIndex].price) * this.number}&start=${this.detail.productSpecsList[this.choosedIndex].startDatetime}&end=${this.detail.productSpecsList[this.choosedIndex].endDatetime}`);
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
    goUserHome(item) {
      if(getUserId()) {
        if(item.currentHolder === getUserId()) {
          // this.go(`/homepage`);
          this.go(`/my-tree?aTCode=${item.code}`);
        } else {
          // this.go(`/homepage?other=1&currentHolder=${item.currentHolder}`);
          this.go(`/my-tree?other=1&currentHolder=${item.currentHolder}&aTCode=${item.code}`);
        }
      } else {
        this.text = '您未登录';
        this.$refs.toast.show();
        setTimeout(() => {
          this.$router.push('/login');
        }, 1000);
      }
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
    authConfirm() {
      this.go('/auth');
    },
    authCancel() {
      this.go('/home');
    },
    getInitWXSDKConfig() {
      this.loading = true;
      initShare({
        title: this.detail.name,
        desc: '认养一棵树，寻一段树缘，寄一份情感',
        link: location.href.split('#')[0] + '/#/product-detail?code=' + this.code + '&userReferee=' + this.userDetail.mobile + '&type=U',
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
          share(this.channel, '认养产品').then((res) => {
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
    },
    shareBrowser() {},
    goBack() {
      this.$router.replace({path: '/home'});
    }
  },
  mounted() {
    setTitle('产品详情');
    this.userReferee = this.$route.query.userReferee;
    if (window.history && window.history.pushState) {
      console.log(1);
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', this.goBack, false);
    }
    if(this.userReferee && !getUserId()) {
      this.$router.push(`/register?code=${this.code}&userReferee=${this.userReferee}&type=U&back=1`);
    } else {
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
          }),
          getAdoptList({
            productCode: this.code,
            statusList: [2, 3, 4]
          }),
          getDictList('sell_type'),
          getConfig('REALNAME_NOTIFI')
        ]).then(([res1, res2, res3, res4, res5]) => {
          this.loading = false;
          this.detail = res1;
          this.detailDescription = res1.description;
          this.userDetail = res2;
          this.adoptList = res3;
          this.banners = this.detail.bannerPic.split('||');
          if(this.banners.length >= 2) {
            this.loop = true;
          }
          res4.map((item) => {
            this.sellTypeObj[item.dkey] = item.dvalue;
          });
          if(!this.isWxConfiging && !this.wxData) {
            this.getInitWXSDKConfig();
          }
          this.authContent = res5.cvalue;
        }).catch(() => { this.loading = false; });
      } else {
        Promise.all([
          getProductDetail({
            code: this.code
          }),
          getAdoptList({
            productCode: this.code,
            statusList: [1, 2, 3]
          })
        ]).then(([res1, res2]) => {
          this.loading = false;
          this.detail = res1;
          this.detailDescription = res1.description;
          this.adoptList = res2;
          this.banners = this.detail.bannerPic.split('||');
          if(this.banners.length >= 2) {
            this.loop = true;
          }
          if(!this.isWxConfiging && !this.wxData) {
            this.getInitWXSDKConfig();
          }
        }).catch(() => { this.loading = false; });
      }
    }
  },
  destroyed() {
    window.removeEventListener('popstate', this.goBack, false);
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
    BackOnly,
    Scroll,
    ConfirmSjdAuth
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
      height: 7.1rem;
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
    .title {
      padding: 0.3rem;
      p {
        font-size: 0.3rem;
        margin-bottom: 0.3rem;
        display: flex;
        align-items: center;
        .sell-type {
          background: $second-color;
          font-size: 0.22rem;
          color: $color-highlight-background;
          border-radius: 0.15rem;
          padding: 0.05rem 0.1rem;
          margin-right: 0.1rem;
        }
      }
      .title-second {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .price {
          font-size: 0.36rem;
          color: $second-color;
        }
        .place {
          color: $color-gray;
          font-size: 0.22rem;
        }
      }
    }
    .prograss-bar {
      padding: 0.3rem;
      .top {
        display: flex;
        align-items: center;
        margin-bottom: 0.3rem;
        text-align: center;
        .line {
          flex: 1;
          height: 0.1rem;
          background: rgb(238, 238, 238);
          border-radius: 0.05rem;
          border: 1px solid $second-color;
          .nowCount {
            background: $second-color;
            height: 100%;
          }
        }
        .percent {
          padding-left: 0.3rem;
          font-size: 0.3rem;
          color: rgb(51, 51, 51);
        }
      }
      .bottom {
        display: flex;
        align-items: center;
        .bottom-item {
          flex: 1;
          text-align: center;
          p {
            font-size: 0.3rem;
            color: rgb(51, 51, 51);
            font-weight: 500;
          }
          .bottom-item-first {
            font-size: 0.22rem;
            font-weight: 300;
            margin-bottom: 0.1rem;
          }
        }
      }
    }
    .info {
      background: $color-highlight-background;
      padding: 0 0.3rem;
      .tab {
        font-size: 0.26rem;
        height: 0.64rem;
        border-bottom: 1px solid $color-border;
        display: flex;
        align-items: center;
        justify-content: space-around;
        span {
          display: inline-block;
          color: $color-gray;
          line-height: 0.64rem;
          width: 30%;
          text-align: center;
        }
        .active {
          color: $second-color;
          border-bottom: 1px solid $second-color;
        }
      }
      .tab1 {
        .description {
          background: #fff;
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
      .tab2 {
        .item {
          width: 100%;
          /*height: 0.72rem;*/
          font-size: $font-size-medium-x;
          line-height: 0.72rem;
          border-bottom: 1px solid #eee;
          display: flex;
          align-items: center;
          span:first-child {
            /*margin-right: 0.3rem;*/
            width: 30%;
            /*display: inline-block;*/
          }
          span:last-child {
            flex: 1;
          }
          img {
            height: 0.21rem;
          }
          &:last-child{
            border-bottom: none;
            justify-content: space-between;
          }
        }
      }
      .tab3 {
        .item {
          width: 100%;
          font-size: $font-size-medium-x;
          border-bottom: 1px solid #eee;
          padding: 0.18rem 0;
          display: flex;
          align-items: center;
          .userPhoto {
            width: 0.6rem;
            height: 0.5rem;
            margin-right: 0.1rem;
          }
          .info {
            display: inline-block;
            font-size: 0;
            flex: 1;
            padding: 0;
            .name {
              font-size: 0.22rem;
              margin-bottom: 0.1rem;
              font-weight: 500;
            }
            .date {
              font-size: 0.18rem;
              color: #999;
            }
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
    display: flex;
    justify-content: space-between;
    background: $color-highlight-background;
    border-top: 1px solid $color-border;
    /*align-items: center;*/
    button {
      color: $color-highlight-background;
      font-size: 0.32rem;
    }
    .footer-me {
      width: 25%;
      background: $color-highlight-background;
      color: #202020;
    }
    .footer-share {
      width: 25%;
      background: $primary-color;
    }
    .footer-adopt {
      width: 50%;
      background: $second-color;
    }
    /*.disabled {*/
      /*background: #969998;*/
    /*}*/
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
        .close {
          width: 0.34rem;
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
