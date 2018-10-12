<template>
  <div class="adopt-list-wrapper">
    <m-header class="cate-header" title="养护记录"></m-header>
    <div class="adopt-list">
      <Scroll :data="mrList"
              :hasMore="hasMore"
              @pullingUp="getPageOrder">
        <div class="item" @click="go('/maintain-detail?code=' + item.code)" v-for="item in mrList">
          <img :src="formatImg(item.pics[0])">
          <div class="info">
            <p class="info-title">{{item.projectName}}</p>
            <p class="info-pic">图片：{{item.pics.length}}</p>
            <p class="bottom"><span class="name">{{item.maintainerName}}</span><span class="datetime">{{formatDate(item.updateDatetime)}}</span></p>
          </div>
        </div>
      </Scroll>
    </div>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import {setTitle, formatDate, formatImg} from 'common/js/util';
  import { getMaintainRecordsPage } from 'api/biz';

  export default {
    data() {
      return {
        start: 1,
        limit: 10,
        hasMore: true,
        treeNumber: '',
        mrList: []
      };
    },
    mounted() {
      setTitle('养护记录');
      this.treeNumber = this.$route.query.treeNumber;
      this.getPageOrder();
    },
    methods: {
      formatDate(date) {
        return formatDate(date, 'yyyy-MM-dd');
      },
      formatImg(img) {
        return formatImg(img);
      },
      go(url) {
        this.$router.push(url);
      },
      getPageOrder() {
        Promise.all([
          getMaintainRecordsPage({
            treeNumber: this.treeNumber,
            start: this.start,
            limit: this.limit
          })
        ]).then(([res]) => {
          console.log(res);
          if (res.totalPage <= this.start) {
            this.hasMore = false;
          }
          res.list.map((item) => {
            item.pics = item.pic.split('||');
          });
          this.mrList = [...this.mrList, ...res.list];
          console.log(this.mrList);
          this.start ++;
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
          .info-title {
            font-size: $font-size-medium-x;
            line-height: $font-size-large-s;
            margin-bottom: 0.1rem;
          }
          .info-pic {
            color: #666;
            font-size: $font-size-small;
            line-height: 0.33rem;
            margin-bottom: 0.18rem;
          }
          .bottom {
            font-size: $font-size-small;
            line-height: 0.33rem;
            .name {
              color: #666;
              margin-right: 0.4rem;
            }
            .datetime {
              color: #999;
            }
          }
        }
      }
    }
  }
</style>
