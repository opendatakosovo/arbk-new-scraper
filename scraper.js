// Requiring puppeteer
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

// Launching browser
puppeteer
  .launch({ headless: true })
  .then(async browser => {
    // Creating a new tab
    const page = await browser.newPage();
    //Going to ARBK page
    await page.goto("https://arbk.rks-gov.net/");
    await page.type("#txtNumriBiznesit", "70301460");
    await page.click("#Submit1");
    await page.once("load", () => {
      page.click(
        "#content > article > div > table > tbody > tr > td:nth-child(2) > a"
      );
      page.once("load", () => {
        page.content().then(html => {
          let raw = {
            info: [],
            authorized: []
          };
          let formatted = {};
          const $ = cheerio.load(html);
          raw.info.push({
            key: "emri",
            value: $("#MainContent_ctl00_lblBiznesi").text()
          });
          store_raw_data(
            $,
            "#MainContent_ctl00_pnlBizneset > table:nth-child(1) > tbody > tr ",
            raw,
            "info"
          );
          store_raw_data(
            $,
            "#MainContent_ctl00_pnlBizneset > table:nth-child(2) > tbody > tr",
            raw,
            "authorized"
          );
          console.log(raw);
        });
      });
    });
  })
  .catch(error => {
    console.log(error);
  });
// "#MainContent_ctl00_pnlBizneset > table:nth-child(1) > tbody > tr "
function store_raw_data($, htmlSelector, obj, key) {
  if ($(htmlSelector).html() != null) {
    if (key == "info") {
      $(htmlSelector).each((i, elem) => {
        obj[key].push({
          key: $(elem)
            .children("td:nth-child(1)")
            .children("b")
            .text()
            .trim()
            .replace(/\s\s+/g, " "),
          value: $(elem)
            .children("td:nth-child(2)")
            .children("span")
            .text()
            .trim()
            .replace(/\s\s+/g, " ")
        });
      });
    } else if (key == "authorized") {
      $(htmlSelector).each((i, elem) => {
        obj[key].push({
          key: $(elem)
            .children("td:nth-child(1)")
            .children("span")
            .text()
            .trim()
            .replace(/\s\s+/g, " "),
          value: $(elem)
            .children("td:nth-child(2)")
            .children("span")
            .text()
            .trim()
            .replace(/\s\s+/g, " ")
        });
      });
    }
  }
}
