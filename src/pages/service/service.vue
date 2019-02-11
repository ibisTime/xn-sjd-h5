<template>
  <div class="service-page-wrapper">
    <div class="follow-wrapper" ref="followWrapper">
      <Scroll
        ref="scroll"
        class="scroll"
        :data="list"
        @scroll="scroll"
        :listen-scroll="listenScroll"
        :probe-type="probeType"
        :pullUpLoad="pullUpLoad">
        <div ref="item" v-for="item in list" :key="item.id">
          <div v-if="isSelf(item.userId)">
            <div class="item-time"><span>{{formatDate(item.createDatetime)}}</span></div>
            <div class="item-wrap item-right">
              <div class="item-cont">{{item.content}}</div>
              <img :src="avatar"/>
            </div>
          </div>
          <div v-else>
            <div class="item-time"><span>{{formatDate(item.createDatetime)}}</span></div>
            <div class="item-wrap item-left">
              <img src="./kefu@2x.png"/>
              <div class="item-cont">{{item.content}}</div>
            </div>
          </div>
        </div>
        <div class="talk-bottom" ref="talkBtm"></div>
      </Scroll>
      <div class="new-msg-tip" @click="newMsgClick" v-if="showNewMsg">您有新消息</div>
      <div class="service-input">
        <input class="input-cont" placeholder="说点啥呗" type="text" v-model="msg">
        <button @click="sendMsg">发送</button>
      </div>
    </div>
    <full-loading v-show="loading"></full-loading>
    <toast ref="toast" text="消息不能为空"></toast>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll';
import Slider from 'base/slider/slider';
import FullLoading from 'base/full-loading/full-loading';
import Toast from 'base/toast/toast';
import { setTitle, getUserId, formatDate, isUnDefined, formatImg } from 'common/js/util';
import fetch from 'common/js/fetch';
import { getUser } from 'api/user';
import { readMessage, replyMessage, clearMsg } from 'api/store';

