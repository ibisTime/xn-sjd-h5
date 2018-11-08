<template>
  <div class="tree-code-wrapper">
    <!--<m-header class="cate-header" title="已认养名单"></m-header>-->
    <div class="tree-code-list">
      <scroll ref="scroll"
              :data="dataList"
              :pullUpLoad="pullUpLoad">
        <div class="content">
          <div class="item" v-for="(item, index) in dataList " @click="goUserHome(item)" :key="index">
            {{item.treeNumber || item.code}}
          </div>
        </div>
        <no-result v-show="!(dataList && dataList.length)" title="暂无树" class="no-result-wrapper"></no-result>
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
  import {formatAmount, formatDate, setTitle} from 'common/js/util';
  import { getBookingProDetail, getDeriveZichanDetail, getOriginZichanDetail } from 'api/biz';

  export default {
    data() {
      return {
        toastText: '',
        loading: false,
        loadingText: '',
        dataList: [],
        // dataList: [{code: '33sjkfghe3'}, {code: '33akjb3'}, {code: '3s33'}, {code: '3jwfhkgaeywui33'}, {code: '33ajk3'}, {code: '33qw3'}, {code: '3q33'}, {code: '333'}],
        pullUpLoad: null
      };
    },
    mounted() {
      this.derive = this.$route.query.derive || '';
      this.origin = this.$route.query.origin || '';
      this.buy = this.$route.query.buy || '';
      setTitle('树编号');
      if(this.derive) {
        this.getJishouInitData();
      } else if(this.origin) {
        this.getOriginInitData();
      } else {
        this.getInitData();
      }
    },
    methods: {
      getInitData() {
        this.getAdoptList();
      },
      getJishouInitData() {
        this.getJishouList();
      },
      getOriginInitData() {
        this.getOriginList();
      },
      getAdoptList() {
        this.loading = true;
        this.code = this.$route.query.code;
        Promise.all([
          getBookingProDetail({
            code: this.code
          })
        ]).then(([res1]) => {
          this.dataList = res1.treeList;
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        });
      },
      getJishouList() {
        this.loading = true;
        this.code = this.$route.query.code;
        Promise.all([
          getDeriveZichanDetail({
            code: this.code
          })
        ]).then(([res1]) => {
          this.dataList = res1.treeList;
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        });
      },
      getOriginList() {
        this.loading = true;
        this.code = this.$route.query.code;
        Promise.all([
          getOriginZichanDetail({
            code: this.code
          })
        ]).then(([res1]) => {
          this.dataList = res1.treeNumberList;
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        });
      },
      formatAmount(amount) {
        return formatAmount(amount);
      },
      formatDate(date, format) {
        return formatDate(date, format);
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
  .tree-code-wrapper {
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
    .tree-code-list {
      background: $color-highlight-background;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0.3rem;
      right: 0.3rem;
      .content {
        font-size: 0;
        padding: 0.3rem 0;
        .item {
          display: inline-block;
          font-size: $font-size-medium-s;
          line-height: 0.37rem;
          border: 1px solid $color-border;
          padding: 0.11rem 0.16rem;
          margin: 0 0.3rem 0.3rem 0;
          color: #999;
        }
      }
    }
  }
</style>
