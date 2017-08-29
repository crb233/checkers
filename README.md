# Checkers!

Our CS 451 final project hosted on [GitHub](https://github.com/crb233/checkers).
Implements a user-friendly web application for playing checkers online.



## Authors

Curtis Bechtel, Hajer Karoui, Sam Nathanson, and Julie Soderstrom



## Notes

This project is being written as a publicly available web application with a
central server to connect players with each other.

Screenshots as proof of code coverage can be found at `doc/code_coverage/`.

Screenshots as proof of static code analysis can be found at
`doc/static_analysis/`.

Project release notes are contained in `CHANGELOG.md`

The final test case document can be found at
`doc/Checkers Test Case Document.pdf`



## Platforms and Services

The server side code is written in Node.js using NPM packages such as Express
and BodyParser. It is being hosted on [Heroku](cs-451-checkers.herokuapp.com).

The database uses MongoDB and is hosted on mLab.

The client is written in HTML, CSS, and JavaScript with the use of JQuery for
easier asynchronous HTTP requests.



## Getting Started

To clone and set up this repository (for contributors only):
- `$ git clone https://github.com/crb233/checkers`
- `$ npm install`

To run tests and see test coverage:
- `$ npm test`
- Navigate to `coverage/index.html` on a modern web browser

To lint a directory or file (static code analysis):
- `$ npm run -s lint file/path/here.js`

To lint all source and test files:
- `$ npm run -s lint-all`

To generate documentation:
- `$ npm run make-doc`
- Navigate to `doc/api/index.html` on a modern web browser

To deploy this project locally:
- Set environment variables `DB_USER`, `DB_PASS`, `DB_ADDR`, and `DB_NAME`
- `$ npm start`
- Navigate to `localhost:8080` on a modern web browser

To deploy this project on Heroku (for contributors only):
- Create a free Heroku account
- Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
- `$ heroku login`
- `$ git push heroku master`
- Navigate to `cs-451-checkers.herokuapp.com` on a modern web browser
