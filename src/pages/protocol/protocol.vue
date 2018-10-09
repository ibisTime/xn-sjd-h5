<template>
  <div class="protocol-wrapper" :style="{bottom: register ? '0' : '0.98rem'}">
    <!--<m-header class="cate-header" :title="title"></m-header>-->
    <!--  v-html="protocol" -->
    <div class="protocol">
      <Scroll :pullUpLoad="pullUpLoad">
        <p v-html="xyText" class="rich-text-description"></p>
      </Scroll>
      <!-- <table>
        <tbody>
          <tr>
            <td width="240px" height="240px">

              <img id="qrimage" src="//qr.api.cli.im/qr?data=http%253A%252F%252F192.168.1.162%253A8033%252F%2523%252Fregister&amp;level=H&amp;transparent=false&amp;bgcolor=%23ffffff&amp;forecolor=%23000000&amp;blockpixel=12&amp;marginblock=1&amp;logourl=&amp;size=260&amp;kid=cliim&amp;key=9ee0765087ace26c717af8d86bd50a6e">
            </td>
          </tr>
        </tbody>
      </table> -->
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
  import { placeOrder, recognizeOrder, recognizeOrderFirst, getProductDetail, getCompany } from 'api/biz';
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
      this.loading = true;
      if(this.register) {
        getSystemConfigCkey('REGISTRATION_AGREEMENT').then((res) => {
          this.loading = false;
          this.xyText = res.cvalue;
        }).catch(() => { this.loading = false; });
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
    },
    methods: {
      confirm() {
        let userId = getCookie('userId');
        this.loading = true;
        if(this.type) {
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
              this.go('/pay?orderCode=' + res);
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
              this.go('/pay?orderCode=' + res);
            }).catch(() => { this.loading = false; });
          }
        }
      },
      go(url) {
        this.$router.push(url);
      }
    },
    watch: {
      content() {
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
