<template>
  <div class="adopt-list-wrapper">
    <m-header class="cate-header" title="已认养名单"></m-header>
    <div class="adopt-list">
      <scroll ref="scroll"
              :data="dataList"
              :hasMore="hasMore"
              @pullingUp="getAdoptList">
        <div class="item" v-for="(item, index) in dataList " @click="goUserHome(item)">
          <div class="userPhoto" :style="getImgSyl()"></div>
          <div class="info">
            <p class="name">你是我的教科书</p>
            <p class="date">{{formatDate(item.startDatetime, 'yyyy-MM-dd')}}</p>
          </div>
          <span class="price fr">¥{{formatAmount(item.amount)}}</span>
        </div>
        <no-result v-show="!hasMore && !(dataList && dataList.length)" title="暂无认养" class="no-result-wrapper"></no-result>
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
  import {formatAmount, formatDate, formatImg, getUserId} from 'common/js/util';
  import defaltAvatarImg from './avatar@2x.png';
  import { getPageUserTree } from 'api/biz';

  export default {
    data() {
      return {
        toastText: '',
        loading: false,
        loadingText: '',
        dataList: [],
        start: 1,
        limit: 20,
        hasMore: true
      };
    },
    created() {
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
          getPageUserTree({
            start: this.start,
            limit: this.limit,
            productCode: this.code,
            currentHolder: ''
          })
        ]).then(([res1]) => {
          if (res1.list.length < this.limit || res1.totalCount <= this.limit) {
            this.hasMore = false;
          }
          this.loading = false;
          this.dataList = res1.list;
          this.start++;
        }).catch(() => {
          this.loading = false;
        });
      },
      go(url) {
        this.$router.push(url);
      },
      goUserHome(item) {
        if(item.currentHolder === getUserId()) {
          this.go(`/homepage`);
        } else {
          this.go(`/homepage?other=1&currentHolder=${item.currentHolder}`);
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
          }
          .date {
            font-size: 0.24rem;
            line-height: 0.33rem;
          }
        }
        .price {

        }
      }
    }
  }
</style>
