// login.test.js — Selenium test TC-LOGIN-01
const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs');

(async function TC_LOGIN_01() {
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

    const emailBox = await driver.wait(
      until.elementLocated(By.css('input[type="email"]')), 10000
    );
    await emailBox.sendKeys('buyer' + '@' + 'test.com');
    const pwBox = await driver.findElement(By.css('input[type="password"]'));
    await pwBox.sendKeys('test123');

    const urlBefore = await driver.getCurrentUrl();
    console.log('URL before click:', urlBefore);

    const btn = await driver.findElement(By.xpath("//button[contains(., 'Sign In')]"));
    await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', btn);
    await driver.sleep(500);
    await btn.click();
    await pwBox.sendKeys(Key.RETURN);

    let urlAfter = urlBefore;
    for (let i = 0; i < 16; i++) {
      await driver.sleep(500);
      urlAfter = await driver.getCurrentUrl();
      if (urlAfter !== urlBefore) break;
    }
    console.log('URL after click :', urlAfter);

    const png = await driver.takeScreenshot();
    fs.writeFileSync('login-result.png', png, 'base64');
    console.log('Saved screenshot: login-result.png');

    if (urlAfter !== urlBefore && !urlAfter.endsWith('/login')) {
      console.log('TC-LOGIN-01: PASS — navigated to', urlAfter);
    } else {
      console.log('TC-LOGIN-01: FAIL — URL did not change');
    }
  } catch (err) {
    console.log('TC-LOGIN-01: FAIL — error:', err.message);
  } finally {
    await driver.sleep(1500);
    await driver.quit();
  }
})();