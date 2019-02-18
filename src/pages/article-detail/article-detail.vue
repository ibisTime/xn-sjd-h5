<template>
  <div class="article-detail-wrapper">
    <m-header class="cate-header" title="文章详情"></m-header>
    <div class="content">
      <Scroll :pullUpLoad="pullUpLoad" ref="scroll">
        <div class="title">{{detail.title}}</div>
        <div class="author-connect">
          <span class="author">作者：{{detail.publishUserName}}</span>
          <span class="connect" v-if="detail.productName && detail.treeName"><span @click="goTree()">关联古树：{{detail.productName}}({{detail.treeName}})</span><img src="./more.png" v-show="detail.adoptTreeCode"></span>
        </div>
        <p class="prop"><span class="date">{{formatDate(detail.publishDatetime)}}</span></p>
        <div class="context" ref="description">
          <div class="context-content">
            <p v-for="item in contextList">{{item}}</p>
          </div>
          <img :src="formatImg(item)" v-for="item in detail.photolist">
        </div>
      </Scroll>
    </div>
    <div class="footer">
      <div class="collect" @click="collect">
        <img src="./uncollect@2x.png" v-show="!collectFlag">
        <img src="./collect@2x.png" v-show="collectFlag">
        <span>{{collectCount}}</span>
      </div>
      <div class="border"></div>
      <div class="laud" @click="laud">
        <img src="./unlaud@2x.png" v-show="!laudFlag">
        <img src="./laud@2x.png" v-show="laudFlag">
        <span>{{pointCount}}</span>
      </div>
    </div>
    <full-loading v-show="loading"></full-loading>
    <toast ref="toast" :text="text"></toast>
  </div>
