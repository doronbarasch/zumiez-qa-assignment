# zumiez-qa-assignment
QA Engineer Assignment for Zumiez

Prerequisites:
    
    Node: v24.14.1
    
    Playwright: 1.58.2

To install:
    
    Make sure Node version matches
    
    Clone the git repository

To run:
    
    Using a terminal, navigate to the directory for the git repository
    
    For all tests enter into terminal: npx playwright test
    
    For specific test files enter into terminal: npx playwright test <filename>
    
    For specific test by title enter into terminal: npx playwright test -g "Name of specific test", e.g. npx playwright test -g "Detail and Add to Cart w/ Options"
    
The above commands will run the tests in headless mode. To run the tests in headed mode, add --headed to the end of any of the commands

To view report:
    
    After running a test, enter into terminal: npx playwright show-report
    
    Alternatively, use a file explorer to open the index.html file in the playwright-reports folder. Note that this will be the report for the most recent test run

Project Structure:
    
    Test files are located in the tests folder. The *.spec.js files contain the individual tests. For this exercise, I only wrote one test for each of the scenarios, but in an actual testing scenario it may make sense to break the tests up into smaller tests for sake of isolating issue sources (i.e. in this case, split the search and filter into a search test and a filter test).
    
    Reports are found in the playwright-report folder as noted above. Playwright generates an html file for each test run.
    
    In the top level directory, playwright.config.js contains the configuration settings for test runs. This is where browsers to run tests in can be selected, amongst other options like default timeout settings, test directory, etc.
    
    The Page Object Models are in the pages folder. There's one for the base page, which I've intended as the locators that are present on every page for the application. The next is the search results page, which is for when there's a user initiated search. And lastly, there's a product details page for use with pages for single products.

