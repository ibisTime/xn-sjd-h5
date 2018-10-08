<template>
  <div class="score-rules-wrapper full-screen-wrapper">
    <div class="bg">
      <m-header class="cate-header" title="积分规则"></m-header>
      <div class="content">
        <div class="title">
          <span class="name">产生项</span>
          <span class="score">分值</span>
        </div>

        <scroll ref="scroll"
          :data="systemConfigPage"
          :hasMore="hasMore"
          @pullingUp="getConfigData">
          <div class="item" v-for="(item, index) in systemConfigPage" :key="index">
            <span class="name">{{item.remark}}</span>
            <span class="score">{{item.cvalue}}</span>
          </div>
          <no-result v-show="!hasMore && !(systemConfigPage && systemConfigPage.length)" title="暂无积分规则" class="no-result-wrapper"></no-result>
        </Scroll>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import {getSystemConfigPage} from 'api/general';
  import NoResult from 'base/no-result/no-result';
  export default {
    data() {
      return {
        systemConfigPage: [],
        hasMore: true,
        start: 1,
        limit: 10
      };
    },
    mounted() {
      this.getConfigData();
    },
    methods: {
      getInitData() {
        this.getConfigData();
      },
      getConfigData() {
        if (this.hasMore) {
          getSystemConfigPage({
            type: 'JF_RULE',
            start: this.start,
            limit: this.limit
          }).then(data => {
            if (data.list.length < this.limit || data.totalCount <= this.limit) {
              this.hasMore = false;
            }
            this.systemConfigPage = this.systemConfigPage.concat(data.list);
            this.start ++;
          });
        }
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
  .score-rules-wrapper {
    background: $color-highlight-background;
    margin-top: 0.88rem;
    .fl {
      float: left;
    }
    .fr {
      float: right;
    }
    .bg {
      .content {
        position: absolute;
        top: 0rem;
        left: 0;
        bottom: 0.62rem;
        width: 100%;
        padding: 0.62rem 0.3rem;
        .title {
          font-size: $font-size-medium-x;
          color: #333;
          display: flex;
          .name {
            flex: 1;
          }
          .score {
            width: 0.7rem;
          }
        }
        .item {
          padding: 0.37rem 0;
          font-size: $font-size-medium-s;
          line-height: 0.37rem;
          display: flex;
          border-bottom: 1px solid $color-border;
          .name {
            flex: 1;
          }
          .score {
            width: 0.7rem;
          }
        }
      }
    }
    .no-result-wrapper {
      position: absolute;
      width: 100%;
      top: 40%;
      left: 0;
      transform: translateY(-50%);
    }
  }

</style>
