<template>
    <div>
        <div class="content">
            <div class="pj-con">
                <textarea name="" v-model="pjText" placeholder="宝贝满足你的期待吗？说说你的使用心情，分享给想买的他们吧"></textarea>
            </div>
            <div class="pj-img">
                <div class="img-box">
                    <div class="iup-box">
                        <input type="file">
                    </div>
                    <div class="zp-box">
                    
                    </div>
                </div>
            </div>
            <p class="back-co"></p>
            <div class="pj-foo">
                <div class="s-pj">
                    发表
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      pjText: ''
    };
  }
};
</script>

<style lang="scss" scoped>
@import "../../common/scss/mixin.scss";
@import "../../common/scss/variable.scss";
.content {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    font-family: PingFang-SC-Medium;
    background-color: #fff;
    padding-top: 0.3rem;
    color: #999999;
    .back-co{
        height: 0.2rem;
        background-color: #f5f5f5;
    }
    .pj-con{
        padding: 0 0.3rem;
        height: 2.2rem;
        font-size: 0.28rem;
        line-height: 1.3;
        textarea{
            width: 100%;
            height: 100%;
            padding: 0.1rem;
        }
    }
    .img-box{
        margin-left: 0.3rem;
        width: 1.8rem;
        height: 1.8rem;
        position: relative;
        .iup-box{
            width: 100%;
            height: 100%;
            opacity: 0;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 9;
            input{
                width: 100%;
                height: 100%;
            }
        }
        .zp-box{
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;
            background-image: url('./tjtp.png');
            background-size: 100% 100%;
        }
    }
    .pj-foo{
        margin-top: 1.16rem;
        padding: 0 0.3rem;
        .s-pj{
            height: 1rem;
            line-height: 1rem;
            text-align: center;
            background-color: #23AD8C;
            color: #fff;
            border-radius: 0.08rem;
            font-size: 0.32rem;
            letter-spacing: 0.005rem;
        }
    }

}
</style>
