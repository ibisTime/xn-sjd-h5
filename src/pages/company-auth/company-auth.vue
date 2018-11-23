<template>
  <transition name="slide">
    <div class="person-auth-wrapper">
      <div class="form-wrapper">
        <div class="form-item border-bottom-1px">
          <div class="item-label">企业名称</div>
          <div class="item-input-wrapper">
            <input type="text" class="item-input" v-model="name" name="name" v-validate="'required'" placeholder="请输入企业名称">
            <span v-show="errors.has('name')" class="error-tip">{{errors.first('name')}}</span>
          </div>
        </div>
        <div class="form-item border-bottom-1px">
          <div class="item-label">营业执照号</div>
          <div class="item-input-wrapper">
            <input type="tel" class="item-input" v-model="mobile" name="mobile" v-validate="'required|mobile'" placeholder="请输入营业执照号">
            <span v-show="errors.has('mobile')" class="error-tip">{{errors.first('mobile')}}</span>
          </div>
        </div>
        <div class="text">
          <textarea v-model="context" ref="textarea" @input="autosize" v-validate="'required'" rows="5" class="item-input" placeholder="请输入企业简介"></textarea>
        </div>
        <div class="avatar">
          <img :src="formatImg(item.key)" v-for="(item, index) in photos" class="avatar-photos" ref="myImg" @click="choseItem(index)"/>
          <!--<qiniu-->
            <!--ref="qiniu"-->
            <!--style="visibility: hidden;position: absolute;"-->
            <!--:token="token"-->
            <!--:uploadUrl="uploadUrl"></qiniu>-->
          <div class="input-box">
            <!--<input class="input-file"-->
                   <!--type="file"-->
                   <!--:multiple="multiple"-->
                   <!--ref="fileInput"-->
                   <!--@change="fileChange($event)"-->
                   <!--accept="image/*"/>-->
            <img src="./upload@2x.png">
          </div>
        </div>
        <div class="form-btn">
          <button :disabled="setting" @click="saveAddress">保存</button>
        </div>
        <!--<full-loading v-show="showLoading"></full-loading>-->
        <toast ref="toast" :text="toastText"></toast>
      </div>
    </div>
  </transition>
</template>
<script>
  import { setTitle } from 'common/js/util';
  import FullLoading from 'base/full-loading/full-loading';
  import Toast from 'base/toast/toast';

  export default {
    data() {
      return {
        setting: false,
        name: '',
        mobile: '',
        province: '',
        city: '',
        district: '',
        provErr: '',
        address: '',
        addressErr: '',
        isDefault: '0',
        showLoading: true,
        isAlert: true,
        toastText: '',
        code: '',
        photos: [],
        context: ''
      };
    },
    created() {
      setTitle('企业认证');
      // this.code = this.$route.params.id || '';
      this.code = sessionStorage.getItem('ressCode');
    },
    methods: {
      autosize(obj) {
        // let el = obj;
        setTimeout(() => {
          // console.log(1);
          this.$refs.textarea.style.cssText = 'height:auto; padding:0';
          // for box-sizing other than "content-box" use:
          // el.style.cssText = '-moz-box-sizing:content-box';
          this.$refs.textarea.style.cssText = 'height:' + this.$refs.textarea.scrollHeight + 'px';
        }, 0);
      },
      _initPageData(addr) {
        this.showLoading = false;
        this.name = addr.addressee;
        this.mobile = addr.mobile;
        this.address = addr.detailAddress;
        this.isDefault = addr.isDefault;
        this.province = addr.province;
        this.city = addr.city;
        this.district = addr.district;
      }
    },
    components: {
      FullLoading,
      Toast
    }
  };
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  @import "~common/scss/variable";

  .person-auth-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;;
    .form-wrapper {
      padding: 0rem 0.3rem;
      .form-item {
        .item.label {
          flex: 0 0 1.2rem;
        }
        .item-label {
          padding: 0;
        }
        .item-input-wrapper {
          padding-right: 0;
          height: 1.1rem;
        }
      }
      .form-btn {
        padding: 0;
        button {
          border-radius: 0.08rem;
        }
      }
      .text {
        padding-top: 0.3rem;
        border-bottom: 1px solid $color-border;
        .item-input {
          line-height: 0.5rem;
          width: 100%;
        }
      }
      .avatar {
        position: relative;
        padding: 0.3rem;
        font-size: 0;
        .avatar-photos {
          width: 1.6rem;
          height: 1.6rem;
          margin: 0.35rem 0.3rem 0 0;
          vertical-align: bottom;
        }
        .input-box {
          display: inline-block;
          position: relative;
          img {
            /*width: 1.6rem;*/
            /*height: 1.6rem;*/
            /*margin: 0.35rem 0.3rem 0 0;*/
            /*vertical-align: bottom;*/
            width: 1.6rem;
            height: 1.6rem;
            /* margin: 0.35rem 0.3rem 0 0; */
            vertical-align: bottom;
            float: left;
            /* position: absolute; */
            /* left: 0; */
            z-index: 32;
            top: 0;
          }
          .input-file {
            /*width: 1.6rem;*/
            /*height: 1.6rem;*/
            /*background: url("./upload@2x.png") no-repeat;*/
            /*background-size: 100% 100%;*/
            /*font-size: 0;*/
            width: 1.6rem;
            height: 1.6rem;
            /* background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAYAAACLz2ctAAAAAXNSR…4DLF+LuRQIl+NhHIW6HReVShmFyYDddmm3zSa+mpqaN/8H23Hj+bUf5sYAAAAASUVORK5CYII=) no-repeat; */
            /*background-size: 100% 100%;*/
            font-size: 0;
            /* float: left; */
            z-index: 44;
            position: absolute;
            left: 0;
            opacity: 0;
          }
        }
      }
    }
  }
  input::-webkit-input-placeholder {
    color: #ccc;
  }
  textarea::-webkit-input-placeholder {
    color: #ccc;
    font-size: $font-size-medium-s;
  }
</style>
