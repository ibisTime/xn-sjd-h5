<template>
  <transition name="logistics">
    <div class="logistics-wrapper">
      <div class="logi-header">
        <div class="head-left">
          <img :src="getImgSyl(logisticData.shopPic)" alt="">
        </div>
        <div class="head-right">
          <p>物流状态：<span class="status">{{logisticData.statusTxt}}</span></p>
          <p>承运来源：{{logisticData.logicPany}}</p>
          <p>物流单号：{{expNo}}</p>
        </div>
      </div>
      <p class="hr"></p>
      <div class="logi-content">
        <div class="logi-zz" ref="logizz" v-show="logisticsData.length > 1"></div>
        <div class="logi-box" ref="logibox" v-for="(item, index) in logisticsData" :key="index">
          <p class="logi-p">{{item.AcceptStation}}</p>
          <p>{{formatDate(item.AcceptTime)}}</p>
          <span :class='{"new-logi": index === 0}'></span>
        </div>
        <no-result v-show="!logisticsData.length" class="no-result-wrapper" title="暂无物流消息"></no-result>
      </div>
      <full-loading v-show="loading" title="正在加载中..."></full-loading>
    </div>
  </transition>
</template>
<script>
  import FullLoading from 'base/full-loading/full-loading';
  import NoResult from 'base/no-result/no-result';
  import { lookLogistics } from 'api/store';
  import { setTitle, formatImg, formatDate } from 'common/js/util';

  export default {
    data() {
      return {
        loading: true,
        logicTime: '',
        logisticsData: [],
        logisticData: {
          shopPic: '',
          statusTxt: '',
          logicPany: '',
          orderCode: ''
        },
        expNo: '',
        eleHeight: 0
      };
    },
    created() {
      setTitle('物流信息');
      let expCode = this.$route.query.expCode;
      this.expNo = this.$route.query.expNo;
      // let expCode = 'YD';
      // this.expNo = '3720520214862';
      this.logisticData = JSON.parse(sessionStorage.getItem('logisticData'));
      lookLogistics({
        expCode,
        expNo: this.expNo
      }).then(data => {
        if(data.Traces) {
          this.logisticsData = data.Traces;
          setTimeout(() => {
            let logibox = this.$refs.logibox;
            if(logibox) {
              for(let i = 0, len = logibox.length - 1; i < len; i++) {
                this.eleHeight += parseFloat(window.getComputedStyle(logibox[i], null).height) + parseFloat(window.getComputedStyle(logibox[i], null).marginBottom);
                this.$refs.logizz.style.height = this.eleHeight + 'px';
              }
            }
            this.loading = false;
          }, 500);
        }else {
          this.loading = false;
        }
      }, () => {
        this.loading = false;
      });
    },
    methods: {
      formatDate(time) {
        return formatDate(time);
      },
      getImgSyl(imgs, type) {
        let pic = imgs ? formatImg(imgs) : type === 'u' ? 'static/avatar@2x.png' : 'static/default.png';
        return pic;
      }
    },
    components: {
      FullLoading,
      NoResult
    }
  };
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  @import "~common/scss/variable";

  .logistics-wrapper {
    width: 100%;
    min-height: 100%;
    font-size: 0.3rem;
    color: #999;
    font-family: PingFang-SC-Medium;
    background-color: #fff;
    .hr{
      height: 0.2rem;
      background-color: #f5f5f5;
    }
    .logi-header{
      padding: 0.3rem;
      display: flex;
      .head-left{
        margin-right: 0.24rem;
        img{
          width: 1.5rem;
          height: 1.5rem;
        }
      }
      .head-right{
        width: 80%;
        display: flex;
        flex-wrap: wrap;
        align-content: space-between;
        p{
          width: 100%;
          letter-spacing: 0.23px;
        }
        .status{
          color: #5393EE;
        }
        .wz{
          color: #23AD8C;
        }
      }
    }
    .logi-content{
      position: relative;
      padding: 0.4rem 0.36rem;
      .logi-zz{
        position: absolute;
        left: 0.36rem;
        top: 0.52rem;
        height: 0%;
        width: 0.02rem;
        background-color: #e6e6e6;
      }
      .logi-box{
        position: relative;
        margin-bottom: 0.6rem;
        padding-left: 0.26rem;
        .logi-p{
          color: #333;
          margin-bottom: 0.2rem;
        }
        span{
          position: absolute;
          left: 0;
          top: 0.1rem;
          transform: translateX(-45%);
          display: inline-block;
          width: 0.1rem;
          height: 0.1rem;
          -webkit-border-radius: 100%;
          -moz-border-radius: 100%;
          border-radius: 100%;
          background-color: #ccc;
        }
        .new-logi{
          background-color: #23AD8C;
          width: 0.16rem;
          height: 0.16rem;
        }
      }
    }
  }
  input::-webkit-input-placeholder {
    color: #ccc;
  }
  textarea::-webkit-input-placeholder {
    color: #ccc;
    font-size: $font-size-medium-s;
  }
</style>
