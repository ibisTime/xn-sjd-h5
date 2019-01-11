<template>
  <div class="emotion-channel-wrapper">
    <m-header class="cate-header" title="情感频道" actText="发布" @action="action"></m-header>
    <div class="tab">
      <span :class="time ? 'active' : ''" @click="changeTime">按发布时间排序</span>
      <span :class="!time ? 'active' : ''"  @click="changeTime">按收藏数排序</span>
      <span @click="changeOfficial">
        <img src="./unchoosed@2x.png" v-if="!official">
        <img src="./choosed@2x.png" v-if="official">
        <span>只看官方推文</span>
      </span>
    </div>
    <div class="adopt-list" v-show="list.length">
      <Scroll :data="list"
              :hasMore="hasMore"
              @pullingUp="getPageOrders">
        <div class="item" @click="go('/article-detail?code=' + item.code)" v-for="item in list">
          <img :src="formatImg(item.photolist[0])">
          <div class="info">
            <p class="title">{{item.title}}</p>
            <div class="info-middle"><span>作者：{{item.publishUserName}}</span><span v-show="item.treeName">关联古树：{{item.productName}}({{item.treeName}})</span></div>
            <p class="prop">
              <span class="date">{{formatDate(item.publishDatetime, 'yyyy.MM.dd')}}</span>
              <span><span class="collect">收藏：{{item.collectCount}}</span><span class="laud">点赞{{item.pointCount}}</span></span>
            </p>
          </div>
        </div>
      </Scroll>
    </div>
    <div v-show="!hasMore && !list.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无内容"></no-result>
    </div>
    <full-loading v-show="loading"></full-loading>
    <toast ref="toast" :text="text"></toast>
    <!--<router-view></router-view>-->
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import FullLoading from 'base/full-loading/full-loading';
  import NoResult from 'base/no-result/no-result';
  import Toast from 'base/toast/toast';
  import { setTitle, formatDate, formatImg, getUserId } from 'common/js/util';
  import { getCookie } from 'common/js/cookie';
  import { getArticlePage, getListUserTree } from 'api/biz';

  export default {
    data() {
      return {
        text: '',
        start: 1,
        limit: 10,
        hasMore: true,
        loading: false,
        list: [],
        official: false,
        time: true
      };
    },
    mounted() {
      setTitle('情感频道');
      this.treeNo = this.$route.query.treeNo || '';
      this.userId = getCookie('userId');
      this.getPageOrders();
    },
    methods: {
      formatImg(img) {
        return formatImg(img);
      },
      formatDate(date) {
        return formatDate(date, 'yyyy.MM.dd');
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
          status: '5',
          openLevel: '1',
          queryUserId: getUserId(),
          orderDir: 'asc',
          orderColumn: 'order_no',
          treeNo: this.treeNo
        }).then((res) => {
          if (res.list.length < this.limit || res.totalCount <= this.limit) {
            this.hasMore = false;
          }
          res.list.map((item) => {
            item.photolist = item.photo.split('||');
          });
          this.list = this.list.concat(res.list);
          this.start++;
          this.loading = false;
        }).catch(() => { this.loading = false; });
      },
      changeOfficial() {
        this.official = !this.official;
      },
      changeTime() {
        this.time = !this.time;
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
  .emotion-channel-wrapper {
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
    .tab {
      height: 0.8rem;
      padding: 0.2rem 0.3rem;
      font-size: 0.28rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.88rem;
      border-bottom: 1px solid #ebebeb;
      img {
        width: 0.2rem;
        height: 0.2rem;
      }
      .active {
        color: $primary-color;
      }
    }
    .adopt-list {
      background: $color-highlight-background;
      position: absolute;
      top: 1.68rem;
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
            justify-content: space-between;
            .collect,.laud {
              font-size: 0.22rem;
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
