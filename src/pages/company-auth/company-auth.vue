<template>
  <transition name="slide">
    <div class="person-auth-wrapper">
      <Scroll ref="scroll" :pullUpLoad="pullUpLoad">
        <div class="form-wrapper">
          <div class="form-item border-bottom-1px">
            <div class="item-label">企业名称</div>
            <div class="item-input-wrapper">
              <input type="text" class="item-input" v-model="perConfig.companyName" name="name" v-validate="'required'" placeholder="请输入企业名称(必填)">
              <span v-show="errors.has('name')" class="error-tip">{{errors.first('name')}}</span>
            </div>
          </div>
          <div class="form-item border-bottom-1px">
            <div class="item-label">企业地址</div>
            <div class="item-input-wrapper">
              <input type="text" class="item-input" v-model="perConfig.companyAddress" name="qydz" v-validate="'required'" placeholder="请输入企业地址(必填)">
              <span v-show="errors.has('qydz')" class="error-tip">{{errors.first('qydz')}}</span>
            </div>
          </div>
          <div class="form-item border-bottom-1px">
            <div class="item-label">企业法人姓名</div>
            <div class="item-input-wrapper">
              <input type="text" class="item-input" v-model="perConfig.companyChargerName" name="companyChargerName" v-validate="'required'" placeholder="请输入企业法人姓名(必填)">
              <span v-show="errors.has('companyChargerName')" class="error-tip">{{errors.first('companyChargerName')}}</span>
            </div>
          </div>
          <div class="form-item border-bottom-1px">
            <div class="item-label">企业法人联系方式</div>
            <div class="item-input-wrapper">
              <input type="text" class="item-input" v-model="perConfig.companyChargerMobile" name="companyChargerMobile" v-validate="'required'" placeholder="请输入企业法人联系方式(必填)">
              <span v-show="errors.has('companyChargerMobile')" class="error-tip">{{errors.first('companyChargerMobile')}}</span>
            </div>
          </div>
          <div class="form-item border-bottom-1px">
            <div class="item-label">企业法人身份证</div>
            <div class="item-input-wrapper">
              <input type="text" class="item-input" v-model="perConfig.companyChargerIdNo" name="companyChargerIdNo" v-validate="'required'" placeholder="请输入企业法人身份证(必填)">
              <span v-show="errors.has('companyChargerIdNo')" class="error-tip">{{errors.first('companyChargerIdNo')}}</span>
            </div>
          </div>
          <div class="form-item border-bottom-1px">
            <div class="item-label">企业联系人</div>
            <div class="item-input-wrapper">
              <input type="text" class="item-input" v-model="perConfig.companyContactName" name="lxr" v-validate="'required'" placeholder="请输入企业联系人(必填)">
              <span v-show="errors.has('lxr')" class="error-tip">{{errors.first('lxr')}}</span>
            </div>
          </div>
          <div class="form-item border-bottom-1px">
            <div class="item-label">企业联系人电话</div>
            <div class="item-input-wrapper">
              <input type="text" class="item-input" v-model="perConfig.companyContactMobile" name="companyContactMobile" v-validate="'required'" placeholder="请输入企业联系人电话(必填)">
              <span v-show="errors.has('companyContactMobile')" class="error-tip">{{errors.first('companyContactMobile')}}</span>
            </div>
          </div>
          <div class="form-item border-bottom-1px">
            <div class="item-label">企业联系人地址</div>
            <div class="item-input-wrapper">
              <input type="text" class="item-input" v-model="perConfig.companyContactAddress" name="license" v-validate="'required'" placeholder="请输入企业联系人地址(必填)">
              <span v-show="errors.has('companyContactAddress')" class="error-tip">{{errors.first('companyContactAddress')}}</span>
            </div>
          </div>
          <div class="form-item border-bottom-1px">
            <div class="item-label">企业开户行</div>
            <div class="item-input-wrapper">
              <input type="text" class="item-input" v-model="perConfig.companyBank" name="companyBank" v-validate="'required'" placeholder="请输入企业开户行(必填)">
              <span v-show="errors.has('companyBank')" class="error-tip">{{errors.first('companyBank')}}</span>
            </div>
          </div>
          <div class="form-item border-bottom-1px">
            <div class="item-label">企业开户行账号</div>
            <div class="item-input-wrapper">
              <input type="text" class="item-input" v-model="perConfig.companyBankNumber" name="companyBankNumber" v-validate="'required'" placeholder="请输入企业开户行账号(必填)">
              <span v-show="errors.has('companyBankNumber')" class="error-tip">{{errors.first('companyBankNumber')}}</span>
            </div>
          </div>
          <div class="form-item border-bottom-1px">
            <div class="item-label">企业注册统一码</div>
            <div class="item-input-wrapper">
              <input type="text" class="item-input" v-model="perConfig.bussinessLicenseId" name="zctym" v-validate="'required'" placeholder="请输入企业注册统一码(必填)">
              <span v-show="errors.has('zctym')" class="error-tip">{{errors.first('zctym')}}</span>
            </div>
          </div>
          <!--<div class="text">-->
            <!--<textarea v-model="perConfig.companyIntroduce" ref="textarea" v-validate="'required'" class="item-input" placeholder="请输入企业简介(选填)"></textarea>-->
          <!--</div>-->
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
            <div class="avatar">
              <img src="./yyzz.png" v-show="photoCm.length === 0">
              <img :src="formatImg(photoCm, 'cm')"/>
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
                       @change="fileChange($event, 'cm')"
                       accept="image/*"/>
              </div>
            </div>
          </div>
          <div class="form-btn">
            <button :disabled="setting" @click="saveMessage">保存</button>
          </div>
        </div>
      </Scroll>
      <full-loading v-show="showLoading"></full-loading>
      <toast ref="toast" :text="toastText"></toast>
    </div>
  </transition>
