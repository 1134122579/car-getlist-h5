<template>
  <div class="cardpageStyle">
    <!-- 领取页面 -->
    <div class="carddrawpage" v-show="is_draw">
      <img class="carddrawpageimg" :src="cardpageInfo.img" />
      <div class="deawButton">
        <van-button round type="danger" block size="small" :disabled="is_loading" @click="goDraw" color="#D85A1D"
          >立即前往</van-button
        >
      </div>
    </div>
    <!-- 领取校验 -->
    <div class="userinfoStyle" v-show="!is_draw">
      <!-- 是否需要认证 1 需要认证  2 不需要-->
      <div class="content_b" v-if="cardpageInfo.is_auth == 2">
        <div>
          <div class="rece-button" v-if="[0, 1, 2, 3, 4, 6].includes(cardpageInfo.receive_status)">
            <van-button round type="danger" block size="small" :disabled="is_loading" @click="gotocard" color="#D85A1D"
              >领取卡片</van-button
            >
          </div>
          <!-- 审核中  -->
          <div class="eitUser" v-if="cardpageInfo.receive_status == 5">
            <div class="eitUser-title">{{ cardpageInfo.name }}</div>
            <van-empty class="custom-image" :image="authloading" description="亲，已为您加急审核~"> </van-empty>
          </div>
          <!-- 拒绝 通过审核  -->
          <div class="eitUser" v-if="cardpageInfo.receive_status == 7">
            <div class="eitUser-title">{{ cardpageInfo.name }}</div>
            <van-empty class="custom-image custom-image-err" :image="imgerricon" description="您的领取申请不通过">
              <van-button
                round
                type="danger"
                size="small"
                :disabled="is_loading"
                @click="applyOrder"
                color="#D85A1D"
                class="bottom-button"
                >再次申请</van-button
              ></van-empty
            >
          </div>
        </div>
        <!-- 规则  -->
        <div class="rule">
          <div class="rule-title">领取规则</div>
          <pre>{{ cardpageInfo.desc }}</pre>
        </div>
      </div>
      <!-- 是否需要认证 1 需要认证  2 不需要-->
      <div class="content_b" v-if="cardpageInfo.is_auth == 1">
        <!-- 加载动画 -->
        <div class="eitUser" v-if="is_loading">
          <img class="loadingstyle" src="../../assets/loading.gif" alt="" />
        </div>
        <div v-if="!is_loading">
          <!-- 填写信息 填写认证信息 -->
          <div class="eitUser" v-if="![1].includes(userInfo.is_auth)">
            <div class="eitUser-title">{{ cardpageInfo.name }}认证</div>
            <van-form @submit="onSubmit">
              <!-- <div class="upload">
            <van-uploader :after-read="afterRead">
              <van-image v-if="!cardImg" :src="card_Z"></van-image>
              <van-image v-if="cardImg" height="240" :src="cardImg"></van-image>
              <p class="rz">点击，上传身份证</p>
            </van-uploader>
          </div> -->
              <!-- <div class="upload">
            <van-uploader :after-read="afterRead">
              <van-image v-if="!cardImg" :src="card_Z"></van-image>
              <van-image v-if="cardImg" height="240" :src="cardImg"></van-image>
              <p class="rz">点击，上传学生证</p>
            </van-uploader>
          </div> -->
              <van-field
                v-model="userInfo.name"
                name="name"
                label-width="60px"
                label="姓名"
                colon
                placeholder="请填写姓名"
                required
                :rules="[{ required: true }]"
              />
              <van-field
                v-model.trim="userInfo.mobile"
                type="tel"
                name="mobile"
                label="手机号"
                colon
                label-width="60px"
                placeholder="请输入手机号"
                required
                :rules="[{ required: true }]"
              >
                <template #button>
                  <van-button
                    size="mini"
                    @click.prevent="getMobileCode"
                    :disabled="isMobilePush"
                    :color="isMobilePush ? '#ccc' : '#EC6925'"
                    type="primary"
                    >{{ !isMobilePush ? '发送验证码' : '倒计时' + mobileTimeDown + '秒' }}
                  </van-button>
                </template>
              </van-field>
              <van-field
                v-model.trim="userInfo.code"
                name="code"
                label="验证码"
                label-width="60px"
                placeholder="请输入验证码"
                required
                v-if="iscodebutton"
                :rules="[{ required: true }]"
              />
              <van-field
                v-model.trim="userInfo.idcard"
                name="idcard"
                colon
                label="身份证"
                label-width="60px"
                placeholder="请输入身份证"
                required
                :rules="[{ required: true }]"
              />
              <!-- <van-field
          v-model="userInfo.address"
          name="address"
          label="地址"
          placeholder="请输入地址"
          :rules="[{ required: true, message: '请填写地址' }]"
        /> -->
              <div style="margin: 8px 10px">
                <van-button round block size="small" type="info" color="#D85A1D" native-type="submit"
                  >立即认证</van-button
                >
              </div>
            </van-form>
          </div>
          <!-- 认证审核中 -->
          <div class="eitUser" v-if="userInfo.is_auth == 1 && cardpageInfo.receive_status == 5">
            <div class="eitUser-title">{{ cardpageInfo.name }}领取</div>
            <van-empty class="custom-image" :image="authloading" description="亲，已为您加急审核~"> </van-empty>
          </div>
          <!-- 认证 通过 -->
          <div class="eitUser" v-if="userInfo.is_auth == 1 && [0, 1, 2, 3, 4, 6].includes(cardpageInfo.receive_status)">
            <div class="eitUser-title">{{ cardpageInfo.name }}领取</div>
            <van-empty
              class="custom-image"
              :image="imgsuccessicon"
              :description="
                [1, 6].includes(cardpageInfo.receive_status) ? '会员卡申请已审核通过' : '身份信息已认证成功'
              "
            >
              <van-button round type="danger" size="small" @click="gotocard" color="#D85A1D" class="bottom-button">{{
                [1, 6].includes(cardpageInfo.receive_status) ? '立即领取' : '领取卡片'
              }}</van-button>
              <p class="rule_tig">*领取条件参考如下规则</p>
            </van-empty>
          </div>
          <!-- 拒绝 通过审核  -->
          <div class="eitUser" v-if="userInfo.is_auth == 1 && cardpageInfo.receive_status == 7">
            <div class="eitUser-title">{{ cardpageInfo.name }}领取</div>
            <van-empty class="custom-image custom-image-err" :image="imgerricon" description="您的领取申请不通过">
              <van-button
                round
                type="danger"
                size="small"
                :disabled="is_loading"
                @click="applyOrder"
                color="#D85A1D"
                class="bottom-button"
                >再次申请</van-button
              >
            </van-empty>
          </div>
        </div>
        <div class="rule">
          <div class="rule-title">领取规则</div>
          <pre>{{ cardpageInfo.desc }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { compressImg } from '@/utils/compressImg'
import { getSharetextInfo } from '@/utils/share'
import { getUrlKey } from '@/utils/wxload'
import sha1 from 'sha1'
export default {
  data() {
    return {
      is_draw: true,
      iscodebutton: false,
      codeTime: null,
      isMobilePush: false,
      mobileTimeDown: 60,
      auth: 1,
      getcardExtNum: 1,
      setInter: null,
      cardpageInfo: '', //会员卡页面信息
      cardImg: '',
      card_Z: require('@/assets/card_z.png'),
      imgsuccessicon: require('@/assets/auth-success.png'),
      imgerricon: require('@/assets/shenhe-err.png'),
      authloading: require('@/assets/auth-loading.png'),
      card_F: require('@/assets/card_f.png'),
      fileList: [],
      userInfo: '',
      is_loading: true
    }
  },
  created() {
    this.getcardInfo()
    this.getinfoil()
  },
  methods: {
    applyOrder() {
      let { order_no } = this.cardpageInfo
      this.Api.applyOrder({ order_no }).then(res => {
        this.getcardInfo()
      })
    },
    goDraw() {
      this.is_draw = false
    },
    //  获取验证码
    getMobileCode() {
      let mobile = this.userInfo.mobile
      let isMobile = /^\d{11}$/.test(mobile)
      if (!isMobile) {
        this.$toast('请输入正确的手机号')
        return
      }
      this.Api.sendMsg({ mobile }).then(res => {
        this.$toast('验证码发送成功')
        this.isMobilePush = true
        this.iscodebutton = true
        this.codeTime = setInterval(() => {
          this.mobileTimeDown = this.mobileTimeDown - 1
          if (this.mobileTimeDown <= 0) {
            this.isMobilePush = false
            clearInterval(this.codeTime)
          }
        }, 1000)
      })
    },
    //   分享配置
    getShare() {},
    // 获取卡片信息
    async getcardInfo() {
      let { card_id } = this.$route.query
      if (!card_id) {
        this.$router.replace({ path: '/404' })
        return
      }
      let res = await this.Api.getCardInfo({ card_id })
      let cardpageInfo = res.data
      cardpageInfo['desclist'] = cardpageInfo['desc'].split('/n')
      this.cardpageInfo = cardpageInfo
      console.log('cardpageInfo', cardpageInfo)
      window.document.title = cardpageInfo.name + '领取'
      let wxConfig = {
        title: `${cardpageInfo.title}`,
        desc: `${cardpageInfo.content}`,
        link: location.origin + location.pathname + '?card_id=' + getUrlKey('card_id'),
        imgUrl: 'http://api.skyorange.cn/wxh5/skylogo.jpg',
        success(res) {}
      }
      getSharetextInfo(wxConfig)
    },
    async getinfoil() {
      let that = this
      let res = await this.Api.getUserInfo()
      console.log(res.data)
      that.userInfo = res.data
      this.is_loading = false
    },
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      let that = this
      this.$toast.loading({ message: '上传中...' })
      console.log(file.file.size, '压缩前')
      compressImg(file.file).then(res => {
        res = that.dataURLtoFile(res)
        console.log('compressImg', res)
        let data = res.sise > file.file.size ? file.file : res
        if (data.size / 1024 / 1024 > 2) {
          that.$toast.clear()
          return false
        }
        let fromData = new FormData()
        fromData.append('file', data)
        this.Api.upCardImage(fromData).then(res => {
          console.log(res, 'upCardImage')
          that.$toast.clear()
          that.cardImg = res.data.imgLink
          that.userInfo.idcard = res.data.cardInfo['公民身份号码']
          that.userInfo.name = res.data.cardInfo['姓名']
          that.userInfo.address = res.data.cardInfo['住址']
        })
      })
    },
    dataURLtoFile(dataurl, filename) {
      // 生成Blob
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    onClickLeft() {
      console.log('返回')
      this.$router.go(-1)
    },
    onSubmit(e) {
      console.log(e)
      let { card_id } = this.$route.query
      let { min_age, max_age, sex } = this.cardpageInfo
      let that = this
      let { idcard, address, name, mobile, code } = this.userInfo
      let age = this.getAge(idcard)
      if (sex != 0) {
        let issex = parseInt(idcard.substr(16, 1)) % 2 == 1 ? 1 : 2
        if (issex != sex) {
          // alert('男')
          this.$toast(`对不起，此卡仅限${sex == 1 ? '男性' : '女性'}领取！`)
          return
        }
      }
      if (!code) {
        this.$toast('请输入验证码')
        return
      }
      if (age >= min_age && age <= max_age) {
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })
        try {
          this.Api.authUserInfo({ idcard, address, name, mobile, card_id, code }).then(res => {
            Toast.success('认证成功')
            that.getinfoil()
            that.$toast.clear()
          })
        } catch (error) {
          this.$toast.clear()
        }
      } else {
        this.$toast('对不起，您的年龄不符合领取规则')
      }
    },
    gotocard() {
      let { is_free, is_auth, receive_status, min_age, max_age, sex } = this.cardpageInfo
      //   is_auth  1 认证  2 不认证
      //  is_free 1 免费 2 收费
      //   需要认证
      console.log(this.userInfo.age, 'age', min_age, max_age)
      if (is_auth == 1) {
        // let age = this.getAge(this.userInfo.idcard)
        let age = Number(this.userInfo.age)
        if (age < min_age || age > max_age) {
          this.$toast('对不起，您的年龄不符合领取规则！')
          return
        }
        // 获取性别
        if (sex != 0) {
          let issex = parseInt(this.userInfo.idcard.substr(16, 1)) % 2 == 1 ? 1 : 2
          // 1    1
          //    男   男
          if (issex != sex) {
            // alert('男')
            this.$toast(`对不起，此卡仅限${sex == 1 ? '男性' : '女性'}领取！`)
            return
          }
        }
      }
      if (receive_status == 1) {
        this.addCard()
        return
      }
      if (is_free == 2) {
        console.log('收费')
        // receive_status  2  待支付  1 待领取
        this.payVipOrder()
      } else {
        console.log('免费')
        this.createVipOrder()
      }
    },
    // 创建会员卡领取记录
    async createVipOrder() {
      let { card_id } = this.$route.query
      if (!card_id) {
        this.$router.replace({ path: '/404' })
        return
      }
      //   let { min_age, max_age, is_auth, sex } = this.cardpageInfo

      if (this.cardpageInfo.receive_status == '0') {
        let res = await this.Api.createVipOrder({ card_id })
        if (this.cardpageInfo.is_shehe == 1) {
          //弹框提醒审核中
          this.$toast.fail('提交中')
          console.log('提交中')
          this.getcardInfo()
        } else {
          let editWXCardOrder = await this.Api.editWXCardOrderStatus({ order_no: this.cardpageInfo.order_no })
          this.addCard()
        }
      } else if ([1, 6].includes(this.cardpageInfo.receive_status)) {
        // 后续加上修改领取状态
        let editWXCardOrder = await this.Api.editWXCardOrderStatus({ order_no: this.cardpageInfo.order_no })
        this.addCard()
      }
    },
    // 领取会员卡到卡包
    addCard() {
      let that = this
      let { vip_code, gh_openid } = this.userInfo
      let cardId = this.cardpageInfo.card_id //  微信卡包id
      let cardpageId = this.$route.query.card_id //微信当前卡包信息id
      let code = `${vip_code}-${cardpageId}`
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      that.Api.getShare({
        url: location.href
      }).then(res => {
        console.log(res.data)
        let appId = res.data.appId
        let timestamp = res.data.timestamp
        let nonceStr = res.data.nonceStr
        let signature = res.data.signature
        that.$wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: appId, // 必填，公众号的唯一标识，填自己的！
          timestamp: timestamp, // 必填，生成签名的时间戳，刚才接口拿到的数据
          nonceStr: nonceStr, // 必填，生成签名的随机串
          signature: signature, // 必填，签名，见附录1
          jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'chooseCard', 'addCard'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        })
        this.getcardExtNum = 1
        that.cardExtSignPackage(cardId, code, gh_openid, timestamp)
        return
        that.Api.cardExtSignPackage({ card_id: cardId, code, openid: gh_openid, timestamp })
          .then(cardExtSign => {
            console.log('cardExtSignPackage', cardExtSign.data)
            let { signature, apiTicket, nonceStr, openid, card_id, code } = cardExtSign.data
            that.$wx.ready(() => {
              that.$wx.addCard({
                cardList: [
                  {
                    cardId: cardId,
                    cardExt: JSON.stringify({
                      api_ticket: apiTicket,
                      card_id,
                      nonce_str: nonceStr,
                      code,
                      openid,
                      timestamp,
                      signature
                    })
                  }
                ], // 需要添加的卡券列表
                success: function (ress) {
                  var cardList = ress.cardList // 添加的卡券列表信息
                  console.log('添加的卡券列表信息', cardList)
                  Toast.clear()
                },
                fail: function () {
                  Toast.clear()
                }
              })
            })
          })
          .catch(error => {
            console.log(error, 'errorerrorerrorerrorerror')
            this.addCard()
          })
      })
    },
    // 调用领取卡包
    cardExtSignPackage(cardId, code, gh_openid, timestamp) {
      let that = this
      if (this.getcardExtNum > 3) {
        clearInterval(this.setInter)
        return
      }
      that.Api.cardExtSignPackage({ card_id: cardId, code, openid: gh_openid, timestamp })
        .then(cardExtSign => {
          console.log('cardExtSignPackage', cardExtSign.data)
          let { signature, apiTicket, nonceStr, openid, card_id, code } = cardExtSign.data
          that.$wx.ready(() => {
            that.$wx.addCard({
              cardList: [
                {
                  cardId: cardId,
                  cardExt: JSON.stringify({
                    api_ticket: apiTicket,
                    card_id,
                    nonce_str: nonceStr,
                    code,
                    openid,
                    timestamp,
                    signature
                  })
                }
              ], // 需要添加的卡券列表
              success: function (ress) {
                var cardList = ress.cardList // 添加的卡券列表信息
                console.log('添加的卡券列表信息', cardList)
                Toast.clear()
              },
              fail: function () {
                Toast.clear()
              }
            })
          })
        })
        .catch(error => {
          console.log(error, this.getcardExtNum, 'errorerrorerrorerrorerror')
          this.setInter = setInterval(() => {
            this.getcardExtNum++
            this.cardExtSignPackage(cardId, code, gh_openid, timestamp)
          }, 500)
        })
    },

    // 认证后调用支付
    payVipOrder() {
      let that = this
      //   if (!this.checked) {
      //     this.$toast.fail('请阅读安全协议')
      //     return
      //   }
      let { receive_status, order_no } = this.cardpageInfo
      let { card_id } = this.$route.query
      //   调取继续支付接口
      if (receive_status == 2) {
        this.Api.nextVipOrder({ out_trade_no: order_no }).then(res => {
          console.log(res)
          that.payToolsOrderApi = res.data //数据
          if (typeof WeixinJSBridge == 'undefined') {
            if (document.addEventListener) {
              document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false)
            } else if (document.attachEvent) {
              document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady)
              document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady)
            }
          } else {
            this.onBridgeReady()
          }
        })
        return
      }
      //   创建新的订单支付
      this.Api.createVipOrder({ card_id }).then(res => {
        console.log(res)
        that.payToolsOrderApi = res.data //数据
        if (typeof WeixinJSBridge == 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false)
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady)
            document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady)
          }
        } else {
          this.onBridgeReady()
        }
      })
    },
    // 调用支付
    onBridgeReady() {
      let that = this
      let { out_trade_no } = this.payToolsOrderApi
      WeixinJSBridge.invoke('getBrandWCPayRequest', that.payToolsOrderApi, function (res) {
        that.queryToolsOrder(out_trade_no)
        that.getCardInfo()
        return
      })
    },
    // 查询是否支付成功
    queryToolsOrder(data) {
      this.Api.queryVipOrder({ out_trade_no: data })
        .then(res => {
          Toast.success('支付成功')
          this.getcardInfo()
          this.addCard()
          //   let text = `${this.userInfo.vip_code}-${data}`
          //   this.qrcodecreated.clear() // 清除二维码
          //   this.qrcodecreated.makeCode(text) // 也可以调用方法生成二维码，好处就是可以先清除在生成
          //   this.is_pay = true
          //   this.islookCard = true
          //   this.show = true
        })
        .catch(() => {
          console.log('支付失败')
          this.getcardInfo()
          Toast.fail('支付失败')
          // this.$wx.closeWindow()
        })
    },
    // 获取年龄
    getAge(identityCard) {
      var len = (identityCard + '').length
      if (len == 0) {
        return 0
      } else {
        if (len != 15 && len != 18) {
          //身份证号码只能为15位或18位其它不合法
          return 0
        }
      }
      var strBirthday = ''
      if (len == 18) {
        //处理18位的身份证号码从号码中得到生日和性别代码
        strBirthday = identityCard.substr(6, 4) + '/' + identityCard.substr(10, 2) + '/' + identityCard.substr(12, 2)
      }
      if (len == 15) {
        strBirthday =
          '19' + identityCard.substr(6, 2) + '/' + identityCard.substr(8, 2) + '/' + identityCard.substr(10, 2)
      }
      //时间字符串里，必须是“/”
      var birthDate = new Date(strBirthday)
      var nowDateTime = new Date()
      var age = nowDateTime.getFullYear() - birthDate.getFullYear()
      if (
        nowDateTime.getMonth() < birthDate.getMonth() ||
        (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())
      ) {
        age--
      }
      return age
    }
  }
}
</script>

