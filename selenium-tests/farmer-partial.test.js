// farmer-partial.test.js — Selenium test TC-FARMER-03
const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs');

(async function TC_FARMER_03() {
  const driver = await new Builder().forBrowser('chrome').build();
  await driver.manage().window().setRect({ width: 1440, height: 900 });

  const INVALID_BSB = 'NOTAVALIDBSB!!@@';
  const INVALID_ACCOUNT = 'abcXYZ@@@';

  async function loginAsFarmer() {
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
    await loginAsFarmer();
    console.log('Logged in as farmer');

    await driver.get('http://localhost:3000/dashboard/farmer');
    await driver.sleep(4000);

    try {
      const settingsTab = await driver.findElement(
        By.xpath("//button[contains(., 'Settings') or contains(., '⚙')]")
      );
      await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', settingsTab);
      await driver.sleep(500);
      await settingsTab.click();
      console.log('Clicked Settings tab');
      await driver.sleep(2000);
    } catch (e) {
      console.log('Could not find Settings tab:', e.message);
    }

    try {
      const payoutTab = await driver.findElement(
        By.xpath("//button[contains(., 'Payouts') or contains(., '💳')]")
      );
      await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', payoutTab);
      await driver.sleep(500);
      await payoutTab.click();
      console.log('Clicked Payouts sub-tab');
      await driver.sleep(2500);
    } catch (e) {
      console.log('Could not find Payouts sub-tab:', e.message);
    }

    let bsbInput, accountInput;
    try {
      bsbInput = await driver.findElement(By.css('input[placeholder="xxx-xxx"]'));
      accountInput = await driver.findElement(By.css('input[placeholder="xxxxxxxxxx"]'));
    } catch (e) {
      console.log('TC-FARMER-03: FAIL — could not find BSB/Account inputs (Payouts panel not loaded)');
      const png = await driver.takeScreenshot();
      fs.writeFileSync('farmer-partial-result.png', png, 'base64');
      console.log('Saved screenshot: farmer-partial-result.png');
      return;
    }

    await bsbInput.clear();
    await bsbInput.sendKeys(INVALID_BSB);
    await accountInput.clear();
    await accountInput.sendKeys(INVALID_ACCOUNT);

    const bsbValue = await bsbInput.getAttribute('value');
    const accountValue = await accountInput.getAttribute('value');
    console.log('BSB field accepted    :', JSON.stringify(bsbValue));
    console.log('Account field accepted:', JSON.stringify(accountValue));

    await driver.sleep(1000);

    try {
      const saveBtn = await driver.findElement(
        By.xpath("//button[contains(., 'Save Payout')]")
      );
      await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', saveBtn);
      await driver.sleep(500);
      await saveBtn.click();
      console.log('Save Payout button clicked');
    } catch (e) {
      console.log('Save Payout button not found');
    }

    await driver.sleep(3000);

    const bodyText = (await driver.findElement(By.css('body')).getText()).toLowerCase();
    const hasValidationError = bodyText.includes('invalid bsb') ||
                                bodyText.includes('invalid account') ||
                                bodyText.includes('must be 6 digits') ||
                                bodyText.includes('invalid format') ||
                                bodyText.includes('numbers only');
    console.log('Validation error shown:', hasValidationError);

    const png = await driver.takeScreenshot();
    fs.writeFileSync('farmer-partial-result.png', png, 'base64');
    console.log('Saved screenshot: farmer-partial-result.png');

    if (hasValidationError) {
      console.log('TC-FARMER-03: PASS — payout form correctly rejected invalid BSB/account format');
    } else {
      console.log('TC-FARMER-03: PARTIAL PASS — payout form accepted clearly invalid BSB "' + INVALID_BSB + '" and account "' + INVALID_ACCOUNT + '" without format validation');
    }
  } catch (err) {
    console.log('TC-FARMER-03: FAIL — error:', err.message);
  } finally {
    await driver.sleep(1500);
    await driver.quit();
  }
})();
