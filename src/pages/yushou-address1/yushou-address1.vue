<template>
  <transition name="slide">
    <div class="address-list-wrapper">
      <div class="addr-scroll-wrapper">
        <scroll :data="addressList[0]" :hasMore="hasMore" :pullUpLoad="pullUpLoad">
          <div class="pro-info">
            <p><span>{{detail.productName}}</span><span>买入单价：{{formatAmount(detail.price)}}元/{{packUnitObj[detail.unit]}}</span></p>
            <p><span>可收货总数</span><span>{{+detail.quantity + +detail.receivingQuantity}}{{packUnitObj[detail.presellProduct.packUnit]}}</span></p>
            <p><span>可收货数量</span><span>{{amount}}{{packUnitObj[detail.presellProduct.packUnit]}}</span></p>
            <p>注意：填写地址后此批货物不可转让</p>
          </div>
          <div class="gray"></div>
          <ul class="already-list">
            <li v-for="(item, index) in list" :key="index" class="border-bottom-1px" v-show="list.length">
              <div class="content">
                <div class="content-left">
                  <div class="info">
                    <div class="name-mobile">
                      <span class="name">{{item.receiver}}</span>
                      <span class="mobile">{{item.receiverMobile}}</span>
                    </div>
                    <div class="number">{{item.deliverCount}}{{packUnitObj[item.unit]}}</div>
                  </div>
                  <div class="addr">{{item.province}} {{item.city}} {{item.area}} {{item.address}}</div>
                </div>
              </div>
              <div class="opeator border-top-1px">
                <div class="default">
                  <!--<span class="add-address-text">收货数量</span>-->
                </div>
                <div class="right">
                  <button @click="goLogistics(item)" v-if="item.status === '1'">查看物流</button>
                  <button class="confirm" @click="confirm(item)" v-if="item.status === '1'">确认收货</button>
                </div>
              </div>
            </li>
          </ul>
          <div class="gray"></div>
          <div class="tip">
            <div class="addButton" @click="toAddress">
              <div class="addButton-inner">
                <img src="./add-border@2x.png">
                <span class="add-address-text">添加地址</span>
              </div>
            </div>
            <div class="opeator border-top-1px">
              <div class="default">
                <span class="add-address-text">收货数量</span>
              </div>
              <div class="right">
                <img class="diamonds right-item" @click="addNumber" src="./add@2x.png">
                <input class="num right-item" v-model="number" type="number">
                <img class="diamonds right-item" @click="subNumber" src="./sub@2x.png">
              </div>
            </div>
          </div>
          <div class="gray"></div>
          <ul class="choosed-address">
            <li v-for="(item, index) in addressList[0]" :key="index" class="border-bottom-1px" v-show="addressList[0].length">
              <div class="content">
                <div class="content-left">
                  <div class="info"><span class="name">{{item.receiver}}</span><span class="mobile">{{item.receiverMobile}}</span></div>
                  <div class="addr">{{item.province}} {{item.city}} {{item.area}} {{item.address}}</div>
                </div>
                <div class="content-right" @click="deleteItem(item, index)">
                  <img src="./delete@2x.png">
                </div>
              </div>
              <div class="opeator border-top-1px">
                <div class="default">
                  <span class="add-address-text">收货数量</span>
                </div>
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
          <button class="two" @click="confirmTihuo">确认提货</button>
        </div>
      </div>
      <div class="no-result-wrapper">
        <no-result v-show="!hasMore && !addressList.length" title="您尚未添加收货地址"></no-result>
      </div>
      <full-loading v-show="loadingFlag" :title="loadingText"></full-loading>
      <confirm ref="confirm" text="确认收货" @confirm="confirmShouhuo"></confirm>
      <confirm ref="confirmDelete" text="确认删除" @confirm="_deleteAddress"></confirm>
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
  import { confirmTihuo, getOriginZichanDetail, getWuliudanList, confirmShouhuo } from 'api/biz';
  import { getDictList } from 'api/general';

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
        detail: {presellProduct: {packUnit: ''}},
        pullUpLoad: null,
        number: 1,
        amount: 0,    // 取货总数
        outputUnitObj: {},
        packUnitObj: {},
        presellLogisticsStatus: {},
        logisCompany: {}
      };
    },
    created() {
      let clear = this.$route.query.clear;
      if(clear) {
        sessionStorage.removeItem('tihuo-address');
      }
      setTitle('提货');
      this.code = this.$route.query.code;
      this.currentItem = null;
      this.getAddress();
      this.getProDetail();
      this.getAlreadyAddress();
      this.getObjs();
      this.addressList = [];
    },
    updated() {
      this.getAddress();
    },
    methods: {
      formatAmount(amount) {
        return formatAmount(amount);
      },
      add(item) {
        item.deliverCount++;
        this.amountChange();
      },
      sub(item) {
        if (item.deliverCount >= 2) {
          item.deliverCount--;
          this.amountChange();
        }
      },
      addNumber() {
        this.number++;
      },
      subNumber() {
        if (this.number >= 2) {
          this.number--;
        }
      },
      confirm(item) {
        this.currentItem = item;
        this.$refs.confirm.show();
      },
      toAddress() {
        if(this.addressList[0]) {
          sessionStorage.setItem('tihuo-address', JSON.stringify(this.addressList[0]));
        }
        this.go(`/yushou-address-list?tihuo=1&number=${this.number}&code=${this.code}`);
      },
      goLogistics(item) {
        let logisData = {
          statusTxt: this.presellLogisticsStatus[item.status],
          shopPic: this.detail.presellProduct.listPic,
          logicPany: this.logisCompany[item.logisticsCompany]
        };
        sessionStorage.setItem('logisticData', JSON.stringify(logisData));
        this.go(`/logistics?expCode=${item.logisticsCompany}&expNo=${item.logisticsNumber}`);
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
          this.amountChange();
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
      deleteItem(item, index) {
        this.currentItem = item;
        this.deleteIndex = index;
        this.$refs.confirmDelete.show();
      },
      _deleteAddress() {
        if (this.currentItem) {
          let tempArr = JSON.parse(sessionStorage.getItem('tihuo-address'));
          tempArr.splice(this.deleteIndex, 1);
          this.addressList[0] = tempArr;
          sessionStorage.setItem('tihuo-address', JSON.stringify(this.addressList[0]));
          this.addressList.push(JSON.parse(sessionStorage.getItem('tihuo-address')));
          this.amountChange();
        }
      },
      addTihuoAddress() {
        this.go(`/tihuo-address-addedit?code=${this.code}`);
      },
      amountChange() {
        this.amount = 0;
        this.addressList[0] && this.addressList[0].map((item) => {
          this.amount += +item.deliverCount;
        });
      },
      confirmTihuo() {
        if(this.addressList[0] && this.addressList[0].length) {
          this.loadingFlag = true;
          confirmTihuo({
            code: this.code,
            logisticsList: this.addressList[0]
          }).then((res) => {
            this.loadingFlag = false;
            if(res.isSuccess) {
              this.text = '提交成功';
              this.$refs.toast.show();
              setTimeout(() => {
                this.go('/my-consignment');
              }, 1000);
            }
          }).catch(() => { this.loadingFlag = false; });
        } else {
          this.text = '请添加至少一条地址';
          this.$refs.toast.show();
        }
      },
      getAlreadyAddress() {
        Promise.all([
          getWuliudanList({
            originalGroupCode: this.code
          }).then((res) => {
            this.list = res;
          })
        ]);
      },
      confirmShouhuo() {
        confirmShouhuo({
          code: this.currentItem.code
        }).then((res) => {
          if(res.isSuccess) {
            this.text = '确认收货成功';
            this.$refs.toast.show();
            setTimeout(() => {
              location.reload();
            }, 1000);
          }
        });
      },
      getObjs() {
        Promise.all([
          getDictList('output_unit'),
          getDictList('pack_unit'),
          getDictList('presell_logistics_status'),
          getDictList('logistics_company')
        ]).then(([res1, res2, res3, res4]) => {
          res1.map((item) => {
            this.outputUnitObj[item.dkey] = item.dvalue;
          });
          res2.map((item) => {
            this.packUnitObj[item.dkey] = item.dvalue;
          });
          res3.map((item) => {
            this.presellLogisticsStatus[item.dkey] = item.dvalue;
          });
          res4.map((item) => {
            this.logisCompany[item.dkey] = item.dvalue;
          });
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
    bottom: 0.98rem;
    width: 100%;
    height: 100%;
    background: $color-background;

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }

    &.slide-enter, &.slide-leave-to {
      transform: translate3d(100%, 0, 0);
    }

    .already-list {
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
          /*flex-direction: column;*/
          align-items: center;
          height: 1.6rem;
          padding: 0 0.3rem;
          .content-left {
            flex: 1;
            .info {
              font-size: $font-size-medium-x;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .name-mobile {
                .name {
                  margin-right: 0.3rem;
                }
                .mobile {
                  width: 2.1rem;
                  color: #999;
                }
              }
              .number {
                margin-right: 0.3rem;
              }
              span {
                line-height: 0.42rem;
              }
            }
          }

          .content-right {
            border-left: 1px solid $color-border;
            img {
              width: 0.36rem;
              height: 0.36rem;
              margin-left: 0.3rem;
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
    .choosed-address {
      padding-bottom: 0.98rem;
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
          /*flex-direction: column;*/
          align-items: center;
          height: 1.6rem;
          padding: 0 0.3rem;
          .content-left {
            flex: 1;
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
          }

          .content-right {
            border-left: 1px solid $color-border;
            img {
              width: 0.36rem;
              height: 0.36rem;
              margin-left: 0.3rem;
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
        input {
          color: #333;
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
        width: 100%;
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
    .tip {
      background: #ffffff;
      .addButton {
        width: 100%;
        height: 1.6rem;
        .addButton-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.6rem;
          border-bottom: 1px solid $color-border;
          img {
            width: 0.4rem;
            height: 0.4rem;
            margin-right: 0.2rem;
          }
          .add-address-text {
            color: #b3b3b3;
            font-size: 0.24rem;
          }
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

          .add-address-text {
            color: #b3b3b3;
            font-size: 0.24rem;
          }
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
</style>
