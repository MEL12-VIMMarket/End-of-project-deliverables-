// browse-empty.test.js — Selenium test TC-BROWSE-02
const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs');

(async function TC_BROWSE_02() {
  const driver = await new Builder().forBrowser('chrome').build();
  await driver.manage().window().setRect({ width: 1440, height: 900 });

  try {
    await driver.get('http://localhost:3000/listings?category=nonexistentcategory12345');
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
    
    const cards = await driver.findElements(By.css('[class*="card"], [class*="Card"], [class*="product"]'));
    console.log('Cards visible    :', cards.length);
    
    const bodyText = (await driver.findElement(By.css('body')).getText()).toLowerCase();
    const hasEmptyMsg = bodyText.includes('no product') || bodyText.includes('not found') ||
                        bodyText.includes('no results') || bodyText.includes('no listings') ||
                        bodyText.includes('empty');
    console.log('Empty-state text :', hasEmptyMsg ? 'Found in body' : 'NOT found');
    
    const png = await driver.takeScreenshot();
    fs.writeFileSync('browse-empty-result.png', png, 'base64');
    console.log('Saved screenshot: browse-empty-result.png');
    
    if (cards.length === 0 && hasEmptyMsg) {
      console.log('TC-BROWSE-02: FAIL (expected) — no products in filter; UI correctly showed empty state');
    } else if (cards.length === 0) {
      console.log('TC-BROWSE-02: PARTIAL — empty result but no clear empty-state message');
    } else {
      console.log('TC-BROWSE-02: UNEXPECTED — products appeared for nonexistent category');
    }
  } catch (err) {
    console.log('TC-BROWSE-02: FAIL — error:', err.message);
  } finally {
    await driver.sleep(1500);
    await driver.quit();
  }
})();