<template>
  <transition name="slide">
    <div class="surprise-wrapper">
      <m-header class="cate-header" title="赠送"></m-header>
      <div class="pic">
        <img :src="formatImg()">
      </div>
      <div class="tip">
        您想把这棵树转赠给谁的话，就填入TA的账号吧
      </div>
      <div class="form-wrapper">
        <div class="form-item border-bottom-1px">
          <div class="item-label">赠送对象</div>
          <div class="item-input-wrapper">
            <input v-focus type="tel" class="item-input" name="mobile" v-model="mobile" v-validate="'required|mobile'" placeholder="请输入对方手机号码">
            <span v-show="errors.has('mobile')" class="error-tip">{{errors.first('mobile')}}</span>
          </div>
        </div>
        <!--<div class="form-item  border-bottom-1px">-->
          <!--<div class="item-label">对象昵称</div>-->
          <!--<div class="item-input-wrapper">-->
            <!--<input class="item-input" v-model="nickname" v-validate="'required'" placeholder="请输入对方昵称">-->
            <!--<span v-show="errors.has('nickname')" class="error-tip">{{errors.first('nickname')}}</span>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="form-item border-bottom-1px">-->
          <!--<div class="item-label">对方姓名</div>-->
          <!--<div class="item-input-wrapper">-->
            <!--<input class="item-input" name="realName" v-model="realName" v-validate="'required'" placeholder="请输入对方姓名">-->
            <!--<span v-show="errors.has('realName')" class="error-tip">{{errors.first('realName')}}</span>-->
          <!--</div>-->
        <!--</div>-->
        <div class="form-btn">
          <button @click="give">确认赠送</button>
        </div>
        <toast ref="toast" text="赠送成功"></toast>
      </div>
    </div>
  </transition>
</template>
<script>
  import {directiveMixin} from 'common/js/mixin';
  import {formatImg, setTitle} from 'common/js/util';
  import Toast from 'base/toast/toast';
  import MHeader from 'components/m-header/m-header';
  import { GiveTree } from 'api/biz';
  import defaultImg from './../../common/image/tree-default.png';

  export default {
    mixins: [directiveMixin],
    data() {
      return {
        captErr: '',
        mobile: '',
        nickname: '',
        realName: '',
        adoptTreeCode: '', // 认养权编号
        other: 0,
        currentHolder: '',
        pic: ''
      };
    },
    mounted() {
      setTitle('赠送');
      this.other = this.$route.query.other;
      this.currentHolder = this.$route.query.currentHolder;
      this.adoptTreeCode = this.$route.query.aTCode;
      this.pic = this.$route.query.pic;
    },
    methods: {
      formatImg() {
        return this.pic && this.pic !== 'undefined' ? formatImg(this.pic) : defaultImg;
      },
      give() {
        if(this.mobile && this.adoptTreeCode) {
          GiveTree({
            code: this.adoptTreeCode,
            toMobile: this.mobile
          }).then(() => {
            this.$refs.toast.show();
            setTimeout(() => {
              this.go(`/homepage`);
            }, 2000);
          }, () => {});
        }
      },
      go(url) {
        this.$router.push(url);
      }
    },
    components: {
      Toast,
      MHeader
    }
  };
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  @import "~common/scss/variable";

  .surprise-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $color-highlight-background;
    .pic {
      width: 100%;
      height: 4rem;
      margin-top: 0.88rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .tip {
      background: #FDF4D6;
      width: 100%;
      height: 0.7rem;
      font-size: 0.24rem;
      color: #666;
      line-height: 0.7rem;
      padding: 0 0.3rem;
    }
    .form-wrapper {
      padding: 0 0.3rem;
      font-weight: 500;
      .form-item {
        .item-btn {
          width: 1.68rem;
          padding-right: 0;
          button {
            height: 0.53rem;
            line-height: 0.52rem;
            background: $color-highlight-background;
            color: $primary-color;
            border: 1px solid $primary-color;
            border-radius: 0.04rem;
          }
          .gray {
            background: #cccccc;
            border:none;
            color: #fff;
          }
        }
        .item-label {
          padding-left: 0;
        }
      }
      .item-input-wrapper {
        padding: 0;
        height: 1.1rem;
        .error-tip {
          right: 0;
        }
      }
      .form-btn {
        padding: 0;
        button {
          border-radius: 0.08rem;
          font-size: $font-size-medium-x;
        }
      }
    }
  }
  input::-webkit-input-placeholder {
    color: #ccc;
  }
</style>
