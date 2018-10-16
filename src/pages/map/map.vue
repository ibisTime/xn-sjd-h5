<template>
  <div class="map-wrapper full-screen-wrapper">
    <div id="container"></div>
    <full-loading v-show="loading" :title="loadText"></full-loading>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import FullLoading from 'base/full-loading/full-loading';
  import MHeader from 'components/m-header/m-header';
  import AMap from 'AMap';
  import { setTitle } from 'common/js/util';
  import { getUserTreeDetail, getProductTreeDetail } from 'api/biz';

  export default {
    data() {
      return {
        loading: false,
        loadText: '',
        detail: {}
      };
    },
    mounted() {
      setTitle('查看地图');
      this.code = this.$route.query.code;
      this.treeCode = this.$route.query.treeCode;
      this.getUserTreeDetail();
    },
    methods: {
      initMap() {
        this.marker = new AMap.Marker({
          position: new AMap.LngLat(this.detail.tree.longitude, this.detail.tree.latitude),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: '北京'
        });
        this.map = new AMap.Map('container', {
          center: [this.detail.tree.longitude, this.detail.tree.latitude],
          resizeEnable: true,
          zoom: 10
        });
        AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], () => {
          this.map.addControl(new AMap.ToolBar());
          this.map.addControl(new AMap.Scale());
        });
        this.map.add(this.marker);
      },
      getUserTreeDetail() {
        this.loading = true;
        if(this.treeCode) {
          // 树木详情
          getProductTreeDetail({
            code: this.treeCode
          }).then((res) => {
            this.detail.tree = res;
            this.initMap();
            this.loading = false;
          }).catch((msg) => { console.log(msg); this.loading = false; });
        } else {
          // 主页
          getUserTreeDetail(this.code).then((res) => {
            this.detail = res;
            this.initMap();
            this.loading = false;
          }).catch((msg) => { console.log(msg); this.loading = false; });
        }
      },
      go(url) {
        this.$router.push(url);
      }
    },
    watch: {
      content() {
        this._refreshScroll();
      }
    },
    components: {
      Scroll,
      MHeader,
      FullLoading
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";

  .map-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0.98rem;
    width: 100%;
    background: #fff;
    z-index: 100;
    #container {
      height: 100%;
      width: 100%;
    }
  }
</style>
