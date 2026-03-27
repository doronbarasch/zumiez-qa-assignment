const BasePage = require("./basepage")
const {expect}=require("@playwright/test")

class SearchResultsPage extends BasePage {
    //Construct the search results page and its locators
    constructor(page,searchTerm) {
        super(page)
        this.searchTerm=searchTerm
        this.searchHeading=page.getByRole('heading').filter({hasText: "Search results for:"})
        //Note: text is still "items found" even if only 1 item is found
        this.itemsFound=page.getByText("items found")
        this.firstFilterLabel=page.locator("(//div[@class='ProductAttributeValue-Label'])[1]")
        this.firstFilterCheckbox=page.locator('input[type="checkbox"]').first()
        //The filter related locators should only be set once a filter is active
        this.filtHeader=undefined
        this.filtName=undefined
    }

    /*VERIFIERS*/
    //Verify the URL of the page is correct based on the search term for the page
    async verifySearchUrl() {
        const searchUrlRegEx = new RegExp(String.raw`search\/${this.searchTerm.replaceAll(" ","%20")}`) //the replaceAll accounts for any spaces in search term
        await expect(this.page).toHaveURL(searchUrlRegEx)
    }

    //Verify that the search heading contains the search term
    async verifySearchHeading() {
        await expect(this.searchHeading).toContainText(this.searchTerm)
    }

    //Verify that some number of items were found by the search
    async verifyItemsFound() {
        await expect(this.itemsFound).toHaveText(/[1-9][0-9]*/)
    }

    //Verify that the first filter exists and has a number of items
    async verifyFilterExists() {
        await expect(this.firstFilterLabel).toHaveText(/([1-9][0-9]*)/)
    }

    //Verify that a filter is acitve based on the URL
    async verifyFilterUrl() {
        await expect(this.page).toHaveURL(/customFilters/)
    }

    //Verify that a filter is active based on the "Now shopping by" section
    async verifyFilterNowShoppingBy(filterName) {
        await expect(this.filtHeader).toHaveText("Now shopping by:")
        await expect(this.filtName).toHaveText(filterName)
    }

    //Verify that the number of items when clicking on the filter is same as items found
    //while filter is active
    async verifyFilterItemsFound(numFiltRes) {
        await expect(this.itemsFound).toContainText(numFiltRes)
    }

    /*GETTERS*/
    //Gets the name and number of items for the first filter on the search results page
    async getFirstFiltNameNum() {
        const filterTitle = await this.firstFilterLabel.allTextContents()
        const filtArr = filterTitle.toString().split("(")
        const filtName=filtArr[0]
        const numFiltRes = filtArr[1].substring(0,filtArr[1].length-1)
        return {filtName, numFiltRes}
    }
    
    /*ACTIONS*/
    //Apply the first filter available for the search results page
    async applyFirstFilter() {
        await this.firstFilterCheckbox.click()
        //Make sure to add locators for filter-based items
        this.filtHeader= await this.page.locator('h3.ResetAttributes-Title')
        this.filtName= await this.page.locator('.ResetAttributes-AttributeOption')
    }
}
module.exports=SearchResultsPage