// login-partial.test.js — Selenium test for the Login module 


const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');

(async function loginPartialTest() {
  const driver = await new Builder().forBrowser('chrome').build();

  await driver.manage().window().setRect({ width: 1440, height: 900 });
const PERFORMANCE_THRESHOLD_MS = 100;
  

  const EMAIL = 'buyer' + '@' + 'test.com';
  const PASSWORD = 'test123';

  try {
    await driver.get('http://localhost:3000/login');

    const emailBox = await driver.wait(
      until.elementLocated(By.css('input[type="email"]')), 10000
    );
    await emailBox.sendKeys(EMAIL);
    await driver.findElement(By.css('input[type="password"]')).sendKeys(PASSWORD);

    const urlBefore = await driver.getCurrentUrl();
    console.log('URL before click:', urlBefore);

    const signInBtn = await driver.findElement(
      By.xpath("//button[contains(., 'Sign In →') or contains(., 'Sign In \\u2192')]")
    );
    await driver.executeScript('arguments[0].scrollIntoView({block: "center"});', signInBtn);
    await driver.sleep(500);

   
    const startTime = Date.now();
    await driver.executeScript('arguments[0].click();', signInBtn);

    let loginSucceeded = false;
    try {
      await driver.wait(async () => {
        const url = await driver.getCurrentUrl();
        return !url.endsWith('/login');
      }, 10000);
      loginSucceeded = true;
    } catch (e) {
      loginSucceeded = false;
    }
  
    const elapsedMs = Date.now() - startTime;

    const urlAfter = await driver.getCurrentUrl();
    console.log('URL after click :', urlAfter);
    console.log('Login took      :', elapsedMs, 'ms');

    const png = await driver.takeScreenshot();
    fs.writeFileSync('login-partial-result.png', png, 'base64');
    console.log('Saved screenshot: login-partial-result.png');

    if (!loginSucceeded) {
      console.log('TC-LOGIN-03: FAIL — login did not complete, URL still', urlAfter);
    } else if (elapsedMs >= PERFORMANCE_THRESHOLD_MS) {
      console.log(
        'TC-LOGIN-03: PARTIAL PASS — login succeeded (navigated to ' + urlAfter +
        ') but took ' + elapsedMs + 'ms, which exceeds the ' +
        PERFORMANCE_THRESHOLD_MS + 'ms performance threshold'
      );
    } else {
      console.log(
        'TC-LOGIN-03: PASS — login succeeded in ' + elapsedMs + 'ms (under ' +
        PERFORMANCE_THRESHOLD_MS + 'ms threshold), navigated to ' + urlAfter
      );
    }

    await driver.sleep(2000);
  } catch (err) {
    console.log('TC-LOGIN-03: FAIL — error:', err.message);
  } finally {
    await driver.quit();
  }
})();