<template>
  <div class="rollScreen_container" id ="rollScreen_container">
    <img src="./bulletin@2x.png">
    <ul class="rollScreen_list" :style = {transform:transform} :class="{rollScreen_list_unanim:num===0}">
      <li class="rollScreen_once" v-for="(item,index) in contentArr" :key=index>
        <span>{{item.content.substr(0,15) + '...'}}</span>
      </li>
      <li class="rollScreen_once" v-for="(item,index) in contentArr" :key=index+contentArr.length>
        <span>{{item.content.substr(0,15) + '...'}}</span>
      </li>
    </ul>
    <span class="more" @click="go('/me')">更多</span>
  </div>
</template>

<script>
  export default {
    props: {
      height: {
        default: 0.7,
        type: Number
      },
      lineNum: {
        default: 1,
        type: Number
      },
      contentArr: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    data: function () {
      return {
        // contentArr: ['内容1', '内容2', '内容3', '内容4', '内容5', '内容6', '内容7'],
        num: 0
      };
    },
    computed: {
      transform: function () {
        return 'translateY(-' + this.num * this.height + 'rem)';
      }
    },
    created() {
      let _this = this;
      setInterval(function () {
        if (_this.num !== _this.contentArr.length) {
          _this.num++;
        } else {
          _this.num = 0;
        }
      }, 3000);
    },
    methods: {
      go(url) {
        // debugger;
        // // this.$emit('use', items);
        this.$router.push('/bulletin');
      }
    }
  };
</script>

<style lang="scss" scoped>
  .rollScreen_container{
    display: flex;
    align-items: baseline;
    position:relative;
    overflow: hidden;
    height: 0.7rem;
    width: 100%;
    background: #fdf4f3;
    padding: 0 0.3rem;
    img {
      width: 0.74rem;
      height: 0.25rem;
      margin-right: 0.11rem;
      border-left: 3px solid #ed544d;
      padding-left: 0.14rem;
    }
    .more {
      position: absolute;
      top: 50%;
      right: 0.3rem;
      transform: translateY(-50%);
      color: #ed544d;
      font-size: 0.24rem;
      padding-left: 0.2rem;
      border-left: 1px solid #ed544d;
    }
  }
  .rollScreen_list{
    transition: 1s linear;
  }
  .rollScreen_list_unanim{
    transition: none
  }
  .rollScreen_once {
    height: 0.7rem;
    font-size: 0.24rem;
    background: #fdf4f3;
    padding: 0.24rem 0.3rem 0.24rem 0.2rem;
    line-height: 0.33rem;
  }
</style>
