<template>
  <div class="me-wrapper full-screen-wrapper">
    <div class="bg">
      <m-header class="cate-header" title="完善资料" actText="保存" @action="action"></m-header>
      <div class="content">
        <div class="in-content">
          <div class="avatar">
            <img :src="getAvatar()"/>
            <!--<qiniu-->
              <!--ref="qiniu"-->
              <!--style="visibility: hidden;position: absolute;"-->
              <!--:token="token"-->
              <!--:uploadUrl="uploadUrl"></qiniu>-->
            <!--<input class="input-file"-->
                   <!--type="file"-->
                   <!--:multiple="multiple"-->
                   <!--ref="fileInput"-->
                   <!--@change="fileChange"-->
                   <!--accept="image/*"/>-->
          </div>
          <div class="user-info-list">
            <div>
              <span class="mr110">昵称</span>
              <input type="text" name="nickname" v-model="nickname" v-validate="required" placeholder="请输入昵称">
              <span v-show="errors.has('mobile')" class="error-tip">{{errors.first('mobile')}}</span>
            </div>
            <div>
              <span class="mr110">性别</span>
              <select v-validate="'required'" name="sex" v-model="sex">
                <option value="" style="display: none">请输入用户</option>
                <option value="男" selected>男</option>
                <option value="女">女</option>
              </select>
              <span v-show="errors.has('mobile')" class="error-tip">{{errors.first('mobile')}}</span>
            </div>
            <div>
              <span class="mr110">年龄</span>
              <input type="tel" name="age" v-model="age" v-validate="required" placeholder="请输入年龄">
            </div>
            <div>
              <span class="mr50">真实姓名</span>
              <input type="text" name="realName" v-model="realName" v-validate="required" placeholder="请输入真实姓名">
            </div>
            <div>
              <span class="mr50">身份证号</span>
              <input type="text" name="idNo" v-model="idNo" v-validate="required" placeholder="请输入身份证号">
            </div>
          </div>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import Qiniu from 'base/qiniu/qiniu';
  import MHeader from 'components/m-header/m-header';
  import {setTitle, formatImg} from 'common/js/util';

  export default {
    data() {
      return {
        nickname: '',
        sex: '男',
        age: '',
        realName: '',
        idNo: ''

      };
    },
    created() {
      setTitle('完善资料');
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
      //
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
  .me-wrapper {
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
        padding: 0.88rem 0.3rem;
        margin-bottom: 0.98rem;
        .in-content {
          .avatar {
            height: 2.6rem;
            border-bottom: 1px solid $color-border;
            text-align: center;
            position: relative;
            img {
              width: 1.1rem;
              height: 1.1rem;
              margin-top: 0.75rem;
            }
            .input-file {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              opacity: 0;
            }
          }
          .user-info-list {
            background: $color-highlight-background;
            .mr50 {
              margin-right: 0.5rem;
            }
            .mr110 {
              margin-right: 1.1rem;
            }
            div {
              width: 100%;
              height: 1.1rem;
              font-size: $font-size-medium-x;
              line-height: 1.1rem;
              border-bottom: 1px solid #eee;
              color: #333;
              font-size: 0.3rem;
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
          }
        }
      }
    }
    input::-webkit-input-placeholder {
      color: #ccc;
    }
  }
</style>
