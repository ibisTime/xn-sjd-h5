<template>
  <div class="write-article-wrapper">
    <div class="bg">
      <m-header class="cate-header" title="发布文章"></m-header>
      <div class="content">
        <Scroll :pullUpLoad="pullUpLoad">
          <div class="in-content">
            <div class="user-info-list">
              <div class="title">
                <input type="text" name="title" v-model="title" v-validate="'required'" placeholder="标题">
                <span v-show="errors.has('title')" class="error-tip">{{errors.first('title')}}</span>
              </div>
              <div class="text">
                <textarea v-model="context" ref="textarea" @input="autosize" v-validate="'required'" rows="5" class="item-input" placeholder="发表下你的感想吧"></textarea>
              </div>
            </div>
            <div class="avatar">
              <img :src="formatImg(item.key)" v-for="(item, index) in photos" class="avatar-photos" ref="myImg" @click="choseItem(index)"/>
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
                <img src="./upload@2x.png">
              </div>
            </div>
            <div class="gray"></div>
            <div class="user-info-list">
              <div class="select-item">
                <span>关联古树</span>
                <select v-validate="'required'" name="adoptTreeCode" v-model="adoptTreeCode">
                  <option :value="item" v-for="item in list">{{item.tree.scientificName}}-{{item.tree.treeNumber}}</option>
                </select>
                <img src="./more@2x.png"/>
              </div>
              <div class="select-item">
                <span>谁可以看</span>
                <select v-validate="'required'" name="openLevel" v-model="openLevel">
                  <option value="1">公开</option>
                  <option value="2">私密</option>
                  <option value="3">仅好友可见</option>
                </select>
                <img src="./more@2x.png"/>
              </div>
            </div>
            <div class="button">
              <button @click="fabu" :disabled="setting">发布</button>
            </div>
        </div>
        </Scroll>
      </div>
    </div>
    <full-loading v-show="loading"></full-loading>
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
  import Toast from 'base/toast/toast';
  import Scroll from 'base/scroll/scroll';
  import Qiniu from 'base/qiniu/qiniu';
  import MHeader from 'components/m-header/m-header';
  import FullLoading from 'base/full-loading/full-loading';
  import EXIF from 'exif-js';
  import { getQiniuToken } from 'api/general';
  import {formatImg, getImgData} from 'common/js/util';
  import { getCookie } from 'common/js/cookie';
  import { getListUserTree, addArticle } from 'api/biz';
  import PhotoEdit from 'components/photo-edit/photo-edit';

  export default {
    data() {
      return {
        setting: false,
        pullUpLoad: null,
        loading: false,
        adoptTreeCode: '',
        openLevel: '1',
        title: '',
        context: '',
        text: '',
        token: '',
        uploadUrl: '',
        multiple: false,
        photos: [],
        list: [], // 认养权列表
        currentItem: null
      };
    },
    mounted() {
      this.uploadUrl = 'http://up-z0.qiniu.com';
      this.userId = getCookie('userId');
      this.loading = true;
      Promise.all([
        getQiniuToken(),
        getListUserTree({
          statusList: ['1', '2', '3']
        })
      ]).then(([res1, res2]) => {
        if(!res2.length) {
          this.text = '您没有古树，暂时无法发布文章哦';
          this.$refs.toast.show();
          setTimeout(() => {
            this.$router.back();
          }, 1000);
        } else {
          this.token = res1.uploadToken;
          this.list = res2;
          this.adoptTreeCode = res2[0];
          this.loading = false;
        }
      }).catch(() => { this.loading = false; });
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
      formatImg(img) {
        return formatImg(img);
      },
      go(url) {
        this.$router.push(url);
      },
      getAvatar() {
        if (!this.user) {
          return require('./../../common/image/avatar@2x.png');
        }
        return formatImg(this.preview || this.user.photo);
      },
      // 发布文章
      fabu() {
        // debugger;
        this.setting = true;
        let photoArr = [];
        this.photos.map((item) => {
          photoArr.push(item.key);
        });
        if(!this.title) {
          this.text = '请填写标题';
          this.$refs.toast.show();
          this.setting = false;
          return;
        }
        if(!this.context) {
          this.text = '请填写内容';
          this.$refs.toast.show();
          this.setting = false;
          return;
        }
        if(!photoArr.length) {
          this.text = '文章必须包含至少一张图片';
          this.$refs.toast.show();
          this.setting = false;
          return;
        }
        let photo = photoArr.join('||');
        this.$validator.validateAll().then((result) => {
          if(result) {
            this.loading = true;
            addArticle({
              title: this.title,
              content: this.context,
              photo: photo,
              openLevel: this.openLevel,
              adoptTreeCode: this.adoptTreeCode.code,
              treeNo: this.adoptTreeCode.tree.treeNumber,
              updater: this.userId,
              publishUserId: this.userId,
              type: '2',
              dealType: '1'
            }).then((res) => {
              if(res.code) {
                this.text = '发布成功，待平台审核';
                this.$refs.toast.show();
                this.loading = false;
                setTimeout(() => {
                  this.$router.back();
                }, 1000);
              }
            }).catch(() => {
              this.loading = false;
              this.setting = false;
            });
          }
        });
      },
      /**
       * 选中要操作的图片
       * */
      choseItem(index) {
        let item = this.photos[index];
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
            self.uploadPhoto(data, item.key).then(() => {
              item = {
                ...item,
                ok: true
              };
              if(item.ok === true) {
                self.photos.push(item);
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
    computed: {
      photoCls() {
        return this.photos.length ? '' : 'no-photo';
      },
      curUrl() {
        // return this.currentItem ? this.currentItem.preview : '';
        console.log(this.currentItem);
        console.log(this.currentItem ? formatImg(this.currentItem.key) : '');
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
      FullLoading,
      Toast,
      PhotoEdit
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
      .content {
        /*padding: 0.88rem 0 0;*/
        position: absolute;
        top: 0.88rem;
        bottom: 0;
        left: 0;
        right: 0;
        overflow: auto;
        background: #fff;
        .in-content {
          padding-bottom: 0.5rem;
          .avatar {
            border-bottom: 1px solid $color-border;
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
          .user-info-list {
            background: $color-highlight-background;
            padding: 0 0.3rem;
            .mr50 {
              margin-right: 0.5rem;
            }
            .mr110 {
              margin-right: 1.1rem;
            }
            .select-item {
              display: flex;
              align-items: center;
              span {
                padding-right: 0.2rem;
              }
              select {
                flex: 1;
              }
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
            .title {
              input[type="text"] {
                width: 80%;
                color: #333;
              }
            }
            .text {
              padding-top: 0.3rem;
              border: none;
              .item-input {
                line-height: 0.5rem;
                width: 100%;
              }
            }
            .error-tip {
              color: red;
            }
          }
        }
      }
      .button {
        height: 0.84rem;
        padding: 0 0.3rem 0.5rem;
        font-size: 0;
        box-sizing: content-box;
        button {
          background: $primary-color;
          border-radius: 0.08rem;
          color: $color-highlight-background;
          width: 100%;
          height: 100%;
          font-size: 0.3rem;
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
