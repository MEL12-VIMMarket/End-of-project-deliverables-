// cart-empty.test.js — Selenium test TC-CART-02
const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs');

(async function TC_CART_02() {
  const driver = await new Builder().forBrowser('chrome').build();
  await driver.manage().window().setRect({ width: 1440, height: 900 });

  try {
    await driver.get('http://localhost:3000/cart');
    await driver.sleep(2000);
    
        try {
          const rejectBtn = await driver.findElement(
            By.xpath("//button[contains(., 'Reject all') or contains(., 'Accept all')]")
          );
          await rejectBtn.click();
          await driver.sleep(1000);
        } catch (e) {}
    
    await driver.sleep(2000);
    console.log('URL:', await driver.getCurrentUrl());
    
    const bodyText = (await driver.findElement(By.css('body')).getText()).toLowerCase();
    const hasEmpty = bodyText.includes('empty') || bodyText.includes('no item') || bodyText.includes('nothing');
    console.log('Empty-state    :', hasEmpty ? 'Found' : 'NOT found');
    
    let checkoutVisible = false;
    try {
      const btn = await driver.findElement(By.xpath("//button[contains(., 'Checkout') or contains(., 'checkout')]"));
      checkoutVisible = await btn.isDisplayed();
    } catch (e) {}
    console.log('Checkout button visible:', checkoutVisible);
    
    const png = await driver.takeScreenshot();
    fs.writeFileSync('cart-empty-result.png', png, 'base64');
    console.log('Saved screenshot: cart-empty-result.png');
    
    if (hasEmpty && !checkoutVisible) {
      console.log('TC-CART-02: FAIL (expected) — empty cart correctly prevents checkout');
    } else if (hasEmpty) {
      console.log('TC-CART-02: PARTIAL — empty-state shown but checkout button still visible');
    } else {
      console.log('TC-CART-02: UNEXPECTED — no empty-state message displayed');
    }
  } catch (err) {
    console.log('TC-CART-02: FAIL — error:', err.message);
  } finally {
    await driver.sleep(1500);
    await driver.quit();
  }
})();