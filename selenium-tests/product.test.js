// product.test.js — Selenium test TC-PROD-01
const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs');

(async function TC_PROD_01() {
  const driver = await new Builder().forBrowser('chrome').build();
  await driver.manage().window().setRect({ width: 1440, height: 900 });

  try {
    await driver.get('http://localhost:3000/listings');
    await driver.sleep(2000);

    try {
      const rejectBtn = await driver.findElement(
        By.xpath("//button[contains(., 'Reject all') or contains(., 'Accept all')]")
      );
      await rejectBtn.click();
      await driver.sleep(1000);
    } catch (e) {}

    await driver.wait(until.elementLocated(By.css('article.ls-card')), 10000);
    await driver.sleep(2000);

    const urlBefore = await driver.getCurrentUrl();
    console.log('URL before click:', urlBefore);

    const romaLink = await driver.findElement(By.xpath("//a[contains(., 'Roma Tomato') or contains(@href, 'roma-tomato')]"));
    await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', romaLink);
    await driver.sleep(500);
    await romaLink.click();

    await driver.sleep(4000);
    const urlAfter = await driver.getCurrentUrl();
    console.log('URL after click :', urlAfter);

    let cartBtnFound = false;
    try {
      await driver.findElement(
        By.xpath("//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'add to cart') or contains(., '🛒')]")
      );
      cartBtnFound = true;
    } catch (e) {}
    console.log('Add-to-Cart button:', cartBtnFound ? 'found' : 'NOT found');

    const png = await driver.takeScreenshot();
    fs.writeFileSync('product-result.png', png, 'base64');
    console.log('Saved screenshot: product-result.png');

    if (urlAfter !== urlBefore && cartBtnFound) {
      console.log('TC-PROD-01: PASS — navigated to Roma Tomatoes detail page with Add-to-Cart visible');
    } else if (urlAfter !== urlBefore) {
      console.log('TC-PROD-01: PARTIAL — navigated to detail page but Add-to-Cart not detected');
    } else {
      console.log('TC-PROD-01: FAIL — navigation failed');
    }
  } catch (err) {
    console.log('TC-PROD-01: FAIL — error:', err.message);
  } finally {
    await driver.sleep(1500);
    await driver.quit();
  }
})();
