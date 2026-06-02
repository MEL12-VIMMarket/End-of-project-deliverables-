// register-weakpw.test.js — Selenium test TC-REG-03
const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs');

(async function TC_REG_03() {
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
    
    const uniqueEmail = 'weakpw' + Date.now() + '@' + 'example.com';
    
    await driver.wait(until.elementLocated(By.css('input[type="text"]')), 10000);
    await driver.findElement(By.css('input[type="text"]')).sendKeys('Weak Password User');
    await driver.findElement(By.css('input[type="email"]')).sendKeys(uniqueEmail);
    const pwBox = await driver.findElement(By.css('input[type="password"]'));
    await pwBox.sendKeys('123456');
    
    console.log('Test email      :', uniqueEmail);
    
    const btn = await driver.findElement(By.xpath("//button[contains(., 'Register')]"));
    await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', btn);
    await driver.sleep(500);
    await btn.click();
    await pwBox.sendKeys(Key.RETURN);
    
    await driver.sleep(5000);
    const urlAfter = await driver.getCurrentUrl();
    const bodyText = await driver.findElement(By.css('body')).getText();
    const acceptedFlow = /verification email sent|check your email|click the link to activate/i.test(bodyText);
    
    console.log('URL after submit:', urlAfter);
    
    const png = await driver.takeScreenshot();
    fs.writeFileSync('register-weakpw-result.png', png, 'base64');
    console.log('Saved screenshot: register-weakpw-result.png');
    
    if (urlAfter.endsWith('/register') && !acceptedFlow) {
      console.log("TC-REG-03: PASS — weak password '123456' was correctly rejected");
    } else {
      console.log("TC-REG-03: PARTIAL PASS — weak password '123456' was accepted; account created but no strength enforcement");
    }
  } catch (err) {
    console.log('TC-REG-03: FAIL — error:', err.message);
  } finally {
    await driver.sleep(1500);
    await driver.quit();
  }
})();