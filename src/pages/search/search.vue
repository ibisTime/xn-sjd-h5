<template>
  <transition name="slide">
    <div class="search-wrapper">
      <header>
        <div class="inner">
          <img src="./back@2x.png" v-if="left.back" class="back" @click="back">
          <div class="search">
            <div class="search-icon"></div>
            <input type="text" ref="searchInput" placeholder="搜索树木" v-model="query" @click="focus"/>
            <i v-show="query" class="close-icon" @click="clearInput"></i>
          </div>
          <button class="search-btn" @click="search">搜索</button>
        </div>
      </header>
      <div v-show="query" class="result-wrapper">
        <scroll ref="resultScroll" :pullUpLoad="pullUpLoad" :data="list">
          <ul>
            <li v-for="item in list" class="border-bottom-1px" @click="saveSearch(item.code)">{{item.name}}</li>
          </ul>
        </scroll>
      </div>
      <div class="history-wrapper">
        <div class="title">
          <h1>搜索历史</h1>
          <!--<i class="del-icon" @click="showConfirm"></i>-->
        </div>
        <scroll @beforeScrollStart="blurInput" :data="searchHistory" ref="historyScroll" :pullUpLoad="pullUpLoad">
          <ul>
            <li v-for="item in searchHistory" @click="addQuery(item)">{{item.content}}</li>
          </ul>
        </scroll>
      </div>
      <confirm ref="confirm" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>
      <full-loading v-show="loading" :title="title"></full-loading>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import Confirm from 'base/confirm/confirm';
  import FullLoading from 'base/full-loading/full-loading';
  import {directiveMixin} from 'common/js/mixin';
  import {getSearchHistoryList, addSearchHistory} from 'api/biz';

  export default {
    mixins: [directiveMixin],
    props: {
      right: {
        type: Object,
        default: () => {
          return {
            cancel: false,
            sign: false
          };
        }
      },
      left: {
        type: Object,
        default: () => {
          return {
            back: false
          };
        }
      }
    },
    data() {
      return {
        query: '',
        list: [],
        loading: false,
        title: '正在加载...',
        searchHistory: []
      };
    },
    created() {
      this.pullUpLoad = null;
      this.loading = true;
      getSearchHistoryList('1').then((res) => {
        this.searchHistory = res.slice(0, 11);
        this.loading = false;
      }).catch(() => {
        this.loading = true;
      });
    },
    methods: {
      search() {
        addSearchHistory({type: 1, content: this.query}).then((res) => {
          this.go(`/product-list?query=${this.query}`);
        });
      },
      addQuery(query) {
        this.query = query.content;
      },
      saveSearch(code) {
        this.saveSearchHistory(this.query);
        this.$router.push(this.$route.path + '/' + code);
      },
      showConfirm() {
        this.$refs.confirm.show();
      },
      blurInput() {
        this.$refs.searchInput.blur();
      },
      clearInput() {
        this.query = '';
      },
      back() {
        this.$router.back();
      },
      focus() {
        // this.$emit('focus');
      },
      go(url) {
        this.$router.push(url);
      }
    },
    components: {
      Scroll,
      Confirm,
      FullLoading
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .search-wrapper {
    height: 0.88rem;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;

    header {
      padding: 0.14rem 0.3rem 0;
      margin-bottom: 0.5rem;

      .inner {
        height: 0.72rem;
        display: flex;
        align-items: center;
        .back {
          height: 0.32rem;
          margin-right: 0.2rem;
        }
        .search {
          height: 100%;
          flex: 1;
          display: flex;
          align-items: center;
          border-radius: 0.3rem;
          background: #f3f4f8;
          margin-right: 0.2rem;

          .search-icon {
            flex: 0 0 0.54rem;
            height: 0.34rem;
            background-repeat: no-repeat;
            background-position: 0.2rem center;
            background-size: 0.24rem;
            @include bg-image('search');
          }

          input {
            flex: 1;
            font-size: $font-size-medium;
            background: transparent;
          }

          .close-icon {
            display: inline-block;
            width: 0.7rem;
            height: 0.34rem;
            background-size: 0.3rem;
            background-position: center;
            background-repeat: no-repeat;
            @include bg-image('close');
          }
        }
        .search-btn {
          width: 1.2rem;
          color: $color-highlight-background;
          font-size: 0.28rem;
          border-radius: 0.36rem;
          background: $primary-color;
          line-height: 0.72rem;
        }
        .cancel {
          padding: 0 0.3rem;
          height: 0.6rem;
          line-height: 0.6rem;
          font-size: $font-size-medium-xx;
        }
        .sign {
          height: 100%;
          font-size: 0;
          img {
            margin: 0 0.3rem;
            height: 0.52rem;
          }
        }
      }
    }

    .history-wrapper {
      position: absolute;
      top: 0.6rem;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0.78rem 0.3rem 0.6rem;

      .title {
        position: relative;

        .del-icon {
          position: absolute;
          right: 0;
          top: 0;
          width: 0.5rem;
          height: 0.5rem;
          background-repeat: no-repeat;
          background-position: right top;
          background-size: 0.3rem;
          @include bg-image('delete');
        }
      }

      h1 {
        font-size: 0.28rem;
        padding-bottom: 0.34rem;
        color: #333;
      }

      ul {
        font-size: 0;

        li {
          display: inline-block;
          margin-bottom: 0.2rem;
          margin-right: 0.2rem;
          padding: 0.18rem 0.36rem;
          border-radius: 0.08rem;
          font-size: 0.28rem;
          background: #f0f0f0;
        }
      }
    }

    .result-wrapper {
      position: absolute;
      top: 0.88rem;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0 0.3rem;

      li {
        padding-left: 0.3rem;
        height: 1rem;
        line-height: 1rem;
        @include border-bottom-1px($color-border);
        font-size: $font-size-medium;
        color: $color-text-l;

        &:last-child {
          @include border-none();
        }
      }
    }

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }

    &.slide-enter, &.slide-leave-to {
      left: 100%;
    }
  }
</style>
