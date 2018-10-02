<template>
  <div class="adopt-list-wrapper">
    <m-header class="cate-header" title="树木查看"></m-header>
    <div class="productTree-list">
      <Scroll :pullUpLoad="pullUpLoad">
        <div class="item" @click="go('/productTree-detail?code='+item.code)" v-for="item in this.proList">
          <div class="info">
           <div class="imgWrap" :style="getImgSyl(item.pic)">
             <samp>{{item.status}}</samp>
           </div>
            <div class="text">
              <p class="title">编号：{{item.code}}</p>
              <p class="position">学名：{{item.scientificName}}</p>
              <div class="props"><span class="duration">树级：{{item.rank}} / 树龄：{{item.age}}</span></div>
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
  import { formatAmount, formatDate, formatImg } from 'common/js/util';
  import { getProductTreePage } from 'api/biz';

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
        index: 0
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
            if(d.pic) {
              d.pic = d.pic.split('||')[0];
            }
          });
          this.proList = this.proList.concat(res1.list);
          this.start++;
        }).catch(() => { this.loading = false; });
      },
      getImgSyl(imgs) {
        let img = imgs ? formatImg(imgs) : './tree@3x.png';
        return {
          backgroundImage: `url(${img})`
        };
      }
    },
    mounted() {
      this.pullUpLoad = null;
      this.loading = true;
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
      top: 0.88rem;
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
          .imgWrap{
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

            samp {
              position: absolute;
              bottom: 0;
              right: 0.06rem;
              z-index: 9;
              font-size: 0.2rem;
              line-height: 2;
              color: $color-red;
            }
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
              .duration {

              }
            }
          }
        }
      }
    }
  }
</style>