export default {
  data() {
    return {
      start: 1,
      loading: true,
      msg: '',
      code: '',
      list: [],
      avatar: '',
      showNewMsg: false,
      readConfig: {
        userId: getUserId(),
        code: ''
      },
      replyConfig: {
        code: '',
        content: '',
        userId: getUserId()
      },
      user2: '',
      msgCode: '',
      clearMsgConfig: {
        user1: getUserId(),
        user2: '',
        code: ''
      }
    };
  },
  created() {
    setTitle('客服');
    this.user2 = this.$route.query.user2;
    this.msgCode = this.$route.query.code || '';
    this.pullUpLoad = null;
    this.probeType = 3;
    this.listenScroll = true;
    if(this.msgCode) {
      this.clearMsgConfig.code = this.msgCode;
      this.clearMsgConfig.user2 = this.user2;
      clearMsg(this.clearMsgConfig).then(data => {
        console.log(data);
      });
    }
    Promise.all([
      this.getPageMsg(),
      getUser()
    ]).then(([data, userInfo]) => {
      this.avatar = formatImg(userInfo.photo) || '/static/avatar@2x.png';
      this.loading = false;
      this.scrollToBottom();
      this.refreshMsg();
    }).catch(() => {
      this.loading = false;
    });
  },
  methods: {
    scroll() {
      if(this.$refs.item) {
        var elmEnd = this.$refs.item[this.$refs.item.length - 1];
        let rect = elmEnd.getBoundingClientRect();
        let top = rect.top + rect.height;
        let maxTop = this.$refs.followWrapper.clientHeight -
          this.$refs.talkBtm.offsetHeight;
        if (top <= maxTop) {
          this.showNewMsg = false;
        }
      }
    },
    newMsgClick() {
      this.scrollToBottom();
      this.showNewMsg = false;
    },
    // 查询消息
    getPageMsg() {
      return fetch(629785, { start: 1, limit: 1, user1: getUserId(), user2: this.user2 }).then((data) => {
        if (data.list.length) {
          this.code = data.list[0].code;
        }
        if (this.loading) {
          this.list = data.list[0].messageList;
        }
        // 第一次加载无需判断
        if (!this.loading && this.$refs.item.length &&
          data.list[0].messageList.length !== this.list.length) {
          this.list = data.list[0].messageList;
          setTimeout(() => {
            var elmEnd = this.$refs.item[this.$refs.item.length - 1];
            let rect = elmEnd.getBoundingClientRect();
            let top = rect.top + rect.height;
            let maxTop = this.$refs.followWrapper.clientHeight -
              this.$refs.talkBtm.offsetHeight;
            if (top > maxTop) {
              this.showNewMsg = true;
            } else {
              this.showNewMsg = false;
            }
          }, 20); // 20
        }
        if(this.code) {
          this.readMessage();
        }
      }).catch(() => {});
    },
    // 定时刷新数据
    refreshMsg() {
      this.interval = setInterval(() => {
        this.getPageMsg();
      }, 1000);
      // this.timer = setTimeout(() => {
      //   this.getPageMsg().then(() => {
      //     this.refreshMsg();
      //   });
      // }, 1000); // 1000
    },
    // 发送消息
    sendMsg() {
      if (isUnDefined(this.msg) || this.msg.replace(/^\s*|\s*$/ig, '') === '') {
        this.$refs.toast.show();
        return;
      }
      if (this.code) {
        this.replyConfig.code = this.code;
        this.replyConfig.content = this.msg;
        this.list.push({
          id: new Date().valueOf(),
          userId: getUserId(),
          content: this.msg,
          createDatetime: new Date()
        });
        this.scrollToBottom();
        this.msg = '';
        replyMessage(this.replyConfig).then(data => {});
      } else {
        this._sendMsg();
      }
    },
    // 发送消息
    _sendMsg() {
      let msg = this.msg;
      this.msg = '';
      this.list.push({
        id: new Date().valueOf(),
        userId: getUserId(),
        content: msg,
        createDatetime: new Date()
      });
      this.scrollToBottom();
      fetch(629780, {
        type: '0',
        user1: getUserId(),
        user2: this.user2,
        content: msg
      }).then((data) => {
        this.code = data.code;
      }).catch(() => {});
    },
    // 滚动到底部
    scrollToBottom(time = 300) {
      setTimeout(() => {
        this.$refs.scroll.scrollToElement(this.$refs.talkBtm, 300);
      }, 100);
    },
    // 格式化日期
    formatDate(date) {
      return formatDate(date, 'yyyy.MM.dd hh:mm');
    },
    // 是否是自己发的消息
    isSelf(userId) {
      return userId === getUserId();
    },
    readMessage() {
      this.readConfig.code = this.code;
      readMessage(this.readConfig).then((res) => {});
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  components: {
    Slider,
    FullLoading,
    Scroll,
    Toast
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/mixin.scss";
@import "../../common/scss/variable.scss";
.service-page-wrapper {
  .follow-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #F0F0F0;
    .scroll{
      padding-top: 0.4rem;
    }
    .item-time {
      padding-bottom: 0.3rem;
      padding-top: 0.5rem;
      text-align: center;
      font-size: 0;
      span {
        display: inline-block;
        padding: 0.11rem 0.53rem;
        border-radius: 0.08rem;
        font-size: $font-size-medium;
        background: #E6E6E6;
        color: #999999;
      }
    }
    .item-wrap {
      display: flex;
      align-items: flex-end;
      img {
        width: 1rem;
        height: 1rem;
        flex: 0 0 1rem;
      }
      .item-cont {
        padding: 0.2rem 0.31rem;
        word-break: break-all;
        font-size: $font-size-medium;
        line-height: 0.4rem;
      }
      &.item-left {
        padding: 0 0.3rem 0 0.2rem;
        justify-content: flex-start;
        img {
          margin-bottom: -0.1rem;
        }
        .item-cont {
          background: #FFFFFF;
          border: 1px solid #E6E6E6;
          border-radius: 0.2rem 0.2rem 0.2rem 0;
          color: #666666;
        }
      }
      &.item-right {
        padding: 0 0.3rem;
        justify-content: flex-end;
        img {
          border-radius: 0.5rem;
        }
        .item-cont {
          background: #363638;
          border: 1px solid #E6E6E6;
          border-radius: 0.2rem 0.2rem 0 0.2rem;
          color: #F4E6A9;
        }
      }
    }
    .talk-bottom {
      padding-top: 0.6rem;
    }
  }
  .new-msg-tip {
    position: fixed;
    bottom: 1.6rem;
    font-size: $font-size-medium;
    color: #fff;
    background-color: #999;
    border-radius: 0.3rem;
    padding: 0.1rem 0;
    width: 2rem;
    text-align: center;
    margin-left: -1rem;
    left: 50%;
  }
  .service-input {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0.98rem;
    display: flex;
    align-items: center;
    padding: 0.13rem 0.3rem;
    background: #FFFFFF;
    box-shadow: 0 -1px 0 0 #E6E6E6;
    .input-cont {
      flex: 1;
      padding-right: 0.3rem;
      line-height: $font-size-medium;
      height: 100%;
      font-size: $font-size-medium;
    }
    button {
      padding: 0.16rem 0.57rem;
      font-size: $font-size-medium;
      color: #fff;
      background: #DAB86E;
      border-radius: 0.04rem;
    }
  }
}
</style>