</template>
<script>
  import Toast from 'base/toast/toast';
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import FullLoading from 'base/full-loading/full-loading';
  import { getArticleDetail, getArticleDz, getArticleSc, isArticleSc, isArticleDz, share, readArticle } from 'api/biz';
  import { getUserDetail } from 'api/user';
  import { setTitle, formatDate, formatImg, getUserId } from 'common/js/util';
  import {initShare} from 'common/js/weixin';

  export default {
    data() {
      return {
        text: '',
        loading: false,
        pullUpLoad: null,
        collectFlag: false,
        laudFlag: false,
        detail: {},
        contextList: [],
        config: {
          userId: getUserId(),
          code: ''
        },
        isConfig: {
          userId: getUserId(),
          code: '',
          type: '2'
        },
        collectCount: 0,
        pointCount: 0,
        context: '<table><tbody><tr><td width="240px" height="240px"><img id="qrimage" src="//qr.api.cli.im/qr?data=http%253A%252F%252F192.168.1.162%253A8033%252F%2523%252Fregister&amp;level=H&amp;transparent=false&amp;bgcolor=%23ffffff&amp;forecolor=%23000000&amp;blockpixel=12&amp;marginblock=1&amp;logourl=&amp;size=260&amp;kid=cliim&amp;key=9ee0765087ace26c717af8d86bd50a6e"></td></tr></tbody></table>'
      };
    },
    mounted() {
      setTitle('文章详情');
      this.userReferee = this.$route.query.userReferee;
      this.code = this.$route.query.code;
      if(this.userReferee && !getUserId()) {
        this.$router.push(`/register?code=${this.code}&userReferee=${this.userReferee}&type=U&back=1`);
      }
      this.isWxConfiging = false;
      this.wxData = null;
      this.code = this.$route.query.code;
      this.userReferee = this.$route.query.userReferee;
      this.config.code = this.code;
      this.isConfig.code = this.code;
      this.loading = true;
      if(getUserId()) {
        this.readArticle();
        isArticleSc(this.isConfig).then(data => {
          // 是否收藏
          if(data.isPointCollect !== '0') {
            this.collectFlag = true;
          }
        });
        this.isConfig.type = '1';
        isArticleDz(this.isConfig).then(data => {
          // 是否点赞
          if(data.isPointCollect !== '0') {
            this.laudFlag = true;
          }
        });
      }
      getArticleDetail({
        code: this.code
      }).then((res) => {
        this.detail = res;
        this.pointCount = +res.pointCount;
        this.collectCount = +res.collectCount;
        this.detail.photolist = this.detail.photo.split('||');
        this.contextList = this.detail.content.split(/\n/);
        if(!this.isWxConfiging && !this.wxData && getUserId()) {
          this.getInitWXSDKConfig();
        }
        this.loading = false;
      }).catch(() => { this.loading = false; });
    },
    methods: {
      formatImg(img) {
        return formatImg(img);
      },
      formatDate(date) {
        return formatDate(date, 'yyyy-MM-dd');
      },
      go(url) {
        this.$router.push(url);
      },
      goTree() {
        if(!getUserId()) {
          this.text = '您未登录';
          this.$refs.toast.show();
          setTimeout(() => {
            this.$router.push('/login');
          }, 500);
        } else {
          if(this.detail.adoptOrderTree) {
            if (this.detail.adoptOrderTree.status === '2') {
              if (this.detail.adoptOrderTree.currentHolder === getUserId()) {
                this.go(`/my-tree?aTCode=${this.detail.adoptTreeCode}`);
              } else {
                this.go(`/my-tree?other=1&currentHolder=${this.detail.adoptOrderTree.currentHolder}&aTCode=${this.detail.adoptTreeCode}`);
              }
            } else {
              this.text = '该认养已过期';
              this.$refs.toast.show();
            }
          } else {
            this.text = '未被认养';
            this.$refs.toast.show();
            if(this.detail.productStatus === '4') {
              setTimeout(() => {
                this.go(`/product-detail?code=${this.detail.productCode}`);
              }, 1000);
            }
          }
        }
      },
      collect() {
        // 调接口收藏
        if(!getUserId()) {
          this.text = '您未登录';
          this.$refs.toast.show();
          return;
        }
        this.loading = true;
        getArticleSc(this.config).then(data => {
          this.loading = false;
          this.collectFlag = !this.collectFlag;
          if(this.collectFlag) {
            this.collectCount ++;
          }else {
            this.collectCount --;
          }
        }, () => {
          this.loading = false;
        });
        // 收藏数+1
      },
      laud() {
        // 调接口点赞
        if(!getUserId()) {
          this.text = '您未登录';
          this.$refs.toast.show();
          return;
        }
        this.loading = true;
        getArticleDz(this.config).then(data => {
          this.loading = false;
          this.laudFlag = !this.laudFlag;
          if(this.laudFlag) {
            this.pointCount ++;
          }else {
            this.pointCount --;
          }
        }, () => {
          this.loading = false;
        });
        // 点赞数+1
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
      },
      getInitWXSDKConfig() {
        this.loading = true;
        getUserDetail({userId: getUserId()}).then((res) => {
          initShare({
            title: this.detail.title,
            desc: this.detail.content,
            link: location.href.split('#')[0] + '/#/article-detail?code=' + this.code + '&userReferee=' + res.mobile + '&type=U',
            imgUrl: formatImg(this.detail.photo.split('||')[0]) || 'http://image.tree.hichengdai.com/FhDuAJ9CVvOGGgLV6CxfshkWzV9g?imageMogr2/auto-orient/thumbnail/!300x300',
            success: (res) => {
              this.channel = '';
              if(res.errMsg.indexOf('sendAppMessage') !== -1) {
                this.channel = 0;
              } else if(res.errMsg.indexOf('shareTimeline') !== -1) {
                this.channel = 1;
              } else if(res.errMsg.indexOf('shareQQ') !== -1) {
                this.channel = 2;
              } else if(res.errMsg.indexOf('shareQZone') !== -1) {
                this.channel = 3;
              }
              if(getUserId()) {
                share(this.channel, '文章').then((res) => {
                  if(res.code) {
                    this.text = '分享成功';
                    this.$refs.toast.show();
                  }
                }).then(() => { });
              }
            }
          }, (data) => {
            this.isWxConfiging = false;
            this.wxData = data;
            this.loading = false;
          }, (msg) => {
            alert(msg);
            this.isWxConfiging = false;
            this.wxData = null;
            this.loading = false;
          });
        });
      },
      readArticle() {
        readArticle(this.code).then((res) => {
        }).catch(() => {});
      }
    },
    watch: {
      detail() {
        this._refreshScroll();
      }
    },
    components: {
      Toast,
      Scroll,
      MHeader,
      FullLoading
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  .article-detail-wrapper {
    background: #fff;
    position: fixed;
    width: 100%;
    bottom: 0.98rem;
    top: 0;
    left: 0;
    .fl {
      float: left;
    }
    .fr {
      float: right;
    }
    .content {
      background: $color-highlight-background;
      position: absolute;
      top: 0.88rem;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0.3rem;
      .title {
        font-size: 0.4rem;
        line-height: 0.56rem;
        margin-bottom: 0.4rem;
      }
      .author-connect {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.22rem;
        span {
          font-size: 0.26rem;
        }
        .author {
          color: #666;
        }
        .connect {
          color: $primary-color;
          display: flex;
          align-items: center;
          img {
            height: 0.24rem;
            margin-left: 0.05rem;
          }
        }
      }
      .prop {
        font-size: $font-size-small;
        line-height: 0.33rem;
        color: #999;
        display: flex;
        padding-bottom: 0.3rem;
        border-bottom: 1px solid $color-border;
        .date {
          flex: 1;
        }
        .collect {
          margin-right: 0.3rem;
        }
      }
      .context {
        padding-top: 0.3rem;
        font-size: $font-size-medium-s;
        line-height: 0.37rem;
        .context-content {
          margin-bottom: 0.3rem;
        }
        img {
          width: 100%;
        }
      }
    }
    .footer {
      background: #fff;
      position: fixed;
      width: 100%;
      bottom: 0;
      left: 0;
      height: 0.98rem;
      line-height: 0.52rem;
      border-top: 1px solid $color-border;
      >div{
        width: 45%;
        display: inline-block;
        text-align: center;
      }
      .border {
        width: 0;
        height: 0.4rem;
        border-right: 1px solid $color-border;
      }
      div {
        font-size: 0;
        img {
          width: 0.38rem;
          height: 0.38rem;
          margin-right: 0.1rem;
        }
        span {
          font-size: $font-size-small;
          line-height: 0.33rem;
          color: #999;
        }
      }
    }
  }
</style>
