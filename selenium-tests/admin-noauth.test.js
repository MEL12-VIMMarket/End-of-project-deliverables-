// admin-noauth.test.js — Selenium test TC-ADMIN-02
const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs');

(async function TC_ADMIN_02() {
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

    await driver.get('http://localhost:3000/dashboard/admin');
    await driver.sleep(5000);

    const urlAfter = await driver.getCurrentUrl();
    console.log('URL after navigate:', urlAfter);

    const png = await driver.takeScreenshot();
    fs.writeFileSync('admin-noauth-result.png', png, 'base64');
    console.log('Saved screenshot: admin-noauth-result.png');

    if (!urlAfter.includes('/dashboard/admin') && !urlAfter.includes('/admin')) {
      console.log('TC-ADMIN-02: FAIL (expected) — buyer correctly blocked from admin (redirected to ' + urlAfter + ')');
    } else {
      console.log('TC-ADMIN-02: UNEXPECTED — buyer reached admin dashboard!');
    }
  } catch (err) {
    console.log('TC-ADMIN-02: FAIL — error:', err.message);
  } finally {
    await driver.sleep(1500);
    await driver.quit();
  }
})();
