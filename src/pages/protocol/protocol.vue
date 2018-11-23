<template>
  <div class="protocol-wrapper" :style="{bottom: register ? '0' : '0.98rem'}">
    <!--<m-header class="cate-header" :title="title"></m-header>-->
    <!--  v-html="protocol" -->
    <div class="protocol">
      <Scroll :pullUpLoad="pullUpLoad" ref='scroll'>
        <p v-html="xyText" class="rich-text-description" ref="description"></p>
      </Scroll>
    </div>
    <div class="footer" v-show="sign">
      <div class="confirm" @click="confirm()">我已阅读并签署</div>
    </div>
   <full-loading v-show="loading" :title="loadText"></full-loading>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import FullLoading from 'base/full-loading/full-loading';
  import MHeader from 'components/m-header/m-header';
  import { getCookie } from 'common/js/cookie';
  import { placeOrder, recognizeOrder, recognizeOrderFirst, getProductDetail, getBookingProDetail, getCompany, placePreOrder, getDeriveZichanDetail } from 'api/biz';
  import { getSystemConfigCkey } from 'api/general';
  import { setTitle } from 'common/js/util';

  export default {
    data() {
      return {
        title: '协议',
        sign: false,
        loadingFlag: true,
        protocol: '',
        xyText: '',
        loading: false,
        loadText: '',
        pullUpLoad: null,
        register: ''
      };
    },
    mounted() {
      setTitle('协议');
      this.pullUpLoad = null;
      this.sign = this.$route.query.sign || '';
      this.proCode = this.$route.query.proCode || '';
      this.specsCode = this.$route.query.specsCode || '';
      this.quantity = this.$route.query.quantity || '';
      this.type = this.$route.query.type || '';
      this.identifyCode = this.$route.query.identifyCode || '';
      this.register = this.$route.query.register || '';
      this.pre = this.$route.query.pre || '';  // 是否为预售
      this.jishou = this.$route.query.jishou || '';  // 是否为寄售
      this.loading = true;
      if(this.register) {
        getSystemConfigCkey('REGISTRATION_AGREEMENT').then((res) => {
          this.loading = false;
          this.xyText = res.cvalue;
        }).catch(() => { this.loading = false; });
      } else {
        if(this.jishou) {
          Promise.all([
            getDeriveZichanDetail({code: this.proCode}).then((res) => {
              getCompany({userId: res.ownerId}).then((data) => {
                this.loading = false;
                this.xyText = data.contractTemplate;
              });
            })
          ]).catch(() => { this.loading = false; });
        } else if(this.pre) {
          Promise.all([
            getBookingProDetail({code: this.proCode}).then((res) => {
              getCompany({userId: res.ownerId}).then((data) => {
                this.loading = false;
                this.xyText = data.contractTemplate;
              });
            })
          ]).catch(() => { this.loading = false; });
        } else {
          Promise.all([
            getProductDetail({code: this.proCode}).then((res) => {
              getCompany({userId: res.ownerId}).then((data) => {
                this.loading = false;
                this.xyText = data.contractTemplate;
              });
            })
          ]).catch(() => { this.loading = false; });
        }
      }
    },
    methods: {
      // 点击签署协议
      confirm() {
        if(this.pre) {
          this.preConfirm();
        } else {
          let userId = getCookie('userId');
          this.loading = true;
          if(this.type) {
            // 非集体下单
            placeOrder({
              productCode: this.proCode,
              specsCode: this.specsCode,
              userId: userId,
              quantity: this.quantity,
              type: this.type
            }).then((res) => {
              this.loading = false;
              this.go('/pay?orderCode=' + res.code + '&type=' + this.type);
            }).catch(() => { this.loading = false; });
          } else {
            // 集体下单
            if(this.identifyCode) {
              // 非第一人
              recognizeOrder({
                identifyCode: this.identifyCode,
                userId: userId,
                quantity: this.quantity
              }).then((res) => {
                this.loading = false;
                this.go('/pay?orderCode=' + res + '&type=' + this.type);
              }).catch(() => { this.loading = false; });
            } else {
              // 第一人
              recognizeOrderFirst({
                productCode: this.proCode,
                specsCode: this.specsCode,
                userId: userId,
                quantity: this.quantity
              }).then((res) => {
                this.loading = false;
                this.go('/pay?orderCode=' + res + '&type=' + this.type);
              }).catch(() => { this.loading = false; });
            }
          }
        }
      },
      // 预售签署协议
      preConfirm() {
        let userId = getCookie('userId');
        this.loading = true;
        placePreOrder({
          // productCode: this.proCode,
          specsCode: this.specsCode,
          userId: userId,
          quantity: this.quantity
          // type: this.type
        }).then((res) => {
          this.loading = false;
          this.go('/pay?pre=1&orderCode=' + res.code + '&type=' + this.type);
        }).catch(() => { this.loading = false; });
      },
      go(url) {
        this.$router.push(url);
      },
      // 富文本滚动
      _refreshScroll() {
        setTimeout(() => {
          this.$refs.scroll.refresh();
          let imgs = this.$refs.description.getElementsByTagName('img');
          for (let i = 0; i < imgs.length; i++) {
            let _img = imgs[i];
            if (_img.complete) {
              setTimeout(() => {
                this.$refs.scroll.refresh();
              }, 20);
              continue;
            }
            _img.onload = () => {
              setTimeout(() => {
                this.$refs.scroll.refresh();
              }, 20);
            };
          }
        }, 20);
      }
    },
    watch: {
      xyText() {
        this._refreshScroll();
      }
    },
    components: {
      Scroll,
      MHeader,
      FullLoading
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";

  .protocol-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0.98rem;
    width: 100%;
    background: #fff;
    z-index: 100;
    .protocol {
      margin: 0 0;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: auto;
    }
    .footer {
      background: #fff;
      height: 0.98rem;
      line-height: 0.9rem;
      color: #fff;
      font-size: $font-size-medium-x;
      position: fixed;
      bottom: 0;
      width: 100%;
      left: 0;
      padding: 0 0.3rem;
      border-top: 1px solid $color-border;
      display: flex;
      align-items: center;
      .confirm {
        border-radius: 0.08rem;
        background: $primary-color;
        width: 100%;
        height: 0.9rem;
        line-height: 0.98rem;
        display: inline-block;
        text-align: center;
      }
    }
    table{
      text-align: center;
      font-size: 0.4rem;
    }
  }
</style>
