const axios = require("axios");
const { smsKey, smsType } = require("../key");
const {
  ACTIVE_ACCOUNT_LIST_PATH,
  ACTIVE_COOKIE_LIST_PATH,
  ACTIVE_ACCOUNT_FAIL_LIST_PATH,
} = require("./constants");
const path = require("path");
const fs = require("fs");

// 等待时间
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 随机生成n个0-m的不同整数
 * @param {number} maxSize
 * @param {number} max
 * @returns {number[]}
 */
function randomNumber(maxSize, max) {
  const uniqueRandomNumbers = [];
  while (uniqueRandomNumbers.length < maxSize) {
    const randomNumber = Math.floor(Math.random() * (max + 1));
    if (!uniqueRandomNumbers.includes(randomNumber)) {
      uniqueRandomNumbers.push(randomNumber);
    }
  }
  return uniqueRandomNumbers;
}

// 写入文件
async function writeOrAppendToFile(filePath, content) {
  fs.access(filePath, fs.constants.F_OK, async err => {
    if (err) {
      await fs.writeFileSync(filePath, content);
    } else {
      await fs.appendFileSync(filePath, content);
    }
  })
}

// 随机生成指定长度大小写数字的密码
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
      randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
}

// 随机年月日
function getRandomYear(startYear, endYear) {
  return Math.floor(Math.random() * (endYear - startYear + 1)) + startYear + '';
}

// 多线程批量
function runMethodNTimes(method, numTimes) {
  let attempt = 1;
  const interval = 1000; // 连续调用之间的延迟，单位为毫秒

  const handleNext = async () => {
      if (attempt <= numTimes) {
          await method();
          setTimeout(handleNext, interval);
          attempt++;
      }
  };

  handleNext();
}

// 获取号码
async function getNumber() {
  try {
    // Step 1: Get a number
    const response = await axios.get(`https://sms-activate.ru/stubs/handler_api.php?api_key=${smsKey}&action=getNumber&service=${smsType}&country=6`);
    const data = response.data.split(':');
    if (data[0] !== 'ACCESS_NUMBER') {
      throw new Error('Failed to get number: ' + response.data);
    }
    const id = data[1];
    const number = data[2];
    return [id, number];
  } catch (error) {
    console.error(error);
  }
}

// 获取短信
async function getNumberText(id, flag) {
  const response = await axios.get(`https://sms-activate.ru/stubs/handler_api.php?api_key=${smsKey}&action=getStatus&id=${id}`);
  const data = response.data.split(':');
  if (data[0] !== 'STATUS_OK' && !flag) {
    throw new Error('Failed to get SMS: ' + response.data);
  }
  const sms = data[1];

  return sms + ''
}

async function cookieOrAccount(type) {
  let account = [];
  if (type === 'cookie') {
    const cookieRegex = /(\w+)=([^;]+)/g;
    const regex = /\|(.*?)\|/;
    const cookieFilePath = path.join(__dirname, ACTIVE_COOKIE_LIST_PATH);
    const fileContents = await fs.promises.readFile(cookieFilePath, "utf8");
    // 读取文件内容 cookie
    const cookieList = fileContents.split("\n");
    account = cookieList.map(item => {
      let user = '';
      const match = item.match(cookieRegex);
      const password = item.match(regex)[1] + '';
      
      const cookies = match.map(cookie => {
        const [name, value] = cookie.split('=').map(c => c.trim());
        if (name === 'c_user') {
          user = value
        }
        return { name, value, domain: '.facebook.com' }; // 替换为实际的域名
      });

      return {
        cookies,
        password,
        user
      }
    })
  } else {
    const accountFilePath = path.join(__dirname, ACTIVE_ACCOUNT_LIST_PATH);
    // 账号密码
    const fileContents = await fs.promises.readFile(accountFilePath, "utf8");
    const accountList = fileContents.split("\n");
    account = accountList.map(item => {
      const [user, password] = item.split(",");

      return {
        user,
        password
      }
    })
  }

  return account;
}

async function accountCookieLogin() {
  let account = []
  const fileContents = await fs.promises.readFile('./handleCookie.txt', "utf8");
  // 读取文件内容 cookie
  const cookieList = fileContents.split("\n");
  const regex = /(\[.*?\]),(\d+),(\w+)/;
  account = cookieList.map(item => {
    const match = item.match(regex);
    const cookies = JSON.parse(match[1]);
    const user = match[2];
    const password = match[3];

    return { cookies, user, password }
  })

  return account
}

module.exports = {
  sleep,
  randomNumber,
  generateRandomString,
  getRandomYear,
  runMethodNTimes,
  getNumber,
  getNumberText,
  writeOrAppendToFile,
  cookieOrAccount,
  accountCookieLogin,
};
