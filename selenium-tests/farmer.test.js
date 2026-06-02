// farmer.test.js — Selenium test TC-FARMER-01
const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs');

(async function TC_FARMER_01() {
  const driver = await new Builder().forBrowser('chrome').build();
  await driver.manage().window().setRect({ width: 1440, height: 900 });

  try {
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
    await driver.findElement(By.css('input[type="email"]')).sendKeys('farmer' + '@' + 'test.com');
    const pwBox = await driver.findElement(By.css('input[type="password"]'));
    await pwBox.sendKeys('test123');

    const btn = await driver.findElement(By.xpath("//button[contains(., 'Sign In')]"));
    await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', btn);
    await driver.sleep(500);
    await btn.click();
    await pwBox.sendKeys(Key.RETURN);

    await driver.sleep(6000);
    const urlAfter = await driver.getCurrentUrl();
    console.log('URL:', urlAfter);

    const png = await driver.takeScreenshot();
    fs.writeFileSync('farmer-result.png', png, 'base64');
    console.log('Saved screenshot: farmer-result.png');

    if (urlAfter.includes('/dashboard/farmer') || urlAfter.includes('/farmer')) {
      console.log('TC-FARMER-01: PASS — farmer reached farmer area at', urlAfter);
    } else {
      console.log('TC-FARMER-01: FAIL — farmer did not reach dashboard, at', urlAfter);
    }
  } catch (err) {
    console.log('TC-FARMER-01: FAIL — error:', err.message);
  } finally {
    await driver.sleep(1500);
    await driver.quit();
  }
})();
