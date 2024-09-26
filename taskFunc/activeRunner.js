const scroll = require("./scroll");
const { sleep } = require("../utils/utils");
/**
 * 点赞
 * @param {puppeteer.Page} page
 * @param {number} randomMaxSize
 * @param {number} randomMaxValue
 * @param {number} scrollStep
 * @param {number} scrollHeight
 * @param {number} scrollDelay
 * @param {Function} callBack
 */
module.exports = async function activeRunner(
  page,
  scrollStep,
  scrollHeight,
  scrollDelay,
  callBack
) {
  await sleep(10000);
  // await page.waitForSelector('div[role="main"]');
  // await page.waitForSelector('div[role="feed"]');
  await scroll(page, scrollStep, scrollHeight, scrollDelay, callBack);
};
