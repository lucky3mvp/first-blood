//index.js
const app = getApp()

Page({
  data: {
    firstAuth: false,
    failText: '',
    buttonTitle: '',
  },
  //页面加载后数据准备
  onLoad: function (options) {
    // 可以通过 scene, options 判断一些页面跳转的参数等
    // let scene = decodeURIComponent(options.scene)
    // console.log(options, scene)
    this.verifyAuthInfo();
  },
  // 验证授权
  verifyAuthInfo: function () {
    wx.getSetting({
      success: res => {
        console.log('verifyAuthInfo success', res)
        let { authSetting } = res;
        let userInfoAuth = authSetting['scope.userInfo'];
        if (userInfoAuth) { // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.getUserInfoAndLogin();
        } else { // 未授权，则调起授权弹窗
          this.applyForAuth();
          if (userInfoAuth === null || userInfoAuth === undefined) {
             // 首次授权，设置标志位
            this.data.firstAuth = true;
          }
        }
      },
      fail: () => { // 获取用户设置信息失败
        this.handleError('获取用户设置信息失败', '重新获取');
      }
    })
  },
  // 调起授权弹框
  applyForAuth: function () {
    wx.authorize({
      scope: 'scope.userInfo',
      success: () => { // 授权成功
        console.log('applyForAuth success')
        this.getUserInfoAndLogin();
      },
      fail: (err) => { // 用户拒绝授权，则进入授权失败页
        console.log('applyForAuth fail', this.data.firstAuth)
        if (this.data.firstAuth) {
          this.data.firstAuth = false;
          wx.showModal({
            title: '',
            content: '您点击了拒绝授权，将无法使用本小程序，点击确定重新获取授权',
            showCancel: true,
            confirmText: '确定',
            success: res => {
              if (res.confirm) {
                this.openSetting();
              } else if (res.cancel) {
                this.handleError('小程序无授权暂无法使用', '重新授权');
              }
            },
            fail: errMsg => {
              this.handleError('小程序无授权暂无法使用', '重新授权');
            }
          })
        } else {
          this.handleError('小程序无授权暂无法使用', '重新授权');
        }
      }
    })
  },
  // 获取用户信息
  getUserInfoAndLogin: function () {
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        app.globalData.userInfo = res.userInfo
        // 跳转到首页
        wx.switchTab({
          url: '/pages/home/home',
        })
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      }
    })
  },
  // 错误处理
  handleError: function (failText = '', buttonTitle = '') {
    this.setData({
      failText: failText,
      buttonTitle: buttonTitle
    })
  },
  // 调起客户端小程序设置界面，返回用户设置的操作结果
  openSetting: function () {
    wx.openSetting({
      success: res => {
        console.log('openSetting suc', res)
        this.handleError();
        this.verifyAuthInfo();
      },
      fail: errMsg => {
        console.log('openSetting fail', errMsg)
        this.handleError('设置失败，请重新操作', '重新授权');
      }
    })
  },

  buttonPressed: function () {
    let { buttonTitle } = this.data;
    if (buttonTitle === '重新登录') {
      this.getUserInfoAndLogin();
    } else if (buttonTitle === '重新授权') {
      this.openSetting();
    } else if (buttonTitle === '重新获取') {
      this.verifyAuthInfo();
    }
  },
})






// //获取应用实例
// const app = getApp()

// Page({
//   data: {
//     userInfo: {},
//     hasUserInfo: false,
//     canIUse: wx.canIUse('button.open-type.getUserInfo')
//   },
//   onLoad: function () {
//     // if (app.globalData.userInfo) {
//     //   this.setData({
//     //     userInfo: app.globalData.userInfo,
//     //     hasUserInfo: true
//     //   })
//     // } else if (this.data.canIUse){
//     //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
//     //   // 所以此处加入 callback 以防止这种情况
//     //   app.userInfoReadyCallback = res => {
//     //     this.setData({
//     //       userInfo: res.userInfo,
//     //       hasUserInfo: true
//     //     })
//     //   }
//     // } else {
//     //   // 在没有 open-type=getUserInfo 版本的兼容处理
//     //   wx.getUserInfo({
//     //     success: res => {
//     //       app.globalData.userInfo = res.userInfo
//     //       this.setData({
//     //         userInfo: res.userInfo,
//     //         hasUserInfo: true
//     //       })
//     //     }
//     //   })
//     // }
//   },
//   getUserInfo: function(e) {
//     console.log(e)
//     app.globalData.userInfo = e.detail.userInfo
//     this.setData({
//       userInfo: e.detail.userInfo,
//       hasUserInfo: true
//     })
//   }
// })
