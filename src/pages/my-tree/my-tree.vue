<template>
  <div class="home-wrapper">
    <m-header class="cate-header" :title="title"></m-header>
    <div class="content">
      <Scroll :pullUpLoad="pullUpLoad">
      <div class="tree-panel">
        <div class="cover" v-show="cover"></div>
        <div class="juanzeng" v-show="juanzengShow">
          <span>+{{presentTppQuantity}}g</span>
          <img src="./heart@2x.png">
        </div>
        <div class="tree-panel-danmu" v-show="danmuShow">
          <img src="./head.png" class="head">
          <div class="info">
            <span class="name">hhh</span>
            <span class="context">{{emojiText}}</span>
          </div>
          <img :src="emoji" class="emoji">
        </div>
        <div class="carbon-bubbles">
          <div class="bubble-item" v-for="item in tppList" @click="doCollectionTpp(item)">
            <div class="bubble" :class="'status' + item.status">
              <img src="./bubble-light@2x.png">
              <span>{{formatAmount(item.quantity, 1)}}g</span>
            </div>
          </div>
        </div>
        <!-- 证书 -->
        <div class="certification" @click="certification" v-show="!other">
          <img src="./certification@2x.png" class="certification">
          <span>x5</span>
        </div>
        <!-- 礼物 -->
        <div class="me" @click="go('/gift')">
          <img src="./head.png">
          <span>礼物</span>
        </div>
        <div class="icons">
          <img src="./map@2x.png">
          <img src="./prop@2x.png" @click="props" v-show="!other">
          <img src="./strategy@2x.png" @click="go('/strategy')" v-show="!other">
          <img src="./give@2x.png" @click="goSurprise" v-show="!other">
        </div>
        <div class="icons-other" v-show="other">
          <img src="./danmu@2x.png" @click="danmu" >
          <img src="./juanzeng@2x.png" @click="juanzeng">
        </div>
        <img src="./romantic-story@2x.png" class="romantic-story" v-show="!other" @click="go('/emotion-channel')">
      </div>
      <!-- 能量比拼 -->
      <div class="battle" v-if="other === '1'" v-show="other === '1'">
        <div class="battle-bg">
          <div class="battle-item" :class="comparisonData.toUserIsWin ? 'win' : ''">
            <div class="battle-item-head">
              <div class="userPhoto" :style="getImgSyl(comparisonData.toUserInfo.photo)"></div>
              <img src="./crown@2x.png" class="crown">
            </div>
            <div>
              <p class="info">TA收取你</p>
              <p class="number">{{formatAmount(comparisonData.toUserWeekQuantity)}}g</p>
            </div>
          </div>
          <span class="vs">VS</span>
          <div class="battle-item" :class="comparisonData.userIsWin ? 'win' : ''">
            <div>
              <p class="info">你收取TA</p>
              <p class="number">{{formatAmount(comparisonData.userWeekQuantity)}}g</p>
            </div>
            <div class="battle-item-head">
              <div class="userPhoto" :style="getImgSyl(comparisonData.userInfo.photo)"></div>
              <img src="./crown@2x.png" class="crown">
            </div>
          </div>
        </div>
      </div>
      <!-- 用户 -->
      <div class="tab" v-show="!other">
        <span :class="tab === 0 ? 'active' : ''" @click="changeTab(0)">最新动态</span>
        <!--<span :class="tab === 1 ? 'active' : ''" @click="changeTab(1)">认养人介绍</span>-->
        <span :class="tab === 2 ? 'active' : ''" @click="changeTab(2)">古树详情</span>
      </div>
      <!-- 用户 - 最新动态/认养人/古树详情 -->
      <div class="tab-panel" v-show="!other">
        <!-- 最新动态 -->
        <div class="dynamic" v-show="tab === 0">
          <!-- 访客 -->
          <div class="heads">
            <div class="head-item">
              <img src="./head.png">
              <!--<span class="number">10g</span>-->
            </div>
          </div>
          <!-- 动态 -->
          <div class="dynamic-info">
            <div class="dynamic-info-item" v-for="item in dynamicsList">
              <!-- type  类型 biz_log_type:（1赠送碳泡泡/2留言/3收取碳泡泡） -->
              <p v-if="item.type === '1'">
                <span class="name">{{item.userInfo.nickname && item.userId != getUserId() ? item.userInfo.nickname : ''}}</span>
                <span class="activity">赠送{{formatAmount(item.quantity)}}g</span><span class="time">{{formatDate(item.createDatetime, 'hh:mm')}}</span>
              </p>
              <p v-if="item.type === '2'">
                <span class="name">{{item.userInfo.nickname && item.userId != getUserId() ? item.userInfo.nickname : ''}}</span>
                <span class="activity">留言</span><span class="time">{{formatDate(item.createDatetime, 'hh:mm')}}</span>
              </p>
              <p v-if="item.type === '3'">
                <span class="name">{{item.userInfo.nickname && item.userId != getUserId() ? item.userInfo.nickname : ''}}</span>
                <span class="activity">收取{{formatAmount(item.quantity)}}g</span><span class="time">{{formatDate(item.createDatetime, 'hh:mm')}}</span>
              </p>
            </div>
            <no-result v-show="!(dynamicsList && dynamicsList.length)" title="暂无动态" class="no-result-wrapper"></no-result>
          </div>
        </div>
        <!-- 认养人介绍 -->
        <!--<div class="adopter-introduction" v-html="adopterIntroduction" v-show="tab === 1"></div>-->
        <!-- 古树详情 -->
        <div class="tree-detail" v-show="tab === 2">
          <!--<div class="item">-->
            <!--<span>古树昵称</span><span>樟子松鼠</span>-->
          <!--</div>-->
          <div class="item">
            <span>古树学名</span><span>{{treeDetail.tree ? treeDetail.tree.scientificName : ''}}</span>
          </div>
          <div class="item">
            <span>古树编码</span><span>{{treeDetail.treeNumber}}</span>
          </div>
          <div class="item">
            <span>古树品种</span><span>{{treeDetail.tree ? treeDetail.tree.variety : ''}}</span>
          </div>
          <div class="item">
            <span>养护单位</span><span>28020065389</span>
          </div>
          <div class="item">
            <span>养护人</span><span>庭园观赏及绿化树种</span>
          </div>
          <!--<div class="item">-->
            <!--<span>当前认养人</span><span>三级</span>-->
          <!--</div>-->
          <div class="item" @click="go('/invitation')">
            <span>历史认养人</span>
            <img src="./more@2x.png" class="fr more">
          </div>
          <div class="item" @click="go('/maintain-records')">
            <span>养护记录</span>
            <img src="./more@2x.png" class="fr more">
          </div>
        </div>
      </div>
      <div class="gray" v-show="other"></div>
      <!-- TA的动态 -->
      <div class="dynamic-other" v-show="other">
        <div class="dynamic-title">
          <div class="border"></div>
          <span>TA的动态</span>
        </div>
        <div class="daily">
          <div class="daily-content">
            <div class="daily-content-item" v-for="item in dynamicsList">
              <div v-show="isShowDate(item)">
                <div class="daily-title" >{{formatDynamicsDate(item)}}</div>
                <div class="border"></div>
              </div>
              <!-- type  类型 biz_log_type:（1赠送碳泡泡/2留言/3收取碳泡泡） -->
              <div class="daily-content-item-info" v-if="item.type === '1'">
                <img src="./steal@2x.png" alt="">
                <p class="activity"><span>{{other === '1' ? 'TA的好友' : item.userInfo.nickname ? item.userInfo.nickname : ''}}</span>赠送{{formatAmount(Number(item.quantity))}}g</p>
                <p class="time">{{formatDate(item.createDatetime, 'hh:mm')}}</p>
              </div>
              <div class="daily-content-item-info" v-if="item.type === '2'">
                <img src="./steal@2x.png" alt="">
                <p class="activity"><span>{{other === '1' ? 'TA的好友' : item.userInfo.nickname ? item.userInfo.nickname : ''}}</span>留言{{formatAmount(Number(item.quantity))}}g</p>
                <p class="time">{{formatDate(item.createDatetime, 'hh:mm')}}</p>
              </div>
              <div class="daily-content-item-info" v-if="item.type === '3'">
                <img src="./steal@2x.png" alt="">
                <p class="activity"><span>{{other === '1' ? 'TA的好友' : item.userInfo.nickname ? item.userInfo.nickname : ''}}</span>收取{{formatAmount(Number(item.quantity))}}g</p>
                <p class="time">{{formatDate(item.createDatetime, 'hh:mm')}}</p>
              </div>
              <div class="border"></div>
            </div>
          </div>
          <no-result v-show="!(dynamicsList && dynamicsList.length)" title="暂无动态" class="no-result-wrapper"></no-result>
        </div>
      </div>
      </Scroll>
    </div>
    <!-- 道具 -->
    <div :class="['mask',flag ? 'show' : '']" @click="change"></div>
    <div :class="['props',flag && propFlag ? 'show' : '']">
      <div class="title">
        <span @click="changeProps(0)" :class="propsData.type === 0 ? 'active' : ''">保护罩</span>
        <span @click="changeProps(1)" :class="propsData.type === 1 ? 'active' : ''">一键收取</span>
        <img src="./close@2x.png" @click="close('propFlag')">
      </div>
      <div class="content">
        <div class="content-prop">
          <prop-scroll :currentIndex="propCurrentIndex"
                       :dataList="propsList"
                       ref="propScroll"
                       @select="selectProp"
                       @buy="showBuy"
                      ></prop-scroll>

          <!--<div class="wrap" ref="propWrap">-->
            <!--<div class="prop-item" ref="propItem">-->
              <!--<div class="prop-item-title">保护罩</div>-->
              <!--<div class="prop-item-condition">每天限量50万</div>-->
              <!--<div class="prop-item-img">-->
                <!--<img src="./cover-small@2x.png">-->
                <!--<span>2天</span>-->
              <!--</div>-->
              <!--<div class="prop-item-score enable" @click="convert">200积分</div>-->
            <!--</div>-->
            <!--<div class="prop-item">-->
              <!--<div class="prop-item-title">钻石保护罩</div>-->
              <!--<div class="prop-item-condition">钻石会员尊享</div>-->
              <!--<div class="prop-item-img">-->
                <!--<img src="./cover-small@2x.png">-->
                <!--<span>3天</span>-->
              <!--</div>-->
              <!--<div class="prop-item-score">200积分</div>-->
            <!--</div>-->
          <!--</div>-->
        </div>
        <div class="score">
          <span>我的积分：3455 </span><img src="./more@2x.png">
        </div>
      </div>
    </div>
    <div :class="['danmu',flag && danmuFlag ? 'show' : '']">
      <div class="title">
        <img src="./close@2x.png" @click="close('propFlag')">
      </div>
      <div class="content">
        <div class="prop-item" @click="showDanmu(1)">
          <span>感谢帮我收能量</span>
          <img src="./1@2x.png">
        </div>
        <div class="prop-item" @click="showDanmu(2)">
          <span>给你点个赞</span>
          <img src="./7@2x.png">
        </div>
        <div class="prop-item" @click="showDanmu(3)">
          <span>我控制不住我自己啊~</span>
          <img src="./2@2x.png">
        </div>
        <div class="prop-item" @click="showDanmu(4)">
          <span>勤快的宝宝有能量~</span>
          <img src="./3@2x.png">
        </div>
        <div class="prop-item" @click="showDanmu(5)">
          <span>我对你已绝望</span>
          <img src="./4@2x.png">
        </div>
        <div class="prop-item" @click="showDanmu(6)">
          <span>你行行好，别把我的能量全收走，可以吗~</span>
          <img src="./5@2x.png">
        </div>
        <div class="prop-item" @click="showDanmu(7)">
          <span>你怎么每天这么勤快呢</span>
          <img src="./6@2x.png">
        </div>
      </div>
    </div>
    <convert v-show="convertFlag" :propsDetail="propsData.buyItem" @close="close('convertFlag')" @convertSuccess="convertSuccess"></convert>
    <convert-success v-show="convertSuccessFlag" :propsDetail="propsData.buyItem" @close="close('convertSuccessFlag')" @convertSuccess="convertSuccess"></convert-success>
    <certification v-show="certificationFlag" @close="close('certificationFlag')" @convertSuccess="convertSuccess"></certification>
    <juanzeng v-show="juanzengFlag" @close="close('juanzengFlag')" @juanzengSuccess="juanzengSuccess" :quantity="String(presentTppQuantity)"></juanzeng>
    <toast ref="toast" :text="text"></toast>
    <router-view></router-view>
  </div>
