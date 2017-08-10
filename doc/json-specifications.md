
## PLAYER_OBJECT
```
{
    "player_id": ID,
    "player_name": STRING,
    "player_number": INT,
    "game_id": ID,
    "new_messages": [
        MESSAGE_OBJECT,
        MESSAGE_OBJECT,
        MESSAGE_OBJECT
    ]
}
```

## GAME_OBJECT
```
{
    "game_id": ID,
    "player_names": [STRING, STRING],
    "player_colors": [STRING, STRING],
    "turn": INT,
    "public": BOOL,
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
```
{
    "type": "forfeit/request_draw/accept_draw/message",
    "text": STRING,
}
```

## NEW_GAME_REQUEST
```
{
    "player_name": STRING,
    "public": BOOL
}
```

## NEW_GAME_RESPONSE
```
{
    "player": PLAYER_OBJECT,
    "game": GAME_OBJECT
}
```

## JOIN_GAME_REQUEST
```
{
    "player_name": STRING,
    "game_id": ID
}
```

## JOIN_GAME_RESPONSE
```
{
    "player": PLAYER_OBJECT,
    "game": GAME_OBJECT
}
```

## MAKE_MOVE_REQUEST
```
{
    "player_id": ID,
    "move": [
        [INT, INT], // from position: x, y
        [INT, INT], // to position: x, y
        [INT, INT], // to position: x, y
    ]
}
```

## MAKE_MOVE_RESPONSE
```
{
    "success": BOOL,
    "game": GAME_OBJECT
}
```

## GET_UPDATES_REQUEST
```
{
    "game_id": ID
}
```

## GET_UPDATES_RESPONSE
```
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
```
{
    "player_id": ID,
    "message": MESSAGE_OBJECT
}
```
