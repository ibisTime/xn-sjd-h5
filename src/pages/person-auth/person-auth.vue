<template>
  <transition name="slide">
    <div class="person-auth-wrapper">
      <div class="form-wrapper">
        <div class="form-item border-bottom-1px">
          <div class="item-label">真实姓名</div>
          <div class="item-input-wrapper">
            <input type="text" class="item-input" v-model="perConfig.realName" name="name" v-validate="'required'" placeholder="请输入姓名">
            <span v-show="errors.has('name')" class="error-tip">{{errors.first('name')}}</span>
          </div>
        </div>
        <div class="form-item border-bottom-1px">
          <div class="item-label">身份证号</div>
          <div class="item-input-wrapper">
            <input type="text" class="item-input" v-model="perConfig.idNo" name="idCard" v-validate="'required|idCard'" placeholder="请输入身份证号">
            <span v-show="errors.has('idCard')" class="error-tip">{{errors.first('idCard')}}</span>
          </div>
        </div>
        <div class="text">
          <textarea v-model="perConfig.introduce" ref="textarea" v-validate="'required'" class="item-input" placeholder="说些什么吧，这会在您的空间内展示"></textarea>
        </div>
        <div class="avatar-box">
          <div class="avatar">
            <img src="./rzz.png" v-show="photos.length === 0">
            <img :src="formatImg(photos, 'zm')"/>
            <qiniu
              ref="qiniu"
              style="visibility: hidden;position: absolute;"
              :token="token"
              :uploadUrl="uploadUrl"></qiniu>
            <div class="input-box">
              <input class="input-file"
                     type="file"
                     :multiple="multiple"
                     ref="fileInput"
                     @change="fileChange($event, 'zm')"
                     accept="image/*"/>
            </div>
          </div>
          <div class="avatar">
            <img src="./rzf.png" v-show="photoFm.length === 0">
            <img :src="formatImg(photoFm, 'fm')"/>
            <qiniu
              ref="qiniu"
              style="visibility: hidden;position: absolute;"
              :token="token"
              :uploadUrl="uploadUrl"></qiniu>
            <div class="input-box">
              <input class="input-file"
                     type="file"
                     :multiple="multiple"
                     ref="fileInput"
                     @change="fileChange($event, 'fm')"
                     accept="image/*"/>
            </div>
          </div>
        </div>
        <div class="form-btn">
          <button :disabled="setting" @click="saveMessage">保存</button>
        </div>
        <full-loading v-show="showLoading"></full-loading>
        <toast ref="toast" :text="toastText"></toast>
      </div>
    </div>
  </transition>
