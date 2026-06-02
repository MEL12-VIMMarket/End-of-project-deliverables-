// checkout-unauth.test.js — Selenium test TC-CHECK-02
const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs');
 
(async function TC_CHECK_02() {
  const driver = await new Builder().forBrowser('chrome').build();
  await driver.manage().window().setRect({ width: 1440, height: 900 });
 
  try {
    await driver.manage().deleteAllCookies();
    
    await driver.get('http://localhost:3000/checkout');
    await driver.sleep(2000);
    
        try {
          const rejectBtn = await driver.findElement(
            By.xpath("//button[contains(., 'Reject all') or contains(., 'Accept all')]")
          );
          await rejectBtn.click();
          await driver.sleep(1000);
        } catch (e) {}
    await driver.sleep(3000);
    
    const urlAfter = await driver.getCurrentUrl();
    console.log('URL after navigate:', urlAfter);
    
    const png = await driver.takeScreenshot();
    fs.writeFileSync('checkout-unauth-result.png', png, 'base64');
    console.log('Saved screenshot: checkout-unauth-result.png');
    
    if (urlAfter.includes('/login')) {
      console.log('TC-CHECK-02: FAIL (expected) — unauthenticated checkout correctly redirected to /login');
    } else if (!urlAfter.includes('/checkout')) {
      console.log('TC-CHECK-02: FAIL (expected) — unauthenticated checkout was blocked, redirected to', urlAfter);
    } else {
      console.log('TC-CHECK-02: UNEXPECTED — anonymous user reached', urlAfter);
    }
  } catch (err) {
    console.log('TC-CHECK-02: FAIL — error:', err.message);
  } finally {
    await driver.sleep(1500);
    await driver.quit();
  }
})();
 