const fs = require('fs');
const moment = require('moment');
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const { surnames, names } = require('./utils/name');
const { getCookie } = require("./taskFunc/index");
const { generateRandomString, getRandomYear, runMethodNTimes, getNumber, getNumberText, sleep } = require('./utils/utils');

// 实例个数
const Instances_Length = 1;

// 执行次数
const Times = 1;

async function main() {
  let errStr = ''
  let txtId = ''
  const browser = await puppeteer.launch({
    headless: false, args: [
      '--lang=en'
    ]
  });
  const page = await browser.newPage();
  // 设置自定义语言
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'zh-en,zh;q=0.9'
  });
  try {
    const password = generateRandomString(8);
    errStr += `密码：${password}`;
    const [id, number] = await getNumber();
    txtId = id;
    errStr += `手机：${number}`;
    await page.goto("https://www.facebook.com/");
    // 填写注册表单
    await page.waitForSelector("#globalContainer");
    const element = await page.$('a[data-testid="open-registration-form-button"]');
    element?.click();
    await page.waitForSelector(".registration_redesign", { timeout: 1000000 });
    const emailEl = await page.$('input[name="reg_email__"]');
    const lastNameEl = await page.$('input[name="lastname"]');
    const firstNameEl = await page.$('input[name="firstname"]');
    await emailEl?.type(number, { delay: 500 });
    await page.type("#password_step_input", password, { delay: 500 });
    await page.select('select#year', getRandomYear(1980, 2000));
    await page.select('select#month', getRandomYear(1, 12));
    await page.select('select#day', getRandomYear(1, 26));
    await lastNameEl?.type(surnames[Math.floor(Math.random() * surnames.length)], { delay: 500 });
    await firstNameEl?.type(names[Math.floor(Math.random() * names.length)], { delay: 500 });
    await page.click("._58mt");
    const btnEl = await page.$('button[name="websubmit"]');
    btnEl?.click();
    console.log('----------提交表单----------')
    await page.waitForSelector("#conf_dialog_middle_components", { timeout: 1000000 });
    console.log('----------等待验证码----------')
    await sleep(70000);
    const smsText = await getNumberText(id);
    const content = `${number},${password},创建时间：${moment().format('YYYY-MM-DD')} \n`;
    console.log(smsText, password, number);
    const codeEl = await page.$('input[name="code"]');
    await codeEl?.type(smsText, { delay: 500 });
    const nextEl = await page.$('button[name="confirm"]');
    await nextEl?.click();
    await writeOrAppendToFile('./account.txt', content);
    await sleep(5000);
    await getCookie(page, number, password, 'account');
    await browser.close();
  } catch(err) {
    await browser.close();
    if (txtId) {
      const smsText = await getNumberText(txtId, true);
      errStr += `验证码：${smsText} 错误时间：${moment().format('YYYY-MM-DD')} \n`;
    }
    await writeOrAppendToFile('./error.txt', errStr);
  }
}

async function writeOrAppendToFile(filePath, content) {
  fs.access(filePath, fs.constants.F_OK, async err => {
    if (err) {
      await fs.writeFileSync(filePath, content);
    } else {
      await fs.appendFileSync(filePath, content);
    }
  })
}


// 执行次数
runMethodNTimes(async () => {
  const apiArr = [];
  for (let i = 0; i < Instances_Length; i++) {
    apiArr.push(main())
  }
  await Promise.all(apiArr);
}, Times);