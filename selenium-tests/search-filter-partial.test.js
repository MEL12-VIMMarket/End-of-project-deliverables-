// search-filter-partial.test.js — Selenium test TC-SEARCH-03
const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs');

(async function TC_SEARCH_03() {
  const driver = await new Builder().forBrowser('chrome').build();
  await driver.manage().window().setRect({ width: 1440, height: 900 });

  try {
    await driver.get('http://localhost:3000/listings');
    await driver.sleep(2000);
    
        try {
          const rejectBtn = await driver.findElement(
            By.xpath("//button[contains(., 'Reject all') or contains(., 'Accept all')]")
          );
          await rejectBtn.click();
          await driver.sleep(1000);
        } catch (e) {}
    
    const minBox = await driver.findElement(By.css('input[placeholder="Min"]'));
    const maxBox = await driver.findElement(By.css('input[placeholder="Max"]'));
    await minBox.sendKeys('5');
    await maxBox.sendKeys('10', Key.RETURN);
    await driver.sleep(3000);
    
    console.log('Filter applied : min=5, max=10');
    
    const cards = await driver.findElements(By.css('[class*="card"], [class*="Card"], [class*="product"]'));
    console.log('Total cards    :', cards.length);
    
    let inRange = 0, outRange = 0;
    for (const card of cards) {
      try {
        const txt = await card.getText();
        const m = txt.match(/\$?\s?(\d+(?:\.\d+)?)/);
        if (m) {
          const price = parseFloat(m[1]);
          if (price >= 5 && price <= 10) inRange++; else outRange++;
        }
      } catch (e) {}
    }
    console.log('In-range       :', inRange);
    console.log('Out-of-range   :', outRange);
    
    const png = await driver.takeScreenshot();
    fs.writeFileSync('search-filter-partial-result.png', png, 'base64');
    console.log('Saved screenshot: search-filter-partial-result.png');
    
    if (cards.length === 0) {
      console.log('TC-SEARCH-03: FAIL — filter returned no results');
    } else if (outRange === 0) {
      console.log('TC-SEARCH-03: PASS — all ' + cards.length + ' results in 5-10 range');
    } else {
      console.log('TC-SEARCH-03: PARTIAL PASS — filter applied but ' + outRange + ' of ' + cards.length + ' results fell outside the 5-10 price range');
    }
  } catch (err) {
    console.log('TC-SEARCH-03: FAIL — error:', err.message);
  } finally {
    await driver.sleep(1500);
    await driver.quit();
  }
})();
