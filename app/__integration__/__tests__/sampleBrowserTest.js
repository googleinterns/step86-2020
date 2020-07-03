/**
 * Example of how to create browser based integration tests.
 * "page" is exposed globally by jest-puppeteer, it represents a chrome page.
 * Its full API can be found here: https://pptr.dev/#?product=Puppeteer&version=v5.0.0&show=api-class-page
 *
 * Many times, you'll have to run code *within* the context of a page for tests.
 *  For example, checking whether certain elements exist in the dom.
 *  This can be done using page.eval, shown below.
 */

describe("Github", () => {
  beforeAll(async () => {
    await page.goto("https://github.com");
  });

  it("has header with background color rgb(36, 41, 46)", async () => {
    expect.assertions(1);

    await page.waitForSelector("header");
    console.log("here");
    const bgColor = await page.evaluate(() => {
      const header = document.querySelector("header");
      return window
        .getComputedStyle(header)
        .getPropertyValue("background-color");
    });

    /* That could also be written with this shorthand
     * const bgColor = await page.$eval("header", header => {
     *     return window.getComputedStyle(header).getPropertyValue("background-color");
     * });
     */

    expect(bgColor).toEqual("rgb(36, 41, 46)");
  });

  it("should have correct title", async () => {
    expect.assertions(1);
    const title = await page.title();
    expect(title).toEqual(
      "The world’s leading software development platform · GitHub"
    );
  });
});
