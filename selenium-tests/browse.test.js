// browse.test.js — Selenium test TC-BROWSE-01
const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs');

(async function TC_BROWSE_01() {
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
    
    console.log('URL:', await driver.getCurrentUrl());
    
    await driver.wait(until.elementLocated(By.css('img, [class*="card"], [class*="Card"]')), 10000);
    await driver.sleep(2000);
    
    const cards = await driver.findElements(By.css('[class*="card"], [class*="Card"], [class*="product"]'));
    console.log('Product cards visible:', cards.length);
    
    const png = await driver.takeScreenshot();
    fs.writeFileSync('browse-result.png', png, 'base64');
    console.log('Saved screenshot: browse-result.png');
    
    if (cards.length > 0) {
      console.log('TC-BROWSE-01: PASS — ' + cards.length + ' product cards rendered');
    } else {
      console.log('TC-BROWSE-01: FAIL — no product cards rendered');
    }
  } catch (err) {
    console.log('TC-BROWSE-01: FAIL — error:', err.message);
  } finally {
    await driver.sleep(1500);
    await driver.quit();
  }
})();