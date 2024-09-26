const path = require("path");
// const puppeteer = require("puppeteer");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { proxy_url, proxy_accout, proxy_password } = require("./key");
puppeteer.use(StealthPlugin())
const {
  PAGE_URL,
  ACTIVE_ACCOUNT_FAIL_LIST_PATH,
} = require("./utils/constants");
const { login, like, fullScreen, activeRunner, follow, setLanguage, getCookie } = require("./taskFunc/index");
const { randomNumber, writeOrAppendToFile, cookieOrAccount, accountCookieLogin } = require("./utils/utils");

async function main(type, isPhoneCreate = false) {
  const failFilePath = path.join(__dirname, ACTIVE_ACCOUNT_FAIL_LIST_PATH);
  let accouts;
  if (isPhoneCreate && type === 'cookie') {
    accouts = await accountCookieLogin();
  } else {
    accouts = await cookieOrAccount(type);
  }
  let index = 29;
  let password, user, browser;
  while (index < accouts.length) {
    password = accouts[index].password;
    user = accouts[index].user;

    console.log(`执行第${index + 1}次日活`, user, password);
    // 可以选择有头模式以便观察执行过程
    browser = await puppeteer.launch({
      headless: false,
      // 禁用网页通知
      args: ["--disable-notifications", `--proxy-server=cb0b710eb1f433ca.fjt.as.ipidea.online:2336`],
      // args: ["--disable-notifications", `--proxy-server=${proxy_url}`],
    });
    const page = await browser.newPage();

    // 统一超时时间
    await page.setDefaultTimeout(100000);

    if (type === 'cookie') {
      await page.setCookie(...accouts[index].cookies.map(cookie => ({ ...cookie, domain: '.facebook.com', url: PAGE_URL })));
    }

    await page.authenticate({ username: 'wjh9612-zone-static-region-id', password: 'abcdEFG1996' })
    // await page.authenticate({ username: proxy_accout, password: proxy_password })

    // 设置自定义语言
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'zh-CN,zh;q=0.9'
    });
    await page.goto(PAGE_URL);

    await page.setRequestInterception(true);

    page.on('request', (request) => {
      // 检查请求的 URL、类型和其他属性
      // const url = request.url();
      const type = request.resourceType();

      if (type === 'image' || type === 'video') {
        // 阻止图片和视频的加载
        request.abort();
      } else {
        // 其他类型的请求继续
        request.continue();
      }
    });
    try {
      await active(page, user, password, type);
      console.log(`第${index + 1}次日活 执行完毕！`);
    } catch (error) {
      console.log(error, "error");
      await writeOrAppendToFile(failFilePath, JSON.stringify(accouts[index]) + '\n');
    }
    // Todo: 关闭brower
    index++;
  }
  process.exit();
}

/**
 * 活跃脚本
 * @param {puppeteer.Page} page
 * @param {string} user
 * @param {string} password
 */
async function active(page, user, password, type) {
  // await fullScreen(page);
  // await setLanguage(page);
  await login(page, user, password, type);
  // 保存登录的cookie
  // await getCookie(page, user, password, type);
  // await follow(page);
  const randomNumArr = randomNumber(1, 5);
  const task = () => {
    like(page, randomNumArr);
  };
  await activeRunner(page, 50, 5000, 250, task);

}

// 默认 cookie登录
const AUTO_TYPE = 'cookie';
main(AUTO_TYPE, true);