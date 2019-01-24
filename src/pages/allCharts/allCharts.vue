<template>
  <div class="adopt-list-wrapper">
    <div class="me" v-if="getUserId()">
      <div class="item" @click="goUserHome(userDetail)">
        <div class="order">
          <img v-if="userDetail.rowNo === 1" src="./no1@2x.png">
          <img v-else-if="userDetail.rowNo === 2" src="./no2@2x.png">
          <img v-else-if="userDetail.rowNo === 3" src="./no3@2x.png">
          <samp class="rowNo" v-else>{{userDetail.rowNo}}</samp>
        </div>
        <div class="userPhoto" :style="getImgSyl(userDetail.photo ? userDetail.photo : '')"></div>
        <div class="info">
          <p class="name">
            <span>{{userDetail.nickname ? userDetail.nickname: jiami(userDetail.mobile)}}</span>
            <img src="./steal@2x.png" v-show="userDetail.takeableTppAmount">
          </p>
          <p class="date">获得了{{userDetail.certificateCount}}个环保证书</p>
        </div>
        <span class="price fr">{{formatAmount(userDetail.tppAmount)}}碳泡泡</span>
      </div>
    </div>
    <div class="gray" v-if="getUserId()"></div>
    <div class="adopt-list" :style="{top : getUserId() ? '1.48rem' : '0'}">
      <scroll ref="scroll"
              :data="userList"
              :hasMore="hasMore"
              @pullingUp="getUserList">
        <div class="item" v-for="item in userList" @click="goUserHome(item)">
          <div class="order">
            <img v-if="item.rowNo === 1" src="./no1@2x.png">
            <img v-else-if="item.rowNo === 2" src="./no2@2x.png">
            <img v-else-if="item.rowNo === 3" src="./no3@2x.png">
            <samp class="rowNo" v-else>{{item.rowNo}}</samp>
          </div>
          <div class="userPhoto" :style="getImgSyl(item.photo ? item.photo : '')"></div>
          <div class="info">
            <p class="name">
              <span>{{item.nickname ? item.nickname: jiami(item.mobile)}}</span>
              <img src="./steal@2x.png" v-show="item.takeableTppAmount">
            </p>
            <p class="date">获得了{{item.certificateCount}}个环保证书</p>
          </div>
          <span class="price fr">{{formatAmount(item.tppAmount)}}碳泡泡</span>
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
  import { allChart } from 'api/user';
  import {formatAmount, formatDate, formatImg, setTitle, getUserId} from 'common/js/util';
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
        userDetail: {photo: '', mobile: ''}
      };
    },
    mounted() {
      setTitle('排行榜');
      this.getInitData();
    },
    methods: {
      getUserId() {
        return getUserId();
      },
      getInitData() {
        this.getUserList();
      },
      getUserList() {
        this.loading = true;
        this.code = this.$route.query.code;
        Promise.all([
          allChart({
            start: this.start,
            limit: this.limit,
            orderDir: 'asc',
            orderColumn: 'row_no'
          })
        ]).then(([res1]) => {
          if (res1.list.length < this.limit || res1.totalCount <= this.limit) {
            this.hasMore = false;
          }
          this.loading = false;
          this.userList = this.userList.concat(res1.list);
          this.userList.map((item) => {
            if(item.userId === getUserId()) {
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
        if(getUserId()) {
          if(item.userId === getUserId()) {
            this.go(`/homepage`);
          } else {
            this.go(`/homepage?other=1&currentHolder=${item.userId}`);
          }
        } else {
          this.toastText = '您未登录';
          this.$refs.toast.show();
          setTimeout(() => {
            this.$router.push('/login');
          }, 1000);
        }
      },
      // 加密
      jiami(mobile) {
        return mobile.substr(0, 3) + '****' + mobile.substr(7);
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
    .me {
      background: $color-highlight-background;
      padding: 0 0.3rem;
      .item {
        width: 100%;
        height: 1.3rem;
        font-size: $font-size-medium-x;
        line-height: 1.1rem;
        padding: 0.3rem 0;
        display: flex;
        align-items: center;
        .order {
          align-items: center;
          display: flex;
          img {
            width: 0.41rem;
            height: 0.51rem;
          }
          .rowNo{
            display: inline-block;
            width: 0.41rem;
            line-height: 0.51rem;
            font-size: 0.28rem;
            text-align: center;
          }
        }
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
          }
          .date {
            font-size: 0.24rem;
            line-height: 0.33rem;
            color: #999
          }
          img {
            width: 0.36rem;
            height: 0.36rem;
          }
        }
        .price {

        }
      }
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
      top: 1.48rem;
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
        .order {
          align-items: center;
          display: flex;
          img {
            width: 0.41rem;
            height: 0.51rem;
          }
        }
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

        }
      }
    }
  }
</style>
