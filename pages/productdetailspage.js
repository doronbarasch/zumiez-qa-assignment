const BasePage = require("./basepage");
const {expect}=require("@playwright/test")

class ProductDetailsPage extends BasePage {
    //Constructor the product details page and its locators
    constructor(page) {
        super(page)
        this.firstProductAttr=page.locator('.ProductAttributeValue-String').first()
        this.productAttr=page.locator('.ProductAttributeValue-String').filter({hasText: /(S)*(M\b)*(L)*(XL)*(XXL)*(3XL)*(One Size)*/})
        this.productName=page.locator('h1.ProductActions-Title')
        this.selectedOption=undefined
        this.addToCart=page.getByRole('button').filter({hasText: ("ADD TO MY BAG")})
    }

    //Verify size options exist by checking the first size option
    //Note: calling this prevents a race condition if iterating through size options
    //Limitations: Regex only works for size based options at the moment, need diff method for colors if iterating
    async verifySizeOptions() {
        await expect(this.firstProductAttr).toHaveText(/(S)*(M\b)*(L)*(XL)*(XXL)*(3XL)*(One Size)*/)
    }

    //Iterates through and picks some enabled size-based product option
    async pickSomeEnabledOption() {
        for(const row of await this.productAttr.filter({hasText: /(S)*(M\b)*(L)*(XL)*(XXL)*(3XL)*(One Size)*/}).all()) {
            const isDisabled = !(await row.isEnabled())
            if (!isDisabled) {
                await row.click()
            }
        }
        this.selectedOption=this.page.locator('.ProductConfigurableAttributes-SelectedOptionLabel')
    }

    //Adds an item to the cart
    async addItemToCart() {
        this.addToCart.click()
        //Make sure to set the mini cart items on the base page when adding item to cart
        this.miniCartCounter=this.page.getByLabel("Items in cart").first()
        this.cartItemName=this.page.locator(".CartItem-Heading")
        //This is an assumption but I think it's always ok to set the cart item option -
        //at a cursory glance it looks like every item has an option, even if it's only one
        this.cartItemOpt=this.page.locator("div[class='CartItem-Options'] span")
    }

    //Gets the name of the product from the product page
    //Returns: name of product
    async getProdName() {
        return this.productName.allTextContents()
    }

    //Gets the selected option for the product from the product page
    //Returns: text of selected option if there is an option selected
    //Note: Returns undefined if called before pickSomeEnabledOption (or other option selector in the future)
    async getSelectedOption() {
        return this.selectedOption.allTextContents()
    }
}

module.exports=ProductDetailsPage