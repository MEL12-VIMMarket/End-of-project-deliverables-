// checkout.test.js — Selenium test TC-CHECK-01
const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs');

(async function TC_CHECK_01() {
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
    console.log('Add to Cart clicked');
    await driver.sleep(3000);

    await driver.get('http://localhost:3000/cart');
    await driver.sleep(4000);
    const cartBody = await driver.findElement(By.css('body')).getText();
    const cartHasRoma = /roma/i.test(cartBody);
    console.log('Cart contains Roma Tomatoes:', cartHasRoma);

    if (!cartHasRoma) {
      console.log('TC-CHECK-01: FAIL — Add to Cart did not add Roma Tomatoes to cart');
      return;
    }

    let checkoutLink = null;
    try {
      checkoutLink = await driver.findElement(
        By.xpath("//a[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'checkout')] | //button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'checkout')]")
      );
    } catch (e) {}

    if (checkoutLink) {
      console.log('Found Checkout link on cart page — clicking it');
      await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', checkoutLink);
      await driver.sleep(500);
      await checkoutLink.click();
    } else {
      console.log('No Checkout link found, navigating directly');
      await driver.get('http://localhost:3000/checkout');
    }

    let reachedCheckout = false;
    try {
      await driver.wait(
        until.elementLocated(By.xpath("//*[contains(., 'Secure Checkout') or contains(., 'Delivery Details') or contains(., 'Delivery Address')]")),
        15000
      );
      reachedCheckout = true;
    } catch (e) {}

    await driver.sleep(2000);
    const urlAfter = await driver.getCurrentUrl();
    console.log('URL:', urlAfter);
    console.log('Checkout content visible:', reachedCheckout);

    let hasContinue = false;
    try {
      await driver.findElement(By.xpath("//button[contains(., 'Continue') or contains(., 'Payment')]"));
      hasContinue = true;
    } catch (e) {}
    console.log('Continue button :', hasContinue ? 'present' : 'MISSING');

    const png = await driver.takeScreenshot();
    fs.writeFileSync('checkout-result.png', png, 'base64');
    console.log('Saved screenshot: checkout-result.png');

    if (urlAfter.includes('/checkout') && hasContinue) {
      console.log('TC-CHECK-01: PASS — reached checkout step 1 with item(s) in cart');
    } else if (reachedCheckout && hasContinue) {
      console.log('TC-CHECK-01: PASS — checkout form rendered with Continue to Payment button');
    } else {
      console.log('TC-CHECK-01: FAIL — could not reach checkout form, ended at', urlAfter);
    }
  } catch (err) {
    console.log('TC-CHECK-01: FAIL — error:', err.message);
  } finally {
    await driver.sleep(1500);
    await driver.quit();
  }
})();
