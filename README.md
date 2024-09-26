## 感谢每一位支持开源的朋友. 这是一个基于 puppeteer 开发 用于 facebook 自动注册\点赞\关注的js脚本.

## 本项目用的是 sms-activate.io 的短信接码网站.

> 假如此轮子对你有帮助,请顺手 star 一下吧.o(_￣︶￣_)o

## 安装使用! 下载依赖

```bash
npm i
or
yarn
```

#### 配置项目需要的 key

```javascript
// 2captcha验证码过滤 暂时未用到
const captchaKey = "";
// 短信接码的key
const smsKey = "fd37ecf662e604c9cA********"";
// 短信接码的项目 fb是facebook 其他的可在网站上查询
const smsType = "fb";
// 代理 谷歌上很多
const proxy_url = "cb0b710eb1f433ca.********";
const proxy_accout = "wjh9612-z********"";
const proxy_password = "********"";
```

## 如何使用

```javascript
// 自动注册 可在脚本中设置 实例个数 执行次数
node createFaceBook.js 

// 自动点赞 关注
node active.js 
```

## 其它问题

如果不加代理注册 建议一天不超过 50 个账号 不能执行自动点赞 关注脚本 会被 180 天警告

如果有什么不懂得 可加v HaxOn_ 跟作者探讨探讨 