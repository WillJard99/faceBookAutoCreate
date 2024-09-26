
const { searchTag } = require('../utils/name');
const { sleep } = require('../utils/utils');

module.exports = async function follow(page) {
    await sleep(10000)
    const searchEl = await page.$('input[role="combobox"]');
    await searchEl.focus();
    await searchEl?.type(searchTag[Math.floor(Math.random() * searchTag.length)], { delay: 500 });
    await page?.keyboard?.press('Enter');
    await sleep(5000)

    const targetElement = await page.evaluateHandle(() => {
        const autoDirSpans = document.querySelectorAll('span[dir="auto"]');
        for (let span of autoDirSpans) {
            const childSpans = span.querySelectorAll('span');
            for (let childSpan of childSpans) {
                if (childSpan.textContent.includes('公共主页')) {
                    return childSpan;
                }
            }
        }
        return null;
    });
    await targetElement?.click();
    await sleep(5000);
    const followButtons = await page.$$('div[aria-label="关注"]');
    await followButtons[Math.floor(Math.random() * followButtons.length)].click();

    const logoEl = await page.$('a[aria-label="Facebook"]');
    await logoEl?.click();
    await sleep(3000);
    const reLoadEl = await page.$('a[aria-label="首页"]');
    await reLoadEl?.click();
    await sleep(3000);
}