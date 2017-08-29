# Changelog

All notable changes to this project will be documented in this file.
The style and format of each version of this changelog is shown below:

```
## version number
- changed this to that
- added this
- removed that
- fixed bug #number
```
## 0.9.0
- added sound notification when player makes a move
- played a full game that tested all the functionalities
- played a game with a player in another continent to test network latency
- finalized json specs and added object description
- fixed bug #25
- fixed #26
- added refresh button to pull list of public active games #27


## 0.8.0
- added win condition
- fixed timer issue
- further testing of endpoints
- tested cases in the test document
- fixed bug #22

## 0.7.0
- fixed jump validation
- tested and tuned request_draw(), accept_draw(), reject_draw(), forfeit()
- beautifyedg and fixed the GUI
- further testing of endpoints
- fixed #10

## 0.6.0
- tested move validation
- added GUI elements to the board side menu
- implemented request_draw(), accept_draw(), reject_draw(), forfeit()
- implemented pause for both players
- further testing of endpoints
- fixed a few server bugs
- fixed information display missing data, bug #16

## 0.5.0
- tested makeMove()
- tested validateMove(), validJump() and validStep() to checkers.js
- added timer for each player
- fired up the DB and tested some entries
- added game instructions to the paused screen
- connected endpoints: new-game, join-game, get-games

## 0.4.0
- added validateMove() and makeMove() to checkers.js
- added validJump() and validStep() to checkers.js
- added correctDirection(), isDiagonal(), and findDistance() to checkers.js

## 0.3.0
- linked the send-message endpoint
- linked the get-updates endpoint
- linked the make-move endpoint
- linked the join-game endpoint
- linked the new-game endpoint to the database
- linked the get-games endpoint to the database
- added json specs

## 0.2.0
- added checkers.js
- added clientManager.js for managing client-side functionality
- added board.html, a basic checkers board page
- added index.html, a basic client side GUI
- added requestManager.js for managing request endpoints
- added databaseManager.js for managing the connection to the database
- added app.js, a basic front-end server
- removed open.js due to compatibility issues


## 0.1.0
- installed and configured eslint
- added open.js to open the coverage file
- updated the README
- added this CHANGELOG
- reorganized the directory structure
- added package-lock.json (for npm dependencies)
- added package.json (for project info and npm dependencies)

## 0.0.0
- added Checkers Requirements Specification.docx
- initial commit
