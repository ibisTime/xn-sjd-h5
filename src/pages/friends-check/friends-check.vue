<template>
  <div class="adopt-list-wrapper">
    <m-header class="cate-header" title="好友审核"></m-header>
    <div class="adopt-list">
      <scroll ref="scroll"
              :data="userList"
              :hasMore="hasMore"
              @pullingUp="getUserList">
        <div class="item" v-for="item in userList">
          <div class="userPhoto" :style="getImgSyl(item.fromUserInfo.photo ? item.fromUserInfo.photo : '')" @click="goUserHome(item)"></div>
          <div class="info">
            <p class="name">
              <span>{{item.fromUserInfo.nickname ? item.fromUserInfo.nickname: jiami(item.fromUserInfo.mobile)}}</span>
            </p>
            <p class="date">申请关注你</p>
          </div>
          <span class="price fr" v-if="item.status === '0'"><button class="refuse" @click="checkFocus(item, 0)">拒绝</button><button class="agree" @click="checkFocus(item, 1)">同意</button></span>
          <span class="price fr status" v-if="item.status !== '0'">{{statusObj[item.status]}}</span>
        </div>
        <no-result v-show="!hasMore && !(userList && userList.length)" title="暂无好友" class="no-result-wrapper"></no-result>
      </Scroll>
    </div>
    <full-loading v-show="loading" :title="loadingText"></full-loading>
    <toast :text="toastText" ref="toast"></toast>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import NoResult from 'base/no-result/no-result';
  import FullLoading from 'base/full-loading/full-loading';
  import Toast from 'base/toast/toast';
  import { getRelationPage, checkFocus } from 'api/user';
  import { getDictList } from 'api/general';
  import {formatAmount, formatDate, formatImg, setTitle} from 'common/js/util';
  import { getCookie } from 'common/js/cookie';
  import defaltAvatarImg from './../../common/image/avatar@2x.png';

  export default {
    data() {
      return {
        showBack: false,
        toastText: '',
        loading: false,
        loadingText: '',
        userList: [],
        myInfo: {},
        start: 1,
        limit: 30,
        hasMore: true,
        userDetail: {toUserInfo: {photo: '', mobile: ''}},
        statusObj: {}
      };
    },
    mounted() {
      setTitle('好友排行榜');
      this.userId = getCookie('userId');
      this.getInitData();
    },
    methods: {
      getInitData() {
        this.getUserList();
        this.getStatusObj();
      },
      getStatusObj() {
        getDictList('user_releation_status').then((res) => {
          res.map((item) => {
            this.statusObj[item.dkey] = item.dvalue;
          });
        });
      },
      getUserList() {
        this.loading = true;
        this.code = this.$route.query.code;
        Promise.all([
          getRelationPage({
            start: this.start,
            limit: this.limit,
            isMySelf: 0
          })
        ]).then(([res1]) => {
          if (res1.list.length < this.limit || res1.totalCount <= this.limit) {
            this.hasMore = false;
          }
          this.loading = false;
          this.userList = this.userList.concat(res1.list);
          this.userList.map((item) => {
            if(item.toUser === this.userId) {
              this.userDetail = item;
            }
          });
          this.start++;
        }).catch(() => {
          this.loading = false;
        });
      },
      formatAmount(amount) {
        if(formatAmount(amount) >= 1000) {
          return formatAmount(formatAmount(amount)) + 'k';
        } else {
          return formatAmount(amount);
        }
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
      goUserHome(item) {
        if(item.mySelf === '1') {
          this.go(`/homepage`);
        } else {
          this.go(`/homepage?other=1&currentHolder=${item.fromUserInfo.userId}`);
        }
      },
      // 加密
      jiami(mobile) {
        return mobile.substr(0, 3) + '****' + mobile.substr(7);
      },
      checkFocus(item, index) {
        this.approveResult = index;
        checkFocus({
          approveResult: this.approveResult,
          code: item.code
        }).then((res) => {
          if(res.isSuccess) {
            if(this.approveResult) {
              item.status = '1';
              this.text = this.statusObj[1];
            } else {
              item.status = '2';
              this.text = this.statusObj[2];
            }
          }
        });
      }
    },
    components: {
      Scroll,
      MHeader,
      NoResult,
      FullLoading,
      Toast
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  .adopt-list-wrapper {
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
    .gray {
      width: 100%;
      height: 0.2rem;
      padding: 0;
      background: $color-background;
    }
    .adopt-list {
      background: $color-highlight-background;
      position: absolute;
      top: 0.88rem;
      bottom: 0;
      left: 0.3rem;
      right: 0.3rem;
      .item {
        width: 100%;
        height: 1.3rem;
        font-size: $font-size-medium-x;
        border-bottom: 1px solid #eee;
        line-height: 1.1rem;
        padding: 0.3rem 0;
        display: flex;
        align-items: center;
        .userPhoto {
          width: 0.8rem;
          height: 0.8rem;
          margin: 0 0.2rem;
        }
        .info {
          display: inline-block;
          font-size: 0;
          flex: 1;
          .name {
            font-size: 0.3rem;
            line-height: 0.42rem;
            margin-bottom: 0.14rem;
            display: flex;
            align-items: center;
            span {
              margin-right: 0.15rem;
            }
            img {
              width: 0.36rem;
              height: 0.36rem;
            }
          }
          .date {
            font-size: 0.24rem;
            line-height: 0.33rem;
            color: #999
          }
        }
        .price {
          button {
            width: 1.16rem;
            height: 0.52rem;
            border-radius: 0.04rem;
            border: 1px solid;
            background: #fff;
          }
          .refuse {
            color: #999;
            margin-right: 0.3rem;
          }
          .agree {
            color: $primary-color;
          }
        }
        .status {
          color: #999;
          font-size: 0.24rem;
        }
      }
    }
  }
</style>
