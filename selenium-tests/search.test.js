// search.test.js — Selenium test TC-SEARCH-01
const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs');

(async function TC_SEARCH_01() {
  const driver = await new Builder().forBrowser('chrome').build();
  await driver.manage().window().setRect({ width: 1440, height: 900 });

  try {
    await driver.get('http://localhost:3000/listings?search=tomato');
    await driver.sleep(4000);

    try {
      const rejectBtn = await driver.findElement(
        By.xpath("//button[contains(., 'Reject all') or contains(., 'Accept all')]")
      );
      await rejectBtn.click();
      await driver.sleep(1000);
    } catch (e) {}

    await driver.sleep(2000);

    console.log('URL after search:', await driver.getCurrentUrl());

    const cards = await driver.findElements(By.css('article.ls-card'));
    console.log('article.ls-card count:', cards.length);

    const lsCards = await driver.findElements(By.css('.ls-card'));
    console.log('.ls-card any tag count:', lsCards.length);

    const pcCards = await driver.findElements(By.css('.pc-card'));
    console.log('.pc-card count:', pcCards.length);

    const bodyText = (await driver.findElement(By.css('body')).getText()).toLowerCase();
    const productCountMatch = bodyText.match(/(\d+)\s+products?\s+for/);
    console.log('"X products for" in page text:', productCountMatch ? productCountMatch[0] : 'NOT FOUND');

    const png = await driver.takeScreenshot();
    fs.writeFileSync('search-result.png', png, 'base64');
    console.log('Saved screenshot: search-result.png');

    if (cards.length > 0) {
      console.log('TC-SEARCH-01: PASS — search returned ' + cards.length + ' matching results');
    } else {
      console.log('TC-SEARCH-01: FAIL — no results returned for tomato');
    }
  } catch (err) {
    console.log('TC-SEARCH-01: FAIL — error:', err.message);
  } finally {
    await driver.sleep(1500);
    await driver.quit();
  }
})();
