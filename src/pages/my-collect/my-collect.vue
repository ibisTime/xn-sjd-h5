<template>
  <div class="adopt-list-wrapper">
    <m-header class="cate-header" title="我的收藏"></m-header>
    <!--<div class="type">-->
      <!--<span @click="changeType(0)" :class="type === 0 ? 'active' : ''">文章</span>-->
      <!--<span @click="changeType(1)" :class="type === 1 ? 'active' : ''">古树</span>-->
    <!--</div>-->
    <div class="article-list" v-show="type === 0">
      <Scroll :pullUpLoad="pullUpLoad">
        <div class="item" @click="go('/article-detail?code=' + artItem.article.code)" v-for="(artItem, index) in collectTextData" :key="index">
          <img alt="" :src="getImgSyl(artItem.article.photo)">
          <div class="info">
            <p class="title">{{artItem.article.title}}</p>
            <!--<div class="info-middle">-->
              <!--<span>作者：{{artItem.article.publishUserName}}</span>-->
              <!--<span v-show="artItem.article.treeName">关联古树：{{artItem.article.treeName}}</span>-->
            <!--</div>-->
            <p class="prop"><span class="date">{{formatDate(artItem.createDatetime)}}</span><span class="collect">收藏 {{artItem.article.collectCount}}</span><span class="laud">赞 {{artItem.article.pointCount}}</span></p>
          </div>
        </div>
      </Scroll>
      <div v-show="!collectTextData.length" class="no-result-wrapper">
        <no-result title="抱歉，暂无收藏"></no-result>
      </div>
    </div>
    <div class="tree" v-show="type === 1">
      <Scroll :pullUpLoad="pullUpLoad">
        <div class="tree-list">
          <div class="item" @click="go('/product-detail')">
            <img src="./emotion@2x.png" class="hot-pro-img">
            <div class="hot-pro-text">
              <p class="hot-pro-title">捐赠认养古树</p>
              <p class="hot-pro-place"><span class="hot-pro-introduction">四川 成都</span><img src="./emotion@2x.png" class="fr"></p>
              <p><span class="hot-pro-price">¥2480.00</span></p>
            </div>
          </div>
        </div>
      </Scroll>
    </div>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import NoResult from 'base/no-result/no-result';
  import { myArticlePage } from 'api/biz';
  import { formatImg, formatDate } from 'common/js/util';

  export default {
    data() {
      return {
        type: 0,
        collectTextData: [],   // 文章收藏
        collectTreeData: []    // 古树收藏
      };
    },
    created() {
      this.pullUpLoad = null;
      Promise.all([myArticlePage()]).then(([res1]) => {
        this.collectTextData = res1;
      }).catch(() => {});
    },
    methods: {
      formatImg(img) {
        return formatImg(img);
      },
      formatDate(time) {
        return formatDate(time);
      },
      go(url) {
        this.$router.push(url);
      },
      getImgSyl(imgs, type) {
        let pic = imgs ? formatImg(imgs) : type === 'u' ? 'static/avatar@2x.png' : 'static/default.png';
        return pic;
      },
      changeType(index) {
        this.type = index;
      },
      goProductDetail() {
        this.$router.push('/product-detail');
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
    .type {
      height: 0.8rem;
      margin-top: 0.88rem;
      font-size: 0;
      display: flex;
      align-items: center;
      justify-content: space-around;
      border-bottom: 1px solid $color-border;
      .active {
        color: $primary-color;
        border-bottom: 1px solid $primary-color;
      }
      span {
        font-size: $font-size-medium-x;
        line-height: 0.42rem;
      }
    }
    .article-list {
      background: $color-highlight-background;
      position: absolute;
      /*top: 1.68rem;*/
      top: 1rem;
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
      .no-result-wrapper{
        position: absolute;
        left: 50%;
        top: 10%;
        transform: translateX(-50%);
      }
    }
    .tree {
      padding: 0 0.3rem 0;
      background: $color-highlight-background;
      position: absolute;
      top: 1.68rem;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: auto;
      .tree-list {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        font-size: 0;
        .item {
          width: 3.3rem;
          height: 4.17rem;
          margin-top: 0.3rem;
          border: 1px solid #e6e6e6;
          border-radius: 0.04rem;
          display: inline-block;
          .hot-pro-img {
            height: 2.3rem;
            width: 100%;
            margin-bottom: 0.2rem;
          }
          .hot-pro-text {
            padding: 0 0.2rem;
            p {
              font-size: 0;
            }
            .hot-pro-title {
              font-size: $font-size-medium-x;
              line-height: 0.42rem;
              margin-bottom: 0.19rem;
            }
            .hot-pro-place {
              margin-bottom: 0.17rem;
              .hot-pro-introduction {
                color: $color-text-l;
                font-size: $font-size-small;
                line-height: $font-size-medium-xx;
              }
              img {
                width: 0.77rem;
                height: 0.32rem;
              }
            }
            .hot-pro-price {
              color: $primary-color;
              font-size: $font-size-small;
              line-height: 0.29rem;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
</style>
