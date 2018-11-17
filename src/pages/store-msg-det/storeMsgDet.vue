<template>
    <div class="msg-wrapper">
        <div class="content">
            <ul class="msg-list">
                <li>
                    <div class="msg-orter">
                        <div class="orter-img msg-box">
                            <div class="p"></div>
                        </div>
                        <div class="order-msg msg-box">
                            哈哈
                        </div>
                    </div> 
                    <div class="msg-own">
                        <div class="use-msg msg-box">
                            我哈市将
                        </div>
                        <div class="use-img msg-box">
                            <div class="p"></div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="send-msg">
            <div class="iup-box">
                <input type="text" placeholder="说点啥呗">
            </div>
            <div class="sen-box">
                发送
            </div>
        </div>
    </div>
</template>

<script>
import { sendMessage, readMessage, replyMessage } from 'api/store';
import { getUserId } from 'common/js/util';
export default {
  data() {
    return {
      sendConfig: {
        user1: getUserId(),
        user2: '',       // 他人（客服）
        content: '',
        type: '0'
      },
      readConfig: {
        code: '',
        userId: getUserId()
      },
      replyConfig: {
        code: '',
        content: '',
        userId: getUserId()
      }
    };
  },
  methods: {
    sendMessageFn() {  // 发送消息
      sendMessage(this.sendConfig).then(data => {});
    },
    readMessageFn() {  // 阅读消息
      readMessage(this.readConfig).then(data => {});
    },
    replyMessageFn() {  // 回复消息
      replyMessage(this.replyConfig).then(data => {});
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../common/scss/mixin.scss";
@import "../../common/scss/variable.scss";
.msg-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0rem;
  width: 100%;
  background-color: #f0f0f0;
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .content {
    overflow: auto;
    font-family: PingFang-SC-Medium;
    .msg-list{
        padding: 0.2rem;
        padding-bottom: 0.8rem;
        li{
            width: 100%;
            font-size: 0.32rem;
            letter-spacing: 0.005rem;
            .msg-box{
                display: inline-block;
                vertical-align: middle;
            }
            .orter-img,
            .use-img{
                padding: 0.1rem;
                .p{
                    margin: 0;
                    width: 0.8rem;
                    height: 0.8rem;
                    border: 1px solid transparent;
                    border-radius: 100%;
                    border: none;
                    background-size: 100% 100%;
                    background-image: url('./shop.png');
                }
            }
            .order-msg,
            .use-msg{
                padding: 0.1rem 0.3rem;
                border-radius: 0.1rem;
            }
            .order-msg{
                background-color: #fff;;
            }
            .use-msg{
                color: #fff;
                background-color: #23AD8C;
            }
            .msg-own{
                text-align: right;
            }
        }
    }
  }
  .send-msg{
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 1.2rem;
        background-color: #fff;
        box-shadow: 0 -0.02rem 0 0 #EBEBEB;
        display: flex;
        padding: 0.1rem 0.2rem;
        font-size: 0.3rem;
        .iup-box{
            width: 80%;
            padding-right: 0;
            font-size: 0.3rem;
            input{
                width: 100%;
                padding: 0.2rem;
                color: #333;
            }
        }
        .sen-box{
            width: 20%;
            background-color: burlywood;
            color: #fff;
            letter-spacing: 0.05rem;
            height: 100%;
            padding-top: 0.33rem;
            text-align: center;
            border-radius: 0.08rem;
        }
    }
}
</style>
