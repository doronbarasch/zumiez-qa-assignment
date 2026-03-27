const {expect}=require("@playwright/test")

class BasePage {
    //Construct the base page and its locators
    constructor(page) {
        this.page = page
        this.searchBar="#search-field"
        this.miniCartCounter=undefined //this must be set when the first item is added to cart
        this.cartItemName=undefined //This must be set when first item is added to cart
        this.cartItemOpt=undefined //This must be set when first item is added to cart
    }

    //Searches for a product using the base page locators
    //Params: searchTerm - the product search term, as a string, to search for
    async searchForProduct(searchTerm) {
        //Enter search term in search bar field
        await this.page.fill(this.searchBar,searchTerm)
        //Ensure focus is on search bar, then press enter to search
        await this.page.focus(this.searchBar)
        await this.page.keyboard.press('Enter')
    }

    //Verify that the mini cart counter has the correct expected value
    async verifyMiniCartCount(count) {
        await expect(this.miniCartCounter).toHaveText(count)
    }

    //Verify that the mini cart has the correct item name
    async verifyMcItemName(itemName) {
        await expect(this.cartItemName).toHaveText(itemName)
    }

    //Verift that the mini cart has the correct item option
    async verifyMcItemOpt(itemOption) {
        await expect(this.cartItemOpt).toContainText(itemOption)
    }
}

module.exports=BasePage;