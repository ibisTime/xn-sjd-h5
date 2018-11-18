<template>
  <transition name="slide">
    <div class="address-list-wrapper">
      <m-header class="cate-header" title="我的收货地址" actText="新增" @action="action"></m-header>
      <div class="addr-scroll-wrapper">
        <scroll :data="addressList" :hasMore="hasMore">
          <ul>
            <li v-for="(item, index) in addressList" :key="index" class="border-bottom-1px" @click="selectAddress(index, item)">
              <div class="content">
                <div class="info"><span class="name">{{item.addressee}}</span><span class="mobile">{{item.mobile}}</span></div>
                <div class="addr">{{item.province}} {{item.city}} {{item.district}} {{item.detailAddress}}</div>
                <img src="./ok.png" v-show="currIndex === index">
              </div>
              <div class="opeator border-top-1px">
                <div class="default" @click.stop="setDefault(item, index)">

                </div>
                <button class="edit" @click.stop="goEdit(item)">编辑</button>
                <button class="delete" @click.stop="deleteItem(item, index)">删除</button>
              </div>
            </li>
          </ul>
        </scroll>
      </div>
      <div class="no-result-wrapper">
        <no-result v-show="!hasMore && !addressList.length" title="您尚未添加收货地址"></no-result>
      </div>
      <full-loading v-show="loadingFlag" :title="loadingText"></full-loading>
      <confirm ref="confirm" text="确定删除地址吗" @confirm="_deleteAddress"></confirm>
      <confirm ref="getGiftConfirm" text="确定使用该地址吗" @confirm="getGift" @cancel="cancelAddress"></confirm>
      <toast ref="toast" :text="text"></toast>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import FullLoading from 'base/full-loading/full-loading';
  import Confirm from 'base/confirm/confirm';
  import Toast from 'base/toast/toast';
  import NoResult from 'base/no-result/no-result';
  import MHeader from 'components/m-header/m-header';
  import {setTitle} from 'common/js/util';
  import {deleteAddress, getAddressList, setDefaultAddress} from 'api/user';

  export default {
    data() {
      return {
        hasMore: true,
        loadingFlag: false,
        loadingText: '',
        addressList: [],
        deleteIndex: 0,
        currIndex: null,
        text: ''
      };
    },
    mounted() {
      this.code = this.$route.query.code;
      this.number = this.$route.query.number;
      this.currentItem = null;
      this.getAddress();
    },
    updated() {
      this.getAddress();
    },
    methods: {
      action() {
        // sessionStorage.clear('ressCode');
        this.go('/address-addedit');
      },
      go(url) {
        this.$router.push(url);
      },
      getAddress() {
        if (this.shouldGetData()) {
          if (!this.addressList.length) {
            getAddressList().then((data) => {
              this.addressList = data;
              this.hasMore = false;
              // this.setAddressList(data);
            }).catch(() => {
              this.hasMore = false;
            });
          } else {
            this.hasMore = false;
          }
        }
      },
      shouldGetData() {
        setTitle('地址列表');
        return this.hasMore;
      },
      setDefault(item, index) {
        if (item.isDefault !== '1') {
          this.loadingText = '设置中...';
          this.loadingFlag = true;
          setDefaultAddress(item.code).then(() => {
            this.loadingFlag = false;
            // this.setDefaultAddress({
            //   code: item.code
            // });
            this.addressList.forEach((item, i) => {
              if (index === i) {
                this.addressList[index].isDefault = '1';
              }else{
                this.addressList[i].isDefault = '0';
              }
            });
            this.setCurAddr(item);
          }).catch(() => {
            this.loadingFlag = false;
          });
        }
      },
      goEdit(item) {
        sessionStorage.setItem('ressCode', item.code);
        this.$router.push(`/address-addedit`);
      },
      goAdd() {
        this.$router.push(this.$route.path + '/add');
      },
      deleteItem(item, index) {
        this.currentItem = item;
        this.deleteIndex = index;
        this.$refs.confirm.show();
      },
      _deleteAddress() {
        if (this.currentItem) {
          this.loadingText = '删除中...';
          this.loadingFlag = true;
          deleteAddress(this.currentItem.code).then(() => {
            this.loadingFlag = false;
            // this.deleteAddress({
            //   code: this.currentItem.code
            // });
            this.addressList.splice(this.deleteIndex, 1);
          }).catch(() => {
            this.loadingFlag = false;
          });
        }
      },
      selectAddress(index, item) {
        this.currIndex = index;
        this.currentItem = item;
        this.$refs.getGiftConfirm.show();
      },
      cancelAddress() {
        this.currIndex = null;
      },
      getGift() {
        this.currentItem.receiver = this.currentItem.addressee;
        this.currentItem.address = this.currentItem.detailAddress;
        this.currentItem.area = this.currentItem.district;
        this.currentItem.receiverMobile = this.currentItem.mobile;
        this.currentItem.deliverCount = this.number;
        delete this.currentItem.addressee;
        delete this.currentItem.detailAddress;
        delete this.currentItem.district;
        delete this.currentItem.mobile;
        delete this.currentItem.userId;
        delete this.currentItem.isDefault;
        if(!sessionStorage.getItem('tihuo-address')) {
          let arr = [];
          arr.push(this.currentItem);
          sessionStorage.setItem('tihuo-address', JSON.stringify(arr));
        } else {
          // debugger;
          let arr = JSON.parse(sessionStorage.getItem('tihuo-address'));
          arr.push(this.currentItem);
          sessionStorage.setItem('tihuo-address', JSON.stringify(arr));
        }
        setTimeout(() => {
          this.$router.push(`/yushou-address?pre=1&code=${this.code}`);
        }, 500);
      }
    },
    components: {
      Scroll,
      Toast,
      Confirm,
      FullLoading,
      NoResult,
      MHeader
    }
  };
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .address-list-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: $color-background;

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }

    &.slide-enter, &.slide-leave-to {
      transform: translate3d(100%, 0, 0);
    }

    ul {
      li {
        position: relative;
        @include border-bottom-1px($color-border);
        font-size: $font-size-small;
        background-color: #fff;

        &:last-child {
          @include border-none();
        }

        .content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 1.6rem;
          padding: 0 0.3rem;

          .info {
            font-size: $font-size-medium-x;
            display: flex;
            .name {
              flex: 1;
            }
            .mobile {
              width: 2.1rem;
            }
            span {
              line-height: 0.42rem;
            }
          }

          .addr {
            padding-top: 0.3rem;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            font-size: $font-size-medium-x;
            color: #666;
          }
          img {
            position: absolute;
            right: 0.5rem;
            opacity: 0.7;
          }
        }

        .opeator {
          display: flex;
          align-items: center;
          height: 0.9rem;
          font-size: 0;
          @include border-top-1px($color-border);

          .default {
            flex: 1;

            .icon-chose {
              margin-left: 0.3rem;
              display: inline-block;
              vertical-align: middle;
              width: 0.36rem;
              height: 0.36rem;
              background-size: 0.36rem;
              @include bg-image('un-select');

              &.active {
                @include bg-image('selected');
              }
            }

            span {
              display: inline-block;
              vertical-align: middle;
              padding-left: 0.1rem;
              line-height: 0.33rem;
              font-size: $font-size-small;
              color: $color-text-l;
            }
            .act {
              color: $primary-color;
            }
          }

          button {
            display: inline-block;
            vertical-align: middle;
            font-size: 0.24rem;
            padding: 0.06rem 0.25rem;
            background: #fff;
            border: 1px solid #979797;
            border-radius: 0.04rem;
            color: #666;
          }

          .delete {
            margin-left: 0.5rem;
            margin-right: 0.3rem;
          }
        }
      }
    }

    .no-result-wrapper {
      position: absolute;
      width: 100%;
      top: 40%;
      left: 0;
      transform: translateY(-50%);
    }

    .addr-scroll-wrapper {
      position: absolute;
      top: 0.88rem;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: auto;
    }

    footer {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 0.98rem;
      line-height: 0.98rem;
      text-align: center;
      font-size: $font-size-large-s;
      color: #fff;
      background: $primary-color;
    }
  }
</style>
