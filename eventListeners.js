addEventListener("keydown", (event) => {
    switch(event.key){
        case "w":
            playerMoveUp = true;
            break;
        case "s":
            playerMoveDown = true;
            break;
        default:
            break;
    }
});

addEventListener("keyup", (event) => {
    switch(event.key){
        case "w":
            playerMoveUp = false;
            break;
        case "s":
            playerMoveDown = false;
            break;
        default:
            break;
    }
});