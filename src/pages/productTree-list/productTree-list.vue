<template>
  <div class="adopt-list-wrapper">
    <!--<m-header class="cate-header" title="树木查看"></m-header>-->
    <div class="productTree-list">
      <Scroll :pullUpLoad="pullUpLoad">
        <div class="item" @click="go('/productTree-detail?code='+item.code)" v-for="item in this.proList">
          <div class="info">
            <div class="imgWrap" :style="getImgSyl(item.pic)"></div>
            <div class="text">
              <p class="title">编号：{{item.treeNumber}}</p>
              <!--<p class="title"><span>编号：{{item.treeNumber}}</span><span @click="go('/productTree-detail?code='+item.code)">古树风貌</span><span>它的氧圈</span></p>-->
              <p class="position">学名：{{item.scientificName}}</p>
              <div class="props">
                <span class="duration">树级：{{item.rank}} / 树龄：{{item.age}}</span>
                <samp class="status">{{statusList[item.status]}}</samp>
              </div>
            </div>
          </div>
        </div>
      </Scroll>
    </div>
    <toast ref="toast" :text="text"></toast>
    <router-view></router-view>
  </div>
</template>
<script>
  import Toast from 'base/toast/toast';
  import FullLoading from 'base/full-loading/full-loading';
  import Slider from 'base/slider/slider';
  import NoResult from 'base/no-result/no-result';
  import MHeader from 'components/m-header/m-header';
  import Scroll from 'base/scroll/scroll';
  import {formatAmount, formatDate, formatImg, setTitle} from 'common/js/util';
  import {getProductTreePage} from 'api/biz';
  import { getDictList } from 'api/general';
  import defaultImg from './tree@3x.png';

  export default {
    data() {
      return {
        title: '正在加载...',
        loading: true,
        toastText: '',
        currentList: [],
        text: '',
        start: 1,
        limit: 10,
        hasMore: true,
        proList: [],
        showCheckIn: false,
        pullUpLoad: null,
        currentIndex: +this.$route.query.index || 0,
        code: '',
        index: 0,
        statusList: {}
      };
    },
    methods: {
      formatAmount(amount) {
        return formatAmount(amount);
      },
      formatDate(date, format) {
        return formatDate(date, format);
      },
      formatImg(img) {
        return formatImg(img);
      },
      action() {
        this.showCheckIn = true;
      },
      close() {
        this.showCheckIn = false;
      },
      go(url) {
        this.$router.push(url);
      },
      getPageOrders() {
        this.loading = true;
        this.code = this.$route.query.code;
        Promise.all([
          getProductTreePage({
            start: this.start,
            limit: this.limit,
            productCode: this.code
          })
        ]).then(([res1]) => {
          if (res1.list.length < this.limit || res1.totalCount <= this.limit) {
            this.hasMore = false;
          }
          this.loading = false;
          res1.list.map(function (d) {
            res1.applyDatetime = formatDate(res1.applyDatetime);
            if (d.pic) {
              d.pic = d.pic.split('||')[0];
            }
          });
          this.proList = this.proList.concat(res1.list);
          this.start++;
        }).catch(() => {
          this.loading = false;
        });
      },
      getImgSyl(imgs) {
        let img = imgs ? formatImg(imgs) : defaultImg;
        return {
          backgroundImage: `url(${img})`
        };
      },
      getStatus() {
        getDictList('tree_status').then((res) => {
          res.map((item) => {
            this.statusList[item.dkey] = item.dvalue;
          });
        }).catch(() => {});
      }
    },
    mounted() {
      setTitle('树木查看');
      this.pullUpLoad = null;
      this.loading = true;
      this.getStatus();
      this.getPageOrders();
    },
    components: {
      FullLoading,
      Toast,
      Slider,
      NoResult,
      MHeader,
      Scroll
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
    .gray {
      width: 100%;
      height: 0.2rem;
      padding: 0;
      background: #f5f5f5;
    }
    .productTree-list {
      background: $color-highlight-background;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      .item {
        width: 100%;
        /*height: 2.3rem;*/
        font-size: $font-size-medium-x;
        line-height: 1.1rem;
        border-bottom: 1px solid #eee;
        /*display: flex;*/
        /*align-items: center;*/
        .info {
          display: flex;
          font-size: 0;
          padding: 0.3rem;
          .imgWrap {
            width: 1.5rem;
            height: 1.5rem;
            flex: 0 0 1.5rem;
            margin-right: 0.2rem;
            border-radius: 0.08rem;
            position: relative;
            overflow: hidden;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
          }
          .text {
            display: flex;
            flex-direction: column;
            width: 100%;
            .title {
              font-size: 0.3rem;
              line-height: 0.42rem;
              margin-bottom: 0.17rem;
              display: flex;
              justify-content: space-between;
              flex: 1;
            }
            .position {
              font-size: 0.24rem;
              line-height: 0.33rem;
              color: #999;
              margin-bottom: 0.25rem;
            }
            .props {
              font-size: $font-size-small;
              line-height: 0.33rem;
              color: #999;
              display: flex;
              justify-content: space-between;
              position: relative;

              .duration {

              }
              .status {
                position: absolute;
                top: 0;
                right: 0.06rem;
                z-index: 9;
                color: $color-red;
              }
            }
          }
        }
      }
    }
  }
</style>
