<template>
    <div>
        <div class="zf-box">
            <!--<m-header class="cate-header" :title="headerTitle"></m-header>-->
            <div>
                <p>
                    <img src="./zfwc.png" alt="">
                </p>
                <p>支付成功</p>
              <!--<button class="toOrder" @click="$router.push('/me')">返回个人中心</button>-->
            </div>
          <div class="home" @click="$router.push(`/home`)">
            <img src="./home.png">
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
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 100%;
      font-size: 0.4rem;
      padding-top: 2rem;
      color: #525252;
      text-align: center;
      background-color: #fff;
      p{
        margin-top: 0.4rem;
      }
      img{
        width: 1.5rem;
      }
      .home {
        width: 1rem;
        height: 1rem;
        position: fixed;
        right: 0.3rem;
        bottom: 1.3rem;
        background-size: 100% 100%;
        background-color: $primary-color;
        border-radius: 50%;
        padding: 0.2rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
</style>

