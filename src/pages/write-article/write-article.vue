<template>
  <div class="write-article-wrapper full-screen-wrapper">
    <div class="bg">
      <m-header class="cate-header" title="发布文章" actText="保存" @action="action"></m-header>
      <div class="content">
        <div class="in-content">
          <div class="user-info-list">
            <div>
              <input type="text" name="title" v-model="title" v-validate="required" placeholder="标题">
              <span v-show="errors.has('title')" class="error-tip">{{errors.first('title')}}</span>
            </div>
            <div class="text">
              <textarea v-model="text" v-validate="required" rows="5" class="item-input" placeholder="发表下你的感想吧"></textarea>
            </div>
          </div>
          <div class="avatar">
            <!--<img :src="getAvatar()"/>-->

            <qiniu
              ref="qiniu"
              style="visibility: hidden;position: absolute;"
              :token="token"
              :uploadUrl="uploadUrl"></qiniu>
            <input class="input-file"
                   type="file"
                   :multiple="multiple"
                   ref="fileInput"
                   accept="image/*"/>
          </div>
          <div class="gray"></div>
          <div class="user-info-list">
            <div>
              <select v-validate="'required'" name="sex" v-model="sex">
                <option value="" style="display: none">关联古树</option>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
              <span v-show="errors.has('mobile')" class="error-tip">{{errors.first('mobile')}}</span>
            </div>
            <div>
              <select v-validate="'required'" name="type" v-model="type">
                <option value="" style="display: none">关联古树</option>
                <option value="公开">公开</option>
                <option value="私密">私密</option>
                <option value="仅好友可见">仅好友可见</option>
              </select>
              <span v-show="errors.has('type')" class="error-tip">{{errors.first('type')}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="button">
        <button>发布</button>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import Qiniu from 'base/qiniu/qiniu';
  import MHeader from 'components/m-header/m-header';
  import {formatImg} from 'common/js/util';

  export default {
    data() {
      return {
        sex: '男',
        type: '公开',
        title: '',
        text: '',
        token: '',
        uploadUrl: ''
      };
    },
    created() {
    },
    methods: {
      go(url) {
        this.$router.push(url);
      },
      getAvatar() {
        if (!this.user) {
          return require('./avatar@2x.png');
        }
        return formatImg(this.preview || this.user.photo);
      },
      action() {
        // 保存方法
      }
    },
    components: {
      Scroll,
      MHeader,
      Qiniu
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  .write-article-wrapper {
    background: #fff;
    .fl {
      float: left;
    }
    .fr {
      float: right;
    }
    .bg {
      background-size: contain;
      .title {
        font-size: 0.36rem;
        color: #fff;
        padding-top: 0.19rem;
        text-align: center;
      }
      .content {
        padding: 0.88rem 0 0;
        margin-bottom: 1.62rem;
        .in-content {
          .avatar {
            height: 2.6rem;
            border-bottom: 1px solid $color-border;
            position: relative;
            padding: 0 0.3rem;
            img {
              width: 1.1rem;
              height: 1.1rem;
              margin-top: 0.75rem;
            }
            .input-file {
              width: 1.6rem;
              height: 1.6rem;
              background: url("./upload@2x.png") no-repeat;
              background-size: 100% 100%;
              font-size: 0;
            }
          }
          .user-info-list {
            background: $color-highlight-background;
            padding: 0 0.3rem;
            .mr50 {
              margin-right: 0.5rem;
            }
            .mr110 {
              margin-right: 1.1rem;
            }
            select {
              font-size: $font-size-medium-s;
            }
            div {
              width: 100%;
              font-size: $font-size-medium-x;
              line-height: 1.1rem;
              border-bottom: 1px solid #eee;
              img {
                height: 0.34rem;
              }
              .more {
                margin-top: 0.3rem;
              }
              select {
                width: 3rem;
                background: #fff;
              }
            }
            .text {

              border: none;
              .item-input {
                line-height: 0.5rem;
                width: 100%;
              }
            }
          }
        }
      }
      .button {
        height: 0.84rem;
        padding: 0 0.3rem;
        button {
          background: $primary-color;
          border-radius: 0.08rem;
          color: $color-highlight-background;
          width: 100%;
          height: 100%;
        }
      }
    }
    .gray {
      width: 100%;
      height: 0.2rem;
      padding: 0;
      background: #f5f5f5;
    }
    input::-webkit-input-placeholder {
      color: #ccc;
    }
    textarea::-webkit-input-placeholder {
      color: #ccc;
      font-size: $font-size-medium-s;
    }
    select:invalid { color: gray; }
  }
</style>
