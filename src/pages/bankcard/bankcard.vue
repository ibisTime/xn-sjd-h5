<template>
  <div class="bankcard-wrapper">
    <m-header class="cate-header" title="我的银行卡" :actText="actText" @action="action"></m-header>
    <scroll class="bankcard-content" :hasMore="!bankcardList">
      <div class="bankcard-item" :key="item.code" v-for="(item, index) in bankcardList">
        <div class="content"
             ref="bankcard"
             @click="go('/bankcard-addedit?code=' + item.code)"
             @touchstart.stop.prevent="touchstart(index,$event)"
             @touchmove.stop.prevent="touchmove($event)"
             @touchend.stop.prevent="touchend($event)">
          <div class="img-cont">
            <img src="./bankcard@2x.png" alt="">
          </div>
          <div class="text">
            <div class="text-top">
              <p>{{item.bankName}}</p>
            </div>
            <div class="text-middle">储蓄卡</div>
            <div class="text-bottom bankcardNumber">{{formatBankcardNum(item.bankcardNumber)}}</div>
          </div>
        </div>
        <div ref="deleteEle" class="delete" @click="deleteItem(item)">
          <p>删除</p>
        </div>
      </div>
    </scroll>
    <full-loading v-show="delLoading" title="删除中..."></full-loading>
    <confirm ref="confirm" text="确定删除银行卡吗" @confirm="_deleteBankCard"></confirm>
    <toast ref="toast" text="删除成功"></toast>
    <router-view></router-view>
    </div>
