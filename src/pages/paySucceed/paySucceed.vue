<template>
    <div>
        <div class="zf-box">
            <!--<m-header class="cate-header" :title="headerTitle"></m-header>-->
            <div>
                <p>
                    <img src="" alt="">
                </p>
                <p>支付成功</p>
              <!--<button class="toOrder" @click="$router.push('/me')">返回个人中心</button>-->
            </div>
        </div>
    </div>
</template>

<script>
  import MHeader from 'components/m-header/m-header';
  import { setTitle } from 'common/js/util';
  export default {
    data() {
      return {
        headerTitle: '支付成功'
      };
    },
    mounted() {
      setTitle('支付成功');
    },
    methods: {
      // toOrder() {
      // }
    },
    components: {
      MHeader
    }
  };

</script>

<style lang="scss" scoped>
  @import "~common/scss/variable";
    .zf-box{
        width: 100%;
        height: 5.1rem;
        font-size: 0.6rem;
        padding-top: 0.8rem;
        color: #333;
        text-align: center;
        background-color: #fff;
      .toOrder {
        border-radius: 0.08rem;
        background: #23AD8C;
        width: 3rem;
        line-height: 0.98rem;
        display: inline-block;
        text-align: center;
        margin-top: 0.5rem;
        color: #fff;
        font-size: 0.34rem;
      }
    }
</style>

