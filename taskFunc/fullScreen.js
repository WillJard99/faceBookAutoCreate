/**
 * 全屏
 * @param {puppeteer.Page} page
 */
module.exports = async function fullScreen(page) {
  await page.evaluate(() => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      // Firefox
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      // Chrome, Safari and Opera
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      // IE/Edge
      element.msRequestFullscreen();
    }
  });
  // 设置视图端口为全屏
  await page.setViewport({
    width: 1920, // 屏幕宽度
    height: 1080, // 屏幕高度
  });
};
