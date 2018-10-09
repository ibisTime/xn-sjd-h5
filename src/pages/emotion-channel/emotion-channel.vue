<template>
  <div class="adopt-list-wrapper">
    <m-header class="cate-header" title="情感频道" actText="发布" @action="action"></m-header>
    <div class="adopt-list" v-show="list.length">
      <Scroll :data="list"
              :hasMore="hasMore"
              @pullingUp="getPageOrders">
        <div class="item" @click="go('/article-detail?code=' + item.code)" v-for="item in list">
          <img :src="formatImg(item.photolist[0])">
          <div class="info">
            <p class="title">{{item.title}}</p>
            <p class="prop"><span class="date">{{formatDate(item.publishDatetime)}}</span></p>
          </div>
        </div>
      </Scroll>
    </div>
    <div v-show="!hasMore && !list.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无内容"></no-result>
    </div>
    <full-loading v-show="loading"></full-loading>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import FullLoading from 'base/full-loading/full-loading';
  import NoResult from 'base/no-result/no-result';
  import { setTitle, formatDate, formatImg } from 'common/js/util';
  import { getArticlePage } from 'api/biz';

  export default {
    data() {
      return {
        start: 1,
        limit: 10,
        hasMore: true,
        loading: false,
        list: []
      };
    },
    mounted() {
      setTitle('情感频道');
      this.getPageOrders();
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
      action() {
        this.go('/write-article');
      },
      getPageOrders() {
        this.loading = true;
        getArticlePage({
          start: this.start,
          limit: this.limit,
          status: '5',
          openLevel: '1'
        }).then((res) => {
          this.loading = false;
          if (res.list.length < this.limit || res.totalCount <= this.limit) {
            this.hasMore = false;
          }
          res.list.map((item) => {
            item.photolist = item.photo.split('||');
          });
          this.list = this.list.concat(res.list);
          this.start++;
          this.loading = false;
        }).catch(() => { });
      }
    },
    components: {
      Scroll,
      MHeader,
      FullLoading,
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
    .no-result-wrapper {
      margin-top: 0.8rem;
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
          .title {
            font-size: 0.3rem;
            line-height: 0.42rem;
            margin-bottom: 0.95rem;
            display: flex;
            justify-content: space-between;
            flex: 1;
          }
          .prop {
            font-size: $font-size-small;
            line-height: 0.33rem;
            color: #999;
            display: flex;
            .date {
              flex: 1;
            }
            .collect {
              margin-right: 0.3rem;
            }
          }
        }
      }
    }
  }
</style>
