# Checkers!

Our CS 451 final project hosted on [GitHub](https://github.com/crb233/checkers).
Implements a user-friendly web application for playing checkers online.

## Authors

Curtis Bechtel, Hajer Karoui, Sam Nathanson, and Julie Soderstrom

## Getting Started

To clone and set up this repository:
- `$ git clone https://github.com/crb233/checkers`
- `$ npm install`
- Create a free Heroku account
- Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
- `$ heroku login`

To run tests and see test coverage:
- `$ npm test`

To lint a directory or a single JavaScript file:
- `$ npm run -s lint file/path/here.js`

To lint all source and test files:
- `$ npm run -s lint-all`

To generate JavaScript documentation:
- `$ npm run make-doc`
- Nagivate to `doc/api/index.html`

To deploy the project (only after tests and linter have succeeded):
- `$ git push heroku master`
