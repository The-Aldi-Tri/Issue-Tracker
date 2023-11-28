# Issue Tracker

[![Run on Repl.it](https://replit.com/badge/github/The-Aldi-Tri/Issue-Tracker)](https://replit.com/new/github/The-Aldi-Tri/Issue-Tracker)

*You need an account on Replit


## FreeCodeCamp - Quality Assurance Certification Projects

Instructions for building the project can be found at https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/issue-tracker.


## Assignment

Build a full stack JavaScript app that is functionally similar to this: [https://issue-tracker.freecodecamp.rocks/](https://issue-tracker.freecodecamp.rocks/). Working on this project will involve you writing your code using one of the following methods:

*   Clone [this GitHub repo](https://github.com/freeCodeCamp/boilerplate-project-issuetracker/) and complete your project locally.
*   Use [our Replit starter project](https://replit.com/github/freeCodeCamp/boilerplate-project-issuetracker) to complete your project.
*   Use a site builder of your choice to complete the project. Be sure to incorporate all the files from our GitHub repo.

If you use Replit, follow these steps to set up the project:

*   Start by importing the project on Replit.
*   Next, you will see a `.replit` window.
*   Select `Use run command` and click the `Done` button.

When you are done, make sure a working demo of your project is hosted somewhere public. Then submit the URL to it in the Solution Link field. Optionally, also submit a link to your project's source code in the GitHub Link field.

---

*   Complete the necessary routes in `/routes/api.js`
*   Create all of the functional tests in `tests/2_functional-tests.js`
*   Copy the `sample.env` file to `.env` and set the variables appropriately
*   To run the tests uncomment `NODE_ENV=test` in your `.env` file
*   To run the tests in the console, use the command `npm run test`. To open the Replit console, press Ctrl+Shift+P (Cmd if on a Mac) and type "open shell"

Write the following tests in `tests/2_functional-tests.js`:

*   Create an issue with every field: POST request to `/api/issues/{project}`
*   Create an issue with only required fields: POST request to `/api/issues/{project}`
*   Create an issue with missing required fields: POST request to `/api/issues/{project}`
*   View issues on a project: GET request to `/api/issues/{project}`
*   View issues on a project with one filter: GET request to `/api/issues/{project}`
*   View issues on a project with multiple filters: GET request to `/api/issues/{project}`
*   Update one field on an issue: PUT request to `/api/issues/{project}`
*   Update multiple fields on an issue: PUT request to `/api/issues/{project}`
*   Update an issue with missing `_id`: PUT request to `/api/issues/{project}`
*   Update an issue with no fields to update: PUT request to `/api/issues/{project}`
*   Update an issue with an invalid `_id`: PUT request to `/api/issues/{project}`
*   Delete an issue: DELETE request to `/api/issues/{project}`
*   Delete an issue with an invalid `_id`: DELETE request to `/api/issues/{project}`
*   Delete an issue with missing `_id`: DELETE request to `/api/issues/{project}`
