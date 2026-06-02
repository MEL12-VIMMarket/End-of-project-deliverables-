// cart.test.js — Selenium test TC-CART-01
const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs');

(async function TC_CART_01() {
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
    
    await driver.sleep(2000);
    
    const addBtn = await driver.findElement(By.xpath("//button[contains(., 'Add to Cart') or contains(., 'Cart')]"));
    await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', addBtn);
    await driver.sleep(500);
    await addBtn.click();
    console.log('Add to Cart clicked');
    await driver.sleep(2000);
    
    await driver.get('http://localhost:3000/cart');
    await driver.sleep(3000);
    console.log('URL:', await driver.getCurrentUrl());
    
    const cartItems = await driver.findElements(By.css('[class*="cart-item"], [class*="CartItem"], [class*="item"]'));
    console.log('Cart items:', cartItems.length);
    
    const png = await driver.takeScreenshot();
    fs.writeFileSync('cart-result.png', png, 'base64');
    console.log('Saved screenshot: cart-result.png');
    
    if (cartItems.length > 0) {
      console.log('TC-CART-01: PASS — ' + cartItems.length + ' item visible in cart');
    } else {
      console.log('TC-CART-01: FAIL — cart is empty after adding item');
    }
  } catch (err) {
    console.log('TC-CART-01: FAIL — error:', err.message);
  } finally {
    await driver.sleep(1500);
    await driver.quit();
  }
})();