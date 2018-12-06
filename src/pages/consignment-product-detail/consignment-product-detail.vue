<template>
  <div class="product-detail-wrapper" :style="{bottom: showBottom ? '0.98rem' : '0'}">
    <!--<m-header class="cate-header" title="产品详情"></m-header>-->
    <div class="content">
      <Scroll ref='scroll' :pullUpLoad="pullUpLoad">
        <div class="slider-wrapper">
          <slider :loop="loop">
            <div class="home-slider" v-for="item in banners" :key="item">
              <a :style="getImgSyl(item)"></a>
            </div>
          </slider>
        </div>
      <div class="info">
        <div class="item">
          <span>产品名称</span><span>{{detail.presellProduct.name}}</span>
        </div>
        <div class="item">
          <span>产品产地</span><span>{{detail.presellProduct.originPlace}}</span>
        </div>
        <div class="item">
          <span>产品学名</span><span>{{detail.presellProduct.scientificName}}</span>
        </div>
        <div class="item">
          <span>产品品种</span><span>{{detail.presellProduct.variety}}</span>
        </div>
        <div class="item">
          <span>总产出</span><span>{{detail.presellProduct.totalOutput}}{{outputUnitObj[detail.presellProduct.outputUnit]}}/年</span>
        </div>
        <div class="item" v-show="status === '2'">
          <span>可转让</span><span>{{detail.quantity}}{{packUnitObj[detail.unit]}}</span>
        </div>
        <div class="item" v-show="status === '3'">
          <span>可提货</span><span>{{detail.quantity}}{{packUnitObj[detail.unit]}}</span>
        </div>
        <div class="item" v-show="status === '4'">
          <span>转让</span><span>{{detail.variety}}{{packUnitObj[detail.unit]}}</span>
        </div>
        <div class="item" v-show="status === '5'">
          <span>可生效</span><span>{{detail.variety}}{{packUnitObj[detail.unit]}}</span>
        </div>
        <div class="item" v-show="status === '4'">
          <span>已提货</span><span>{{detail.variety}}{{packUnitObj[detail.unit]}}</span>
        </div>
        <div class="item" v-show="status === '4'">
          <span>可支配</span><span>{{detail.variety}}{{packUnitObj[detail.unit]}}</span>
        </div>
        <div class="item" v-show="detail.status === '2' || detail.status === '3'">
          <span>转让有效时间</span><span>已过期</span>
        </div>
        <div class="item" v-show="detail.status === '0'">
          <span>转让有效时间</span><span>待生效</span>
        </div>
        <div class="item" v-show="detail.status === '1'">
          <span>转让截止时间</span><span>{{formatDate(detail.adoptEndDatetime || detail.presellProduct.adoptEndDatetime, 'yyyy-MM-dd')}}</span>
        </div>
        <div class="item" @click="go(`/consignment-erweima?code=${detail.code}&number=${detail.quantity}&price=${detail.price}`)" v-show="derive && detail.type === '1'">
          <span>转让二维码</span>
          <img src="./more@2x.png" class="fr more">
        </div>
        <div class="item" @click="goTreeCode()" v-show="detail.treeNumberList.length">
          <span>树编号</span><span>{{detail.treeNumberList.length}}棵</span>
          <img src="./more@2x.png" class="fr more">
        </div>
        <div class="item" @click="go(`/belongs?code=${detail.code}`)">
          <span>所属人</span>
          <img src="./more@2x.png" class="fr more">
        </div>
      </div>
      <div class="gray"></div>
      <div class="description">
        <div class="description-title">
          <div class="border"></div>
          <span>图文详情</span>
          <div class="description-detail rich-text-description" v-html="detailDescription" ref="description"></div>
        </div>
      </div>
      </Scroll>
    </div>
    <div class="footer" v-show="buy">
      <span>¥{{formatAmount(detail.price)}}</span>
      <button :style="{'background' : buyDisable ? 'gray' : ''}" @click="showPopUp">{{buyText}}</button>
    </div>
    <div class="footer-dingxiangjishou" v-show="dingxiangJishou">
      <span>¥{{formatAmount(detail.price)}}</span>
      <div class="buttons">
        <button @click="showRefuse">拒绝</button>
        <button @click="showPopUp">确认购买</button>
      </div>
    </div>
    <div class="footer" v-show="chexiao">
      <span>¥{{formatAmount(detail.price)}}</span>
      <button class="fr" @click="showChexiao">撤销</button>
    </div>
    <div class="footer" v-show="(this.origin && detail.ownerId === userId) &&(this.origin && detail.status === '1' || this.origin && detail.status === '0')">
      <button class="two" @click="showAssignment">转让</button>
      <button class="two" @click="address">填写地址，确认自用</button>
    </div>
    <div class="footer" v-show="(this.origin && detail.ownerId === userId) &&(this.origin && detail.status === '2')">
      <button @click="address" v-if="detail.quantity !== '0'">填写地址，确认自用</button>
      <button @click="confirmShouhuo">确认收货</button>
    </div>
    <div :class="['mask',flag || assignmentFlag? 'show' : '']" @click="genghuan"></div>
    <div :class="['buypart',flag ? 'show' : '']">
      <div class="title">
        <div class="title-pic">
          <img :src="formatImg(detail.presellProduct.listPic)">
        </div>
        <div class="title-right">
          <p>{{detail.presellProduct.scientificName}}</p>
          <i @click="genghuan">X</i>
          <p class="position"><img src="./position@2x.png">{{detail.presellProduct.originPlace}}</p>
        </div>
      </div>
      <div class="number">
        <span>价格</span>
        <div class="right">
          <span>¥{{formatAmount(detail.price)}}</span>
        </div>
      </div>
      <div class="number">
        <span>数量</span>
        <div class="right">
          <img class="diamonds right-item" @click="add" src="./add@2x.png">
          <input class="num right-item" v-model="number" type="number">
          <img class="diamonds right-item" @click="sub" src="./sub@2x.png">
        </div>
        <!--<div class="right" v-show="erweimaJishou || dingxiangJishou">-->
          <!--<span>{{number}}</span>-->
        <!--</div>-->
      </div>
      <div class="buypart-bottom">
        <div class="confirm" @click="buyJiShou()">确定(总额：¥{{formatAmount(detail.price * number)}})</div>
      </div>
    </div>
    <div :class="['assignment-part',assignmentFlag ? 'show' : '']">
      <div class="assignment-type">
        <div @click="chooseType(0)" class="assignment-type-item">
          <img src="./choosed@2x.png" v-show="choosedIndex === 0">
          <img src="./unchoosed@2x.png" v-show="choosedIndex !== 0">
          <span>二维码转让/转赠</span>
        </div>
        <div @click="chooseType(1)" class="assignment-type-item">
          <img src="./choosed@2x.png" v-show="choosedIndex === 1">
          <img src="./unchoosed@2x.png" v-show="choosedIndex !== 1">
          <span>定向转让/转赠</span>
        </div>
        <div @click="chooseType(2)" class="assignment-type-item">
          <img src="./choosed@2x.png" v-show="choosedIndex === 2">
          <img src="./unchoosed@2x.png" v-show="choosedIndex !== 2">
          <span>挂单寄售</span>
        </div>
      </div>
      <div class="gray"></div>
      <div class="assignment-info">
        <div class="title" v-show="type === 0 || type === 1">
          <div class="title-inner">
            <span @click="zhuanrang" :class="iszhuanrang ? 'active' : ''">转让</span><span @click="zhuanzeng" :class="!iszhuanrang ? 'active' : ''">转赠</span>
          </div>
        </div>
        <div class="assignment-item" v-show="choosedIndex === 1">
          <span>对方账号</span>
          <input type="text" v-model="mobile" placeholder="请输入对方账号">
        </div>
        <div class="assignment-item">
          <span>价格</span>
          <input type="text" v-model="price" placeholder="请输入价格">
        </div>
        <div class="assignment-item">
          <span>数量</span>
          <input type="text" v-model="number" placeholder="请输入数量">
        </div>
      </div>
      <div class="buypart-bottom">
        <div class="confirm" @click="confirm()">{{assignmentBtnText()}}</div>
      </div>
    </div>
    <toast ref="toast" :text="text"></toast>
    <full-loading v-show="loading"></full-loading>
    <confirm-input ref="confirmInput" :text="inputText" @confirm="handleInputConfirm"></confirm-input>
    <confirm ref="confirmInputChexiao" text="确定撤销吗" @confirm="handleInputConfirmChexiao"></confirm>
    <!--<confirm-input ref="confirmInputChexiao" :text="inputText" @confirm="handleInputConfirmChexiao"></confirm-input>-->
    <router-view></router-view>
  </div>
