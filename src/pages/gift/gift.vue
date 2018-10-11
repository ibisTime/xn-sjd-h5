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
            <p class="date">2018.09.14</p>
          </div>
        </div>
      </Scroll>
    </div>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import { getGiftPage } from 'api/biz';
  import { getDictList } from 'api/general';
  import { formatImg } from 'common/js/util';

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
      this.pullUpLoad = null;
      this.code = this.$route.query.adoptTreeCode;
      this.getGiftStatus();
      this.getPageOrder();
    },
    methods: {
      formatImg(img) {
        return formatImg(img);
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
            limit: this.limit
          })
        ]).then(([res]) => {
          this.giftList = res.list;
        }).catch(() => {});
      }
    },
    components: {
      Scroll,
      MHeader
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
  }
</style>