<style lang="scss">
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
.cardpageStyle {
  width: 100%;
  min-height: 100vh;
  //   background: #94908d;
  background: #4b3a64;
  .carddrawpage {
    width: 100%;
    min-height: 100vh;
    position: relative;
    .carddrawpageimg {
      width: 100%;
      height: 100%;
      display: block;
    }
    .deawButton {
      position: absolute;
      top: 81.7%;
      left: 0;
      right: 0;
      margin: 0 auto;
      z-index: 1;
      box-sizing: border-box;
      padding: 0 40px;
    }
  }
  .userinfoStyle {
    width: 100%;
    min-height: 100vh;
    background: #94908d url('http://mfyfile.greatorange.cn/skyauth.png') no-repeat;
    background-size: 100% auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .header {
      width: 100%;
    }
    .content_b {
      margin-top: 200px;
      width: 82%;
      .rece-button {
        margin-top: 230px;
      }
    }

    .eitUser {
      padding: 0.40667rem 10px 0.12rem;
      margin: 0 auto;
      background: #fff;
      border-radius: 10px;
      box-sizing: border-box;
      .eitUser-title {
        text-align: center;
        font-size: 16px;
        padding: 10px 0;
      }
      .rule_tig {
        font-size: 12px;
        color: #ff0000;
        text-align: center;
        margin-top: 5px;
      }
      .upload {
        display: flex;
        background: #fff;
        border-bottom: 1px solid #ebedf0;
        box-sizing: border-box;
        padding: 20px;
        justify-content: center;
        .rz {
          color: #1900f7;
          text-align: center;
          font-size: 14px;
        }
        .van-uploader {
          box-sizing: border-box;
          // padding: 10px;
        }
      }
      .loadingstyle {
        width: 100%;
        height: 100%;
        display: block;
        margin: 0 auto;
        // object-fit: ;
      }
      .custom-image {
        padding: 0.3rem 0;
        .van-empty__bottom {
          margin-top: 10px;
        }
      }
      .bottom-button {
        width: 190px;
        height: 30px;
      }
    }
    //   规则
    .rule {
      padding: 18px 0;
      color: #fff;
      color: #f7f8fa;
      font-size: 12px;
      line-height: 2;
      margin-bottom: 50px;
      .rule-title {
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        padding-bottom: 10px;
      }
    }
  }
}
</style>
