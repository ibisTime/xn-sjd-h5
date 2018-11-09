<template>
  <div class="adopt-list-wrapper">
    <!--<m-header class="cate-header" title="已认养名单"></m-header>-->
    <div class="adopt-list">
      <scroll ref="scroll"
              :data="dataList"
              :pullUpLoad="pullUpLoad">
        <div class="item" v-for="(item, index) in dataList " @click="goUserHome(item)" :key="index">
          <div class="userPhoto" :style="getImgSyl(item.user ? item.user.photo : '')"></div>
          <div class="info">
            <p class="name">{{item.nickname ? item.nickname : jiami(item.mobile)}}</p>
            <p class="date">{{formatDate(detail.createDatetime, 'yyyy-MM-dd')}}</p>
          </div>
          <span class="price">¥{{formatAmount(detail.price)}} x{{detail.quantity}}</span>
        </div>
        <no-result v-show="!(dataList && dataList.length)" title="暂无认养" class="no-result-wrapper"></no-result>
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
  import {formatAmount, formatDate, formatImg, getUserId, setTitle} from 'common/js/util';
  import defaltAvatarImg from './../../common/image/avatar@2x.png';
  import { getDeriveZichanDetail } from 'api/biz';

  export default {
    data() {
      return {
        toastText: '',
        loading: false,
        loadingText: '',
        dataList: [],
        detail: {},
        pullUpLoad: null
      };
    },
    mounted() {
      this.code = this.$route.query.code;
      setTitle('归属人');
      this.getInitData();
    },
    methods: {
      getInitData() {
        this.getAdoptList();
      },
      getAdoptList() {
        this.loading = true;
        this.code = this.$route.query.code;
        Promise.all([
          getDeriveZichanDetail({
            code: this.code
          })
        ]).then(([res1]) => {
          console.log(res1);
          this.detail = res1;
          this.dataList.push(res1.createrInfo);
          // console.log(this.dataList);
          // this.dataList = res1;
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        });
      },
      go(url) {
        this.$router.push(url);
      },
      goUserHome(item) {
        if(getUserId()) {
          if(item.currentHolder === getUserId()) {
            this.go(`/homepage`);
          } else {
            this.go(`/homepage?other=1&currentHolder=${item.currentHolder}`);
          }
        } else {
          this.toastText = '您未登录';
          this.$refs.toast.show();
          setTimeout(() => {
            this.$router.push('/login');
          }, 1000);
        }
      },
      formatAmount(amount) {
        return formatAmount(amount);
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
    .adopt-list {
      background: $color-highlight-background;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0.3rem;
      right: 0.3rem;
      .item {
        width: 100%;
        height: 1.6rem;
        font-size: $font-size-medium-x;
        line-height: 1.1rem;
        border-bottom: 1px solid #eee;
        padding: 0.3rem 0;
        display: flex;
        align-items: center;
        .userPhoto {
          width: 1rem;
          height: 1rem;
          margin-right: 0.2rem;
        }
        .info {
          display: inline-block;
          font-size: 0;
          flex: 1;
          .name {
            font-size: 0.3rem;
            line-height: 0.42rem;
            margin-bottom: 0.25rem;
            font-weight: 500;
          }
          .date {
            font-size: 0.24rem;
            line-height: 0.33rem;
            color: #999;
          }
        }
        .price {
          color: $primary-color;
          font-size: 0.32rem;
        }
      }
    }
  }
</style>
