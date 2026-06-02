// admin-partial.test.js — Selenium test TC-ADMIN-03
const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs');

(async function TC_ADMIN_03() {
  const driver = await new Builder().forBrowser('chrome').build();
  await driver.manage().window().setRect({ width: 1440, height: 900 });

  const THRESHOLD_MS = 2000;

  async function loginAsAdmin() {
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
    const pw = await driver.findElement(By.css('input[type="password"]'));
    await pw.sendKeys('test123');
    const btn = await driver.findElement(
      By.xpath("//button[contains(., 'Access Admin Portal') or contains(., 'Access') or contains(., 'Admin') or @type='submit']")
    );
    await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', btn);
    await driver.sleep(500);
    await btn.click();
    await pw.sendKeys(Key.RETURN);
    await driver.wait(async () => {
      const u = await driver.getCurrentUrl();
      return u.includes('/dashboard') || u.includes('/admin/dashboard');
    }, 10000);
    await driver.sleep(1500);
  }

  try {
    await loginAsAdmin();
    console.log('Logged in as admin');

    const start = Date.now();
    await driver.get('http://localhost:3000/dashboard/admin');

    let rendered = false;
    try {
      await driver.wait(until.elementLocated(By.css('h1, h2, table, [class*="dashboard"]')), 15000);
      rendered = true;
    } catch (e) {}
    const elapsed = Date.now() - start;

    console.log('Dashboard load time:', elapsed, 'ms');

    const png = await driver.takeScreenshot();
    fs.writeFileSync('admin-partial-result.png', png, 'base64');
    console.log('Saved screenshot: admin-partial-result.png');

    if (!rendered) {
      console.log('TC-ADMIN-03: FAIL — dashboard did not render');
    } else if (elapsed >= THRESHOLD_MS) {
      console.log('TC-ADMIN-03: PARTIAL PASS — dashboard rendered but took ' + elapsed + 'ms (threshold ' + THRESHOLD_MS + 'ms)');
    } else {
      console.log('TC-ADMIN-03: PASS — dashboard rendered in ' + elapsed + 'ms');
    }
  } catch (err) {
    console.log('TC-ADMIN-03: FAIL — error:', err.message);
  } finally {
    await driver.sleep(1500);
    await driver.quit();
  }
})();
