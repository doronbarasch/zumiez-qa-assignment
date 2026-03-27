class BasePage {
    //Construct the base page and its locators
    constructor(page) {
        this.page = page
        this.searchBar="#search-field"
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
}

module.exports=BasePage;