<template>
  <div class="me-wrapper full-screen-wrapper">
    <div class="bg">
      <m-header class="cate-header" title="修改头像" actText="保存" @action="action"></m-header>
      <div class="scroll-section">
        <Scroll :pullUpLoad="pullUpLoad">
        <div class="content">
          <div class="in-content">
            <div class="avatar">
              <img :src="getAvatar()" @click="choseItem()"/>
              <qiniu
                ref="qiniu"
                style="visibility: hidden;position: absolute;"
                :token="token"
                :uploadUrl="uploadUrl"></qiniu>
              <input class="input-file"
                     type="file"
                     :multiple="multiple"
                     ref="fileInput"
                     @change="fileChange($event)"
                     accept="image/*"/>
            </div>
          </div>
        </div>
      </Scroll>
      </div>
    </div>
    <full-loading v-show="loading" :title="loadText"></full-loading>
    <toast ref="toast" :text="text"></toast>
    <photo-edit ref="photoEdit"
                :url="curUrl"
                :imgKey="curKey"
                :type="curType"
                @beMain="beMainPhoto"
                @updateImg="updateImg"
                @deleteImg="deleteImg"></photo-edit>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import Qiniu from 'base/qiniu/qiniu';
  import MHeader from 'components/m-header/m-header';
  import Toast from 'base/toast/toast';
  import FullLoading from 'base/full-loading/full-loading';
  import DatePicker from 'base/date-picker/date-picker';
  import PhotoEdit from 'components/photo-edit/photo-edit';
  import EXIF from 'exif-js';
  import {formatImg, getImgData, emptyValid, getUserId, setTitle} from 'common/js/util';
  import { getQiniuToken } from 'api/general';
  import { getUserDetail, changeAvatar } from 'api/user';

  export default {
    data() {
      return {
        loading: false,
        loadText: '',
        text: '',
        pullUpLoad: null,
        nickname: '',
        sex: '',
        age: '',
        realName: '',
        idNo: '',
        token: '',
        uploadUrl: '',
        multiple: false,
        mobile: '',
        photos: [],
        user: {},
        year: '',
        day: '',
        month: ''
      };
    },
    methods: {
      go(url) {
        this.$router.push(url);
      },
      getAvatar() {
        // if (!getUserId()) {
        //   return require('./../../common/image/avatar@2x.png');
        // }
        // if(this.user.photo) {
        //   this.photos.push({
        //     key: this.user.photo
        //   });
        //   return formatImg(this.photos[0].key);
        // } else {
        //   if(this.photos.length) {
        //     return formatImg(this.photos[0].key);
        //   } else {
        //     return require('./../../common/image/avatar@2x.png');
        //   }
        // }
        if (!getUserId()) {
          return require('./../../common/image/avatar@2x.png');
        }
        if(this.photos.length || this.user.photo) {
          return formatImg(this.photos.length ? this.photos[0].key : this.user.photo);
        } else {
          return require('./../../common/image/avatar@2x.png');
        }
      },
      updateDate (year, month, day) {
        this.year = year;
        this.month = month;
        this.day = day;
        return this._yearValid();
      },
      _yearValid() {
        let result = emptyValid(this.year);
        this.yearErr = result.msg;
        return !result.err;
      },
      // 保存
      action() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.loading = true;
            this.loadText = '修改中...';
            // 修改头像
            // 修改昵称
            // 完善资料
            Promise.all([
              changeAvatar({
                photo: this.photos.length ? this.photos[0].key : this.user.photo
              })
            ]).then(([res1]) => {
              this.loading = false;
              if(res1.isSuccess) {
                this.text = '修改成功';
                this.$refs.toast.show();
                setTimeout(() => {
                  this.$router.push('/me');
                }, 1000);
              }
            }).catch(() => { this.loading = false; });
          }
        });
      },
      /**
       * 选中要操作的图片
       * */
      choseItem() {
        let item = this.photos[0];
        console.log(item);
        if (!item.ok) {
          this.text = '图片还未上传完成';
          this.$refs.toast.show();
          return;
        }
        this.currentItem = item;
        console.log(this.currentItem);
        this.$refs.photoEdit.show();
      },
      /**
       * 设置为封面
       * */
      beMainPhoto(key) {
        let index = this.photos.findIndex(photo => {
          return photo.key === key;
        });
        let item = this.photos[index];
        this.photos.splice(index, 1);
        this.photos.unshift(item);
      },
      /**
       * 更新裁剪后的图片
       * */
      updateImg(base64, key) {
        let index = this.photos.findIndex(photo => {
          return photo.key === key;
        });
        let item = this.photos[index];
        item.ok = false;
        item.preview = base64;
        this.photos.splice(index, 1, item);
        this.currentItem = item;
        this.uploadPhoto(base64, key).then(() => {
          // 再次获取当前图片的位置，防止在上传过程中有其它图片被删除，导致下标改变
          index = this.photos.findIndex(photo => {
            return photo.key === key;
          });
          item = this.photos[index];
          item.ok = true;
          this.photos.splice(index, 1, item);
          this.currentItem = item;
        });
      },
      /**
       * 在弹出的图片操作页面中删除图片
       * */
      deleteImg(key) {
        let index = this.photos.findIndex(photo => {
          return photo.key === key;
        });
        this.deletePhoto(index);
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
        Array.from(files).forEach(file => {
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
              self.uploadPhoto(data, item.key).then(() => {
                item = {
                  ...item,
                  ok: true
                };
                if(item.ok === true) {
                  if(self.photos.length < 9) {
                    self.photos.push(item);
                  }else {
                    self.text = '选择图片不得超过九张';
                    self.$refs.toast.show();
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
        });
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
      },
      deletePhoto(index) {
        this.photos.splice(index, 1);
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
      }
    },
    mounted() {
      setTitle('修改头像');
      this.uploadUrl = 'http://up-z0.qiniu.com';
      Promise.all([
        getQiniuToken(),
        getUserDetail({
          userId: getUserId()
        })
      ]).then(([res1, res2]) => {
        this.token = res1.uploadToken;
        this.user = res2;
      }).catch(() => {});
    },
    computed: {
      photoCls() {
        return this.photos.length ? '' : 'no-photo';
      },
      curUrl() {
        return this.currentItem ? formatImg(this.currentItem.key) : '';
      },
      curKey() {
        return this.currentItem ? this.currentItem.key : '';
      },
      curType() {
        return this.currentItem ? this.currentItem.type : '';
      }
    },
    components: {
      Scroll,
      MHeader,
      Qiniu,
      Toast,
      DatePicker,
      FullLoading,
      PhotoEdit
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  .me-wrapper {
    background: #fff;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    .fl {
      float: left;
    }
    .fr {
      float: right;
    }
    .bg {
      background-size: contain;
      .scroll-section {
        position: absolute;
        top: 0.88rem;
        bottom: 0.76rem;
        left: 0;
        right: 0;
        overflow: auto;
        .title {
          font-size: 0.36rem;
          color: #fff;
          padding-top: 0.19rem;
          text-align: center;
        }
        .content {
          padding: 0;
          margin-bottom: 0;
          background: $color-highlight-background;
          .in-content {
            padding: 0 0.3rem;
            .avatar {
              height: 2.6rem;
              border-bottom: 1px solid $color-border;
              text-align: center;
              position: relative;
              img {
                width: 1.1rem;
                height: 1.1rem;
                margin-top: 0.75rem;
                border-radius: 50%;
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
          }
        }
      }
    }
    .error-tip {
      color: red;
    }
    input::-webkit-input-placeholder {
      color: #ccc;
    }
  }
  .item-input-wrapper{
    input{
      width: 54%;
    }
  }
</style>
