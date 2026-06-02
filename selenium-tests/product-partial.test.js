// product-partial.test.js — Selenium test TC-PROD-03
const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs');

(async function TC_PROD_03() {
  const driver = await new Builder().forBrowser('chrome').build();
  await driver.manage().window().setRect({ width: 1440, height: 900 });

  try {
    await driver.get('http://localhost:3000/listings/1');
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
    const fullBody = await driver.findElement(By.css('body')).getText();
    
    const hasTitle  = (await driver.findElements(By.css('h1, h2'))).length > 0;
    const hasPrice  = /\$\s?\d/.test(fullBody);
    let   hasCart   = false;
    try { await driver.findElement(By.xpath("//button[contains(., 'Cart')]")); hasCart = true; } catch(e){}
    
    const hasReviews = bodyText.includes('review');
    const hasRelated = bodyText.includes('related') || bodyText.includes('similar') || bodyText.includes('you may also');
    
    console.log('Title       :', hasTitle ? 'present' : 'MISSING');
    console.log('Price       :', hasPrice ? 'present' : 'MISSING');
    console.log('Add to Cart :', hasCart  ? 'present' : 'MISSING');
    console.log('Reviews     :', hasReviews ? 'present' : 'MISSING');
    console.log('Related     :', hasRelated ? 'present' : 'MISSING');
    
    const png = await driver.takeScreenshot();
    fs.writeFileSync('product-partial-result.png', png, 'base64');
    console.log('Saved screenshot: product-partial-result.png');
    
    const coreOk = hasTitle && hasPrice && hasCart;
    const optionalMissing = [hasReviews, hasRelated].filter(x => !x).length;
    
    if (!coreOk) {
      console.log('TC-PROD-03: FAIL — core elements missing');
    } else if (optionalMissing > 0) {
      console.log('TC-PROD-03: PARTIAL PASS — core elements present but ' + optionalMissing + ' optional section(s) missing');
    } else {
      console.log('TC-PROD-03: PASS — all sections rendered');
    }
  } catch (err) {
    console.log('TC-PROD-03: FAIL — error:', err.message);
  } finally {
    await driver.sleep(1500);
    await driver.quit();
  }
})();