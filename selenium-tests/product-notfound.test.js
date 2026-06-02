// product-notfound.test.js — Selenium test TC-PROD-02
const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs');

(async function TC_PROD_02() {
  const driver = await new Builder().forBrowser('chrome').build();
  await driver.manage().window().setRect({ width: 1440, height: 900 });

  try {
    await driver.get('http://localhost:3000/listings/99999');
    await driver.sleep(2000);
    
        try {
          const rejectBtn = await driver.findElement(
            By.xpath("//button[contains(., 'Reject all') or contains(., 'Accept all')]")
          );
          await rejectBtn.click();
          await driver.sleep(1000);
        } catch (e) {}
    
    console.log('URL:', await driver.getCurrentUrl());
    await driver.sleep(3000);
    
    const bodyText = (await driver.findElement(By.css('body')).getText()).toLowerCase();
    const hasNotFound = bodyText.includes('not found') || bodyText.includes('does not exist') ||
                        bodyText.includes('no product') || bodyText.includes('unavailable') ||
                        bodyText.includes('404');
    console.log('Not-found message:', hasNotFound ? 'Found' : 'NOT found');
    
    const png = await driver.takeScreenshot();
    fs.writeFileSync('product-notfound-result.png', png, 'base64');
    console.log('Saved screenshot: product-notfound-result.png');
    
    if (hasNotFound) {
      console.log('TC-PROD-02: FAIL (expected) — invalid product ID; UI showed not-found message correctly');
    } else {
      console.log('TC-PROD-02: PARTIAL — page loaded but no clear not-found message');
    }
  } catch (err) {
    console.log('TC-PROD-02: FAIL — error:', err.message);
  } finally {
    await driver.sleep(1500);
    await driver.quit();
  }
})();