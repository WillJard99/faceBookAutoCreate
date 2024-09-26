/**
 * 登陆
 * @param {puppeteer.Page} page
 * @param {string} user
 * @param {string} password
 */
module.exports = async function login(page, user, password, type) {
  if (type === 'cookie') {
    await page.waitForSelector('#pageFooter');
    const passwordInputEl = await page.$('input[name="pass"]');
    if (passwordInputEl) {
      const loginBtnEl = await page.$('input[data-testid="sec_ac_button"]');
      await passwordInputEl?.type(password, { delay: 500 });
      await loginBtnEl.click();
    }
  } else {
    await page.waitForSelector('::-p-xpath(//*[@id="email"])');
    await page.type('::-p-xpath(//*[@id="email"])', user, {
      delay: 200,
    });
    await page.waitForSelector('::-p-xpath(//*[@id="pass"])');
    await page.type('::-p-xpath(//*[@id="pass"])', password, { delay: 150 });
    await page.waitForSelector('::-p-xpath(//*[@id="loginbutton"])');
    await page.click('::-p-xpath(//*[@id="loginbutton"])');
    // await page.waitForSelector('div[role="main"]');
    // await page.waitForSelector('div[role="feed"]');
  }
};