</template>
<script>
  // import {mapMutations, mapGetters, mapActions} from 'vuex';
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import FullLoading from 'base/full-loading/full-loading';
  import Confirm from 'base/confirm/confirm';
  import Toast from 'base/toast/toast';
  import {prefixStyle} from 'common/js/dom';
  import {setTitle} from 'common/js/util';
  // import {changeMobile} from 'api/user';
  import {getBankCardList, delBankCard} from 'api/account';
  // import {SET_BANKCARD_LIST} from 'store/mutation-types';

  const transform = prefixStyle('transform');
  const transitionDuration = prefixStyle('transitionDuration');

  export default {
    data() {
      return {
        delLoading: false,
        actText: '+',
        bankcardList: [{
          bankName: ''
        }],
        bankCode: ''
      };
    },
    created() {
      this.touch = {};
      this.currentItem = null;
      // axios.post(`https://openapi.alipay.com/gateway.do?charset=UTF-8&method=alipay.trade.wap.pay&sign=B79r2fV8vB4fJPuECXS8YBFI6M5Vr5lmg4xLKFQ3Ad%2BHRjcvYPW3obks3GedHi1Ld08VQ0czmAFqIpLf%2Fvy8cBWfc4GgVuGZk5NiYz1xxMJtXiIy6LSx0QogNzpSOgr31SRt9mZtTkAk%2B0ZIboGT88WO%2BaLmf%2BC2kuNF3DIJ2xz73QZ5g%2FPQp1eoia%2BV9IyH47g7oKjzEDbtFpE20zjdVvmIBeGJ3ItWj7mgFiulpvAcZwtEijxjpkEm1esgL738Trtaz26xqM8ZZawr4rpx7byYdyMzxVKdSc8VFz%2FepGQSKFAp4Wb9%2FGZ42Rfo6GSPA0x1zk6IQMfKqoTEmeZ9lQ%3D%3D&return_url=http%3A%2F%2Fsjd.h5.hichengdai.com%2Fa.jspx&notify_url=http%3A%2F%2Fsjd.h5.hichengdai.com%2Falipay%2Fh5%2Fcallback&version=1.0&app_id=2018080260825970&sign_type=RSA2&timestamp=2018-10-06+19%3A35%3A43&alipay_sdk=alipay-sdk-java-3.3.0&format=json`).then(data => {
      //   console.log(data.data)
      // })
      this._getBankCardList();
    },
    computed: {
      // ...mapGetters([
      //   'bankcardList'
      // ])
    },
    updated() {
      if (this.shouldGetData()) {
        this._getBankCardList();
      }
    },
    methods: {
      action() {
        this.go('/bankcard-addedit');
      },
      go(url) {
        this.$router.push(url);
      },
      shouldGetData() {
        if (/\/user\/[^/]+\/setting\/bankcard/.test(this.$route.path)) {
          setTitle('银行卡列表');
          return !this.bankcardList;
        }
      },
      _getBankCardList() {
        getBankCardList().then((data) => {
          this.bankcardList = data;
          // let bankcardNumber = data[0].bankcardNumber;
          // this.bankcardList.map((item) => {
          //   let reg = /^(\d{4})\d+(\d{4})$/;
          //   item.bankcardNumber = item.bankcardNumber.replace(reg, '$1****$2');
          //   let account = '';
          //   for (let i = 0; i < item.bankcardNumber.length; i++) {    /* 可将以下空格改为-,效果也不错 */
          //     if (i === 4) account = account + ' '; /* 帐号第四位数后加空格 */
          //     if (i === 8) account = account + ' '; /* 帐号第八位数后加空格 */
          //     if (i === 12) account = account + ' ';/* 帐号第十二位后数后加空格 */
          //     account = account + item.bankcardNumber.substr(i, 1);
          //   }
          //   // item.bankcardNumber = item.bankcardNumber.substring(bankcardNumber.length - 4);
          // });
          // this.bankCode = bankcardNumber.substring(bankcardNumber.length - 4);
          // if(data.length > 0) {
          //   this.actText = '修改';
          // }
        }).catch(() => {});
      },
      deleteItem(item) {
        console.log(item);
        this.currentItem = item;
        this.$refs.confirm.show();
      },
      _deleteBankCard() {
        if (this.currentItem) {
          this.delLoading = true;
          delBankCard({code: this.currentItem.code}).then(() => {
            this.delLoading = false;
            this._getBankCardList();
          }).catch(() => {
            this.delLoading = false;
          });
        }
      },
      goAdd() {
        this.$router.push(this.$route.path + '/add');
      },
      touchstart(index, event) {
        console.log(index);
        console.log(event);
        this.touch.initiated = true;
        // 用来判断是否是一次移动
        this.touch.moved = false;
        const touch = event.touches[0];
        this.touch[index] = this.touch[index] || {};
        this.touch[index].x1 = touch.pageX;
        this.touch[index].y1 = touch.pageY;
        this.touch[index].x2 = touch.pageX;
        this.touch[index].y2 = touch.pageY;
        this.touch[index].offset = this.touch[index].offset || 0;
        this.touch.currentIndex = index;
      },
      touchmove(event) {
        if (!this.touch.initiated) {
          return;
        }
        const touch = event.touches[0];
        const index = this.touch.currentIndex;
        this.touch[index].x2 = touch.pageX;
        this.touch[index].y2 = touch.pageY;
        const deltaX = touch.pageX - this.touch[index].x1;
        const deltaY = touch.pageY - this.touch[index].y1;
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return;
        }
        if (!this.touch.moved) {
          this.touch.moved = true;
        }
        let offset = this.touch[index].offset + deltaX;
        this.$refs.bankcard[index].style[transform] = `translate3d(${offset}px,0,0)`;
        this.$refs.deleteEle[index].style['zIndex'] = -1;
      },
      touchend(event) {
        const index = this.touch.currentIndex;
        let deltaX = this.touch[index].x2 - this.touch[index].x1;

        if (!this.touch.moved) {
          let deltaY = this.touch[index].y2 - this.touch[index].y1;
          if (Math.abs(deltaX) < 5 || Math.abs(deltaY)) {
            this.selectItem(this.bankcardList[index]);
          }
          return;
        }
        const currentElem = this.$refs.bankcard[index];
        let zIndex = -1;

        if (deltaX <= 0) {
          if (deltaX <= -15) {
            currentElem.style[transform] = 'translate3d(-60px,0,0)';
            this.touch[index].offset = -60;
            zIndex = 0;
          } else {
            currentElem.style[transform] = 'translate3d(0,0,0)';
            this.touch[index].offset = 0;
          }
        } else {
          if (deltaX >= 15) {
            currentElem.style[transform] = 'translate3d(0,0,0)';
            this.touch[index].offset = 0;
          } else {
            currentElem.style[transform] = 'translate3d(0,0,0)';
            this.touch[index].offset = 0;
          }
        }
        currentElem.style[transitionDuration] = '300ms';
        currentElem.addEventListener('transitionend', () => {
          currentElem.style[transitionDuration] = '0ms';
        });
        this.$refs.deleteEle[index].style['zIndex'] = zIndex;
      },
      formatBankcardNum(num) {
        let reg = /^(\d{4})\d+(\d{4})$/;
        num = num.replace(reg, '$1 **** **** $2');
        return num;
      }
      // ...mapMutations({
      //   setBankcardList: SET_BANKCARD_LIST
      // }),
      // ...mapActions([
      //   'deleteBankCard'
      // ])
    },
    components: {
      FullLoading,
      Scroll,
      Confirm,
      Toast,
      MHeader
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";

  .bankcard-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $color-highlight-background;
    /*z-index: 101;*/

    .bankcard-content{
      position: relative;
      height: 100%;
      overflow: hidden;
      margin-top: 0.88rem;
      padding: 0.27rem 0.3rem;
      .bankcard-item {
        width: 100%;
        height: 3.2rem;
        border-radius: 0.12rem;
        margin-bottom: 0.3rem;
        display: flex;
        position: relative;
        .content {
          background: transparent;
          border-style: dashed;
          justify-content: center;
          display: flex;
          height: 100%;
          width: 100%;
          background: url("./bankcard-bg@2x.png") no-repeat;
          background-size: 100% 100%;
          padding: 0.48rem;
        }
        .delete {
          position: absolute;
          right: 0;
          top: 0;
          width: 1.2rem;
          height: 100%;
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          z-index: -1;
          border-radius: 0.12rem;
          font-size: $font-size-medium;
          background: #d30000;
          color: #fff;

          p+p {
            margin-top: 12px;
          }
        }
        .img-cont {
          width: 0.8rem;
          height: 0.8rem;
          display: inline-block;
          background: #fff;
          border-radius: 50%;
          position: relative;
          img {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0.47rem;
            height: 0.47rem;
            transform: translate(-50%, -50%);
            -ms-transform: translate(-50%, -50%);
            -moz-transform: translate(-50%, -50%);
            -webkit-transform: translate(-50%, -50%);
            -o-transform: translate(-50%, -50%);
          }
        }
        .text {
          flex: 1;
          padding-left: 0.3rem;
          color: $color-highlight-background;
          .text-top {
            font-size: $font-size-medium-x;
          }
          .text-middle {
            padding-top: 0.15rem;
            font-size: $font-size-small;
            margin-bottom: 0.8rem;
          }
          .text-bottom {
            font-size: 0.48rem;
          }
        }
        .bankcardNumber {
          color: $color-highlight-background;
        }
      }
    }
  }
</style>
