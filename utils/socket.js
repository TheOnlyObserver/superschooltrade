/**
 * socket操作框架！！！
 * V1.2.1
 * 
 * 超级校园交易
 * 暴漏接口：@socketInit(无需参数)
 * ！！注意：socketInit 只能调用一次！！！！！！！！！！！！！！！
 * 
 * app.socket对象结构
 * #function  @socketCallback(参数1)    更新socket回调函数
 * #function  @connSocket()             发起socket连接
 * #function  @stat()                   获取socket连接状态
 * #object    @conn                     socketTask对象，其内部有原生接口
 * #object    @userInfo                 存储用户信息
 * #object    @callback                 存储回调函数
 * 
 */
const app = getApp();
/**
 * ！-！-！-！-！-！-！--非常重要--！-！-！-！-！-！-！-！-！
 *
 * app.js 中必须保留字段 “socket” 
 * 否则会报错
 */
var socket = app.socket = {};

/**
 * 设置：
 * @debugMod：是否开启调试
 * 
 * 1：开启
 * 0：关闭
 * 要是嫌吵就把调试关闭
 */
const debugMod = 1;

/**
 * 设置：
 * @callbackType：回调函数名称
 * 
 * c：socket关闭回调   gc：全局socket关闭回调
 * e：socket错误回调   ge：全局socket错误回调
 * m：socket消息回调   gm：全局socket消息回调
 * o：socket开启回调   go：全局socket开启回调
 */
const callbackType = ["c", "e", "m", "o", "gc", "ge", "gm", "go"];

/**
 * @function debug：调试信息输出
 * 
 */
const debug = (txt, data = !1) => {
  let serverData = ((data)? ("\r\ncode："+ data.code +"\r\nmsg："+ data.msg) : "");
  debugMod==0 || console.log("%csocket:" + txt + serverData,"background: rgb(286, 229, 255); color: rgb(56, 24, 210)");
};

/**
 * 回调函数统一执行
 */
const runCallback = (e, res)=>{
  (socket.callback[callbackType[e+4]] || (() => { }))(res);
  (socket.callback[callbackType[e]] || (() => { }))(res);
};

/**
 * socket初始化组件
 */
module.exports = () => {

  // 初始化数据
  socket.callback={};

  // 读取最新用户信息
  socket.userInfo = () => {
    let ud = {
      mod: 1,
      id: wx.getStorageSync('id'),
      pass: wx.getStorageSync('session')  
    }
    return ((ud.id && ud.pass) ? ud : debug("致命错误，连接中断！！！！！\r\n无法从缓存中获取到用户id和登陆凭证！！"));
  }

  // 设置回调
  socket.socketCallback = (e) => {
    for (let i = 0; i < callbackType.length; i++) {
      socket.callback[callbackType[i]] = e[callbackType[i]] || socket.callback[callbackType[i]];
    }
  }

  // 发起socket
  socket.connSocket = () => {
    debug("正在发起socket连接！！");

    // 创建socket连接对象
    socket.conn = wx.connectSocket({
      url: 'wss://theonlyobserver.cn:2340',
      seccess: () => { debug("服务器应答成功！！") }
    });

    // 连接开启回调
    socket.conn.onOpen((res) => {
      let userInfo = socket.userInfo();
      if (!userInfo) return !1;
      debug("正在发送验证信息：\r\nid：" + userInfo.id + "\r\npass：" + userInfo.pass + "\r\nmod：" + userInfo.mod);
      socket.isOpen = 1;
      socket.conn.send({
        data: JSON.stringify(userInfo),
      });
      runCallback(3, res);
    });

    // 接受消息回调
    socket.conn.onMessage((res) => {

      // 这个地方容易报错
      res = JSON.parse(res.data);

      (res.code == 10) || debug(([, "Socket连接建立成功！(还没进行信息验证)", "信息验证成功，连接准备就绪！", "消息格式错误！", "消息参数不全！", "成功踢掉了该id其他的socket连接！", "登陆凭证校验失败！", "气死我了，后端又又又又爆炸啦！", "该id在其他地方发起了新的socket连接，这条连接被踢掉了！", , , ,])[res.code], res);
      if (res.code == 10) {
        debug("收到消息了：\r\ntime：" + res.data.time + "\r\nsender：" + res.data.user + "\r\ndata：" + (((typeof res.data.data) == "object") ? JSON.stringify(res.data.data) : res.data.data));
      }
      runCallback(2, res);
    });

    // 错误回调信息
    socket.conn.onError((res) => {
      debug("socket连接螺旋升天旋转爆炸！！！！");
      runCallback(1, res);
    });

    // 连接关闭回调
    socket.conn.onClose((res) => {
      debug("socket连接关闭了！");
      socket.isOpen = !1;
      runCallback(0, res);
    });
  }

  // 获取连接状态
  socket.stat = () => { return socket.isOpen };
}