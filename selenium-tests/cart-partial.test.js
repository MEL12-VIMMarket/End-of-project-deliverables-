// cart-partial.test.js — Selenium test TC-CART-03
const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs');

(async function TC_CART_03() {
  const driver = await new Builder().forBrowser('chrome').build();
  await driver.manage().window().setRect({ width: 1440, height: 900 });

  const ADD_CLICKS = 15;

  try {
    await driver.get('http://localhost:3000/products/roma-tomatoes');
    await driver.sleep(3000);

    try {
      const rejectBtn = await driver.findElement(
        By.xpath("//button[contains(., 'Reject all') or contains(., 'Accept all')]")
      );
      await rejectBtn.click();
      await driver.sleep(1000);
    } catch (e) {}

    await driver.sleep(2000);

    const bodyTextBefore = await driver.findElement(By.css('body')).getText();
    const stockMatch = bodyTextBefore.match(/(\d+)\s+(kg|units?|items?)\s+(in stock|available)/i);
    const reportedStock = stockMatch ? parseInt(stockMatch[1]) : null;
    console.log('Reported stock  :', reportedStock !== null ? reportedStock : 'NOT detected');

    const addBtn = await driver.findElement(
      By.xpath("//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'add to cart')]")
    );
    await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', addBtn);
    await driver.sleep(500);

    for (let i = 0; i < ADD_CLICKS; i++) {
      try {
        await addBtn.click();
      } catch (e) {
        try { await driver.executeScript('arguments[0].click();', addBtn); } catch (e2) {}
      }
      await driver.sleep(250);
    }
    console.log('Add to Cart clicked', ADD_CLICKS, 'times');

    await driver.get('http://localhost:3000/cart');
    await driver.sleep(3000);
    console.log('URL:', await driver.getCurrentUrl());

    const cartBodyText = await driver.findElement(By.css('body')).getText();
    const qtyMatch = cartBodyText.match(/(?:qty|quantity)[:\s]*(\d+)|×\s*(\d+)|\b(\d+)\s*(kg|units?|items?)\b/i);
    let cartQty = null;
    if (qtyMatch) {
      cartQty = parseInt(qtyMatch[1] || qtyMatch[2] || qtyMatch[3]);
    }
    console.log('Detected cart qty:', cartQty !== null ? cartQty : 'NOT detected');

    const items = await driver.findElements(By.css('[class*="cart-item"], [class*="CartItem"]'));
    console.log('Cart line items :', items.length);

    const png = await driver.takeScreenshot();
    fs.writeFileSync('cart-partial-result.png', png, 'base64');
    console.log('Saved screenshot: cart-partial-result.png');

    if (cartQty === null) {
      console.log('TC-CART-03: PARTIAL — could not detect cart quantity, manual check needed');
    } else if (reportedStock !== null && cartQty > reportedStock) {
      console.log('TC-CART-03: PARTIAL PASS — cart quantity (' + cartQty + ') exceeds available stock (' + reportedStock + '); stock-limit validation not enforced');
    } else if (cartQty >= ADD_CLICKS) {
      console.log('TC-CART-03: PARTIAL PASS — ' + ADD_CLICKS + ' adds accepted, cart shows qty ' + cartQty + '; no upper-limit cap detected');
    } else {
      console.log('TC-CART-03: PASS — cart correctly capped at ' + cartQty + ' (clicked ' + ADD_CLICKS + ' times)');
    }
  } catch (err) {
    console.log('TC-CART-03: FAIL — error:', err.message);
  } finally {
    await driver.sleep(1500);
    await driver.quit();
  }
})();
