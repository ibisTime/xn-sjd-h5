<template>
  <div class="adopt-list-wrapper">
    <m-header class="cate-header" title="title"></m-header>
    <category-list></category-list>
    <!--<div class="adopt-list">-->
      <!--<scroll ref="scroll"-->
              <!--:data="dataList"-->
              <!--:pullUpLoad="pullUpLoad">-->
        <!--<div class="item" v-for="(item, index) in dataList " @click="goUserHome(item)" :key="index">-->
          <!--<div class="userPhoto" :style="getImgSyl(item.user ? item.user.photo : '')"></div>-->
          <!--<div class="info">-->
            <!--<p class="name">{{item.user.nickname ? item.user.nickname : jiami(item.user.mobile)}}</p>-->
            <!--<p class="date">{{formatDate(item.startDatetime, 'yyyy-MM-dd')}}</p>-->
          <!--</div>-->
          <!--<span class="price">¥{{formatAmount(item.amount)}} x{{item.userAdoptTreeCount}}</span>-->
        <!--</div>-->
        <!--<no-result v-show="!(dataList && dataList.length)" title="暂无认养" class="no-result-wrapper"></no-result>-->
      <!--</Scroll>-->
    <!--</div>-->
    <full-loading v-show="loading" :title="loadingText"></full-loading>
    <toast :text="toastText" ref="toast"></toast>
  </div>
</template>
<script>
  import Toast from 'base/toast/toast';
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import NoResult from 'base/no-result/no-result';
  import FullLoading from 'base/full-loading/full-loading';
  import CategoryList from 'components/category-list/category-list';
  import {formatAmount, formatDate, formatImg, getUserId, setTitle} from 'common/js/util';
  import defaltAvatarImg from './../../common/image/avatar@2x.png';
  import { getAdoptList } from 'api/biz';

  export default {
    data() {
      return {
        toastText: '',
        loading: false,
        loadingText: '',
        dataList: [],
        pullUpLoad: null
      };
    },
    mounted() {
      let history = this.$route.query.history || false;
      let type = this.$route.query.type || '';
      if(history) {
        setTitle('历史认养人');
        this.title = '历史认养人';
      } else {
        if(type && type === '3') {
          setTitle('已捐赠名单');
          this.title = '已捐赠名单';
        } else {
          setTitle('已认养名单');
          this.title = '已认养名单';
        }
      }
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
          getAdoptList({
            productCode: this.code,
            statusList: [1, 2, 3]
          })
        ]).then(([res1]) => {
          this.dataList = res1;
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
            // this.go(`/homepage`);
            this.go(`/my-tree?aTCode=${item.code}`);
          } else {
            // this.go(`/homepage?other=1&currentHolder=${item.currentHolder}`);
            this.go(`/my-tree?other=1&currentHolder=${item.currentHolder}&aTCode=${item.code}`);
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
      Toast,
      CategoryList
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
      top: 0.88rem;
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
