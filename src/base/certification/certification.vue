<template>
  <div>
    <div class="all">
      <div class="check-in-wrapper"></div>
      <div class="cert-content">
        <img src="./close@2x.png" class="close" @click="close">
        <div ref="prop">
          <div ref="propGroup">
            <div class="full-loading" v-for="item in certificationArr" ref="propItem" :style="getImgSyl()">
              <img :src="head" class="head">
              <p class="name">{{name}}</p>
              <p class="description">你已于{{formatDate(item.startDatetime)}}认养的{{item.tree.scientificName}}，已被认领，种植在{{item.tree.province}}{{item.tree.city}}{{item.tree.area}}。</p>
              <div class="code">
                <span>No.{{item.tree.treeNumber}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {formatDate, formatImg} from 'common/js/util';
  import defaltImg from './bg@2x.png';
  export default {
    props: {
      certificationArr: {
        type: Array,
        default: []
      },
      head: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: ''
      }
    },
    mounted() {},
    methods: {
      formatDate(date) {
        return formatDate(date, 'yyyy-MM-dd');
      },
      close() {
        this.$emit('close');
      },
      getImgSyl() {
        let img = this.certificationArr[0].certificateTemplate ? formatImg(this.certificationArr[0].certificateTemplate) : defaltImg;
        return {
          backgroundImage: `url(${img})`
        };
      }
    }
  };
</script>
<style scoped lang="scss">
  @import "~common/scss/variable";

  .all {
    .cert-content {
      height: 9.5rem;
      position: absolute;
      top: 0;
      width: 100%;
      bottom: 0;
      margin: auto;
      padding: 0 0.4rem;
      .close {
        width: 0.5rem;
        position: absolute;
        right: 0.6rem;
        top: -0.5rem;
      }
      .full-loading {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 6rem;
        height: 9.37rem;
        transform: translate(-50%, -50%);
        /*float: left;*/
        font-size: 0;
        background: #fff;
        /*z-index: 1;*/
        text-align: center;
        /*margin-right: 25px;*/
        /*background: url("./bg@2x.png") no-repeat;*/
        background-size: 100% 100%;
        &:last-child {
          margin-right: 0;
        }
        .head {
          width: 0.94rem;
          height: 0.94rem;
          border-radius: 50%;
          margin-top: 2.6rem;
          margin-bottom: 0.24rem;
        }
        .name {
          font-size: 0.28rem;
          margin-bottom: 0.3rem;
        }
        .description {
          font-size: 0.23rem;
          line-height: 0.42rem;
          color: #666;
          padding: 0 0.66rem 1.14rem;
          text-align: left;
          height: 2rem;
        }
        .code {
          display: inline-block;
          width: 3rem;
          height: 1rem;
          background: url("./code@2x.png") no-repeat;
          background-size: 100% 100%;
          font-size: 0.2rem;
          color: $primary-color;
          span {
            line-height: 1.1rem;
          }
        }
        .buttons {
          display: flex;
          justify-content: space-between;
          button {
            height: 0.9rem;
            padding: 0.22rem 0.4rem;
            background: $primary-color;
            border-radius: 0.08rem;
            display: inline-block;
            color: $color-highlight-background;
            font-size: $font-size-medium-xx;
          }
        }
      }
    }
    .check-in-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #000;
      opacity: 0.5;
    }
  }
</style>
