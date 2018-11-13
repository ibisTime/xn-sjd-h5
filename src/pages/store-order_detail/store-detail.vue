<template>
  <div class="mall-wrapper" @click.stop>
    <div class="content">
        <div class="det-head">
            <div class="det-img"></div>
            <div>订单待收货</div>
        </div>
        <p class="back-co"></p>
        <div class="det-con">
            <div class="con-left">
                <div class="l-img"></div>
            </div>
            <div class="con-right">
                <p>王大锤 <span>15083962283</span></p>
                <p>北京市朝阳区蓬莱东路1001号</p>
            </div>
        </div>
        <p class="back-co"></p>
        <div class="det-list">
            <div class="list-head">
                <p>店铺名称 <span class="fr">代收货</span></p>
            </div>
            <div class="shop-det">
                <div class="shop-left">
                    <div class="shop-img"></div>
                </div>
                <div class="shop-right">
                    <p>商品名称 <span class="fr">x1</span></p>
                    <p>规格分类：10斤装</p>
                    <p>合计1件商品 <span class="fr">¥2480.00</span></p>
                </div>
            </div>
        </div>
        <p class="back-co"></p>
        <div class="det-foo">
            <div class="foo-head">
                <p>订单信息</p>
            </div>
            <div class="foo-con">
                <p>订单号 <span>201910101135</span></p>
                <p>订单金额 <span>¥1000.00</span></p>
                <p>卖家 <span>产权方</span></p>
                <p>支付流水号 <span>201810251136</span></p>
            </div>
        </div>
        <div class="sing-foo">
            <div class="foo-btn">
                删除订单
            </div>
        </div>
    </div>
  </div>
</template>
<script>
import FullLoading from 'base/full-loading/full-loading';
import Toast from 'base/toast/toast';
import { formatAmount, formatImg, formatDate, setTitle } from 'common/js/util';
export default {
  data() {
    return {
      loading: true,
      textMsg: '',
      loadingText: '正在加载中...'
    };
  },
  created() {
    setTitle('订单详情');
  },
  mounted() {
    this.loading = false;
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    },
    formatImg(img) {
      return formatImg(img);
    },
    formatDate(date, format) {
      return formatDate(date, format);
    },
    go(url) {
      this.$router.push(url);
    },
    getImgSyl(imgs) {
      return {
        backgroundImage: `url(${imgs})`
      };
    }
  },
  components: {
    FullLoading,
    Toast
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/mixin.scss";
@import "../../common/scss/variable.scss";
.mall-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0.98rem;
  width: 100%;
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .content {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background-color: #fff;
    font-family: PingFangSC-Regular;
    .sing-foo{
        height: 0.9rem;
        padding: 0.18rem 0;
        display: flex;
        box-shadow: 0 -0.02rem 0 0 #EBEBEB;
        flex-direction: row-reverse;
        .foo-btn{
            width: 1.5rem;
            height: 0.56rem;
            text-align: center;
            line-height: 0.56rem;
            border: 0.02rem solid #979797;
            border-radius: 0.06rem;
            font-size: 0.26rem;
            color: #999;
        }
    }
  }

}
</style>

