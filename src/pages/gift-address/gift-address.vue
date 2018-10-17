<template>
  <transition name="slide">
    <div class="addr-add-edit-wrapper full-screen-wrapper">
      <m-header class="cate-header" title="认领礼物"></m-header>
      <div class="tip">
        <img src="./tip@2x.png" alt="">
        <span>请填写收货地址用来认领礼物（实物礼物）</span>
      </div>
      <div class="form-wrapper">
        <div class="form-item border-bottom-1px">
          <div class="item-label">省市区</div>
          <div class="item-input-wrapper">
            <template v-if="code">
              <city-picker class="item-input"
                           :province="province"
                           :city="city"
                           :district="district"
                           @change="cityChange"
                           >
              </city-picker>
            </template>
            <span v-show="provErr" class="error-tip">{{provErr}}</span>
          </div>
        </div>
        <div class="form-item is-textarea border-bottom-1px">
          <div class="item-label">详细地址</div>
          <div class="item-input-wrapper">
            <textarea v-model="address" name="address" v-validate="'required'" rows="2" class="item-input" placeholder="请输入详细地址信息"></textarea>
            <span v-show="errors.has('address')" class="error-tip">{{errors.first('address')}}</span>
          </div>
        </div>
        <div class="form-item border-bottom-1px">
          <div class="item-label">收货人</div>
          <div class="item-input-wrapper">
            <input type="text" class="item-input" v-model="receiver" name="receiver" v-validate="'required'" placeholder="请输入姓名">
            <span v-show="errors.has('receiver')" class="error-tip">{{errors.first('receiver')}}</span>
          </div>
        </div>
        <div class="form-item border-bottom-1px">
          <div class="item-label">联系方式</div>
          <div class="item-input-wrapper">
            <input type="tel" class="item-input" name="mobile" v-model="mobile" v-validate="'required|mobile'" placeholder="请输入手机号">
            <span v-show="errors.has('mobile')" class="error-tip">{{errors.first('mobile')}}</span>
          </div>
        </div>
        <div class="form-btn">
          <button @click="getGift">确认认领</button>
        </div>
        <full-loading v-show="loading"></full-loading>
        <toast ref="toast" :text="toastText"></toast>
      </div>
    </div>
  </transition>
</template>
<script>
  import {addAddress, editAddress, getAddressList} from 'api/user';
  import { getGift } from 'api/biz';
  import CityPicker from 'base/city-picker/city-picker';
  import FullLoading from 'base/full-loading/full-loading';
  import Toast from 'base/toast/toast';
  import MHeader from 'components/m-header/m-header';

  export default {
    data() {
      return {
        name: '',
        mobile: '',
        province: '',
        city: '',
        district: '',
        provErr: '',
        address: '',
        addressErr: '',
        isDefault: '0',
        loading: false,
        isAlert: true,
        toastText: '',
        headerTitle: '新增收货地址',
        receiver: '',
        code: ''
      };
    },
    mounted() {
      this.code = this.$route.query.code;
    },
    methods: {
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
          this.setAddressList(data);
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
      getGift() {
        this.$validator.validateAll().then((result) => {
          if(result) {
            this.loading = true;
            Promise.all([
              getGift({
                code: this.code,
                reMobile: this.mobile,
                reAddress: this.address,
                receiver: this.receiver,
                province: this.province,
                city: this.city,
                area: this.district
              }),
              addAddress({
                addressee: this.receiver,
                mobile: this.mobile,
                province: this.province,
                city: this.city,
                district: this.district,
                detailAddress: this.address
              })
            ]).then(([res1, res2]) => {
              this.loading = false;
              if(res1.isSuccess && res2.code) {
                this.toastText = '认领成功';
                this.$refs.toast.show();
                setTimeout(() => {
                  this.$router.push('/gift');
                }, 1000);
              }
            }).catch(() => { this.loading = false; });
          }
        });
      },
      _editAddress(param) {
        editAddress(param).then(() => {
          this.setting = false;
          this.toastText = '修改成功';
          this.$refs.toast.show();
          let addressList = this.addressList.slice();
          let index = addressList.findIndex((item) => {
            return item.code === this.code;
          });
          if (addressList.length === 1) {
            param.isDefault = '1';
          }
          addressList.splice(index, 1, param);
          this.setAddressList(addressList);
          this.setCurAddr(param);
          setTimeout(() => {
            this.$router.back();
          }, 1000);
        }).catch(() => {
          this.setting = false;
        });
      },
      _addAddress(param) {
        addAddress(param).then((data) => {
          this.setting = false;
          this.toastText = '新增成功';
          this.$refs.toast.show();
          let _item = {
            code: data.code,
            ...param
          };
          let addressList = this.addressList.slice();
          if (addressList.length === 0) {
            _item.isDefault = '1';
          }
          addressList.push(_item);
          this.setCurAddr(_item);
          this.setAddressList(addressList);
          setTimeout(() => {
            this.$router.back();
          }, 1000);
        }).catch(() => {
          this.setting = false;
        });
      },
      _provinceValid() {
        if (!this.province) {
          this.provErr = '不能为空';
          return false;
        }
        this.provErr = '';
        return true;
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

  .addr-add-edit-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    .tip {
      background: #FDF4D6;
      height: 0.71rem;
      /*line-height: 0.71rem;*/
      margin-top: 0.88rem;
      font-size: $font-size-medium-s;
      color: #666;
      display: flex;
      align-items: center;
      img {
        width: 0.3rem;
        height: 0.3rem;
        margin-left: 0.34rem;
        margin-right: 0.15rem;
      }
    }
    .form-wrapper {
      padding: 0 0.3rem;
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
    }
  }
  input::-webkit-input-placeholder,textarea::-webkit-input-placeholder {
    color: #AAAAAA;
  }
</style>
