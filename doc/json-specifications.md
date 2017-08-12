
## PLAYER_OBJECT
```javascript
{
    "player_id": ID,
    "player_name": STRING,
    "player_number": INT,
    "game_id": ID,
    "opponent_id": ID,
    "last_request": INT,
    "new_messages": [
        MESSAGE_OBJECT,
        MESSAGE_OBJECT,
        MESSAGE_OBJECT
    ]
}
```

## GAME_OBJECT
```javascript
{
    "game_id": ID,
    "player_names": [STRING, STRING],
    "player_colors": [STRING, STRING],
    "turn": INT,
    "public": BOOL,
    "active": BOOL,
    "board": [
        // player 0 side
        [{"player": INT, "king": BOOL}, {"player": INT, "king": BOOL}, null, null, null, null, null, null],
        [{"player": INT, "king": BOOL}, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        // player 1 side
    ]
}
```

## MESSAGE_OBJECT
```javascript
{
    "type": "player_join/forfeit/request_draw/accept_draw/reject_draw",
    "text": STRING,
}
```

## NEW_GAME_REQUEST
```javascript
{
    "player_name": STRING,
    "public": BOOL
}
```

## NEW_GAME_RESPONSE
```javascript
{
    "player": PLAYER_OBJECT,
    "game": GAME_OBJECT
}
```

## JOIN_GAME_REQUEST
```javascript
{
    "player_name": STRING,
    "game_id": ID
}
```

## JOIN_GAME_RESPONSE
```javascript
{
    "player": PLAYER_OBJECT,
    "game": GAME_OBJECT
}
```

## MAKE_MOVE_REQUEST
```javascript
{
    "player_id": ID,
    "move": [
        [INT, INT],
        [INT, INT],
        [INT, INT],
    ]
}
```

## MAKE_MOVE_RESPONSE
```javascript
{
    "success": BOOL,
    "game": GAME_OBJECT
}
```

## GET_UPDATES_REQUEST
```javascript
{
    "player_id": ID
}
```

## GET_UPDATES_RESPONSE
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

## SEND_MESSAGE_REQUEST
```javascript
{
    "player_id": ID,
    "message": MESSAGE_OBJECT
}
```