</template>
<script>
import Toast from 'base/toast/toast';
import Scroll from 'base/scroll/scroll';
import FullLoading from 'base/full-loading/full-loading';
import Slider from 'base/slider/slider';
import NoResult from 'base/no-result/no-result';
import MHeader from 'components/m-header/m-header';
import ConfirmInput from 'base/confirm-input/confirm-input';
import Confirm from 'base/confirm/confirm';
import { formatAmount, formatImg, formatDate, setTitle, getUserId } from 'common/js/util';
import { getCookie } from 'common/js/cookie';
import {initShare} from 'common/js/weixin';
import { getDeriveZichanDetail, getOriginZichanDetail,
  guadanjishou, dingxiangjishou, erweimajishou, placeOrderGuadan,
  refuseDingxiangJishou, cancelDingxiangJishou, zhifuzhuanzeng, placeOrderDingxiang, placeOrderErweima, share } from 'api/biz';
import { getDictList } from 'api/general';
import { getUserDetail } from 'api/user';
export default {
  data() {
    return {
      title: '正在加载...',
      loading: false,
      toastText: '',
      currentList: [],
      hasMore: false,
      text: '',
      pullUpLoad: null,
      detailDescription: '',
      flag: false,
      assignmentFlag: false,
      idCode: '',
      detail: {
        presellProduct: [{price: 0, name: ''}],
        province: '',
        city: '',
        area: '',
        treeNumberList: []
      },
      choosedIndex: 0,
      code: '',   // 产品code
      banners: [],
      loop: false,
      status: '2',
      buy: 0, // 是否是从寄售大厅点进来要购买
      price: '',
      number: 1,
      mobile: '',
      type: 0,
      origin: false,
      derive: false,
      showBottom: false,
      erweimaJishou: false,
      dingxiangJishou: false,
      chexiao: false,
      inputText: '',
      iszhuanrang: true,
      buyText: '确认购买',
      buyDisable: false,
      packUnitObj: {},
      outputUnitObj: {},
      userId: ''
    };
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
    showRefuse(item) {
      this.inputText = '拒绝原因';
      this.curItem = item;
      this.$refs.confirmInput.show();
    },
    showChexiao(item) {
      this.inputText = '撤销原因';
      this.curItem = item;
      this.$refs.confirmInputChexiao.show();
    },
    zhuanrang() {
      this.iszhuanrang = true;
      this.price = '';
    },
    zhuanzeng() {
      this.iszhuanrang = false;
      this.price = 0;
    },
    confirmShouhuo() {
      this.$router.push(`/tihuo-xiangqing?code=${this.code}`);
    },
    handleInputConfirm(text) {
      // 拒绝定向寄售
      refuseDingxiangJishou({
        code: this.code,
        userId: getUserId(),
        remark: text
      }).then((res) => {
        if(res.isSuccess) {
          this.text = '已拒绝';
          this.$refs.toast.show();
          setTimeout(() => {
            this.$router.back();
          }, 1000);
        }
      });
    },
    handleInputConfirmChexiao() {
      // 撤销定向寄售
      cancelDingxiangJishou({
        code: this.code,
        userId: getUserId()
        // remark: text
      }).then((res) => {
        if(res.isSuccess) {
          this.text = '已撤销';
          this.$refs.toast.show();
          setTimeout(() => {
            this.$router.back();
          }, 1000);
        }
      });
    },
    go(url) {
      this.$router.push(url);
    },
    goTreeCode() {
      if(this.origin) {
        this.go(`/tree-code?origin=1&code=${this.detail.code}`);
      } else {
        this.go(`/tree-code?derive=1&code=${this.detail.code}`);
      }
    },
    showPopUp() {
      this.flag = true;
    },
    showAssignment() {
      this.assignmentFlag = true;
    },
    genghuan() {
      if(this.flag) {
        this.flag = !this.flag;
      } else if(this.assignmentFlag) {
        this.assignmentFlag = !this.assignmentFlag;
      }
    },
    assignmentBtnText() {
      return this.choosedIndex === 0 ? '生成二维码' : '确定';
    },
    add() {
      this.number++;
    },
    sub() {
      if (this.number >= 2) {
        this.number--;
      }
    },
    confirm() {
      if(this.userId) {
        let price = this.price;
        let number = this.number;
        let type = this.type;
        let mobile = this.mobile;
        if(this.price === '') {
          this.text = '请填写价格';
          this.$refs.toast.show();
          return;
        }
        if(!this.number) {
          this.text = '请填写数量';
          this.$refs.toast.show();
          return;
        }
        if(type === 0) {
          erweimajishou({
            code: this.code,
            price: price * 1000,
            quantity: number
          }).then((res) => {
            if(res.code) {
              this.text = '将为您跳转到二维码页';
              this.$refs.toast.show();
              setTimeout(() => {
                this.$router.push(`/consignment-erweima?code=${res.code}&number=${this.number}&price=${this.price}`);
              }, 1000);
            }
          });
        } else if(type === 1) {
          dingxiangjishou({
            code: this.code,
            price: price * 1000,
            quantity: number,
            userMobile: mobile
          }).then((res) => {
            if(res.code) {
              this.text = '发布成功';
              this.$refs.toast.show();
              setTimeout(() => {
                this.$router.push('/my-consignment?type=1');
              }, 1000);
            }
          });
        } else if(type === 2) {
          guadanjishou({
            code: this.code,
            price: price * 1000,
            quantity: number
          }).then((res) => {
            if(res.code) {
              this.text = '发布成功';
              this.$refs.toast.show();
              setTimeout(() => {
                this.$router.push('/consignment-hall');
              }, 1000);
            }
          });
        }
      } else {
        this.text = '您未登录';
        this.$refs.toast.show();
        setTimeout(() => {
          this.$router.push('/login');
        }, 1000);
      }
    },
    buyJiShou() {
      if(this.userId) {
        // let quantity = this.number;
        if(this.detail.type === '2') {
          placeOrderGuadan({
            code: this.code,
            userId: getUserId(),
            quantity: this.number
          }).then((res) => {
            if(res.code) {
              this.text = '下单成功';
              this.$refs.toast.show();
              if(formatAmount(this.detail.price * this.number) === '0') {
                zhifuzhuanzeng({
                  code: res.code
                }).then((res) => {
                  if(res.isSuccess) {
                    this.text = '成功';
                    this.$refs.toast.show();
                    setTimeout(() => {
                      this.$router.push(`/me`);
                    }, 500);
                  }
                });
              } else {
                setTimeout(() => {
                  this.go(`/pay?jishou=1&orderCode=${res.code}`);
                }, 500);
              }
            }
          });
        } else if(this.detail.type === '1') {
          placeOrderErweima({
            code: this.code,
            userId: getUserId(),
            quantity: this.number
          }).then((res) => {
            if(res.code) {
              this.text = '下单成功';
              this.$refs.toast.show();
              if(formatAmount(this.detail.price * this.number) === '0') {
                zhifuzhuanzeng({
                  code: res.code
                }).then((res) => {
                  if(res.isSuccess) {
                    this.text = '成功';
                    this.$refs.toast.show();
                    setTimeout(() => {
                      this.$router.push(`/me`);
                    }, 500);
                  }
                });
              } else {
                setTimeout(() => {
                  this.go(`/pay?jishou=1&orderCode=${res.code}`);
                }, 500);
              }
            }
          });
        } else if(this.detail.type === '0') {
          placeOrderDingxiang({
            code: this.code,
            userId: getUserId(),
            quantity: this.number
          }).then((res) => {
            if(res.code) {
              this.text = '下单成功';
              this.$refs.toast.show();
              if(formatAmount(this.detail.price * this.number) === '0') {
                zhifuzhuanzeng({
                  code: res.code
                }).then((res) => {
                  if(res.isSuccess) {
                    this.text = '成功';
                    this.$refs.toast.show();
                    setTimeout(() => {
                      this.$router.push(`/me`);
                    }, 500);
                  }
                });
              } else {
                setTimeout(() => {
                  this.go(`/pay?jishou=1&orderCode=${res.code}`);
                }, 500);
              }
            }
          });
        }
        // this.go(`/protocol?sign=1&jishou=1&proCode=${proCode}&quantity=${quantity}`);
      } else {
        this.text = '您未登录';
        this.$refs.toast.show();
        setTimeout(() => {
          this.$router.push('/login');
        }, 1000);
      }
    },
    chooseType(index) {
      this.choosedIndex = index;
      this.type = index;
      if(index === 2) {
        this.price = '';
      }
    },
    getImgSyl(imgs) {
      return {
        backgroundImage: `url(${formatImg(imgs)})`
      };
    },
    // 富文本滚动
    _refreshScroll() {
      setTimeout(() => {
        this.$refs.scroll.refresh();
        let imgs = this.$refs.description.getElementsByTagName('img');
        for (let i = 0; i < imgs.length; i++) {
          let _img = imgs[i];
          if (_img.complete) {
            setTimeout(() => {
              this.$refs.scroll.refresh();
            }, 20);
            continue;
          }
          _img.onload = () => {
            setTimeout(() => {
              this.$refs.scroll.refresh();
            }, 20);
          };
        }
      }, 20);
    },
    jiami(mobile) {
      return mobile.substr(0, 3) + '****' + mobile.substr(7);
    },
    getInitWXSDKConfig() {
      this.loading = true;
      initShare({
        title: this.buy ? `${this.detail.productName}` : `${this.userDetail.nickname || this.jiami(this.userDetail.mobile)}的预售资产`,
        desc: this.buy ? `${this.detail.createrInfo.nickname || this.jiami(this.detail.createrInfo.mobile)}在寄售大厅内挂单寄售${this.detail.productName}，大家快来抢购。` : `查看${this.userDetail.nickname || this.jiami(this.userDetail.mobile)}的预售资产`,
        link: location.href.split('#')[0] + '/#/consignment-product-detail?code=' + this.code + '&userReferee=' + this.userDetail.mobile + '&type=U',
        imgUrl: this.buy ? formatImg(this.detail.presellProduct.listPic) : 'http://image.tree.hichengdai.com/FhDuAJ9CVvOGGgLV6CxfshkWzV9g?imageMogr2/auto-orient/thumbnail/!300x300',
        success: (res) => {
          this.channel = '';
          if(res.errMsg.indexOf('sendAppMessage') !== -1) {
            this.channel = 0;
          } else if(res.errMsg.indexOf('shareTimeline') !== -1) {
            this.channel = 1;
          } else if(res.errMsg.indexOf('shareQQ') !== -1) {
            this.channel = 2;
          } else if(res.errMsg.indexOf('shareQZone') !== -1) {
            this.channel = 3;
          }
          share(this.channel, '资产').then((res) => {
            if(res.code) {
              this.text = '分享成功';
              this.$refs.toast.show();
            }
          }).then(() => {});
        }
      }, (data) => {
        this.isWxConfiging = false;
        this.wxData = data;
        this.loading = false;
      }, (msg) => {
        alert(msg);
        this.isWxConfiging = false;
        this.wxData = null;
        this.loading = false;
      });
    },
    address() {
      this.go(`/yushou-address?pre=1&clear=1&code=${this.code}`);
    },
    getUserDetail() {
      getUserDetail({userId: getUserId()}).then((res) => {
        this.userDetail = res;
      }).catch(() => {});
    }
  },
  mounted() {
    setTitle('详情');
    this.userReferee = this.$route.query.userReferee;
    if(this.userReferee && !getUserId()) {
      this.$router.push(`/register?code=${this.code}&userReferee=${this.userReferee}&type=U&back=1`);
    }
    this.isWxConfiging = false;
    this.wxData = null;
    this.pullUpLoad = null;
    this.userId = getCookie('userId');
    this.code = this.$route.query.code;
    this.buy = this.$route.query.buy || 0;
    this.loading = true;
    if(this.userId) {
      this.getUserDetail();
    }
    if(this.code[0] === 'O') {
      this.origin = true;
      Promise.all([
        getOriginZichanDetail({
          code: this.code
        }),
        getDictList('pack_unit'),
        getDictList('output_unit')
      ]).then(([res1, res2, res3]) => {
        this.loading = false;
        this.detail = res1;
        this.detailDescription = res1.presellProduct.description;
        this.banners = this.detail.presellProduct.bannerPic.split('||');
        if(this.banners.length >= 2) {
          this.loop = true;
        }
        if(!this.isWxConfiging && !this.wxData) {
          this.getInitWXSDKConfig();
        }
        if(this.detail.status === '1' || this.detail.status === '2') {
          this.showBottom = true;
        }
        res2.map((item) => {
          this.packUnitObj[item.dkey] = item.dvalue;
        });
        res3.map((item) => {
          this.outputUnitObj[item.dkey] = item.dvalue;
        });
      }).catch(() => { this.loading = false; });
    } else {
      this.buy = true;
      this.showBottom = this.buy;
      this.derive = true;
      Promise.all([
        getDeriveZichanDetail({
          code: this.code
        }),
        getDictList('pack_unit'),
        getDictList('output_unit')
      ]).then(([res1, res2, res3]) => {
        // debugger;
        this.loading = false;
        this.detail = res1;
        this.detailDescription = res1.presellProduct.description;
        this.banners = this.detail.presellProduct.bannerPic.split('||');
        if(this.banners.length >= 2) {
          this.loop = true;
        }
        if(this.detail.status === '0' && this.detail.type === '0') {
          // this.number = this.detail.quantity;
          this.dingxiangJishou = true;
          this.showBottom = true;
        }
        if(this.detail.status === '0' && this.detail.creater === getUserId() && !this.buy) {
          this.chexiao = true;
          this.showBottom = true;
        }
        if(this.detail.creater === getUserId() && this.buy) {
          this.buyText = '无法购买自己发布的产品';
          this.buyDisable = true;
          this.showBottom = true;
          // this.buy = !this.buy;
          // this.showBottom = false;
        }
        if(this.detail.type === '1') {
          // this.number = this.detail.quantity;
          this.erweimaJishou = true;
        }
        res2.map((item) => {
          this.packUnitObj[item.dkey] = item.dvalue;
        });
        res3.map((item) => {
          this.outputUnitObj[item.dkey] = item.dvalue;
        });
        if(!this.isWxConfiging && !this.wxData) {
          this.getInitWXSDKConfig();
        }
      }).catch(() => { this.loading = false; });
    }
  },
  watch: {
    detailDescription() {
      this._refreshScroll();
    }
  },
  components: {
    FullLoading,
    Toast,
    Slider,
    NoResult,
    MHeader,
    Scroll,
    ConfirmInput,
    Confirm
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/mixin.scss";
@import "../../common/scss/variable.scss";
.product-detail-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0.98rem;
  width: 100%;
  z-index: 101;
  background: $color-highlight-background;
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .gray {
    width: 100%;
    height: 0.2rem;
    padding: 0;
    background: #f5f5f5;
  }
  .banner-default {
    width: 100%;
    height: 7.5rem;
  }
  .content {
    /*margin: 0.88rem 0;*/
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    .slider-wrapper {
      padding-bottom: 0.2rem;
      background: $color-highlight-background;
      height: 7.5rem;
      width: 100%;
      overflow: hidden;
      .slider {
        .dots {
          .dot {
            background: #eee;
          }
        }
      }
      .home-slider {
        height: 100%;
      }
      a {
        display: block;
        height: 100%;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
      }
    }
    .info {
      background: $color-highlight-background;
      padding: 0 0.3rem;
      .item {
        width: 100%;
        font-size: $font-size-medium-x;
        line-height: 1.1rem;
        border-bottom: 1px solid #eee;
        display: flex;
        span:first-child {
          margin-right: 0.3rem;
          display: inline-block;
          width: 30%;
        }
        span:nth-child(2) {
          flex: 1;
        }
        img {
          height: 0.21rem;
          margin-top: 0.4rem;
          position: absolute;
          right: 0.3rem;
        }
        &:last-child{
          border-bottom: none;
        }
      }
    }
    .description {
      background: #fff;
      padding: 0.3rem;
      .description-title {
        font-size: 0;
        .border {
          border: 2px solid $primary-color;
          height: 0.26rem;
          width: 0;
          display: inline-block;
          margin-right: 0.08rem;
        }
        span {
          font-size: $font-size-medium-x;
          line-height: 0.42rem;
        }
      }
      .description-detail{
        font-size: 0.26rem;
        line-height: 1.8;
        padding: 0.2rem 0;
        img{
          max-width: 100%;
          vertical-align: bottom;
        }
      }
    }
  }
  .footer {
    height: 0.98rem;
    padding: 0.07rem 0.3rem;
    border-top: 1px solid #eee;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    font-size: $font-size-medium-x;
    line-height: 0.7rem;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      color: $primary-color;
      font-size: $font-size-medium-xx;
    }
    button {
      width: 2.96rem;
      height: 0.84rem;
      border-radius: 0.08rem;
      background: $primary-color;
      color: $color-highlight-background;
      font-size: 0.3rem;
    }
    .one {
      width: 100%;
      font-size: 0.32rem;
      line-height: 0.45rem;
    }
    .two {
      width: 3.3rem;
      font-size: 0.32rem;
      line-height: 0.45rem;
    }
  }
  .footer-dingxiangjishou {
    height: 0.98rem;
    padding: 0.07rem 0.3rem;
    border-top: 1px solid #eee;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    font-size: $font-size-medium-x;
    line-height: 0.7rem;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      color: $primary-color;
      font-size: $font-size-medium-xx;
    }
    .buttons {
      display: inline;
      button {
        width: 1.96rem;
        height: 0.84rem;
        border-radius: 0.08rem;
        background: $primary-color;
        color: $color-highlight-background;
        font-size: 0.3rem;
      }
    }
  }
  .mask {
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000000, $alpha: 0.7);
    position: absolute;
    top: 0;
    left: 0;
    display: none;
  }
  .show {
    display: block;
  }
  .buypart {
    width: 100%;
    height: 7.7rem;
    position: fixed;
    bottom: 0;
    background-color: #fff;
    display: none;
    z-index: 9;
    &.show {
      display: block;
    }
    // padding: 0 0.3rem;
    .title {
      height: 1.5rem;
      position: relative;
      border-bottom: 1px solid #eee;
      margin: 0 0.3rem;
      .title-pic {
        position: absolute;
        left: 0;
        bottom: 0.28rem;
        padding: 0.03rem;
        border-radius: 0.1rem;
        background-color: #fff;
        img {
          width: 1.6rem;
          height: 1.6rem;
        }
      }
      .title-right {
        margin-left: 2.14rem;
        position: relative;
        overflow: hidden;
        p {
          margin-top: 0.27rem;
          font-size: $font-size-medium-x;
          line-height: 0.42rem;
          color: #333;
        }
        span {
          margin-top: 0.4rem;
          font-size: $font-size-medium;
          color: #999;
        }
        i {
          width: 0.34rem;
          line-height: 0.34rem;
          line-height: 0.34rem;
          font-size: $font-size-medium;
          text-align: center;
          color: #333;
          border: 1px solid #333;
          border-radius: 50%;
          position: absolute;
          top: 0.2rem;
          right: 0;
        }
        .position {
          font-size: 0.24rem;
          line-height: 0.33rem;
          color: $color-text-l;
          img {
            width: 0.16rem;
            height: 0.2rem;
            margin-right: 0.08rem;
          }
        }
      }
    }
    .packaging {
      height: 1.74rem;
      border-bottom: 1px solid #eee;
      margin: 0.3rem;
      overflow: scroll;
      .packaging-title {
        font-size: $font-size-medium-x;
        line-height: 0.42rem;
        margin: 0 0 0.3rem 0;
      }
      p {
        margin-top: 0.3rem;
        margin-bottom: 0.4rem;
        font-size: $font-size-medium-xx;
        color: #333;
      }
      .select {
        .select-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.28rem;
          font-family: 'PingFang-SC-Medium';
          font-size: 0.26rem;
          color: #666;
          .item-name {
          }
          .item-price-isSelect {
            display: flex;
            align-items: center;
            img {
              width: 0.36rem;
              height: 0.36rem;
            }
            span {
              flex: 1;
              margin-right: 0.4rem;
            }
          }
        }
      }
    }
    .number {
      height: 1.1rem;
      border-bottom: 1px solid #eee;
      margin: 0 0.3rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        font-size: 0.3rem;
      }
      .right {
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        span {
          font-size: 0.33rem;
          color: $primary-color;
          line-height: 0.33rem;
        }
        .right-item {
          float: right;
          text-align: center;
          line-height: 0.5rem;
        }
        .diamonds {
          width: 0.36rem;
          height: 0.36rem;
        }
        .num {
          width: 0.9rem;
          font-size: $font-size-medium-x;
          color: #333;
          height: 0.36rem;
        }
      }
    }
    .buypart-bottom {
      height: 0.98rem;
      line-height: 0.9rem;
      color: #fff;
      font-size: $font-size-medium-x;
      position: absolute;
      bottom: 0;
      width: 100%;
      left: 0;
      padding: 0 0.3rem;
      border-top: 1px solid $color-border;
      display: flex;
      align-items: center;
      div {
        display: inline-block;
        width: 50%;
        text-align: center;
      }
      .confirm {
        border-radius: 0.08rem;
        background: $primary-color;
        width: 100%;
        height: 0.9rem;
        line-height: 0.98rem;
      }
    }
  }
  .assignment-part {
    width: 100%;
    height: 8.7rem;
    position: fixed;
    bottom: 0;
    background-color: #fff;
    display: none;
    z-index: 9;
    &.show {
      display: block;
    }
    .assignment-type {
      font-size: 0.3rem;
      line-height: 0.42rem;
      .assignment-type-item {
        padding: 0.3rem;
        border-bottom: 1px solid $color-border;
        display: flex;
        align-items: center;
        img {
          width: 0.36rem;
          height: 0.36rem;
          margin-right: 0.3rem;
        }
        span {
          font-size: 0.3rem;
          line-height: 0.42rem;
        }
      }
    }
    .assignment-info {
      font-size: 0.26rem;
      line-height: 0.37rem;
      .title {
        height: 1rem;
        padding: 0.3rem;
        text-align: center;
        border-bottom: 1px solid $color-border;
        .title-inner {
          span {
            font-size: 0.3rem;
          }
          span:first-child {
            margin-right: 1.6rem;
          }
          .active {
            color: $primary-color;
            border-bottom: 3px solid $primary-color;
          }
        }
      }
      .assignment-item {
        padding: 0.3rem;
        border-bottom: 1px solid $color-border;
        span {
          margin-right: 0.3rem;
          width: 30%;
          display: inline-block;
        }
      }
    }
    .active {
      color: $primary-color;
    }
    .buypart-bottom {
      height: 0.98rem;
      line-height: 0.9rem;
      color: #fff;
      font-size: $font-size-medium-x;
      position: absolute;
      bottom: 0;
      width: 100%;
      left: 0;
      padding: 0 0.3rem;
      border-top: 1px solid $color-border;
      display: flex;
      align-items: center;
      div {
        display: inline-block;
        width: 50%;
        text-align: center;
      }
      .confirm {
        border-radius: 0.08rem;
        background: $primary-color;
        width: 100%;
        height: 0.9rem;
        line-height: 0.98rem;
      }
    }
  }
}
</style>
