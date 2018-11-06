<template>
  <transition name="slide">
    <div class="address-list-wrapper">
      <div class="addr-scroll-wrapper">
        <scroll :data="addressList[0]" :hasMore="hasMore" :pullUpLoad="pullUpLoad">
          <div class="pro-info">
            <p><span>{{detail.productName}}</span><span>买入单价：{{formatAmount(detail.price)}}元/{{detail.unit}}</span></p>
            <p><span>可收货总数</span><span>50箱</span></p>
            <p><span>可收货数量</span><span>30箱</span></p>
            <p>注意：填写地址后此批货物不可转让</p>
          </div>
          <div class="gray"></div>
          <ul>
            <li v-for="(item, index) in addressList[0]" :key="index" class="border-bottom-1px" v-show="addressList[0].length">
              <div class="content">
                <div class="info"><span class="name">{{item.receiver}}</span><span class="mobile">{{item.receiverMobile}}</span></div>
                <div class="addr">{{item.province}} {{item.city}} {{item.area}} {{item.address}}</div>
              </div>
              <div class="opeator border-top-1px">
                <div class="default" @click.stop="setDefault(item, index)">
                  <!--<i class="icon-chose" :class="item.isDefault === '1' ? 'active' : ''"></i>-->
                  <!--<span>设为默认地址</span>-->
                </div>
                <!--<button class="edit" @click.stop="goEdit(item)">编辑</button>-->
                <!--<button class="delete" @click.stop="deleteItem(item, index)">删除</button>-->
                <div class="right">
                  <img class="diamonds right-item" @click="add(item)" src="./add@2x.png">
                  <input class="num right-item" v-model="item.deliverCount" type="number">
                  <img class="diamonds right-item" @click="sub(item)" src="./sub@2x.png">
                </div>
              </div>
            </li>
          </ul>
        </scroll>
        <div class="footer">
          <button class="two" @click="addTihuoAddress">继续添加地址</button>
          <button class="two" @click="confirmTihuo">确认提货</button>
        </div>
      </div>
      <div class="no-result-wrapper">
        <no-result v-show="!hasMore && !addressList.length" title="您尚未添加收货地址"></no-result>
      </div>
      <full-loading v-show="loadingFlag" :title="loadingText"></full-loading>
      <confirm ref="confirm" text="确定删除地址吗" @confirm="_deleteAddress"></confirm>
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
  import {setTitle, formatAmount} from 'common/js/util';
  // import {SET_ADDRESS_LIST, SET_CURRENT_ADDR} from 'store/mutation-types';
  import {deleteAddress, setDefaultAddress} from 'api/user';
  import { confirmTihuo, getOriginZichanDetail } from 'api/biz';
  // import {mapGetters, mapMutations, mapActions} from 'vuex';

  export default {
    data() {
      return {
        text: '',
        hasMore: true,
        loadingFlag: false,
        loadingText: '',
        list: [],
        addressList: [],
        deleteIndex: 0,
        detail: {},
        pullUpLoad: null
      };
    },
    created() {
      let clear = this.$route.query.clear;
      if(clear) {
        sessionStorage.removeItem('tihuo-address');
      }
      this.code = this.$route.query.code;
      this.currentItem = null;
      this.getAddress();
      this.getProDetail();
      this.addressList = [];
    },
    updated() {
      this.getAddress();
    },
    computed: {
      // ...mapGetters([
      //   'addressList'
      // ])
      /* {
          name: '东南',
          mobile: '18888888888',
          province: '浙江省',
          city: '杭州市',
          area: '余杭区',
          address: '仓前街道'
        } */
    },
    methods: {
      formatAmount(amount) {
        return formatAmount(amount);
      },
      add(item) {
        item.deliverCount++;
      },
      sub(item) {
        if (this.number >= 2) {
          item.deliverCount--;
        }
      },
      getProDetail() {
        this.loadingFlag = true;
        getOriginZichanDetail({
          code: this.code
        }).then((res) => {
          this.detail = res;
          this.loadingFlag = false;
        }).catch(() => { this.loadingFlag = false; });
      },
      go(url) {
        this.$router.push(url);
      },
      getAddress() {
        if (!this.addressList.length) {
          this.addressList.push(JSON.parse(sessionStorage.getItem('tihuo-address')));
        } else {
          this.hasMore = false;
        }
      },
      shouldGetData() {
        if (/\/address/.test(this.$route.path) || this.$route.path === '/yushou-address') {
          setTitle('提货申请');
          return this.hasMore;
        }else{
          return !this.hasMore;
        }
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
      addTihuoAddress() {
        this.go(`/tihuo-address-addedit?code=${this.code}`);
      },
      confirmTihuo() {
        confirmTihuo({
          code: this.code,
          logisticsList: this.addressList[0]
        }).then((res) => {
          if(res.isSuccess) {
            this.text = '提交成功';
            this.$refs.toast.show();
            setTimeout(() => {
              this.go('/consignment-hall/my-consignment');
            }, 1000);
          }
        });
      }
    },
    components: {
      Scroll,
      Toast,
      Confirm,
      FullLoading,
      NoResult
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
              margin-right: 0.3rem;
            }
            .mobile {
              width: 2.1rem;
              color: #999;
            }
            span {
              line-height: 0.42rem;
            }
          }

          .addr {
            padding-top: 0.26rem;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            font-size: $font-size-medium-x;
            color: #666;
          }
        }

        .opeator {
          display: flex;
          align-items: center;
          height: 0.9rem;
          font-size: 0;
          padding: 0 0.3rem;
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
      top: 0;
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
    .pro-info {
      background: #ffffff;
      p {
        color: #ED4A4A;
        font-size: 0.24rem;
        line-height: 0.33rem;
        padding: 0.23rem;
        border-bottom: 1px solid $color-border;
        span {
          font-size: 0.3rem;
          line-height: 0.42rem;
          color: #333;
        }
        span:first-child {
          width: 30%;
          display: inline-block;
        }
      }
      p:last-child {
        padding: 0.2rem;
      }
    }
    .gray {
      width: 100%;
      height: 0.2rem;
      padding: 0;
      background: #f5f5f5;
    }
    .footer {
      height: 0.98rem;
      padding: 0.07rem 0.3rem;
      border-top: 1px solid #eee;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      font-size: $font-size-medium-x;
      line-height: 0.7rem;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        color: $primary-color;
        font-size: $font-size-medium-xx;
      }
      button {
        width: 2.96rem;
        height: 0.84rem;
        border-radius: 0.08rem;
        background: $primary-color;
        color: $color-highlight-background;
        font-size: 0.3rem;
      }
      .one {
        width: 100%;
        font-size: 0.32rem;
        line-height: 0.45rem;
      }
      .two {
        width: 3.3rem;
        font-size: 0.32rem;
        line-height: 0.45rem;
      }
    }
    .right {
      flex: 1;
      display: table-cell;
      vertical-align: middle;
      text-align: center;
      .right-item {
        float: right;
        text-align: center;
        line-height: 0.5rem;
      }
      .diamonds {
        width: 0.36rem;
        height: 0.36rem;
      }
      .num {
        width: 0.9rem;
        font-size: $font-size-medium-x;
        color: #333;
        height: 0.36rem;
      }
    }
  }
</style>
