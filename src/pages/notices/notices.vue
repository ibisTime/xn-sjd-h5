<template>
  <div class="adopt-list-wrapper">
    <div class="adopt-list">
      <Scroll :pullUpLoad="pullUpLoad" :data="list">
        <div class="item" @click="go('/notice-detail?code=' + item.code)" v-for="item in list">
          <div class="info">
            <p class="top"><span class="name">{{cut(item.title,6)}}</span><span class="status">{{formatDate(item.createDatetime)}}</span></p>
            <p class="date">{{cut(item.content, 14)}}</p>
          </div>
        </div>
        <no-result v-show="!hasMore && !(list && list.length)" title="暂无公告" class="no-result-wrapper"></no-result>
      </Scroll>
    </div>
    <full-loading v-show="loading"></full-loading>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import FullLoading from 'base/full-loading/full-loading';
  import NoResult from 'base/no-result/no-result';
  import { getMessage } from 'api/biz';
  import { formatDate, setTitle } from 'common/js/util';

  export default {
    data() {
      return {
        showBack: false,
        loading: false,
        list: []
      };
    },
    mounted() {
      setTitle('公告');
      this.pullUpLoad = null;
      this.loading = true;
      getMessage({
        status: '1',
        type: '1',
        object: 'C'
      }).then((res) => {
        this.loading = false;
        this.list = res;
      }).catch(() => { this.loading = false; });
    },
    methods: {
      formatDate(date) {
        return formatDate(date);
      },
      go(url) {
        this.$router.push(url);
      },
      cut(str, num) {
        if(str.length > num) {
          return str.slice(0, num) + '...';
        } else {
          return str;
        }
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
    .adopt-list {
      background: $color-highlight-background;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0.3rem;
      right: 0.3rem;
      .item {
        width: 100%;
        height: 1.67rem;
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
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.22rem;
            .name {
              flex: 1;
              font-size: 0.32rem;
              line-height: 0.45rem;
            }
            .status {
              font-size: 0.24rem;
              color: #999;
              line-height: 0.33rem;
            }
          }
          .date {
            font-size: 0.28rem;
            line-height: 0.4rem;
            color: #999;
          }
        }
      }
    }
    .no-result-wrapper {
      position: absolute;
      width: 100%;
      top: 1.9rem;
      left: 0;
      transform: translateY(-50%);
    }
  }
</style>
