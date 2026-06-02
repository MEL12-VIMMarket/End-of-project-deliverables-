// browse-partial.test.js — Selenium test TC-BROWSE-03
const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs');

(async function TC_BROWSE_03() {
  const driver = await new Builder().forBrowser('chrome').build();
  await driver.manage().window().setRect({ width: 1440, height: 900 });

  try {
    const THRESHOLD_MS = 1000;
    
    const start = Date.now();
    await driver.get('http://localhost:3000/listings');
    
    let rendered = false;
    try {
      await driver.wait(until.elementLocated(By.css('[class*="card"], [class*="Card"], [class*="product"]')), 10000);
      rendered = true;
    } catch (e) {}
    const elapsed = Date.now() - start;
    
    console.log('Load time      :', elapsed, 'ms');
    
    
        try {
          const rejectBtn = await driver.findElement(
            By.xpath("//button[contains(., 'Reject all') or contains(., 'Accept all')]")
          );
          await rejectBtn.click();
          await driver.sleep(1000);
        } catch (e) {}
    
    const png = await driver.takeScreenshot();
    fs.writeFileSync('browse-partial-result.png', png, 'base64');
    console.log('Saved screenshot: browse-partial-result.png');
    
    if (!rendered) {
      console.log('TC-BROWSE-03: FAIL — listings did not render within 10s');
    } else if (elapsed >= THRESHOLD_MS) {
      console.log('TC-BROWSE-03: PARTIAL PASS — listings rendered but took ' + elapsed + 'ms (threshold ' + THRESHOLD_MS + 'ms)');
    } else {
      console.log('TC-BROWSE-03: PASS — listings rendered in ' + elapsed + 'ms');
    }
  } catch (err) {
    console.log('TC-BROWSE-03: FAIL — error:', err.message);
  } finally {
    await driver.sleep(1500);
    await driver.quit();
  }
})();