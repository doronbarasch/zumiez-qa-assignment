const {test, expect} = require("@playwright/test")
const BasePage=require("../pages/basepage")
const SearchResultsPage = require("../pages/searchresultspage")

test("Search and Filter", async function ({page}){
    //Go to the stage 2 website
    await page.goto("https://stage2-www.zumiez.com")

    //Initialize the base page model
    const basePage = new BasePage(page)

    //Search term to use in the search, assumes at least 1 result
    const searchTerm = "skateboard"

    //Search for product using provided search term
    await basePage.searchForProduct(searchTerm)

    //Make searchResultsPage since now we are on a search results page
    const searchResultsPage = new SearchResultsPage(page,searchTerm)
    
    //Check URL to see if search ran
    await searchResultsPage.verifySearchUrl()

    //Check search results header to double check header reflects correct search term
    await searchResultsPage.verifySearchHeading()

    //Check # of items found, should be greater than 0 based on assumption for search term
    await searchResultsPage.verifyItemsFound()

    //Filter search results
    //Await the first checkbox to have a "(<number>)", as that will be the first filter checkbox
    //Doing this to also try and avoid any race conditions
    await searchResultsPage.verifyFilterExists()

    //Grab name of and number of items for filter
    const {filtName, numFiltRes} = await searchResultsPage.getFirstFiltNameNum()

    // Check the first checkbox on the page (tends to be filter)
    await searchResultsPage.applyFirstFilter()

    /*Intentionally leaving the below verifications out of POM for now
      because I'm not sure they should be included in the SearchResultsPage
      class bc of how filtering works. In other words, I feel like filtered
      search results is a bit of a gray area for still being a searchResults
      page vs being a new type of page*/
    //Check URL for customFilters
    await expect(page).toHaveURL(/customFilters/)

    //Check Now Shopping by
    await expect(page.locator('h3.ResetAttributes-Title')).toHaveText("Now shopping by:")
    await expect(page.locator('.ResetAttributes-AttributeOption')).toHaveText(filtName)

    //Sanity check number of results based on # results from clicked checkbox
    await expect(page.getByText("items found")).toContainText(numFiltRes)
})