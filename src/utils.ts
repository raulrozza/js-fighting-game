export function rectangularCollision({
    rectangle1,
    rectangle2,
}: Record<string, any>) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
            rectangle2.position.x &&
        rectangle1.attackBox.position.x <=
            rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
            rectangle2.position.y &&
        rectangle1.attackBox.position.y <=
            rectangle2.position.y + rectangle2.height
    );
}

export function determineWinner({
    player,
    enemy,
    timerId,
}: Record<string, any>) {
    clearTimeout(timerId);
    const textElement = document.querySelector('#displayText') as any;
    textElement.style.display = 'flex';
    if (player.health === enemy.health) {
        textElement.innerHTML = 'Tie';
    } else if (player.health > enemy.health) {
        textElement.innerHTML = 'Player 1 Wins';
    } else if (player.health < enemy.health) {
        textElement.innerHTML = 'Player 2 Wins';
    }
}

let timer = 60;
let timerId: number;
export function decreaseTimer({ player, enemy }: Record<string, any>) {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        (document.querySelector('#timer') as any).innerHTML = timer;
    }

    if (timer === 0) {
        determineWinner({ player, enemy, timerId });
    }
}
