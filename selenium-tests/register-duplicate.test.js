// register-duplicate.test.js — Selenium test TC-REG-02
const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs');

(async function TC_REG_02() {
  const driver = await new Builder().forBrowser('chrome').build();
  await driver.manage().window().setRect({ width: 1440, height: 900 });

  try {
    await driver.get('http://localhost:3000/register');
    await driver.sleep(2000);

    try {
      const rejectBtn = await driver.findElement(
        By.xpath("//button[contains(., 'Reject all') or contains(., 'Accept all')]")
      );
      await rejectBtn.click();
      await driver.sleep(1000);
    } catch (e) {}

    await driver.wait(until.elementLocated(By.css('input[type="text"]')), 10000);
    await driver.findElement(By.css('input[type="text"]')).sendKeys('Duplicate User');
    await driver.findElement(By.css('input[type="email"]')).sendKeys('buyer' + '@' + 'test.com');
    const pwBox = await driver.findElement(By.css('input[type="password"]'));
    await pwBox.sendKeys('AnyPass123!');

    const urlBefore = await driver.getCurrentUrl();
    console.log('URL before click:', urlBefore);

    const btn = await driver.findElement(By.xpath("//button[contains(., 'Register')]"));
    await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', btn);
    await driver.sleep(500);
    await btn.click();
    await pwBox.sendKeys(Key.RETURN);

    await driver.sleep(5000);
    const urlAfter = await driver.getCurrentUrl();
    console.log('URL after click :', urlAfter);

    const png = await driver.takeScreenshot();
    fs.writeFileSync('register-duplicate-result.png', png, 'base64');
    console.log('Saved screenshot: register-duplicate-result.png');

    if (urlAfter.endsWith('/register')) {
      console.log('TC-REG-02: FAIL (expected) — duplicate email correctly rejected, stayed on', urlAfter);
    } else {
      console.log('TC-REG-02: UNEXPECTED — duplicate registration was accepted, navigated to', urlAfter);
    }
  } catch (err) {
    console.log('TC-REG-02: FAIL — error:', err.message);
  } finally {
    await driver.sleep(1500);
    await driver.quit();
  }
})();