</template>
<script>
  import CityPicker from 'base/city-picker/city-picker';
  import FullLoading from 'base/full-loading/full-loading';
  import Toast from 'base/toast/toast';
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import { getQiniuToken } from 'api/general';
  import { comCertification, getUser } from 'api/user';
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
        showLoading: false,
        isAlert: true,
        toastText: '',
        photos: [],
        photoFm: [],
        photoCm: [],
        token: '',
        uploadUrl: 'http://up-z0.qiniu.com',
        multiple: false,
        perConfig: {
          bussinessLicenseId: '',   // 企业注册统一码
          bussinessLicense: '',  // 营业执照
          companyAddress: '',    // 企业地址
          companyBank: '',       // 企业开户行
          companyBankNumber: '',  // 企业开户行账号
          companyChargerBackIdPic: '', // 企业法人身份证反面
          companyChargerIdNo: '',   // 企业法人身份证
          companyChargerIdPic: '',  // 企业法人身份证正面
          companyChargerMobile: '',  // 企业法人联系方式
          companyChargerName: '',    // 企业法人姓名
          companyContactAddress: '',  // 企业联系人地址
          companyContactMobile: '',   // 企业联系人电话
          companyContactName: '',    // 企业联系人
          companyName: '',       // 企业名称
          // companyIntroduce: '',  // 企业简介
          userId: getUserId()
        },
        pramStatus: ''
      };
    },
    created() {
      setTitle('企业认证');
      this.pullUpLoad = null;
      this.pramStatus = this.$route.query.pramStatus;
      Promise.all([
        getQiniuToken(),
        getUser()
      ]).then(([res1, res2]) => {
        this.token = res1.uploadToken;
        if(this.pramStatus === '1') {
          this.photos.push({key: res2.userExt.companyChargerIdPic});
          this.photoFm.push({key: res2.userExt.companyChargerBackIdPic});
          this.photoCm.push({key: res2.userExt.bussinessLicense});
          this.perConfig.bussinessLicenseId = res2.userExt.bussinessLicenseId;
          this.perConfig.companyAddress = res2.userExt.companyAddress;
          this.perConfig.companyBank = res2.userExt.companyBank;
          this.perConfig.companyBankNumber = res2.userExt.companyBankNumber;
          this.perConfig.companyChargerIdNo = res2.userExt.companyChargerIdNo;
          this.perConfig.companyChargerMobile = res2.userExt.companyChargerMobile;
          this.perConfig.companyChargerName = res2.userExt.companyChargerName;
          this.perConfig.companyContactAddress = res2.userExt.companyContactAddress;
          this.perConfig.companyContactMobile = res2.userExt.companyContactMobile;
          this.perConfig.companyContactName = res2.userExt.companyContactName;
          this.perConfig.companyName = res2.userExt.companyName;
          // this.perConfig.companyIntroduce = res2.userExt.companyIntroduce;
        }
      }).catch(() => {});
    },
    methods: {
      formatImg(photos, type) {
        if(photos.length > 0) {
          if(type === 'zm') {
            this.perConfig.companyChargerIdPic = photos[0].key;
          }
          if(type === 'fm') {
            this.perConfig.companyChargerBackIdPic = photos[0].key;
          }
          if(type === 'cm') {
            this.perConfig.bussinessLicense = photos[0].key;
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
                }
                if(type === 'fm') {
                  self.photoFm = [item];
                }
                if(type === 'cm') {
                  self.photoCm = [item];
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
        if(this.perConfig.bussinessLicenseId === '' ||
          this.perConfig.companyAddress === '' ||
          this.perConfig.companyBank === '' ||
          this.perConfig.companyBankNumber === '' ||
          this.perConfig.companyChargerBackIdPic === '' ||
          this.perConfig.companyChargerIdNo === '' ||
          this.perConfig.companyChargerIdPic === '' ||
          this.perConfig.companyChargerMobile === '' ||
          this.perConfig.companyChargerName === '' ||
          this.perConfig.bussinessLicense === '' ||
          this.perConfig.companyContactAddress === '' ||
          this.perConfig.companyContactMobile === '' ||
          this.perConfig.companyContactName === '' ||
          this.perConfig.companyName === '') {
          this.toastText = '请填写完整';
          this.$refs.toast.show();
          return;
        }
        this.showLoading = true;
        comCertification(this.perConfig).then(data => {
          this.showLoading = false;
          this.toastText = '认证成功';
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
      Scroll,
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
    padding-bottom: 0.5rem;
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
          line-height: 1.4;
          font-size: 0.28rem;
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
          padding: 0.05rem 0.1rem;
          min-height: 2rem !important;
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
        margin-top: 0.3rem;
        font-size: 0;
        width: 1.8rem;
        height: 1.8rem;
        img {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 1;
          margin: 0.35rem 0.3rem 0 0;
          width: 1.8rem;
          height: 1.8rem;
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
            width: 1.8rem;
            height: 1.8rem;
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

