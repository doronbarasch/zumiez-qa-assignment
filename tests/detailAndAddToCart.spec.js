const {test, expect} = require("@playwright/test")
const BasePage=require("../pages/basepage")
const ProductDetailsPage=require("../pages/productdetailspage")

//This test currently is based on the assumption that the result for the 386505 SKU has options in stock
test("Detail and Add to Cart w/ Options", async function({page}){
    await page.goto("https://stage2-www.zumiez.com")

    const basePage = new BasePage(page)
    //Search term to use in the search, assumes at least 1 result
    const searchTerm = "386505"

    //Search for product using provided search term
    await basePage.searchForProduct(searchTerm)

    //Click the product card
    await page.locator('div.ProductCard-LinkInnerWrapper.ProductCard-LinkInnerWrapper_loaded').first().click()

    //Make productDetailsPage since we are now on a product details page
    const productDetailsPage = new ProductDetailsPage(page)
    
    //This await is necessary in order to ensure we have the list of product options to iterate over
    await productDetailsPage.verifySizeOptions()

    //Pick an enabled size option
    await productDetailsPage.pickSomeEnabledOption()

    //Grab values from page to double check against item in mini cart
    const prodName = await productDetailsPage.getProdName()
    const selectedOptionText = await productDetailsPage.getSelectedOption()

    //Add item to cart, assume possible
    await productDetailsPage.addItemToCart()

    //Confirm correct counter in cart icon, just use 1 for now
    await productDetailsPage.verifyMiniCartCount("1")

    // Confirm correct item and option in cart
    await productDetailsPage.verifyMcItemName(prodName)
    await productDetailsPage.verifyMcItemOpt(selectedOptionText)
})