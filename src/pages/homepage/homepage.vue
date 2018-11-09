<template>
  <div class="me-wrapper">
    <!--<m-header class="cate-header" :title="title" actText="分享" @action="action"></m-header>-->
    <div class="out-content">
      <div class="bg">
        <div class="content">
          <div class="in-content">
            <div class="card">
              <div class="me-info">
                <div class="userPhoto" :style="getImgSyl(userInfo.photo)"></div>
                <div class="text">
                  <p>
                    <span>{{userInfo.nickname}}</span>
                    <span class="lv">LV{{userInfo.level}}</span>
                    <span class="follow" v-show="other === '1'" @click="setFollow()" >{{isFriend ? '取消关注' : '加关注'}}</span></p>
                </div>
              </div>
              <div class="category-wrapper bg-transparent">
                <category-scroll :currentIndex="currentIndex"
                                 :categorys="categorys"
                                 @select="selectCategory"></category-scroll>
                <category-scroll :currentIndex="currentIndexSub"
                                 :categorys="categorysSub"
                                 @select="selectCategorySub"></category-scroll>
              </div>
              <!--<div class="type">-->
                <!--<span @click="changeType(0)">全部</span>-->
                <!--<span @click="changeType(1)">古树名木</span>-->
                <!--<span @click="changeType(4)">水源林</span>-->
                <!--<span @click="changeType(3)">情感林</span>-->
                <!--<span @click="changeType(2)">果园林</span>-->
              <!--</div>-->
              <!--<div class="type triangle">-->
                <!--<img :class="!type ? 'active' : ''" src="./triangle@2x.png">-->
                <!--<img :class="type === 1 ? 'active' : ''" src="./triangle@2x.png">-->
                <!--<img :class="type === 4 ? 'active' : ''" src="./triangle@2x.png">-->
                <!--<img :class="type === 3 ? 'active' : ''" src="./triangle@2x.png">-->
                <!--<img :class="type === 2 ? 'active' : ''" src="./triangle@2x.png">-->
              <!--</div>-->
            </div>
          </div>
        </div>
      </div>
      <!--<div class="emotion-forest-type" v-show="type === 3">-->
        <!--<span :class="emotion === 1 ? 'active' : ''" @click="changeEmotion(1)">爱情林</span>-->
        <!--<span :class="emotion === 2 ? 'active' : ''" @click="changeEmotion(2)">亲子林</span>-->
      <!--</div>-->
      <div class="scroll-section">
        <Scroll ref="scroll"
                :data="dynamicsList"
                :hasMore="dynamics.hasMore"
                @pullingUp="getDynamicsList">
          <div class="tree-list" :style="{ top: type === 3 ? '5.46rem' : '4.66rem' }">
            <div class="item" v-for="item in userTree">
              <div class="tree-info" @click="goMyTree(item)">
                <p class="tree-name" v-show="item.tree.sellType !== '3'">{{item.tree.scientificName}}-{{item.treeNumber}}</p>
                <p class="tree-name" v-show="item.tree.sellType === '3'">{{item.tree.scientificName}}-{{item.treeNumber}}-{{item.specsName}}</p>
                <p class="tree-about"></p>
              </div>
              <div class="map" @click="go('/map?code=' + item.code)">
                <img src="./map@2x.png" alt="">
                <p>查看地图</p>
              </div>
            </div>
            <no-result v-show="!loading && !(userTree && userTree.length)" title="还没有认养树" class="no-result-wrapper"></no-result>
          </div>
          <div class="gray"></div>
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
            <div class="gray"></div>
          </div>
          <div class="dynamic">
            <div class="dynamic-title">
              <div class="border"></div>
              <span>{{borderTitle}}</span>
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
                    <img src="./zengsong@2x.png" alt="">
                    <p class="activity"><span>{{getName(item)}}</span>赠送<span>{{get2Name(item)}}</span>{{formatAmount(item.quantity)}}g</p>
                    <p class="time">{{formatDate(item.createDatetime, 'hh:mm')}}</p>
                  </div>
                  <div class="daily-content-item-info" v-if="item.type === '2'">
                    <img src="./message@2x.png" alt="">
                    <p class="activity"><span>{{getName(item)}}</span>留言{{formatAmount(item.quantity)}}g</p>
                    <p class="time">{{formatDate(item.createDatetime, 'hh:mm')}}</p>
                  </div>
                  <div class="daily-content-item-info" v-if="item.type === '3'">
                    <img src="./steal@2x.png" alt="">
                    <p class="activity"><span>{{getName(item)}}</span>收取<span>{{get2Name(item)}}</span>{{formatAmount(item.quantity)}}g</p>
                    <p class="time">{{formatDate(item.createDatetime, 'hh:mm')}}</p>
                  </div>
                  <div class="daily-content-item-info" v-if="item.type === '4'">
                    <div class="message-border">
                      <img :src="formatImg(item.userInfo.photo)"class="head">
                      <div class="message-text">
                        <p class="name">{{getName(item)}}</p>
                        <p class="activity">来收取能量，被保护罩阻挡了</p>
                      </div>
                    </div>
                  </div>
                  <div class="daily-content-item-info" v-if="item.type === '5' || item.type === '6'">
                    <!--<img src="./steal@2x.png" alt="">-->
                    <p class="activity"><span>{{item.note}}</span></p>
                    <p class="time">{{formatDate(item.createDatetime, 'hh:mm')}}</p>
                  </div>
                  <!--<p v-show="item.type === '5' || item.type === '6'">-->
                    <!--<span class="name">{{item.note}}</span>-->
                    <!--<span class="activity"></span><span class="time">{{formatDate(item.createDatetime, 'hh:mm')}}</span>-->
                  <!--</p>-->
                  <div class="border"></div>
                </div>
                <!--<div class="daily-content-item">-->
                <!--<div class="daily-content-item-info">-->
                <!--<img src="./protect@2x.png" alt="">-->
                <!--<p class="activity"><span>{{this.other ? 'TA的好友' : '珊珊'}}</span>使用了保护罩</p>-->
                <!--<p class="time">19:00</p>-->
                <!--</div>-->
                <!--<div class="border"></div>-->
                <!--</div>-->
                <!--<div class="daily-content-item">-->
                <!--<div class="daily-content-item-message">-->
                <!--<div class="message-border">-->
                <!--<img src="./head.png" alt="" class="head">-->
                <!--<div class="message-text">-->
                <!--<p class="name">{{this.other ? 'TA的好友' : '珊珊'}}</p>-->
                <!--<p class="activity">来收取能量，被保护罩阻挡了</p>-->
                <!--</div>-->
                <!--<img src="./cover@2x.png" alt="" class="cover">-->
                <!--</div>-->
                <!--<p class="time">19:00</p>-->
                <!--</div>-->
                <!--<div class="border"></div>-->
                <!--</div>-->
                <no-result v-show="!(dynamicsList && dynamicsList.length)" title="暂无动态" class="no-result-wrapper"></no-result>
              </div>
            </div>
          </div>
          <toast :text="toastText" ref="toast"></toast>
          <div class="mask" @click="change" v-show="share"></div>
        </Scroll>
      </div>
    </div>
    <div class="share" v-show="share">
      <div class="share-text"><span>- </span><span>分享到</span><span> -</span></div>
      <div class="share-type">
        <div class="share-type-item">
          <img src="./wechat@2x.png" alt="">
          <p>微信</p>
        </div>
        <div class="share-type-item">
          <img src="./pyq@2x.png" alt="">
          <p>朋友圈</p>
        </div>
      </div>
      <div class="share-cancel" @click="change">取消</div>
    </div>
    <full-loading v-show="loading" :title="loadingText"></full-loading>
    <toast ref="toast" :text="text"></toast>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import CategoryScroll from 'base/category-scroll/category-scroll';
  import FullLoading from 'base/full-loading/full-loading';
  import Toast from 'base/toast/toast';
  import MHeader from 'components/m-header/m-header';
  import NoResult from 'base/no-result/no-result';
  import { getUser, getHasRelationship, addRelationship, cancelRelationship } from 'api/user';
  import { getListUserTree, getProductType, getComparison, getPageJournal } from 'api/biz';
  import {formatAmount, formatDate, formatImg, setTitle, getUserId} from 'common/js/util';
  import defaltAvatarImg from './../../common/image/avatar@2x.png';

  export default {
    data() {
      return {
        text: '',
        type: 0,
        emotion: 1,
        share: false,
        loading: false,
        loadingText: '',
        toastText: '',
        other: 0,      // 是否好友的主页
        currentHolder: '', // userId 好友
        title: '我的主页',
        borderTitle: '我的动态',
        userInfo: {photo: ''}, // 用户信息
        userTree: [], // 认养的树
        currentIndex: +this.$route.query.index || 0,
        currentIndexSub: +this.$route.query.index || 0,
        index: 0,
        indexSub: 0,
        categorys: [],
        categorysSub: [{value: '全部', key: 'all'}],
        comparisonData: {
          toUserInfo: {photo: ''},
          userInfo: {photo: ''}
        }, // 能量比拼
        isFriend: false, // 是否是好友
        dynamics: {
          start: 1,
          limit: 5,
          hasMore: true
        }, // 动态
        dynamicsList: [] // 动态数据
      };
    },
    mounted() {
      setTitle('我的主页');
      // this.index = +this.$route.query.type || 0;  // 树的类型
      this.other = this.$route.query.other || 0;  // 是否别人的主页
      // 路由带了currentHolder， 是从好友排行榜跳过来的，currentHolder是主页的主人
      // 也就是说，路由带了，就是别人，没带就是自己
      this.currentHolder = this.$route.query.currentHolder || getUserId();
      if(this.other) {
        this.title = 'TA的主页';
        this.borderTitle = 'TA的动态';
        setTitle('TA的主页');
      }
      this.getInitData();
    },
    methods: {
      formatImg(img) {
        // return formatImg(img);
        return img ? formatImg(img) : defaltAvatarImg;
      },
      getName(item) {
        if(item.userInfo.userId === this.currentHolder) {
          if(this.other === '1') {
            return 'TA';
          } else {
            return '我';
          }
        } else {
          if(item.userInfo.userId === getUserId()) {
            return '我';
          } else {
            if(this.other === '1') {
              return 'TA的好友';
            } else {
              if(item.userInfo.nickname) {
                return item.userInfo.nickname;
              } else {
                return this.jiami(item.userInfo.mobile);
              }
            }
          }
        }
      },
      get2Name(item) {
        if(item.adoptUserInfo.userId === this.currentHolder) {
          if(this.other === '1') {
            return 'TA';
          } else {
            return '我';
          }
        } else {
          if(item.adoptUserInfo.userId === getUserId()) {
            return '我';
          } else {
            if(this.other === '1') {
              return 'TA的好友';
            } else {
              if(item.adoptUserInfo.nickname) {
                return item.adoptUserInfo.nickname;
              } else {
                return this.jiami(item.adoptUserInfo.mobile);
              }
            }
          }
        }
      },
      getInitData() {
        this.currentHolder = this.$route.query.currentHolder || getUserId();
        this.other = this.$route.query.other || 0;  // 是否别人的主页
        this.loading = true;
        Promise.all([
          getUser(this.currentHolder),
          getProductType({
            orderDir: 'asc',
            orderColumn: 'order_no',
            status: '1',
            level: '1'
          })
        ]).then(([userInfo, productType]) => {
          this.loading = false;
          this.userInfo = userInfo;

          productType.map(item => {
            this.categorys.push({
              key: item.code,
              value: item.name
            });
          });
          this.type = this.categorys[this.index].key;
          this.getSubType();
          this.getUserTree();
          this.getDynamicsList();
        }).catch(() => { this.loading = false; });
        // 不是当前用户
        if (this.other === '1') {
          this.loading = true;
          Promise.all([
            this.getComparisonData(this.currentHolder),
            this.getIsFriend(this.currentHolder)
          ]).then(() => {
            this.loading = false;
          }).catch(() => { this.loading = false; });
        }
      },
      // 分页查询动态
      getDynamicsList() {
        this.loading = true;
        getPageJournal({
          start: this.dynamics.start,
          limit: this.dynamics.limit,
          queryUserId: this.currentHolder
        }).then((data) => {
          if (data.list.length < this.dynamics.limit || data.totalCount <= this.dynamics.limit) {
            this.dynamics.hasMore = false;
          }
          this.dynamics.start++;
          this.dynamicsList = this.dynamicsList.concat(data.list);
          this.loading = false;
        }, () => { this.loading = false; });
      },
      // 查询我和他是否建立关联
      getIsFriend(toUserId) {
        return getHasRelationship(toUserId).then((data) => {
          this.isFriend = data;
        }, () => {});
      },
      // 设置关注
      setFollow() {
        this.loading = true;
        // 取消关注
        if (this.isFriend) {
          cancelRelationship(this.currentHolder).then((data) => {
            this.isFriend = false;
            this.loading = false;
          }, () => { this.loading = false; });
        // 加关注
        } else {
          addRelationship(this.currentHolder).then((data) => {
            this.isFriend = true;
            this.loading = false;
          }, () => { this.loading = false; });
        }
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
      // 获取用户的树
      getUserTree() {
        // 大类
        // this.type = this.categorys[this.index].key;
        // 小类
        // this.categoryCode = this.categorysSub[this.indexSub].key;
        this.currentHolder = this.$route.query.currentHolder || getUserId();
        this.params = {
          currentHolder: this.currentHolder,
          statusList: ['1', '2', '3']
        };
        if(this.categorysSub[this.indexSub].key === 'all') {
          this.params.parentCategoryCode = this.categorys[this.index].key;
        } else {
          this.params.categoryCode = this.categorysSub[this.indexSub].key;
        }
        this.loading = true;
        return getListUserTree(this.params).then((userTree) => {
          this.userTree = userTree;
          this.loading = false;
        }, () => { this.loading = false; });
      },
      getImgSyl(imgs) {
        let img = imgs ? formatImg(imgs) : defaltAvatarImg;
        return {
          backgroundImage: `url(${img})`
        };
      },
      formatAmount(amount) {
        return formatAmount(amount);
      },
      formatDate(date, format) {
        return formatDate(date, format);
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
      go(url) {
        this.$router.push(url);
      },
      changeType(index) {
        this.type = index;
      },
      changeEmotion(index) {
        this.emotion = index;
      },
      action() {
        this.share = true;
      },
      change() {
        this.share = !this.share;
      },
      goMyTree(item) {
        if(item.tree.status === '4') {
          this.text = '这棵树已经到期咯';
          this.$refs.toast.show();
        } else {
          if(this.other) {
            this.go(`/my-tree?other=1&currentHolder=${this.currentHolder}&aTCode=${item.code}`);
          } else {
            this.go(`/my-tree?aTCode=${item.code}`);
          }
        }
      },
      selectCategory(index) {
        this.index = index;
        this.indexSub = 0;
        this.currentIndexSub = 0;
        this.currentIndex = index;
        this.userTree = [];
        this.loading = true;
        this.getSubType();
      },
      selectCategorySub(index) {
        this.indexSub = index;
        this.currentIndexSub = index;
        this.getUserTree();
      },
      // 获取下级分类
      getSubType() {
        this.loading = true;
        this.categorysSub = [{value: '全部', key: 'all'}];
        getProductType({
          parentCode: this.categorys[this.index].key,
          status: '1',
          orderDir: 'asc',
          orderColumn: 'order_no'
        }).then((res) => {
          res.map((item) => {
            this.categorysSub.push({
              value: item.name,
              key: item.code
            });
          });
          this.categoryCode = this.categorysSub[this.indexSub].key;
          this.getUserTree();
          this.loading = false;
        }).catch(() => { this.loading = false; });
      },
      jiami(mobile) {
        return mobile.substr(0, 3) + '****' + mobile.substr(7);
      }
    },
    components: {
      Scroll,
      MHeader,
      NoResult,
      FullLoading,
      Toast,
      CategoryScroll
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  .me-wrapper {
    background: #fff;
    position: fixed;
    width: 100%;
    bottom: 0;
    top: 0;
    left: 0;
    .fl {
      float: left;
    }
    .fr {
      float: right;
    }
    .head-wrapper {
      background: url("./bg@2x.png") no-repeat;
      /*background-position: left;*/
      /*<!--background-position: -0.2rem;-->*/
    }
    .category-wrapper {
      width: 100%;
      z-index: 100;
      height: 1.8rem;
      line-height: 0.9rem;
      overflow: hidden;
    }
    .category-item{
      padding: 0.1rem 0.33rem;
      border-radius: 1rem;
      font-size: $font-size-small;
      line-height: 0.33rem;
    }
    .out-content {
      .bg {
        background: url("./bg@2x.png") no-repeat;
        background-size: 100% 100%;
        .title {
          font-size: 0.36rem;
          color: #fff;
          padding-top: 0.19rem;
          text-align: center;
        }
        .content {
          padding: 0.43rem 0 0;
          .in-content {
            .card {
              /*height: 3.2rem;*/
              border-radius: 0.12rem;
              /*margin-bottom: 0.25rem;*/
              padding: 0.2rem 0 0 0;
              .me-info {
                text-align: center;
                .userPhoto {
                  width: 1.3rem;
                  height: 1.3rem;
                  margin-bottom: 0.34rem;
                  border: 2px solid $color-highlight-background;
                }
                .text {
                  vertical-align: middle;
                  margin-bottom: 0.32rem;
                  p {
                    margin-bottom: 0.69rem;
                    font-size: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    span:first-child {
                      font-size: $font-size-medium-xx;
                      color: $color-highlight-background;
                    }
                  }
                  .lv {
                    background: #FEAE62;
                    border-radius: 0.06rem;
                    line-height: 0.33rem;
                    display: inline-block;
                    color: #fff;
                    font-size: 0.24rem;
                    margin-left: 0.23rem;
                    padding: 0 0.1rem;
                  }
                  .follow{
                    background: #FEAE62;
                    border-radius: 0.06rem;
                    line-height: 0.33rem;
                    display: inline-block;
                    color: #fff;
                    font-size: 0.24rem;
                    margin-left: 0.23rem;
                    padding: 0 0.1rem;
                  }
                }
              }
              .triangle {
                padding: 0 0.3rem;
              }
              .type {
                font-size: $font-size-medium-x;
                line-height: 0.42rem;
                color: $color-highlight-background;
                display: flex;
                justify-content: space-between;
                img {
                  visibility: hidden;
                  width: 0.22rem;
                  height: 0.12rem;
                }
                img.active {
                  visibility: visible;
                }
              }
            }
          }
        }
      }
      .scroll-section {
        position: absolute;
        top: 5.3rem;
        bottom: 0;
        left: 0;
        right: 0;
        overflow: auto;
        .tree-list {
          background: $color-highlight-background;
          padding: 0 0.3rem;
          /*position: absolute;*/
          /*top: 5.66rem;*/
          /*bottom: 0;*/
          /*left: 0.3rem;*/
          /*right: 0.3rem;*/
          .item {
            width: 100%;
            height: 1.6rem;
            font-size: $font-size-medium-x;
            line-height: 1.6rem;
            border-bottom: 1px solid #eee;
            display: flex;
            align-items: center;
            padding: 0.3rem 0;
            .tree-info {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              .tree-name {
                font-size: $font-size-medium-x;
                line-height: $font-size-medium-x;
                margin-bottom: 0.21rem;
                font-family: PingFangSC-Semibold;
              }
              .tree-about {
                color: #666;
                font-size: $font-size-small;
                line-height: $font-size-small;
              }
            }
            .map {
              display: flex;
              flex-direction: column;
              align-items: center;
              img {
                width: 0.57rem;
                height: 0.57rem;
                margin-bottom: 0.2rem;
              }
              p {
                color: $primary-color;
                font-size: $font-size-small;
                line-height: $font-size-small;
              }
            }
          }
        }
        .gray {
          width: 100%;
          height: 0.2rem;
          padding: 0;
          background: #f5f5f5;
        }
        .dynamic {
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
              margin: 0.15rem 0;
            }
            .daily-content {
              .daily-content-item {
                .daily-content-item-info {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin-left: 0.2rem;
                  .message-border {
                    border: 1px solid #eee;
                    border-radius: 0.5rem;
                    display: flex;
                    align-items: center;
                    padding: 0.1rem;
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
        .mask {
          width: 100%;
          height: 100%;
          background-color: rgba($color: #000000, $alpha: 0.7);
          position: absolute;
          top: 0;
          left: 0;
        }
      }
      .emotion-forest-type {
        height: 0.8rem;
        font-size: 0.28rem;
        line-height: 0.4rem;
        padding: 0 0.3rem;
        background: #FCFCFC;
        box-shadow: 0 1px 0 0 rgba(235,235,235,0.50);
        span {
          line-height: 0.8rem;
          display: inline-block;
          margin-right: 1rem;
        }
        .active {
          color: $primary-color;
          border-bottom: 1px solid $primary-color;
        }
      }

    }
    .share {
      height: 3.8rem;
      background: $color-highlight-background;
      position: fixed;
      bottom: 0;
      width: 100%;
      .share-text {
        font-size: 0.3rem;
        text-align: center;
        margin-top: 0.3rem;
      }
      .share-type {
        padding: 0.4rem 2rem;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid $color-border;
        .share-type-item {
          img {
            width: 0.85rem;
            height: 0.85rem;
            margin-bottom: 0.2rem;
          }
          p {
            font-size: 0.24rem;
            line-height: 0.33rem;
            text-align: center;
          }
        }
      }
      .share-cancel {
        color: #666;
        font-size: $font-size-medium;
        line-height: 0.9rem;
        text-align: center;
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
  }
</style>
