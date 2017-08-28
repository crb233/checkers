
# Checkers Project JSON Specifications

This document standardizes the format and type of objects and data being used
by this Checkers project. Such objects are used by the database, server, and
client for different tasks within the system and among different components.

Each field is given a value which specifies its expected type. These types are
represented by the following tokens:
- STRING: a JavaScript string
- INT: a JavaScript number (more specifically, and integer number)
- BOOL: a JavaScript boolean
- ID: a JavaScript string which represents a unique database identifier
- X_OBJECT: a reference to X_OBJECT which is also specified in this document

Additionally, if there is no specified length of an array of objects, repeating
patterns will be specified with ellipsis `...`.

### PLAYER_OBJECT
```javascript
{
    "player_id": ID,
    "player_name": STRING,
    "player_number": INT,
    "game_id": ID,
    "last_request": INT,
    "new_messages": [
        MESSAGE_OBJECT,
        MESSAGE_OBJECT,
        MESSAGE_OBJECT
    ]
}
```

### GAME_OBJECT
```javascript
{
    "game_id": ID,
    "public": BOOL,
    "active": BOOL,
    "player_names": [STRING, STRING],
    "player_pieces": [INT, INT],
    "timer": INT,
    "turn": INT,
    "board": BOARD_OBJECT
}
```

### BOARD_OBJECT
Must be an Array of length 8 whose elements are Arrays of length 8. Outer Array
contains rows of pieces (where index 0 is on the side of player 0 and index 7 is
on the side of player 1). Inner array contains pieces within a row.
```javascript
[
    [PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT],
    [PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT],
    [PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT],
    [PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT],
    [PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT],
    [PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT],
    [PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT],
    [PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT, PIECE_OBJECT],
]
```

### PIECE_OBJECT
Can be null to represent the lack of a piece.
```javascript
{
    "player": INT,
    "king": BOOL
}
```

### MESSAGE_OBJECT
```javascript
{
    "type": "join/forfeit/request_draw/accept_draw/reject_draw/pause/resume",
    "text": STRING,
}
```

### POSITION_OBJECT
```javascript
[
    INT,
    INT
]
```

### GET_GAMES_REQUEST
```javascript
{}
```

### GET_GAMES_RESPONSE
```javascript
[
    GAME_OBJECT,
    GAME_OBJECT,
    ...
]
```

### NEW_GAME_REQUEST
```javascript
{
    "player_name": STRING,
    "public": BOOL
}
```

### NEW_GAME_RESPONSE
```javascript
{
    "player": PLAYER_OBJECT,
    "game": GAME_OBJECT
}
```

### JOIN_GAME_REQUEST
```javascript
{
    "player_name": STRING,
    "game_id": ID
}
```

### JOIN_GAME_RESPONSE
```javascript
{
    "player": PLAYER_OBJECT,
    "game": GAME_OBJECT
}
```

### MAKE_MOVE_REQUEST
```javascript
{
    "player_id": ID,
    "move": [
        POSITION_OBJECT,
        POSITION_OBJECT,
        ...
    ]
}
```

### MAKE_MOVE_RESPONSE
```javascript
{
    "game": GAME_OBJECT
}
```

### GET_UPDATES_REQUEST
```javascript
{
    "player_id": ID
}
```

### GET_UPDATES_RESPONSE
```javascript
{
    "game": GAME_OBJECT,
    "messages": [
        MESSAGE_OBJECT,
        MESSAGE_OBJECT,
        MESSAGE_OBJECT
    ]
}
```

### SEND_MESSAGE_REQUEST
```javascript
{
    "player_id": ID,
    "message": MESSAGE_OBJECT
}
```

### SEND_MESSAGE_RESPONSE
```javascript
{}
```
