
const { sleep } = require('../utils/utils');

module.exports = async function setLanguage(page) {
    await sleep(10000)
    const cnBtnEl = await page.$('a[title="Simplified Chinese (China)"]');
    await cnBtnEl?.click();
    await sleep(5000)
    // const imgBtnEl = await page.$('image[preserveAspectRatio="xMidYMid slice"]');
    // await imgBtnEl?.click();
    // const settingBtnEl = await page.$$('div[role="listitem"]');
    // await settingBtnEl[0]?.click();
    // const languageBtnEl = await page.$('span[id=":r23:"]');
    // await languageBtnEl?.click();
    // const languageTwpBtnEl = await page.$('span[id=":r29:"]');
    // await languageTwpBtnEl?.click();
    // await sleep(5000);
    // const cnLanguageBtn = await page.$('li[id="zh_CNRECENT"]');
    // await cnLanguageBtn?.click();xu06os2 
    // await sleep(5000);
}