</template>
<script>
import Toast from 'base/toast/toast';
import Scroll from 'base/scroll/scroll';
import PropScroll from 'base/prop-scroll/prop-scroll';
import FullLoading from 'base/full-loading/full-loading';
import Slider from 'base/slider/slider';
import NoResult from 'base/no-result/no-result';
import Convert from 'base/convert/convert';
import ConvertSuccess from 'base/convert-success/convert-success';
import Certification from 'base/certification/certification';
import Juanzeng from 'base/juanzeng/juanzeng';
import MHeader from 'components/m-header/m-header';
import { getComparison, getPageTpp, collectionTpp, GiveTpp, getPageJournal, getUserTreeDetail,
        getListProps, buyProps } from 'api/biz';
import { getSystemConfigCkey } from 'api/general';
import {formatAmount, formatDate, formatImg, getUserId} from 'common/js/util';
import defaltAvatarImg from './avatar@2x.png';

export default {
  data() {
    return {
      title: '我的树',
      loading: true,
      toastText: '',
      hasMore: false,
      text: '',
      pullUpLoad: null,
      flag: false,
      propFlag: false,
      danmuFlag: false,
      convertFlag: false,
      convertSuccessFlag: false,
      certificationFlag: false,
      juanzengFlag: false,
      juanzengShow: false,
      danmuShow: false,
      cover: false,
      tab: 0,
      propIdx: 0,
      adopterIntroduction: '<table><tbody><tr><td width="240px" height="240px"><img id="qrimage" src="//qr.api.cli.im/qr?data=http%253A%252F%252F192.168.1.162%253A8033%252F%2523%252Fregister&amp;level=H&amp;transparent=false&amp;bgcolor=%23ffffff&amp;forecolor=%23000000&amp;blockpixel=12&amp;marginblock=1&amp;logourl=&amp;size=260&amp;kid=cliim&amp;key=9ee0765087ace26c717af8d86bd50a6e"></td></tr></tbody></table>',
      emoji: '',
      emojiText: '',
      emojiArr: [{
        src: require('./1@2x.png'),
        text: '感谢帮我收能量'
      }, {
        src: require('./7@2x.png'),
        text: '给你点个赞'
      }, {
        src: require('./2@2x.png'),
        text: '我控制不住我自己啊~'
      }, {
        src: require('./3@2x.png'),
        text: '勤快的宝宝有能量~'
      }, {
        src: require('./4@2x.png'),
        text: '我对你已绝望'
      }, {
        src: require('./5@2x.png'),
        text: '你行行好，别把我的能量全收走，可以吗~'
      }, {
        src: require('./6@2x.png'),
        text: '你怎么每天这么勤快呢'
      }],
      other: 0,
      comparisonData: {}, // 能量比拼
      presentTppQuantity: 0, // PRESENT_TPP_QUANTITY 赠送碳泡泡的数量
      adoptTreeCode: '', // 认养权编号
      tppList: {}, // 碳泡泡
      dynamics: {
        start: 1,
        limit: 20,
        hasMore: true
      }, // 动态
      dynamicsList: [], // 动态数据
      treeDetail: {}, // 树详情
      propsData: {
        type: 0,
        buyItem: {} // 购买道具编号
      }, // 道具配置
      propCurrentIndex: 0, // 道具配置
      propsList: [] // 道具数据
    };
  },
  created() {
    this.other = this.$route.query.other || 0;  // 是否别人的主页
    this.currentHolder = this.$route.query.currentHolder || '';
    if(this.other) {
      this.title = 'TA的树';
      this.borderTitle = 'TA的动态';
    }
    this.getInitData();
  },
  methods: {
    getInitData() {
      this.adoptTreeCode = this.$route.query.aTCode; // 认养权编号
      Promise.all([
        this.getTppList({
          adoptTreeCode: this.adoptTreeCode
        }),
        this.getPresentTppQuantity(),
        this.getDynamicsList(),
        this.getTreeDetail(),
        this.getPropList()
      ]).then(() => {
        this.loading = false;
      }).catch(() => { this.loading = false; });

      // 不是当前用户
      if (this.other === '1') {
        Promise.all([
          this.getComparisonData(this.currentHolder)
        ]).then(() => {
          this.loading = false;
        }).catch(() => { this.loading = false; });
      }
    },
    // 查询道具列表
    getPropList() {
      getListProps({
        type: this.propsData.type
      }).then((data) => {
        this.propsList = data;
        this.loading = false;
        setTimeout(() => {
          this.$refs.propScroll.scroll.refresh();
        }, 10);
      }).catch(() => { this.loading = false; });
    },
    // 查询树详情
    getTreeDetail() {
      return getUserTreeDetail(this.adoptTreeCode).then((data) => {
        this.treeDetail = data;
      }, () => {});
    },
    // 分页查询动态
    getDynamicsList() {
      getPageJournal({
        start: this.dynamics.start,
        adoptUserId: this.currentHolder,
        adoptTreeCode: this.adoptTreeCode
      }).then((data) => {
        if (data.list.length < this.dynamics.limit || data.totalCount <= this.dynamics.limit) {
          this.dynamics.hasMore = false;
        }
        this.dynamics.start++;
        this.dynamicsList = this.dynamicsList.concat(data.list);
      }, () => {});
    },
    // 获取碳泡泡
    getTppList(params) {
      return getPageTpp(params).then((res) => {
        this.tppList = res.list;
      }, () => {});
    },
    // 赠送碳泡泡
    doGiveTpp() {
      this.loading = true;
      return GiveTpp({
        toUserId: this.currentHolder
      }).then(() => {}, () => { this.loading = false; });
    },
    // 收取碳泡泡
    doCollectionTpp(item) {
      if (item.status === '0') {
        this.loading = true;
        collectionTpp({
          code: item.code,
          userId: this.currentHolder
        }).then(() => {
          this.getTppList();
        }, () => { this.loading = false; });
      } else {
        return;
      }
    },
    // 获取赠送碳泡泡数量
    getPresentTppQuantity() {
      return getSystemConfigCkey('PRESENT_TPP_QUANTITY').then((data) => {
        this.presentTppQuantity = data.cvalue;
      }, () => {});
    },
    // 本周能量比拼
    getComparisonData(toUserId) {
      return getComparison(toUserId).then((data) => {
        data.toUserIsWin = false; // 好友赢
        data.userIsWin = false; // 自己赢
        if (data.toUserWeekQuantity > data.userWeekQuantity) {
          data.toUserIsWin = true;
        } else if (data.toUserWeekQuantity < data.userWeekQuantity) {
          data.userIsWin = true;
        }
        this.comparisonData = data;
      }, () => {});
    },
    // 动态 是否显示日期
    isShowDate(item) {
      let creadDate = formatDate(item.createDatetime, 'MM-dd');
      if (creadDate === this.dynamics.tmplDate) {
        return false;
      } else {
        this.dynamics.tmplDate = creadDate;
        return true;
      }
    },
    // 动态 格式化显示日期
    formatDynamicsDate(item) {
      let creadDate = formatDate(item.createDatetime, 'MM-dd');
      let nowDate = formatDate(new Date(), 'MM-dd');
      if(creadDate === nowDate) {
        creadDate = '今日';
      }
      return creadDate;
    },
    formatAmount(amount, len) {
      return formatAmount(amount, len);
    },
    formatDate(date, format) {
      return formatDate(date, format);
    },
    getImgSyl(imgs) {
      let img = imgs ? formatImg(imgs) : defaltAvatarImg;
      return {
        backgroundImage: `url(${img})`
      };
    },
    go(url) {
      this.$router.push(url);
    },
    goSurprise() {
      this.go(`/surprise?aTCode=${this.adoptTreeCode}`);
    },
    getUserId() {
      return getUserId();
    },
    showPopUp() {
      this.flag = true;
    },
    change() {
      this.flag = !this.flag;
    },
    changeTab(index) {
      this.tab = index;
    },
    changeProps(index) {
      this.propsData.type = index;
      this.getPropList();
    },
    props() {
      this.flag = true;
      this.propFlag = true;
      setTimeout(() => {
        this.$refs.propScroll.scroll.refresh();
      }, 20);
    },
    danmu() {
      this.flag = true;
      this.danmuFlag = true;
    },
    showBuy(item) {
      this.convertFlag = true;
      this.propsData.buyItem = item;
    },
    close(closeWho) {
      this.flag = false;
      if(closeWho === 'propFlag') {
        this.propFlag = false;
      }
      if(closeWho === 'convertFlag') {
        this.convertFlag = false;
      }
      if(closeWho === 'convertSuccessFlag') {
        this.convertSuccessFlag = false;
      }
      if(closeWho === 'certificationFlag') {
        this.certificationFlag = false;
      }
      if(closeWho === 'juanzengFlag') {
        this.juanzengFlag = false;
      }
      if(closeWho === 'danmuFlag') {
        this.danmuFlag = false;
      }
    },
    convertSuccess(code) {
      this.convertSuccessFlag = true;
      this.loading = true;
      buyProps(code).then(() => {
        this.close('convertFlag');
        this.convertSuccessFlag = true;
      }).catch(() => { this.loading = false; });
    },
    juanzengSuccess() {
      this.doGiveTpp().then(() => {
        this.close('juanzengFlag');
        this.juanzengShow = true;
        setTimeout(() => {
          this.juanzengShow = false;
        }, 1000);
      }, () => {});
    },
    certification() {
      this.certificationFlag = true;
    },
    juanzeng() {
      this.juanzengFlag = true;
    },
    showDanmu(index) {
      this.close('danmuFlag');
      this.emoji = this.emojiArr[index - 1].src;
      this.emojiText = this.emojiArr[index - 1].text;
      this.danmuShow = true;
      setTimeout(() => {
        this.danmuShow = false;
      }, 1000);
    },
    selectProp(index) {
      this.currentIndex = index;
    }
  },
  components: {
    FullLoading,
    Toast,
    Slider,
    NoResult,
    MHeader,
    Scroll,
    PropScroll,
    Convert,
    ConvertSuccess,
    Certification,
    Juanzeng
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
  .content {
    /*margin: 0.88rem 0;*/
    position: absolute;
    top: 0.88rem;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    .tree-panel {
      height: 7.66rem;
      background: url("./tree-bg@2x.png") no-repeat;
      background-size: 100% 100%;
      padding: 0.58rem 0.3rem 0.25rem;
      position: relative;
      .cover {
        width: 6.93rem;
        height: 6.93rem;
        background: url("./cover-big@2x.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
      }
      .juanzeng {
        position: absolute;
        bottom: 2.16rem;
        right: 0.66rem;
        display: flex;
        flex-direction: column;
        text-align: center;
        span {
          font-size: $font-size-small;
          line-height: 0.33rem;
          color: #F04F30;
          margin-bottom: 0.26rem;
        }
        img {
          width: 0.9rem;
          height: 0.8rem;
        }
      }
      .tree-panel-danmu {
        border: 1px solid $color-border;
        border-radius: 0.55rem;
        align-items: center;
        font-size: 0;
        position: absolute;
        bottom: 1.16rem;
        right: 0.66rem;
        background: $color-highlight-background;
        display: flex;
        .info {
          display: flex;
          flex-direction: column;
          .name {
            color: #999;
            font-size: $font-size-small;
            margin-bottom: 0.08rem;
          }
          .context {
            font-size: $font-size-medium;
            display: inline-block;
            vertical-align: text-bottom;
          }
        }
        .head {
          width: 0.6rem;
          height: 0.6rem;
          border: 1px solid $primary-color;
          border-radius: 50%;
        }
        .emoji {
          width: 0.8rem;
          height: 0.8rem;
        }
      }
      .carbon-bubbles {
        position: absolute;
        top: 2.4rem;
        display: flex;
        align-items: center;
        left: 50%;
        transform: translateX(-50%);

        .bubble-item {
          margin-right: 0.2rem;

          .bubble {
            position: relative;
            img {
              width: 0.88rem;
              height: 1rem;
            }
            span {
              font-size: $font-size-medium-s;
              line-height: 0.41rem;
              color: $primary-color;
              position: absolute;
              top: 0.38rem;
              left: 50%;
              transform: translateX(-50%);
              font-family: 'AvenirNextCondensed-Bold';
            }

            &.status1{
              opacity: 0.6;
            }
          }
          &:nth-of-type(1) .bubble{
            top: -0.6rem;
            right: 0.3rem;
          }
          &:nth-of-type(2) .bubble{
            top: -0.1rem;
          }
          &:nth-of-type(3) .bubble{
            top: -1.6rem;
            left: 0.2rem;
          }
          &:nth-of-type(4) .bubble{
            right: 0.2rem;
          }
          &:nth-of-type(5) .bubble{
            top: 0.5rem;
            left: 0.3rem;
          }
        }
      }
      .certification {
        width: 0.92rem;
        height: 0.82rem;
        position: relative;
        span {
          font-size: 0.16rem;
          transform: scale(0.8);
          color: #23AD8C;
          position: absolute;
          right: 0.1rem;
          top: 0.05rem;
        }
      }
      .me {
        width: 1.5rem;
        height: 0.78rem;
        background: #fff;
        display: inline-block;
        border-top-left-radius: 0.5rem;
        border-bottom-left-radius: 0.5rem;
        opacity: 0.8;
        position: absolute;
        right: 0;
        top: 0.58rem;
        font-size: 0;
        img {
          width: 0.6rem;
          height: 0.6rem;
          border-radius: 50%;
          border: 1px solid $primary-color;
          position: absolute;
          top: 0.1rem;
          left: 0.1rem;
        }
        span {
          font-size: 0.3rem;
          color: #23AD8C;
          line-height: 0.78rem;
          position: absolute;
          right: 0.1rem;
        }
      }
      .icons {
        width: 4.1rem;
        display: flex;
        justify-content: space-between;
        position: absolute;
        bottom: 0.28rem;
        img {
          width: 0.72rem;
          height: 0.76rem;
        }
      }
      .icons-other {
        width: 1.84rem;
        display: flex;
        justify-content: space-between;
        position: absolute;
        bottom: 0.28rem;
        right: 0.3rem;
        img {
          width: 0.72rem;
          height: 0.76rem;
        }
      }
      .romantic-story {
        width: 1.16rem;
        height: 0.93rem;
        position: absolute;
        bottom: 0.28rem;
        right: 0.3rem
      }
    }
    .battle {
      height: 2.8rem;
      background: $color-highlight-background;
      padding: 0.3rem;
      .battle-bg {
        height: 100%;
        background: url("./battle@2x.png") no-repeat;
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.48rem 0.4rem 0;
        .battle-item {
          display: flex;
          color: #ccc;

          .battle-item-head {
            position: relative;
            .userPhoto {
              width: 0.8rem;
              height: 0.8rem;
              margin: 0 0.2rem;
              border: none;
            }
            .crown {
              width: 0.44rem;
              height: 0.43rem;
              position: absolute;
              top: -0.2rem;
              left: 0;
              display: none;
            }
          }
          .info {
            font-size: $font-size-small;
            line-height: $font-size-small;
            margin-bottom: 0.2rem;
            padding: 0;
          }
          .number {
            font-family: 'PingFangSC-Semibold';
            font-size: $font-size-large;
            line-height: $font-size-large;
          }
          &.win {
            .battle-item-head {
              .userPhoto {
                border: 2px solid #f7c54b;
              }
              .crown {
                display: block;
              }
            }
          }
        }
        .vs {
          color: $primary-color;
          font-size: 0.76rem;
        }
      }
    }
    .tab {
      height: 0.9rem;
      padding: 0 0.6rem;
      display: flex;
      /*justify-content: space-between;*/
      background: $color-highlight-background;
      border-bottom: 1px solid $color-border;

      span {
        font-size: 0.3rem;
        line-height: 0.9rem;
        margin-right: 0.9rem;
      }
      .active {
        color: $primary-color;
        border-bottom: 1px solid $primary-color;
      }
    }
    .tab-panel {
      background: $color-highlight-background;
      padding: 0.3rem 0.3rem 0 0.3rem;
      .dynamic {
        .heads {
          display: flex;
          justify-content: space-between;
          .head-item {
            display: inline;
            position: relative;
            img {
              width: 0.8rem;
              height: 0.8rem;
              border-radius: 50%;
            }
            .number {
              display: inline-block;
              width: 0.36rem;
              height: 0.36rem;
              line-height: 0.36rem;
              color: $color-highlight-background;
              background: $primary-color;
              border-radius: 50%;
              font-size: 0.03rem;
              letter-spacing: -0.89px;
              position: absolute;
              right: -0.1rem;
              bottom: 0.15rem;
              border: 2px solid #fff;
              box-sizing: content-box;
            }
          }
        }
        .dynamic-info {
          border-bottom: 1px solid $color-border;
          .dynamic-info-item {
            font-size: $font-size-medium;
            padding: 0.2rem 0;
            p {
              display: flex;
              align-items: center;
              .name {
                font-family: PingFangSC-Medium;
                margin-right: 0.2rem;
              }
              .activity {
                flex: 1;
              }
              .time {
                font-size: $font-size-small;
                color: #999;
              }
            }
          }
        }
        .more {
          height: 0.8rem;
          color: #666;
          font-size: $font-size-medium-s;
          line-height: 0.8rem;
          text-align: center;
        }
      }
      .adopter-introduction {
        /*margin: 0.88rem 0;*/
        padding: 0.6rem 0;
      }
      .tree-detail {
        background: $color-highlight-background;
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
        }
      }
    }
    .dynamic-other {
      background: #fff;
      padding: 0.3rem;
      .dynamic-title {
        font-size: 0;
        margin-bottom: 0.54rem;
        .border {
          border: 2px solid $primary-color;
          height: 0.26rem;
          width: 0;
          display: inline-block;
          margin-right: 0.08rem;
        }
        span {
          font-size: $font-size-large-ss;
          line-height: 0.42rem;
        }
      }
      .daily {
        .daily-title {
          font-size: $font-size-large-ss;
          line-height: $font-size-large-s;
          font-family: PingFangSC-Semibold;
          margin-bottom: 0.32rem;
        }
        .daily-content {
          .daily-content-item {
            .daily-content-item-info {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-left: 0.2rem;
              img {
                width: 0.36rem;
                margin-right: 0.24rem;
              }
              .activity {
                font-size: $font-size-medium;
                flex: 1;
                span {
                  font-family: PingFangSC-Semibold;
                  margin-right: 0.2rem;
                }
              }
              .time {
                font-size: $font-size-small;
                line-height: 0.33rem;
                color: #999;
              }
            }
            .daily-content-item-message {
              display: flex;
              justify-content: space-between;
              .message-border {
                border: 1px solid #eee;
                border-radius: 0.5rem;
                display: flex;
                align-items: center;
                .head {
                  width: 0.64rem;
                  height: 0.64rem;
                  border-radius: 50%;
                  margin-left: 0.08rem;
                }
                .name {
                  color: #999;
                  font-size: 0.22rem;
                }
                .activity {
                  font-size: 0.28rem;
                }
                .cover {
                  width: 0.84rem;
                  height: 0.84rem;
                }
              }
              .time {
                font-size: $font-size-small;
                line-height: 0.33rem;
                color: #999;
              }
            }
            .border {
              width: 0;
              border-right: 1px solid #eee;
              height: 0.5rem;
              margin-left: 0.35rem;
            }
          }
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
        span:first-child {
          margin-right: 0.3rem;
        }
        img {
          height: 0.21rem;
          margin-top: 0.4rem;
        }
      }
    }
    .gray {
      width: 100%;
      height: 0.2rem;
      padding: 0;
      background: #f5f5f5;
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
      width: 3.2rem;
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
  .props {
    width: 100%;
    height: 6.5rem;
    position: fixed;
    bottom: 0;
    background-color: #fff;
    display: none;
    /*padding: 0 0.3rem;*/
    .title {
      color: #666;
      font-size: $font-size-medium-x;
      line-height: 1rem;
      height: 1rem;
      padding: 0 1.95rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid $color-border;
      img {
        width: 0.46rem;
        height: 0.46rem;
        position: absolute;
        right: 0.3rem;
      }
    }
    .content {
      top: 1rem;

      .content-prop {
        padding: 0.4rem;
        height: 4.88rem;
        /*overflow-x: auto;
        overflow-y: hidden;
        .wrap{
          height: 4.08rem;
        }
        .prop-item {
          float: left;
          width: 2.74rem;
          height: 4.08rem;
          border: 1px solid #e5e5e5;
          border-radius: 0.15rem;
          padding: 0.3rem;
          text-align: center;
          .prop-item-title {
            font-size: $font-size-medium;
            line-height: 0.4rem;
            margin-bottom: 0.08rem;
          }
          .prop-item-condition {
            color: #FFA40F;
            border: 1px solid #FFA40F;
            border-radius: 1rem;
            font-size: $font-size-small;
            line-height: 0.33rem;
            margin-bottom: 0.25rem;
          }
          .prop-item-img {
            position: relative;
            margin-bottom: 0.25rem;
            img {
              width: 1.37rem;
              height: 1.37rem;
            }
            span {
              color: #438A0F;
              font-size: $font-size-small;
              line-height: 0.33rem;
              position: absolute;
              bottom: 0.15rem;
              left: 0.85rem;
            }
          }
          .prop-item-score {
            height: 0.64rem;
            background: #ccc;
            color: $color-highlight-background;
            font-size: $font-size-medium-x;
            line-height: 0.64rem;
            border-radius: 0.05rem;
          }
          .enable {
            background: $primary-color;
          }
        }*/
      }
      /* .content-prop {
        padding: 0.4rem 0.74rem;
        display: flex;
        justify-content: space-between;
        .prop-item {
          width: 2.74rem;
          height: 4.08rem;
          border: 1px solid #e5e5e5;
          border-radius: 0.15rem;
          padding: 0.3rem;
          text-align: center;
          .prop-item-title {
            font-size: $font-size-medium;
            line-height: 0.4rem;
            margin-bottom: 0.08rem;
          }
          .prop-item-condition {
            color: #FFA40F;
            border: 1px solid #FFA40F;
            border-radius: 1rem;
            font-size: $font-size-small;
            line-height: 0.33rem;
            margin-bottom: 0.25rem;
          }
          .prop-item-img {
            position: relative;
            margin-bottom: 0.25rem;
            img {
              width: 1.37rem;
              height: 1.37rem;
            }
            span {
              color: #438A0F;
              font-size: $font-size-small;
              line-height: 0.33rem;
              position: absolute;
              bottom: 0.15rem;
              left: 0.85rem;
            }
          }
          .prop-item-score {
            height: 0.64rem;
            background: #ccc;
            color: $color-highlight-background;
            font-size: $font-size-medium-x;
            line-height: 0.64rem;
            border-radius: 0.05rem;
          }
          .enable {
            background: $primary-color;
          }
        }
      } */
      .score {
        color: #666;
        font-size: $font-size-medium;
        line-height: 0.4rem;
        text-align: center;
        img {
          width: 0.13rem;
          height: 0.24rem;
        }
      }
    }
    .active {
      color: $primary-color;
      border-bottom: 1px solid $primary-color;
    }
  }
  .danmu {
    width: 100%;
    height: 6.5rem;
    position: fixed;
    bottom: 0;
    background-color: #fff;
    display: none;
    .title {
      height: 1rem;
      display: flex;
      align-items: center;
      img {
        width: 0.46rem;
        height: 0.46rem;
        position: absolute;
        right: 0.3rem;
      }
    }
    .content {
      padding: 0 0.3rem;
      .prop-item {
        border: 1px solid $color-border;
        border-radius: 0.55rem;
        align-items: center;
        display: inline-block;
        font-size: 0;
        span {
          flex: 1;
          font-size: $font-size-medium;
          line-height: 0.8rem;
          display: inline-block;
          vertical-align: text-bottom;
          margin: 0 0.1rem 0 0.3rem;
        }
        img {
          width: 0.8rem;
          height: 0.8rem;
        }
      }
    }
    .active {
      color: $primary-color;
      border-bottom: 1px solid $primary-color;
    }
  }
  .show {
    display: block;
  }
}
</style>
