<template>
    <div>
        <div class="zf-box">
            <m-header class="cate-header" :title="headerTitle"></m-header>
            <div>
                <p>
                    <img src="" alt="">
                </p>
                <p>支付成功</p>
            </div>
        </div>
    </div>
</template>

<script>
  import MHeader from 'components/m-header/m-header';

  export default {
    data() {
      return {
        headerTitle: '支付成功'
      };
    },
    components: {
      MHeader
    }
  };

</script>

<style scoped>
    .zf-box{
        width: 100%;
        height: 5.1rem;
        font-size: 0.6rem;
        padding-top: 0.8rem;
        color: #333;
        text-align: center;
        background-color: #fff;
    }
</style>

