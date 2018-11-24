<template>
  <div id="app" @touchmove.prevent>
    <div v-if="!loadingFlag">
      <router-view></router-view>
    </div>
    <div v-if="loadingFlag" class="loading-container">
      <div class="loading-wrapper">
        <loading title=""></loading>
      </div>
    </div>
    <!--<wx-bind-mobile ref="bindMobile"></wx-bind-mobile>-->
    <toast :text="text" ref="toast"></toast>
  </div>
</template>

<script type="text/ecmascript-6">
  import Loading from 'base/loading/loading';
  import Toast from 'base/toast/toast';
  import {setUser, getWxMobAndCapt, getUserId} from 'common/js/util';
  import {getAppId} from 'api/general';
  import {wxLogin, getUserDetail} from 'api/user';
  import {mapMutations, mapGetters} from 'vuex';
  import {SET_LOCATION, SET_IS_LOCA_ERR, SET_LOG_FLAG} from 'store/mutation-types';

  export default {
    data() {
      return {
        loadingFlag: false,
        text: ''
      };
    },
    computed: {
      ...mapGetters([
        'location',
        'logFLag'
      ])
    },
    mounted() {
      if(getUserId()) {
        getUserDetail({userId: getUserId()}).then((res) => {
          if(res.mobile) {
            if(res.status === '0') {
              this.$router.push('/home');
            } else {
              alert('您的账号已被锁定，请联系管理员');
            }
          } else {
            this.$router.push('/wx-bind-mobile');
          }
        }).catch(() => {
          this.loading = false;
          this.relogin = true;
        });
      }
      // if (!isLogin()) {
      //   if (/code=([^&]+)&state=/.exec(location.href)) {
      //     let code = RegExp.$1;
      //     let userReferee = '';
      //     if (/(?:\?|&)userReferee=([^&$]+)/.test(location.hash)) {
      //       userReferee = RegExp.$1;
      //     }
      //     this.wxLogin(code, userReferee);
      //   } else {
      //     this.getAppId();
      //   }
      // } else {
      //   if (/\/#\//.test(location.href)) {
      //     let hash = window.location.hash;
      //     let path = hash;
      //     if (hash === '' || hash === '#/') {
      //       path = '#/home';
      //     }
      //     path = path.substr(1);
      //     this.timer = setInterval(() => {
      //       if (this.$route.fullPath !== '/') {
      //         clearInterval(this.timer);
      //         if (/\/user\/recommend/.test(hash)) {
      //           location.replace(`${location.origin}/?#/home`);
      //         } else {
      //           location.replace(`${location.origin}/?#${path}`);
      //         }
      //       }
      //     }, 20);
      //   } else {
      //     this.loadingFlag = false;
      //   }
        // saveLoginLog().catch(() => {});
      // }
      // let ua = navigator.userAgent.toLowerCase();
      // let isWeixin = ua.indexOf('micromessenger') !== -1;
      // if (!isWeixin) {
      //   document.head.innerHTML = '<title>抱歉，出错了</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0"><link rel="stylesheet" type="text/css" href="https://res.wx.qq.com/open/libs/weui/0.4.1/weui.css">';
      //   document.body.innerHTML = '<div class="weui_msg"><div class="weui_icon_area"><i class="weui_icon_info weui_icon_msg"></i></div><div class="weui_text_area"><h4 class="weui_msg_title">请在微信客户端打开链接</h4></div></div>';
      // }
    },
    methods: {
      wxLogin(code, userReferee) {
        let mobAndCapt = getWxMobAndCapt();
        let mobile;
        let smsCaptcha;
        if (mobAndCapt) {
          mobile = mobAndCapt.mobile;
          smsCaptcha = mobAndCapt.captcha;
        }
        wxLogin(code, userReferee, mobile, smsCaptcha).then((data) => {
          // alert('wxlogin-data-' + JSON.stringify(data));
          if (data.isNeedMobile === '1') {
            this.text = '微信登录需要先绑定手机号';
            this.$refs.toast.show();
            this.$refs.bindMobile.show();
          } else {
            setUser(data);
            if (this.$route.path === '/home/recommend') {
              location.replace(`${location.origin}/?#/home`);
            } else {
              location.replace(`${location.origin}/?#${this.$route.fullPath}`);
            }
          }
        }).catch(() => {});
      },
      getAppId() {
        getAppId().then((data) => {
          let appId = data.cvalue;
          let redirectUri = encodeURIComponent(`${location.origin}?${location.hash}`);
          let url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
          let suffix = '&response_type=code&scope=snsapi_userinfo#wechat_redirect';
          setTimeout(() => {
            location.replace(`${url}?appid=${appId}&redirect_uri=${redirectUri}${suffix}`);
          }, 100);
        });
      },
      ...mapMutations({
        setLocation: SET_LOCATION,
        setLocaErr: SET_IS_LOCA_ERR,
        setLogFLag: SET_LOG_FLAG
      })
    },
    components: {
      Loading,
      Toast
      // WxBindMobile
    }
  };
</script>

<style lang="scss" scoped>
  @import "~common/scss/variable.scss";
  .loading-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .loading-wrapper {
      position: absolute;
      top: 50%;
      width: 100%;
      transform: translate3d(0, -50%, 0);
    }
  }
</style>
