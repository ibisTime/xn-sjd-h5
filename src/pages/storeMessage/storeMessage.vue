<template>
    <div class="msg-wrapper">
        <div class="content">
            <Scroll
                :data="storeMsgData"
                :hasMore="hasMore"
                @pullingUp="storeMsgFn">
                <ul class="msg-list">
                    <li v-for="(item, index) in storeMsgData" :key="index" @click="$router.push(`/store-service?user2=${item.user2}&code=${item.code}`)">
                        <h5>{{item.user1Nickname}} <span class="fr time">{{formatDate(item.createDatetime)}}</span></h5>
                        <p>{{item.messageList[0].content}}</p>
                    </li>
                </ul>
                <div class="mall-content">
                  <no-result v-show="!storeMsgData.length && !hasMore" class="no-result-wrapper" title="抱歉，暂无消息"></no-result>
                </div>
            </Scroll>
        </div>
        <full-loading v-show="loading" :title="loadingText"></full-loading>
    </div>
</template>

<script>
import FullLoading from 'base/full-loading/full-loading';
import Scroll from 'base/scroll/scroll';
import NoResult from 'base/no-result/no-result';
import { formatDate, setTitle, getUserId } from 'common/js/util';
import { storeMessage } from 'api/store';
export default {
  data() {
    return {
      loading: true,
      hasMore: true,
      loadingText: '正在加载...',
      start: 1,
      config: {
        user1: getUserId(),
        start: 1,
        limit: 8,
        orderColumn: 'update_datetime',
        orderDir: 'desc'
      },
      storeMsgData: []
    };
  },
  created() {
    setTitle('我的商城消息');
    this.storeMsgFn();
  },
  methods: {
    formatDate(time) {
      return formatDate(time);
    },
    storeMsgFn() {
      this.config.start = this.start;
      storeMessage(this.config).then(data => {
        this.loading = false;
        if (data.totalPage <= this.start) {
          this.hasMore = false;
        }
        this.storeMsgData = [...this.storeMsgData, ...data.list];
        this.start ++;
      }, () => {
        this.loading = false;
      });
    }
  },
  components: {
    FullLoading,
    Scroll,
    NoResult
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
  background-color: #fff;
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .content {
    overflow: auto;
    padding: 0 0.3rem;
    font-family: PingFang-SC-Medium;
    .msg-list{
        li{
            height: 1.6rem;
            padding: 0.32rem 0;
            background: rgba(216,216,216,0.00);
            box-shadow: 0 0.02rem 0 0 #EBEBEB;
            h5{
                margin-bottom: 0.2rem;
                font-size: 0.3rem;
                color: #333333;
                letter-spacing: 0.005rem;
                span{
                    font-size: 0.24rem;
                    color: #999;
                }
            }
            p{
                font-size: .26rem;
                color: #999999;
                letter-spacing: 0.004rem;
            }
        }
    }
  }

}
</style>
