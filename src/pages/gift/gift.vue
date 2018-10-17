<template>
  <div class="adopt-list-wrapper">
    <m-header class="cate-header" title="礼物"></m-header>
    <div class="adopt-list">
      <Scroll :data="giftList"
              :hasMore="hasMore"
              @pullingUp="getPageOrder">
        <div class="item" @click="go('/claim-gift?code=' + item.code)" v-for="item in giftList">
          <img :src="formatImg(item.listPic)">
          <div class="info">
            <p class="top"><span class="name">{{item.name}}</span><span class="status">{{giftObj[item.status]}}</span></p>
            <p class="date">失效时间：{{formatDate(item.invalidDatetime)}}</p>
          </div>
        </div>
      </Scroll>
    </div>
    <no-result v-show="!hasMore && !(list && list.length)" title="暂无礼物" class="no-result-wrapper"></no-result>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import NoResult from 'base/no-result/no-result';
  import { getGiftPage } from 'api/biz';
  import { getDictList } from 'api/general';
  import { formatImg, formatDate, getUserId } from 'common/js/util';

  export default {
    data() {
      return {
        start: 1,
        limit: 10,
        hasMore: true,
        giftList: [],
        giftObj: {}
      };
    },
    mounted() {
      this.code = this.$route.query.code || '';
      this.getGiftStatus();
      this.getPageOrder();
    },
    methods: {
      formatImg(img) {
        return formatImg(img);
      },
      formatDate(date) {
        return formatDate(date, 'yyyy-MM-dd');
      },
      go(url) {
        this.$router.push(url);
      },
      getGiftStatus() {
        getDictList('gift_order_status').then((res) => {
          res.map((item) => {
            this.giftObj[item.dkey] = item.dvalue;
          });
        }).catch(() => {});
      },
      getPageOrder() {
        Promise.all([
          getGiftPage({
            adoptTreeCode: this.code,
            start: this.start,
            limit: this.limit,
            toUser: getUserId()
          })
        ]).then(([res]) => {
          if (res.totalPage <= this.start) {
            this.hasMore = false;
          }
          this.giftList = [...this.giftList, ...res.list];
          this.start ++;
        }).catch(() => {});
      }
    },
    components: {
      Scroll,
      MHeader,
      NoResult
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
        /*height: 2.3rem;*/
        font-size: $font-size-medium-x;
        line-height: 1.1rem;
        border-bottom: 1px solid #eee;
        padding: 0.3rem 0;
        display: flex;
        align-items: center;
        img {
          width: 2rem;
          height: 1.7rem;
          margin-right: 0.2rem;
          border-radius: 0.08rem;
        }
        .info {
          display: inline-block;
          font-size: 0;
          flex: 1;
          .top {
            font-size: 0.3rem;
            line-height: 0.42rem;
            margin-bottom: 0.95rem;
            display: flex;
            justify-content: space-between;
            .name {
              flex: 1;
            }
            .status {
              font-size: $font-size-small;
            }
          }
          .date {
            font-size: 0.24rem;
            line-height: 0.33rem;
            color: #999;
          }
        }
      }
    }
    .no-result-wrapper {
      position: absolute;
      width: 100%;
      top: 2.9rem;
      left: 0;
      transform: translateY(-50%);
    }
  }
</style>
