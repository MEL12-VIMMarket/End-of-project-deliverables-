// login-invalid.test.js — Selenium test TC-LOGIN-02
const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs');

(async function TC_LOGIN_02() {
  const driver = await new Builder().forBrowser('chrome').build();
  await driver.manage().window().setRect({ width: 1440, height: 900 });

  try {
    await driver.get('http://localhost:3000/login');
    await driver.sleep(1500);

    try {
      const rejectBtn = await driver.findElement(
        By.xpath("//button[contains(., 'Reject all') or contains(., 'Accept all')]")
      );
      await rejectBtn.click();
      await driver.sleep(800);
    } catch (e) {}

    await driver.wait(until.elementLocated(By.css('input[type="email"]')), 10000);
    await driver.findElement(By.css('input[type="email"]')).sendKeys('notarealuser' + '@' + 'fake.com');
    await driver.findElement(By.css('input[type="password"]')).sendKeys('WrongPass123');

    const urlBefore = await driver.getCurrentUrl();
    console.log('URL before click:', urlBefore);

    const btn = await driver.findElement(By.xpath("//button[contains(., 'Sign In')]"));
    await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', btn);
    await driver.sleep(400);
    await driver.executeScript('arguments[0].click();', btn);

    await driver.sleep(4000);
    const urlAfter = await driver.getCurrentUrl();
    console.log('URL after click :', urlAfter);

    const png = await driver.takeScreenshot();
    fs.writeFileSync('login-invalid-result.png', png, 'base64');
    console.log('Saved screenshot: login-invalid-result.png');

    if (urlAfter.endsWith('/login')) {
      console.log('TC-LOGIN-02: FAIL (expected) — invalid credentials correctly rejected, stayed on', urlAfter);
    } else {
      console.log('TC-LOGIN-02: UNEXPECTED PASS — invalid credentials were accepted, navigated to', urlAfter);
    }
  } catch (err) {
    console.log('TC-LOGIN-02: FAIL — error:', err.message);
  } finally {
    await driver.sleep(1500);
    await driver.quit();
  }
})();