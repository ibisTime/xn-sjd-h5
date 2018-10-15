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
                <textarea v-model="context" v-validate="'required'" rows="5" class="item-input" placeholder="发表下你的感想吧"></textarea>
              </div>
            </div>
            <div class="avatar">
              <img :src="formatImg(item.key)" v-for="item in photos" class="avatar-photos"/>
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
              <div>
                <select v-validate="'required'" name="adoptTreeCode" v-model="adoptTreeCode">
                  <option :value="item.code" v-for="item in list">{{item.tree.scientificName}}</option>
                </select>
                <span v-show="errors.has('mobile')" class="error-tip">{{errors.first('mobile')}}</span>
              </div>
              <div>
                <select v-validate="'required'" name="openLevel" v-model="openLevel">
                  <option value="1">公开</option>
                  <option value="2">私密</option>
                  <option value="3">仅好友可见</option>
                </select>
                <span v-show="errors.has('type')" class="error-tip">{{errors.first('type')}}</span>
              </div>
            </div>
            <div class="button">
              <button @click="fabu">发布</button>
            </div>
        </div>
        </Scroll>
      </div>
    </div>
    <full-loading v-show="loading"></full-loading>
    <toast ref="toast" :text="text"></toast>
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

  export default {
    data() {
      return {
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
        list: [] // 认养权列表
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
        this.token = res1.uploadToken;
        this.list = res2;
        this.adoptTreeCode = res2[0].code;
        this.loading = false;
      }).catch(() => { this.loading = false; });
    },
    methods: {
      formatImg(img) {
        return formatImg(img);
      },
      go(url) {
        this.$router.push(url);
      },
      getAvatar() {
        if (!this.user) {
          return require('./avatar@2x.png');
        }
        return formatImg(this.preview || this.user.photo);
      },
      // 发布文章
      fabu() {
        let photoArr = [];
        this.photos.map((item) => {
          photoArr.push(item.key);
        });
        let photo = photoArr.join('||');
        this.$validator.validateAll().then((result) => {
          if(result) {
            addArticle({
              title: this.title,
              content: this.context,
              photo: photo,
              openLevel: this.openLevel,
              adoptTreeCode: this.adoptTreeCode,
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
            }).catch(() => { this.loading = false; });
          } else {
            if(!this.context) {
              this.text = '请填写内容';
              this.$refs.toast.show();
            }
          }
        });
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
    components: {
      Scroll,
      MHeader,
      Qiniu,
      FullLoading,
      Toast
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
