<template>
  <div class="me-wrapper full-screen-wrapper">
    <div class="bg">
      <m-header class="cate-header" title="完善资料" actText="保存" @action="action"></m-header>
      <div class="scroll-section">
        <Scroll :pullUpLoad="pullUpLoad">
        <div class="content">
          <div class="in-content">
            <div class="avatar">
              <img :src="getAvatar()"/>
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
            <div class="user-info-list">
              <div class="item-input-wrapper">
                <span class="mr110">昵称</span>
                <input type="text" name="nickname" v-model="nickname" v-validate="'required'" placeholder="请输入昵称">
                <span v-show="errors.has('nickname')" class="error-tip">{{errors.first('nickname')}}</span>
              </div>
              <div class="item-input-wrapper">
                <span class="mr110">性别</span>
                <select v-validate="'required'" name="sex" v-model="sex">
                  <option value="男">男</option>
                  <option value="女">女</option>
                </select>
                <span v-show="errors.has('mobile')" class="error-tip">{{errors.first('mobile')}}</span>
              </div>
              <div class="item-input-wrapper">
                <span class="mr110">年龄</span>
                <input type="number" name="age" v-model="age" v-validate="'required'" placeholder="请输入年龄">
                <span v-show="errors.has('age')" class="error-tip">{{errors.first('age')}}</span>
              </div>
              <div class="item-input-wrapper">
                <span class="mr50">真实姓名</span>
                <input type="text" name="realName" v-model="realName" v-validate="'required'" placeholder="请输入真实姓名">
                <span v-show="errors.has('realName')" class="error-tip">{{errors.first('realName')}}</span>
              </div>
              <div class="item-input-wrapper">
                <span class="mr50">身份证号</span>
                <input type="text" name="idNo" v-model="idNo" v-validate="'required'" placeholder="请输入身份证号">
                <span v-show="errors.has('idNo')" class="error-tip">{{errors.first('idNo')}}</span>
              </div>
              <div class="item-input-wrapper">
                <span class="mr50">出生日期</span>
                <date-picker class="item-input"
                             :year="year"
                             :month="month"
                             :day="day"
                             @change="updateDate"></date-picker>
              </div>
            </div>
          </div>
        </div>
      </Scroll>
      </div>
    </div>
    <full-loading v-show="loading" :title="loadText"></full-loading>
    <toast ref="toast" :text="text"></toast>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import Qiniu from 'base/qiniu/qiniu';
  import MHeader from 'components/m-header/m-header';
  import Toast from 'base/toast/toast';
  import FullLoading from 'base/full-loading/full-loading';
  import DatePicker from 'base/date-picker/date-picker';
  import EXIF from 'exif-js';
  import {formatImg, getImgData, emptyValid} from 'common/js/util';
  import { getCookie } from 'common/js/cookie';
  import { getQiniuToken } from 'api/general';
  import { getUserDetail, changeAvatar, changeNickname, completeInfo } from 'api/user';

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
        if (!this.userId) {
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
        let date = this.year ? this.year + '-' + this.month + '-' + this.day : '';
        console.log(date);
        if(this.photos.length) {
          this.$validator.validateAll().then((result) => {
            if (result) {
              this.loading = true;
              this.loadText = '修改中...';
              this.sex = this.sex === '男' ? '1' : '0';
              // 修改头像
              // 修改昵称
              // 完善资料
              Promise.all([
                changeAvatar({
                  photo: this.photos.length ? this.photos[0].key : this.user.photo
                }),
                changeNickname({
                  nickname: this.nickname
                }),
                completeInfo({
                  gender: this.sex,
                  age: this.age,
                  realName: this.realName,
                  nickname: this.nickname,
                  idNo: this.idNo,
                  birthday: date || ''
                })
              ]).then(([res1, res2, res3]) => {
                this.loading = false;
                this.sex = this.sex === '1' ? '男' : '女';
                if(res1.isSuccess && res2.isSuccess && res3.isSuccess) {
                  this.text = '修改成功';
                  this.$refs.toast.show();
                  setTimeout(() => {
                    this.$router.push('/me');
                  }, 1000);
                }
              }).catch(() => { this.loading = false; });
            }
          });
        } else {
          this.$validator.validateAll().then((result) => {
            if (result) {
              this.loading = true;
              this.loadText = '修改中...';
              this.sex = this.sex === '男' ? '1' : '0';
              // 修改头像
              // 修改昵称
              // 完善资料
              Promise.all([
                changeNickname({
                  nickname: this.nickname
                }),
                completeInfo({
                  gender: this.sex,
                  age: this.age,
                  realName: this.realName,
                  nickname: this.nickname,
                  idNo: this.idNo,
                  birthday: date || ''
                })
              ]).then(([res2, res3]) => {
                this.loading = false;
                this.sex = this.sex === '1' ? '男' : '女';
                if(res2.isSuccess && res3.isSuccess) {
                  this.text = '修改成功';
                  this.$refs.toast.show();
                  setTimeout(() => {
                    this.$router.push('/me');
                  }, 1000);
                }
              }).catch(() => { this.loading = false; });
            }
          });
        }
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
      }
    },
    mounted() {
      this.userId = getCookie('userId');
      this.uploadUrl = 'http://up-z0.qiniu.com';
      Promise.all([
        getQiniuToken(),
        getUserDetail({
          userId: this.userId
        })
      ]).then(([res1, res2]) => {
        this.token = res1.uploadToken;
        this.user = res2;
        this.nickname = this.user.nickname || '';
        this.sex = this.user.gender ? this.user.gender === '1' ? '男' : '女' || '男' : '';
        this.age = this.user.age || '';
        this.realName = this.user.realName || '';
        this.idNo = this.user.idNo || '';
        this.year = this.user.birthday.split('-')[0];
        this.month = this.user.birthday.split('-')[1];
        this.day = this.user.birthday.split('-')[2];
      }).catch(() => {});
    },
    components: {
      Scroll,
      MHeader,
      Qiniu,
      Toast,
      DatePicker,
      FullLoading
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
                  font-size: 0.3rem;
                }
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
