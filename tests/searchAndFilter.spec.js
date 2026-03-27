const {test, expect} = require("@playwright/test")

test("Search and Filter", async function ({page}){
    await page.goto("https://stage2-www.zumiez.com")

    //Search term to use in the search, assumes at least 1 result
    const searchTerm = "skateboard"

    //Enter search term in search field
    //await page.locator('input.SearchField-Input').fill(searchTerm)
    await page.getByLabel('Search').first().fill(searchTerm)

    //Ensure focus is on search field, then press enter to search
    await page.getByLabel('Search').first().focus()
    await page.keyboard.press('Enter')

    //Check URL to see if search ran
    const searchUrlRegEx = new RegExp(String.raw`search\/${searchTerm.replaceAll(" ","%20")}`) //the replaceAll accounts for any spaces in search term
    await expect(page).toHaveURL(searchUrlRegEx)

    //Check search results header to double check header reflects correct search term
    await expect(page.getByRole('heading').filter({hasText: "Search results for:"})).toContainText(searchTerm)

    //Check # of items found, should be greater than 0 based on assumption for search term
    //Note: text is still "items found" even if only 1 item is found
    await expect(page.getByText("items found")).toHaveText(/[1-9][0-9]*/)

    //Filter search results
    //Await the first checkbox to have a "(<number>)", as that will be the first filter checkbox
    await expect(page.locator('label.Field-CheckboxLabel').locator('div').nth(1)).toHaveText(/([1-9][0-9]*)/)
    //Grab name of and number of items for filter
    const filterTitle = await page.locator('label.Field-CheckboxLabel').locator('div').nth(1).allTextContents()
    const filtArr = filterTitle.toString().split("(")
    const filtName=filtArr[0]
    const numFiltRes = filtArr[1].substring(0,filtArr[1].length-1)

    // Check the first checkbox on the page (tends to be filter)
    await page.locator('input[type="checkbox"]').first().check()

    //Check URL for customFilters
    await expect(page).toHaveURL(/customFilters/)

    //Check Now Shopping by
    await expect(page.locator('h3.ResetAttributes-Title')).toHaveText("Now shopping by:")
    await expect(page.locator('.ResetAttributes-AttributeOption')).toHaveText(filtName)

    //Sanity check number of results based on # results from clicked checkbox
    await expect(page.getByText("items found")).toContainText(numFiltRes)
})