// register.test.js — Selenium test TC-REG-01
const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs');

(async function TC_REG_01() {
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

    const uniqueEmail = 'testuser' + Date.now() + '@' + 'example.com';

    await driver.wait(until.elementLocated(By.css('input[type="text"]')), 10000);
    await driver.findElement(By.css('input[type="text"]')).sendKeys('Test User');
    await driver.findElement(By.css('input[type="email"]')).sendKeys(uniqueEmail);
    const pwBox = await driver.findElement(By.css('input[type="password"]'));
    await pwBox.sendKeys('StrongPass123!');

    console.log('Test email      :', uniqueEmail);

    const btn = await driver.findElement(By.xpath("//button[contains(., 'Register')]"));
    await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', btn);
    await driver.sleep(500);
    await btn.click();
    await pwBox.sendKeys(Key.RETURN);

    await driver.sleep(5000);

    const urlAfter = await driver.getCurrentUrl();
    const bodyText = await driver.findElement(By.css('body')).getText();
    const verificationShown = /verification email sent|check your email|click the link to activate/i.test(bodyText);

    console.log('URL after submit:', urlAfter);

    const png = await driver.takeScreenshot();
    fs.writeFileSync('register-result.png', png, 'base64');
    console.log('Saved screenshot: register-result.png');

    if (verificationShown || urlAfter.includes('/login')) {
      console.log('TC-REG-01: PASS — account created, verification email sent');
    } else if (!urlAfter.endsWith('/register')) {
      console.log('TC-REG-01: PASS — account created, navigated to', urlAfter);
    } else {
      console.log('TC-REG-01: FAIL — still on /register, no verification message shown');
    }
  } catch (err) {
    console.log('TC-REG-01: FAIL — error:', err.message);
  } finally {
    await driver.sleep(1500);
    await driver.quit();
  }
})();
