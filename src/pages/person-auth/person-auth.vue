<template>
  <transition name="slide">
    <div class="person-auth-wrapper">
      <div class="form-wrapper">
        <div class="form-item border-bottom-1px">
          <div class="item-label">真实姓名</div>
          <div class="item-input-wrapper">
            <input type="text" class="item-input" v-model="name" name="name" v-validate="'required'" placeholder="请输入姓名">
            <span v-show="errors.has('name')" class="error-tip">{{errors.first('name')}}</span>
          </div>
        </div>
        <div class="form-item border-bottom-1px">
          <div class="item-label">身份证号</div>
          <div class="item-input-wrapper">
            <input type="tel" class="item-input" v-model="mobile" name="mobile" v-validate="'required|mobile'" placeholder="请输入身份证号">
            <span v-show="errors.has('mobile')" class="error-tip">{{errors.first('mobile')}}</span>
          </div>
        </div>
        <div class="text">
          <textarea v-model="context" ref="textarea" @input="autosize" v-validate="'required'" rows="5" class="item-input" placeholder="请输入个人简介"></textarea>
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
  import {addAddress, editAddress, getAddressList} from 'api/user';
  import CityPicker from 'base/city-picker/city-picker';
  import FullLoading from 'base/full-loading/full-loading';
  import Toast from 'base/toast/toast';
  import MHeader from 'components/m-header/m-header';

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
        headerTitle: '新增收货地址',
        code: '',
        context: '',
        photos: []
      };
    },
    created() {
      // this.code = this.$route.params.id || '';
      this.code = sessionStorage.getItem('ressCode');
      if (this.code) {
        this.headerTitle = '修改收货地址';
        // this.getAddress();
      } else {
        // this._getAddressList();
      }
      this._getAddressList();
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
      getAddress() {
        let index = this.addressList.findIndex((item) => {
          return item.code === this.code;
        });
        if (!~index) {
          this._getAddressList();
        } else {
          this._initPageData(this.addressList[index]);
        }
      },
      _getAddressList() {
        getAddressList().then((data) => {
          // this.setAddressList(data);
          if (this.code) {
            let index = data.findIndex((item) => {
              return item.code === this.code;
            });
            if (!~index) {
              this.toastText = '地址编号错误';
              this.$refs.toast.show();
            } else {
              this._initPageData(data[index]);
            }
          } else {
            this.showLoading = false;
          }
        }).catch(() => {
          this.showLoading = false;
        });
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
      },
      cityChange(prov, city, district) {
        this.province = prov;
        this.city = city;
        this.district = district;
        // this._provinceValid();
      },
      saveAddress() {
        this.$validator.validateAll().then((result) => {
          if(result && this.province && this.city && this.district) {
            this.setting = true;
            let param = {
              addressee: this.name,
              mobile: this.mobile,
              province: this.province,
              city: this.city,
              district: this.district,
              detailAddress: this.address
            };
            if (this.code) {
              param.code = this.code;
              param.isDefault = this.isDefault;
              this._editAddress(param);
            } else {
              this._addAddress(param);
            }
          } else {
            if(this.result && !this.province) {
              this.toastText = '请选择省市区';
            } else {
              this.toastText = '请填写完整信息';
            }
            this.$refs.toast.show();
          }
        });
        // if (this.errors.items.length === 0 && this.mobile && this.name && this.address) {
        //   this.setting = true;
        //   let param = {
        //     addressee: this.name,
        //     mobile: this.mobile,
        //     province: this.province,
        //     city: this.city,
        //     district: this.district,
        //     detailAddress: this.address
        //   };
        //   if (this.code) {
        //     param.code = this.code;
        //     param.isDefault = this.isDefault;
        //     this._editAddress(param);
        //   } else {
        //     this._addAddress(param);
        //   }
        // }
      },
      _editAddress(param) {
        if(this.errors.items.length === 0) {
          editAddress(param).then(() => {
            this.setting = false;
            this.toastText = '修改成功';
            this.$refs.toast.show();
            // let addressList = this.addressList.slice();
            // let index = addressList.findIndex((item) => {
            //   return item.code === this.code;
            // });
            // if (addressList.length === 1) {
            //   param.isDefault = '1';
            // }
            // addressList.splice(index, 1, param);
            // this.setAddressList(addressList);
            // this.setCurAddr(param);
            setTimeout(() => {
              this.$router.back();
            }, 1000);
          }).catch(() => {
            this.setting = false;
          });
        }
      },
      _addAddress(param) {
        addAddress(param).then((data) => {
          this.setting = false;
          this.toastText = '新增成功';
          this.$refs.toast.show();
          // let _item = {
          //   code: data.code,
          //   ...param
          // };
          // let addressList = this.addressList.splice();
          // if (addressList.length === 0) {
          //   _item.isDefault = '1';
          // }
          // addressList.push(_item);
          // this.setCurAddr(_item);
          // this.setAddressList(addressList);
          setTimeout(() => {
            this.$router.push('/address');
          }, 1000);
        }).catch(() => {
          this.setting = false;
        });
      }
    },
    components: {
      CityPicker,
      FullLoading,
      Toast,
      MHeader
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
