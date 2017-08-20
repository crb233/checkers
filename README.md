# Checkers!

Our CS 451 final project hosted on [GitHub](https://github.com/crb233/checkers).
Implements a user-friendly web application for playing checkers online.

## Authors

Curtis Bechtel, Hajer Karoui, Sam Nathanson, and Julie Soderstrom

## Getting Started

To clone and set up this repository:
- `$ git clone https://github.com/crb233/checkers`
- `$ npm install`

To run tests and see test coverage:
- `$ npm test`
- Navigate to `coverage/index.html`

To lint a directory or file:
- `$ npm run -s lint file/path/here.js`

To lint all source and test files:
- `$ npm run -s lint-all`

To generate documentation:
- `$ npm run make-doc`
- Navigate to `doc/api/index.html`

To deploy this project locally:
- Set environment variables `DB_USER`, `DB_PASS`, `DB_ADDR`, and `DB_NAME`
- `$ npm start`

To deploy this project on Heroku:
- Create a free Heroku account
- Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
- `$ heroku login`
- `$ git push heroku master`

