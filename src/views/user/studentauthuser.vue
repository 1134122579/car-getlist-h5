<template>
  <div class="userinfoStyle">
    <!-- <div class="header">
      <van-nav-bar title="用户认证" left-text="返回" left-arrow @click-left="onClickLeft" />
    </div> -->
    <div class="content_b">
      <!-- <img class="contentimg" src="../../assets/vipTitle.png" alt="" /> -->
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
          />
          <!-- <van-field
            v-model.trim="userInfo.userCode"
            name="userCode"
            label="学号"
            placeholder="请输入学号"
            required
            :rules="[{ required: true }]"
          /> -->
          <van-field
            v-model.trim="userInfo.idcard"
            name="idcard"
            colon
            type="number"
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
            <van-button round block size="small" type="info" color="#D85A1D" native-type="submit">立即认证</van-button>
          </div>
        </van-form>
      </div>
      <!-- 认证审核中 -->

      <div class="eitUser" v-if="userInfo.is_auth == 1 && cardpageInfo.receive_status == 5">
        <div class="eitUser-title">{{ cardpageInfo.name }}认证</div>
        <van-empty class="custom-image" :image="authloading" description="审核中">
          <!-- <van-button round type="danger" size="small" @click="gotocard" color="#D85A1D" class="bottom-button"
            >审核</van-button
          > -->
        </van-empty>
      </div>
      <!-- 认证通过 -->
      <div class="eitUser" v-if="userInfo.is_auth == 1 && [0, 1, 6].includes(cardpageInfo.receive_status)">
        <div class="eitUser-title">{{ cardpageInfo.name }}认证</div>
        <van-empty class="custom-image" :image="imgsuccessicon" description="认证成功">
          <van-button round type="danger" size="small" @click="gotocard" color="#D85A1D" class="bottom-button"
            >领取卡片</van-button
          >
        </van-empty>
      </div>
      <div class="rule">
        <div class="rule-title">规则介绍</div>
        <ul>
          <li>1.年龄小于22岁，驻淄高校学生</li>
          <li>2.学生卡39.9元/年</li>
          <li>3.规则介绍规则介绍规则介绍规则介绍规则介绍规则介绍规则介绍规则介绍</li>
          <li>4.最终解释权归本公司所有</li>
        </ul>
      </div>
      <!-- <img class="bottomtimg" src="../../assets/bottom.png" alt="" /> -->
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { compressImg } from '@/utils/compressImg'
export default {
  data() {
    return {
      auth: 1,
      cardpageInfo: '', //会员卡页面信息
      cardImg: '',
      card_Z: require('@/assets/card_z.png'),
      imgsuccessicon: require('@/assets/auth-success.png'),
      authloading: require('@/assets/auth-loading.png'),
      card_F: require('@/assets/card_f.png'),
      fileList: [],
      userInfo: ''
    }
  },
  created() {
    this.getcardInfo()
    this.getinfoil()
  },
  methods: {
    // 获取卡片信息
    async getcardInfo() {
      let { card_id } = this.$route.query
      if (!card_id) {
        this.$router.replace({ path: '/404' })
        return
      }
      let res = await this.Api.getCardInfo({ card_id })
      let cardpageInfo = res.data
      this.cardpageInfo = cardpageInfo
      console.log(cardpageInfo)
      window.document.title = cardpageInfo.name + '领取'
      console.log(document.title)
    },
    async getinfoil() {
      let that = this
      let res = await this.Api.getUserInfo()
      console.log(res.data)
      that.userInfo = res.data
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
      let { min_age, max_age } = this.cardpageInfo
      let that = this
      let { idcard, address, name, mobile } = this.userInfo
      let age = this.getAge(idcard)
      if (age > min_age && age < max_age) {
        this.Api.authUserInfo({ idcard, address, name, mobile, card_id }).then(res => {
          Toast.success('认证成功')
          that.getinfoil()
        })
      } else {
        Toast.fail('年龄不符合')
      }
    },
    gotocard() {
      let { is_free } = this.cardpageInfo
      //   1 免费 2 收费
      if (is_free == 2) {
        console.log('收费')
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
      console.log(this.cardpageInfo.receive_status)
      if (this.cardpageInfo.receive_status == '0') {
        let res = await this.Api.createVipOrder({ card_id })
        if (this.cardpageInfo.is_shehe == 1) {
          //弹框提醒审核中
          this.$toast.fail('资料审核中')
          console.log('资料审核中')
          this.getcardInfo()
        } else {
          this.addCard()
        }
      } else if ([1, 6].includes(this.cardpageInfo.receive_status)) {
        // 后续加上修改领取状态
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
        that.Api.cardExtSignPackage({ card_id: cardId, code, openid: gh_openid, timestamp }).then(cardExtSign => {
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
      })
    },

    // 认证后调用支付
    payVipOrder() {
      let that = this
      //   if (!this.checked) {
      //     this.$toast.fail('请阅读安全协议')
      //     return
      //   }
      this.Api.payTicketOrder({
        pay_type: 1
      }).then(res => {
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
        return
      })
    },
    // 查询是否支付成功
    queryToolsOrder(data) {
      this.Api.queryTicketOrder({ out_trade_no: data })
        .then(res => {
          Toast.success('支付成功')
          let text = `${this.userInfo.vip_code}-${data}`
          this.qrcodecreated.clear() // 清除二维码
          this.qrcodecreated.makeCode(text) // 也可以调用方法生成二维码，好处就是可以先清除在生成
          this.is_pay = true
          this.islookCard = true
          this.show = true
        })
        .catch(() => {
          console.log('支付失败')
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
  }

  .eitUser {
    padding: 4px 10px;
    margin: 0 auto;
    background: #fff;
    border-radius: 10px;
    box-sizing: border-box;
    .eitUser-title {
      text-align: center;
      font-size: 16px;
      padding: 10px 0;
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
    .custom-image {
      padding: 0.3rem 0;
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
    font-size: 14px;
    line-height: 2;
    margin-bottom: 50px;
    .rule-title {
      text-align: center;
      font-size: 18px;
      font-weight: 600;
      padding-bottom: 10px;
    }
  }
}
</style>
