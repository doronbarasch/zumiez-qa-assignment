const {test, expect} = require("@playwright/test")

//This test currently is based on the assumption that the result for the 386505 SKU has options in stock
test("Detail and Add to Cart w/ Options", async function({page}){
    await page.goto("https://stage2-www.zumiez.com")

    //Search term to use in the search, assumes at least 1 result
    const searchTerm = "386505"

    //Enter search term in search field
    await page.locator('input.SearchField-Input').fill(searchTerm)

    //Ensure focus is on search field, then press enter to search
    await page.locator('input.SearchField-Input').focus()
    await page.keyboard.press('Enter')

    //Click the product card
    await page.locator('div.ProductCard-LinkInnerWrapper.ProductCard-LinkInnerWrapper_loaded').first().click()

    //This await is necessary in order to ensure we the list of product options to iterate over
    /*Right now, this regex only works with size field sets. Could expand regex to include color
    /but unnecessary in cases where we don't care about iterating over the actual options*/
    await expect(page.locator('.ProductAttributeValue-String').first()).toHaveText(/(S)*(M\b)*(L)*(XL)*(XXL)*(3XL)*(One Size)*/)

    //Iterate through enabled product options, select the last enabled one
    for(const row of await page.locator('.ProductAttributeValue-String').filter({hasText: /(S)*(M\b)*(L)*(XL)*(XXL)*(3XL)*(One Size)*/}).all()) {
        const isDisabled = !(await row.isEnabled())
        if (!isDisabled) {
            await row.click()
        }
    }

    //Add item to cart, assume possible
    await page.getByRole('button').filter({hasText: ("ADD TO MY BAG")}).click()

    //Grab values from page to double check against item in mini cart
    const prodName = await page.locator('h1.ProductActions-Title').allTextContents()
    const selectedOptionText = await page.locator('.ProductConfigurableAttributes-SelectedOptionLabel').allTextContents()

    //Confirm correct counter in cart icon, just use 1 for now
    await expect(page.locator('.Header-MinicartItemCount')).toHaveText("1")

    // Confirm correct item and option in cart
    await expect(page.locator(".CartItem-Heading")).toHaveText(prodName)
    await expect(page.locator("div[class='CartItem-Options'] span")).toContainText(selectedOptionText)

})