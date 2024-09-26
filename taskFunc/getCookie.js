const { sleep, writeOrAppendToFile } = require('../utils/utils');
const fs = require("fs");
module.exports = async function getCookie(page, user, password, type) {
    await sleep(5000);
    const cookies = await page.cookies();
    const fileContents = await fs.promises.readFile('./handleCookie.txt', "utf8");
    let accountList = fileContents.split("\n");
    if (type == 'cookie') {
        if (accountList && accountList.length > 0) {
            accountList = accountList.map(item => {
                if (item.includes(user)) {
                    const data = `${JSON.stringify(cookies)},${user},${password}`;
                    return data; // 更新匹配到的条目
                }
                return item; // 保持未匹配到的条目不变
            });
            await fs.writeFileSync('./handleCookie.txt', accountList.join("\n"));
        }
    } else {
        let flag = false;
        if (accountList && accountList.length > 0) {
            flag = accountList.some(item => {
                if (item.includes(user)) {

                    return true; // 更新匹配到的条目
                }
            });
        }
        if (!flag) {
            await writeOrAppendToFile('./handleCookie.txt', `${JSON.stringify(cookies)},${user},${password} \n`)
        }
    }
};