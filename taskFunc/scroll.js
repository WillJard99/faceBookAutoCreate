const { sleep } = require("../utils/utils");
/**
 * 滚动
 * @param {puppeteer.Page} page
 * @param {number} scrollStep
 * @param {number} scrollHeight
 * @param {number} scrollDelay
 * @param {Function} callBack
 */
module.exports = async function scorll(
  page,
  scrollStep,
  scrollHeight,
  scrollDelay,
  callBack
) {
  let currentPosition = 0;
  while (currentPosition < scrollHeight) {
    // 滚动到当前位置 + 滚动步长
    await page.evaluate((scrollStep) => {
      window.scrollBy(0, scrollStep);
    }, scrollStep);

    // 等待一段时间
    await sleep(scrollDelay);

    // 更新当前位置
    currentPosition += scrollStep;
    if (typeof callBack === "function") {
      await callBack();
    }
  }
};
