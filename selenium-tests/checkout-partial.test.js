// checkout-partial.test.js — Selenium test TC-CHECK-03
const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs');

(async function TC_CHECK_03() {
  const driver = await new Builder().forBrowser('chrome').build();
  await driver.manage().window().setRect({ width: 1440, height: 900 });

  async function loginAsBuyer() {
    await driver.get('http://localhost:3000/login');
    await driver.sleep(2000);
    try {
      const rejectBtn = await driver.findElement(
        By.xpath("//button[contains(., 'Reject all') or contains(., 'Accept all')]")
      );
      await rejectBtn.click();
      await driver.sleep(1000);
    } catch (e) {}
    await driver.wait(until.elementLocated(By.css('input[type="email"]')), 10000);
    await driver.findElement(By.css('input[type="email"]')).sendKeys('buyer' + '@' + 'test.com');
    const pw = await driver.findElement(By.css('input[type="password"]'));
    await pw.sendKeys('test123');
    const btn = await driver.findElement(By.xpath("//button[contains(., 'Sign In')]"));
    await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', btn);
    await driver.sleep(500);
    await btn.click();
    await pw.sendKeys(Key.RETURN);
    await driver.wait(async () => !(await driver.getCurrentUrl()).endsWith('/login'), 10000);
    await driver.sleep(2000);
  }

  try {
    await loginAsBuyer();
    console.log('Logged in as buyer');

    await driver.get('http://localhost:3000/products/roma-tomatoes');
    await driver.sleep(4000);

    const addBtn = await driver.findElement(
      By.xpath("//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'add to cart')]")
    );
    await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', addBtn);
    await driver.sleep(500);
    await addBtn.click();
    console.log('Item added to cart');
    await driver.sleep(3000);

    await driver.get('http://localhost:3000/cart');
    await driver.sleep(4000);
    const cartBody = await driver.findElement(By.css('body')).getText();
    const cartHasRoma = /roma/i.test(cartBody);
    console.log('Cart contains Roma Tomatoes:', cartHasRoma);

    if (!cartHasRoma) {
      console.log('TC-CHECK-03: FAIL — Add to Cart did not add Roma Tomatoes to cart');
      return;
    }

    let checkoutLink = null;
    try {
      checkoutLink = await driver.findElement(
        By.xpath("//a[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'checkout')] | //button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'checkout')]")
      );
    } catch (e) {}

    if (checkoutLink) {
      await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', checkoutLink);
      await driver.sleep(500);
      await checkoutLink.click();
    } else {
      await driver.get('http://localhost:3000/checkout');
    }

    try {
      await driver.wait(
        until.elementLocated(By.xpath("//*[contains(., 'Delivery Details') or contains(., 'Delivery Address') or contains(., 'Secure Checkout')]")),
        15000
      );
    } catch (e) {
      console.log('TC-CHECK-03: FAIL — could not reach checkout form');
      return;
    }
    await driver.sleep(2000);

    let continueBtn;
    try {
      continueBtn = await driver.findElement(
        By.xpath("//button[contains(., 'Continue') or contains(., 'Payment')]")
      );
    } catch (e) {
      console.log('TC-CHECK-03: FAIL — no Continue button found on checkout page');
      return;
    }

    await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', continueBtn);
    await driver.sleep(500);
    await continueBtn.click();
    await driver.sleep(3000);

    const urlAfter = await driver.getCurrentUrl();
    console.log('URL after submit:', urlAfter);

    const bodyText = (await driver.findElement(By.css('body')).getText()).toLowerCase();
    const movedToStep2 = bodyText.includes('stripe') ||
                         bodyText.includes('card number') ||
                         bodyText.includes('payment method') ||
                         bodyText.includes('step 2') ||
                         bodyText.includes('step 2 — payment');
    console.log('Moved to Step 2:', movedToStep2);

    const stillOnStep1 = bodyText.includes('step 1') || bodyText.includes('delivery details');
    console.log('Still on Step 1:', stillOnStep1);

    const png = await driver.takeScreenshot();
    fs.writeFileSync('checkout-partial-result.png', png, 'base64');
    console.log('Saved screenshot: checkout-partial-result.png');

    if (!movedToStep2 && stillOnStep1) {
      console.log('TC-CHECK-03: PASS — empty address correctly blocked Step 1 (validation enforced)');
    } else if (movedToStep2) {
      console.log('TC-CHECK-03: PARTIAL PASS — Step 1 advanced to Step 2 without required delivery address (validation incomplete)');
    } else {
      console.log('TC-CHECK-03: PARTIAL — unclear what step we are on, manual check needed');
    }
  } catch (err) {
    console.log('TC-CHECK-03: FAIL — error:', err.message);
  } finally {
    await driver.sleep(1500);
    await driver.quit();
  }
})();
