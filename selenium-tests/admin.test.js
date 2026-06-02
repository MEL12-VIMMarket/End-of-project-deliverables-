// admin.test.js — Selenium test TC-ADMIN-01
const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs');

(async function TC_ADMIN_01() {
  const driver = await new Builder().forBrowser('chrome').build();
  await driver.manage().window().setRect({ width: 1440, height: 900 });

  try {
    await driver.get('http://localhost:3000/admin/login');
    await driver.sleep(2000);

    try {
      const rejectBtn = await driver.findElement(
        By.xpath("//button[contains(., 'Reject all') or contains(., 'Accept all')]")
      );
      await rejectBtn.click();
      await driver.sleep(1000);
    } catch (e) {}

    await driver.wait(until.elementLocated(By.css('input[type="email"]')), 10000);
    await driver.findElement(By.css('input[type="email"]')).sendKeys('saudbb098' + '@' + 'gmail.com');
    const pwBox = await driver.findElement(By.css('input[type="password"]'));
    await pwBox.sendKeys('test123');

    const btn = await driver.findElement(
      By.xpath("//button[contains(., 'Access Admin Portal') or contains(., 'Access') or contains(., 'Admin') or @type='submit']")
    );
    await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', btn);
    await driver.sleep(500);
    await btn.click();
    await pwBox.sendKeys(Key.RETURN);

    await driver.sleep(6000);
    const urlAfter = await driver.getCurrentUrl();
    console.log('URL:', urlAfter);

    const png = await driver.takeScreenshot();
    fs.writeFileSync('admin-result.png', png, 'base64');
    console.log('Saved screenshot: admin-result.png');

    if (urlAfter.includes('/dashboard/admin') || urlAfter.includes('/admin/dashboard')) {
      console.log('TC-ADMIN-01: PASS — admin reached admin dashboard at', urlAfter);
    } else if (urlAfter.includes('/dashboard')) {
      console.log('TC-ADMIN-01: PARTIAL — logged in but landed at ' + urlAfter);
    } else {
      console.log('TC-ADMIN-01: FAIL — admin did not reach dashboard, at', urlAfter);
    }
  } catch (err) {
    console.log('TC-ADMIN-01: FAIL — error:', err.message);
  } finally {
    await driver.sleep(1500);
    await driver.quit();
  }
})();
