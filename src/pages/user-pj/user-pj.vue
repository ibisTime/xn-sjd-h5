<template>
    <div>
        <div class="content">
            <div class="pj-con">
                <textarea name="" v-model="pjText" placeholder="宝贝满足你的期待吗？说说你的使用心情，分享给想买的他们吧"></textarea>
            </div>
            <div class="pj-img">
                <div class="img-box">
                    <div class="iup-box">
                        <qiniu
                            ref="qiniu"
                            style="visibility: hidden;position: absolute;"
                            :token="token" />
                        <input type="file"
                            :multiple="multiple"
                            ref="fileInput"
                            @change="fileChange($event)"
                            accept="image/*"/>
                    </div>
                    <div class="zp-box" :style="getImgSyl(photos.length > 0 ? photos[0].key : '')">

                    </div>
                </div>
            </div>
            <p class="back-co"></p>
            <div class="pj-foo">
                <div class="s-pj" @click.stop="addAComment">
                    发表
                </div>
            </div>
        </div>
        <full-loading v-show="loading" :title="loadText"></full-loading>
        <toast ref="toast" :text="text"></toast>
    </div>
</template>

<script>
import Qiniu from 'base/qiniu/qiniu';
import EXIF from 'exif-js';
import { getImgData, formatImg, getUserId } from 'common/js/util';
import { addACommemt } from 'api/store';
import { getQiniuToken } from 'api/general';
import Toast from 'base/toast/toast';
import FullLoading from 'base/full-loading/full-loading';
export default {
  data() {
    return {
      text: '',
      loading: false,
      loadText: '',
      pjText: '',
      result: '',
      photos: [],
      token: '',
      multiple: false,
      commentConfig: {   // 评论入参
        userId: getUserId(),
        content: '',
        commodityCode: ''
      },
      toCode: ''
    };
  },
  mounted() {
    this.commentConfig.commodityCode = this.$route.query.code;
    this.toCode = this.$route.query.toCode;
    Promise.all([
      getQiniuToken()
    ]).then(([res1]) => {
      this.token = res1.uploadToken;
    }).catch(() => {});
  },
  methods: {
    getImgSyl(imgs) {
      return {
        backgroundImage: `url(${imgs ? formatImg(imgs) : '/static/tjtp.png'})`
      };
    },
    addAComment() {
      if(this.pjText === '' && this.photos.length === 0) {
        this.text = '请输入文字或上传图片';
        this.$refs.toast.show();
        return;
      }
      this.loading = true;
      let conText = `<p>${this.pjText}</p>`;
      let conImg = '';
      if(this.photos.length !== 0) {
        conImg = `<img src="${formatImg(this.photos[0].key)}" />`;
      }
      this.commentConfig.content = conText + conImg;
      addACommemt(this.commentConfig).then(data => {
        this.loading = false;
        this.text = '评论成功';
        this.$refs.toast.show();
        this.$router.push('/store-order_detail?code=' + this.toCode);
      }, () => {
        this.loading = false;
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
      this.loading = false;
    }
  },
  components: {
    Qiniu,
    Toast,
    FullLoading
  }
};
</script>

<style lang="scss" scoped>
@import "../../common/scss/mixin.scss";
@import "../../common/scss/variable.scss";
.content {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    font-family: PingFang-SC-Medium;
    background-color: #fff;
    padding-top: 0.3rem;
    color: #999999;
    .back-co{
        height: 0.2rem;
        background-color: #f5f5f5;
    }
    .pj-con{
        padding: 0 0.3rem;
        height: 2.2rem;
        font-size: 0.28rem;
        line-height: 1.3;
        textarea{
            width: 100%;
            height: 100%;
            padding: 0.1rem;
        }
    }
    .img-box{
        margin-left: 0.3rem;
        width: 1.8rem;
        height: 1.8rem;
        position: relative;
        .iup-box{
            width: 100%;
            height: 100%;
            opacity: 0;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 9;
            input{
                width: 100%;
                height: 100%;
            }
        }
        .zp-box{
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;
            background-size: 100% 100%;
        }
    }
    .pj-img{
      padding: 0.2rem 0;
    }
    .pj-foo{
        margin-top: 1.16rem;
        padding: 0 0.3rem;
        .s-pj{
            height: 1rem;
            line-height: 1rem;
            text-align: center;
            background-color: #23AD8C;
            color: #fff;
            border-radius: 0.08rem;
            font-size: 0.32rem;
            letter-spacing: 0.005rem;
        }
    }

}
</style>
