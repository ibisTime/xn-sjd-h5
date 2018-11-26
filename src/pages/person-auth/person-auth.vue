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
          <textarea v-model="perConfig.introduce" ref="textarea" v-validate="'required'" class="item-input" placeholder="请输入个人简介"></textarea>
        </div>
        <div class="avatar">
          <img :src="formatImg(item.key)" v-for="(item, index) in photos" class="avatar-photos" ref="myImg" @click="choseItem(index)"/>
          <img src="./upload@2x.png" v-show="photos.length === 0">
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
                   @change="fileChange($event)"
                   accept="image/*"/>
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
        token: '',
        uploadUrl: 'http://up-z0.qiniu.com',
        multiple: false,
        perConfig: {
          idNo: '',
          idPic: '',
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
          this.perConfig.idNo = res2.idNo;
          this.perConfig.introduce = res2.userExt.introduce;
          this.perConfig.realName = res2.realName;
        }
        this.showLoading = false;
      }).catch(() => {});
    },
    methods: {
      formatImg(key) {
        this.perConfig.idPic = key;
        return formatImg(key);
      },
      /**
       * 从相册中选择图片
       * */
      fileChange(e) {
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
                self.photos = [item];
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
        if(this.perConfig.idPic === '' ||
          this.perConfig.idNo === '' ||
          this.perConfig.realName === '' ||
          this.perConfig.introduce === '') {
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
      .avatar {
        position: relative;
        padding: 0.3rem;
        font-size: 0;
        width: 1.6rem;
        height: 1.6rem;
        .avatar-photos {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          z-index: 1;
          margin: 0.35rem 0.3rem 0 0;
          vertical-align: bottom;
        }
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
        .input-box {
          display: inline-block;
          position: absolute;
          width: 100%;
          left: 0;
          top: 0;
          z-index: 9;
          opacity: 0;
          background-color: transparent;
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
