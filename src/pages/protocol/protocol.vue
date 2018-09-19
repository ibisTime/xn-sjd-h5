<template>
  <div class="protocol" v-html="protocol">
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import {setTitle} from 'common/js/util';
  // import {getUserSystemConfig} from 'api/general';

  export default {
    data() {
      return {
        content: '',
        telephone: '',
        time: '',
        loadingFlag: true,
        protocol: '<table><tbody><tr><td width="240px" height="240px"><img id="qrimage" src="//qr.api.cli.im/qr?data=http%253A%252F%252F192.168.1.162%253A8033%252F%2523%252Fregister&amp;level=H&amp;transparent=false&amp;bgcolor=%23ffffff&amp;forecolor=%23000000&amp;blockpixel=12&amp;marginblock=1&amp;logourl=&amp;size=260&amp;kid=cliim&amp;key=9ee0765087ace26c717af8d86bd50a6e"></td></tr></tbody></table>'
      };
    },
    created() {
      setTitle('关于我们');
      // this.pullUpLoad = null;
      // Promise.all([
      //   getUserSystemConfig('aboutUs'),
      //   getUserSystemConfig('telephone'),
      //   getUserSystemConfig('serviceTime')
      // ]).then(([aboutus, telephone, time]) => {
      //   this.loadingFlag = false;
      //   this.telephone = telephone.cvalue;
      //   this.time = time.cvalue;
      //   this.content = protocol.cvalue;
      // }).catch(() => {
      //   this.loadingFlag = false;
      // });
    },
    methods: {
      getTel() {
        if (this.telephone) {
          return `tel://${this.telephone}`;
        } else {
          return '';
        }
      },
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
      content() {
        this._refreshScroll();
      }
    },
    components: {
      Scroll
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";

  .about-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;

    .about-content {
      height: 100%;
      overflow: hidden;

      .rich-text-description {
        a {
          line-height: 1;
          color: $color-text;
          text-decoration: underline;
        }
      }

      .other-info {
        padding-top: 0.6rem;

        p {
          line-height: 1;
        }
      }
    }
  }
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
