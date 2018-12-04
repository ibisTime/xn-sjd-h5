<template>
  <div class="adopt-list-wrapper">
    <m-header class="cate-header" title="我的文章" actText="发布" @action="action"></m-header>
    <div class="adopt-list">
      <Scroll :data="list"
              :hasMore="hasMore"
              @pullingUp="getPageOrders">
        <div class="item" @click="go('/my-article/article-detail?code=' + item.code)" v-for="item in list">
          <img :src="formatImg(item.photolist[0])">
          <div class="info">
            <p class="title"><span class="title-title">{{item.title}}</span><span class="title-status">{{statusObj[item.status]}}</span></p>
            <div class="info-middle"><span v-show="item.treeName">关联古树：{{item.treeName}}</span></div>
            <p class="prop"><span class="date">{{formatDate(item.publishDatetime)}}</span></p>
          </div>
        </div>
      </Scroll>
    </div>
    <div v-show="!hasMore && !list.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无内容"></no-result>
    </div>
    <full-loading v-show="loading"></full-loading>
    <toast ref="toast" :text="text"></toast>
    <router-view></router-view>
  </div>
</template>
<script>
  import Toast from 'base/toast/toast';
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import FullLoading from 'base/full-loading/full-loading';
  import NoResult from 'base/no-result/no-result';
  import { setTitle, formatDate, formatImg, getUserId } from 'common/js/util';
  import { getCookie } from 'common/js/cookie';
  import { getArticlePage, getListUserTree } from 'api/biz';
  import { getDictList } from 'api/general';

  export default {
    data() {
      return {
        text: '',
        start: 1,
        limit: 10,
        hasMore: true,
        loading: false,
        list: [],
        statusObj: {}
      };
    },
    mounted() {
      setTitle('我的文章');
      this.userId = getCookie('userId');
      getDictList('article_status').then((res) => {
        res.map((item) => {
          this.statusObj[item.dkey] = item.dvalue;
        });
      });
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
        if(!this.userId) {
          this.text = '您未登录';
          this.$refs.toast.show();
          setTimeout(() => {
            this.$router.push('/login');
          }, 1000);
        } else {
          getListUserTree({
            statusList: ['1', '2', '3']
          }).then((res) => {
            if(!res.length) {
              this.text = '您没有古树，暂时无法发布文章哦';
              this.$refs.toast.show();
            } else {
              this.go('/write-article');
            }
          });
        }
      },
      getPageOrders() {
        this.loading = true;
        getArticlePage({
          start: this.start,
          limit: this.limit,
          publishUserId: getUserId()
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
      NoResult,
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
    .no-result-wrapper{
      position: fixed;
      top: 3rem;
      left: 50%;
      -webkit-transform: translateX(-50%);
      -moz-transform: translateX(-50%);
      -ms-transform: translateX(-50%);
      -o-transform: translateX(-50%);
      transform: translateX(-50%);
      z-index: 9;
    }
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
            margin-bottom: 0.19rem;
            display: flex;
            justify-content: space-between;
            flex: 1;
            .title-status {
              font-size: 0.25rem;
              color: red;
            }
          }
          .info-middle {
            font-size: 0.24rem;
            color: #666666;
            margin-bottom: 0.28rem;
            span {
              display: inline-block;
              background: #F0F0F0;
              padding: 0.08rem 0.12rem;
              margin-right: 0.2rem;
              line-height: 0.33rem;
              margin-bottom: 0.1rem;
            }
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
