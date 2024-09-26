/**
 * 点赞
 * @param {puppeteer.Page} page
 * @param {number[]} randomNumArr
 */
module.exports = async function like(page, randomNumArr) {
  let currentIndex = 0;
  while (currentIndex < randomNumArr.length) {
    // Todo：首页预加载的内容处理
    let elements;
    elements = await page.$$(
      'div[data-pagelet="FeedUnit_{n}"] div[aria-label="赞"]'
    );
    if (!elements) {
      elements = await page.$$(
        'div[data-pagelet="FeedUnit_{n}"] div[aria-label="Like"]'
      );
    }
    const isIntersecting = await elements?.[
      randomNumArr[currentIndex]
    ]?.isIntersectingViewport();
    if (isIntersecting) {
      await elements?.[randomNumArr[currentIndex]]?.click();
    }
    currentIndex++;
  }
};