</template>
<script>
  import CityPicker from 'base/city-picker/city-picker';
  import FullLoading from 'base/full-loading/full-loading';
  import Toast from 'base/toast/toast';
  import MHeader from 'components/m-header/m-header';
  import { getQiniuToken } from 'api/general';
  import { certification, getUser } from 'api/user';
  import { setTitle, formatImg, getImgData, getUserId } from 'common/js/util';
  import EXIF from 'exif-js';
  import Qiniu from 'base/qiniu/qiniu';

  export default {
    data() {
      return {
        setting: false,
        province: '',
        city: '',
        district: '',
        provErr: '',
        isDefault: '0',
        showLoading: true,
        isAlert: true,
        toastText: '',
        photos: [],
        photoFm: [],
        token: '',
        uploadUrl: 'http://up-z0.qiniu.com',
        multiple: false,
        perConfig: {
          idNo: '',
          idPic: '',  // 正面
          backIdPic: '', // 反面
          introduce: '',
          realName: '',
          userId: getUserId()
        },
        perStatus: ''
      };
    },
    created() {
      setTitle('个人认证');
      this.perStatus = this.$route.query.perStatus;
      Promise.all([
        getQiniuToken(),
        getUser()
      ]).then(([res1, res2]) => {
        this.token = res1.uploadToken;
        if(this.perStatus === '1') {
          this.photos.push({key: res2.userExt.idPic});
          this.photoFm.push({key: res2.userExt.backIdPic});
          this.perConfig.idNo = res2.idNo;
          this.perConfig.introduce = res2.userExt.introduce;
          this.perConfig.realName = res2.realName;
        }
        this.showLoading = false;
      }).catch(() => {});
    },
    methods: {
      formatImg(photos, type) {
        if(photos.length > 0) {
          if(type === 'zm') {
            this.perConfig.idPic = photos[0].key;
          }
          if(type === 'fm') {
            this.perConfig.backIdPic = photos[0].key;
          }
          return formatImg(photos[0].key);
        }
      },
      /**
       * 从相册中选择图片
       * */
      fileChange(e, type) {
        let files;
        if (e.dataTransfer) {
          files = e.dataTransfer.files;
        } else if (e.target) {
          files = e.target.files;
        }
        let self = this;
        let file = files[0];
        let orientation;
        EXIF.getData(file, function() {
          orientation = EXIF.getTag(this, 'Orientation');
        });
        let reader = new FileReader();
        reader.onload = function(e) {
          getImgData(file.type, this.result, orientation, function(data) {
            let _url = URL.createObjectURL(file);
            let item = {
              preview: data,
              ok: false,
              type: file.type,
              key: _url.split('/').pop() + '.' + file.name.split('.').pop()
            };
            self.loading = true;
            self.uploadPhoto(data, item.key).then(() => {
              item = {
                ...item,
                ok: true
              };
              if(item.ok === true) {
                if(type === 'zm') {
                  self.photos = [item];
                }else {
                  self.photoFm = [item];
                }
              }
              self.updatePhotos(item);
            }).catch(err => {
              self.onUploadError(err);
            });
            self.$refs.fileInput.value = null;
          });
        };
        reader.readAsDataURL(file);
      },
      /**
       * 图片上传完成后更新photos
       * */
      updatePhotos(item) {
        for (let i = 0; i < this.photos.length; i++) {
          if (this.photos[i].key === item.key) {
            this.photos.splice(i, 1, item);
            break;
          }
        }
        this.loading = false;
      },
      uploadPhoto(base64, key) {
        return this.$refs.qiniu.uploadByBase64(base64, key);
      },
      /**
       * 处理图片上传错误事件
       * @param error 错误信息
       */
      onUploadError(error) {
        this.text = (error.body && error.body.error) || `${error.message}:10M` || '图片上传出错';
        this.$refs.toast.show();
      },
      saveMessage() {
        if(this.perConfig.idNo === '' ||
          this.perConfig.realName === '') {
          this.toastText = '请填写完整';
          this.$refs.toast.show();
          return;
        }
        this.showLoading = true;
        certification(this.perConfig).then(data => {
          this.showLoading = false;
          if(this.perStatus === '1') {
            this.toastText = '重新认证成功';
          }else {
            this.toastText = '认证成功';
          }
          this.$refs.toast.show();
          setTimeout(() => {
            this.$router.push('/me');
          }, 1500);
        }, () => {
          this.showLoading = false;
        });
      }
    },
    components: {
      CityPicker,
      FullLoading,
      Toast,
      MHeader,
      Qiniu
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
    min-height: 100%;
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
        input{
          color: #666;
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
          padding: 0.05rem 0.1rem;
          min-height: 3rem !important;
          font-size: 0.3rem;
          color: #333;
          width: 100%;
        }
      }
      .avatar-box{
        text-align: center;
      }
      .avatar {
        position: relative;
        display: inline-block;
        margin: 0 0.3rem;
        margin-top: 0.3rem;
        font-size: 0;
        width: 2rem;
        height: 2rem;
        img {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 1;
          margin: 0.35rem 0.3rem 0 0;
          width: 2rem;
          height: 2rem;
          vertical-align: bottom;
          float: left;
          top: 0;
        }
        .input-box {
          display: inline-block;
          position: absolute;
          width: 100%;
          left: 0rem;
          top: 0.4rem;
          z-index: 99;
          opacity: 0;
          background-color: transparent;
          .input-file {
            width: 2rem;
            height: 2rem;
            font-size: 0;
            opacity: 0;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 999;
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
