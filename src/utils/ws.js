/**
 * 封装原生websocket，主要实现多种情况下的断线重连
 */
import _isFunction from 'lodash/isFunction';

export default class WS {
  constructor(option) {
    this.url = option.url; // websocket地址
    this.onclose = option.onclose; // 关闭时的回调
    this.onerror = option.onerror; // 出错时的回调
    this.onopen = option.onopen; // 开启时的回调
    this.onmessage = option.onmessage; // 接收数据时的回调
    this.lock = false; // 连接锁，避免重复连接
    this.ws = null; // websocket实例
    this.timeout = option.timeout || 60000; // 断线重连时间
    this.timeoutObj = null;
    this.serverTimeoutObj = null;
    this.createWebSocket();
  }

  createWebSocket() {
    try {
      this.ws = new WebSocket(this.url);
      this.initEventHandle();
    } catch (error) {
      this.reconnect();
    }
  }

  initEventHandle() {
    this.ws.onclose = () => {
      this.reconnect();
      if (_isFunction(this.onclose)) this.onclose();
    };

    this.ws.onerror = () => {
      this.reconnect();
      if (_isFunction(this.onerror)) this.onerror();
    };

    this.ws.onopen = () => {
      this.reset();
      this.start();
      if (_isFunction(this.onopen)) this.onopen();
    };

    this.ws.onmessage = event => {
      this.reset();
      this.start();
      if (_isFunction(this.onmessage)) this.onmessage(event);
    };
  }

  reconnect() {
    if (this.lock) return;
    this.lock = true;
    setTimeout(() => {
      this.createWebSocket();
      this.lock = false;
    }, 2000);
  }

  reset() {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
  }

  start() {
    this.timeoutObj = setTimeout(() => {
      this.ws.send('heartBeat');
      this.serverTimeoutObj = setTimeout(() => {
        this.ws.close();
      }, this.timeout);
    }, this.timeout);
  }
}
