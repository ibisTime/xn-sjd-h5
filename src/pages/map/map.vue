<template>
  <div class="map-wrapper full-screen-wrapper">
    <div id="container"></div>
    <!--<div class="info" style="border-radius: 0.08rem; position: fixed; top: 0">-->
      <!--<div style="width: 100%; height: 100%; background: #494948; opacity: 0.7"></div>-->
      <!--<div style="padding: 0.18rem; color: #fff; display: flex;">-->
        <!--<div style="flex: 1">-->
          <!--<p style="font-size: 0.42rem">{{detail.treeNumber}}</p>-->
          <!--<p style="font-size: 0.24rem">{{detail.tree.province}} {{detail.tree.city}} {{detail.tree.area}}</p>-->
        <!--</div>-->
        <!--<div style="background: #23AD8C; border-radius: 0.06rem; display: flex; align-items: center">-->
          <!--<img src="">-->
          <!--<span style="font-size: 0.22rem;">导航</span>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
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
        detail: {tree: {province: '', city: '', area: ''}},
        goUrl: ''
      };
    },
    mounted() {
      setTitle('查看地图');
      this.goUrl = require('./go@2x.png');
      this.code = this.$route.query.code;
      this.treeCode = this.$route.query.treeCode;
      this.getUserTreeDetail();
    },
    methods: {
      initMap() {
        // 点标记
        this.icon = new AMap.Icon({
          size: new AMap.Size(47, 64),    // 图标尺寸
          image: require('./position@2x.png'),  // Icon的图像
          imageSize: new AMap.Size(24, 32)
        });
        this.marker = new AMap.Marker({
          position: new AMap.LngLat(this.detail.tree.longitude, this.detail.tree.latitude),
          icon: this.icon // 添加 Icon 实例
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
        this.map.addControl(new AMap.ToolBar());
        // -------------------------------------important----------------------------------
        // -------------------------------------important----------------------------------
        // this.info.push("<div class='input-card content-window-card'><div><img style=\"float:left;\" src=\" https://webapi.amap.com/images/autonavi.png \"/></div> ");
        // this.info.push("<p class='input-item'>电话 : 010-84107000   邮编 : 100102</p>");
        // this.info.push("<p class='input-item'>地址 :北京市朝阳区望京阜荣街10号首开广场4层</p></div></div>");
        this.infoWindow = new AMap.InfoWindow({
          content: `<div class="info" style="border-radius: 0.08rem;">
            <div style="padding: 0.18rem; color: #fff; display: flex; align-items: center;">
              <div style="flex: 1; font-size: 0;">
                <p style="font-size: 0.32rem; margin-bottom: 0.1rem; display: ${this.code ? 'inline-block' : 'none'}">${this.detail.treeNumber}</p>
                <p style="font-size: 0.24rem">${this.detail.tree.province} ${this.detail.tree.city} ${this.detail.tree.area}</p>
              </div>
              <div style="background: #23AD8C; border-radius: 0.06rem; display: flex; align-items: center; padding: 0.2rem;margin-left: 0.2rem;">
                <!--<img :src=${this.goUrl} style="width: 0.36rem;height: 0.36rem ">-->
                <i style="background: url(${this.goUrl});
                display: inline-block;
                width: 0.24rem;
                height: 0.21rem;
                background-position: 0 0;
                background-size: 100% 100%;"></i>
                <!--<span style="font-size: 0.22rem;">导航</span>-->
                <a href="https://uri.amap.com/marker?position=${this.detail.tree.longitude}, ${this.detail.tree.latitude}" style="font-size: 0.22rem; color: #fff;">导航</a>
              </div>
            </div>
            <div style="width: 100%; height: 100%; background: #494948; opacity: 0.7; position: absolute; border-radius: 0.06rem; position: absolute; top: 0; z-index: -1;"></div>
          </div>`,  // 使用默认信息窗体框样式，显示信息内容
          offset: new AMap.Pixel(10, -40),
          isCustom: true
        });

        this.infoWindow.open(this.map, this.map.getCenter());
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
            console.log(this.detail);
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
