
const GAME_SIZE = 32

// @ts-ignore
const game = new Game({
    maxUpdatesPerSec: 10,
    element: document.getElementById('game'),
    size: GAME_SIZE,
    baseColor: '#2d2d2d',
    colors: {
        'red': '#f94144',
        'darkOrange': '#f3722c',
        'orange': '#f8961e',
        'yellow': '#f9c74f',
        'green': '#90be6d',
        'aqua': '#43aa8b',
        'blue': '#577590'
    },
    inputs: ['up', 'down', 'left', 'right', 'space'], // Inputs we want to track
    create,
    update,
    end
})
game.start()


function create(game){
    console.log(game)

    const randPos = game.randomPosition()
    const player = {
        x: randPos[0],
        y: randPos[1],
        color: game.colors.green,
        attackCooldown: 500,
        lastAttack: 0
    }
    game.set('player', player)
    game.set('zombies', [...new Array(30)].map(i => generateZombie(game)))
    game.set('projectiles', [])

}

function end(game){}

function update(game){
    // Clear the canvas
    game.clearDots()

    // Extract game state
    const player = game.get('player')
    const zombies = game.get('zombies')
    const projectiles = game.get('projectiles')
    const { up, down, left, right, space } = game.inputs
    const now = game.now

    // Handle attack input
    if(space && ready(player.lastAttack, now, player.attackCooldown)){
        player.lastAttack = now

        // Execute attack
        for(let i=0;i<4;i++){
            projectiles.push(
                createProjectile(player.x, player.y, game.colors.blue, 
                    i == 0? 'up' : i == 1? 'down' : i == 2? 'left' : 'right'   
                )
            )
        }
        
    }

    // Update projectiles
    for(const proj of projectiles){
        if(proj.dead){ continue; }

        // If on wall, flag for despawning
        if(isWall(proj.x, proj.y)){
            proj.dead = true
        }

        // Move projectile
        moveEntity(proj, proj.direction)
    }
    // Remove dead projectiles
    const deadProjectiles = projectiles.filter(p => p.dead)
    for(const proj of deadProjectiles){
        projectiles.splice(
            projectiles.indexOf(proj), 1
        )
    }

    // Update zombies
    for(const zomb of zombies){
        // Update zombie position (if ready)
        if(ready(zomb.lastMove, now, zomb.moveCooldown)){
            const direction = getRandDirection()
            moveEntity(zomb, direction)
            zomb.lastMove = now
        }

        // Update zomb color
        // zomb.color = zomb.color == game.colors.red? game.colors.darkOrange : game.colors.red
    }

    // Update player position
    moveEntity(player, { up, down, left, right })

    // Update player color
    player.color = player.color == game.colors.green? game.colors.aqua : game.colors.green

    // Draw projectiles
    for(const proj of projectiles){
        game.setDot(proj.x, proj.y, proj.color)
    }

    // Draw zombies
    for(const zomb of zombies){
        game.setDot(zomb.x, zomb.y, zomb.color)
    }

    // Draw player
    game.setDot(player.x, player.y, player.color)
}



function createProjectile(x, y, color, direction){
    return {
        x,
        y,
        color,
        direction,
        dead: false
    }
}
function ready(lastTrigger, currentTime, cooldown){
    return (currentTime - lastTrigger) > cooldown
}
function generateZombie(game){
    const pos = getRandWallPos(game)
    return {
        x: pos[0],
        y: pos[1],
        color: game.colors.red,
        moveCooldown: 1000,
        lastMove: 0
    }
}
function getRandWallPos(game){
    let x, y
    const wall = game.utils.randBetween(1, 4)
    if(wall == 1){ x = 1, y = game.utils.randBetween(1, GAME_SIZE) }
    else if(wall == 2){ x = GAME_SIZE, y = game.utils.randBetween(1, GAME_SIZE) }
    else if(wall == 3){ x = game.utils.randBetween(1, GAME_SIZE), y = 1 }
    else if(wall == 4){ x = game.utils.randBetween(1, GAME_SIZE), y = GAME_SIZE }
    return [x, y]
}
function getRandDirection(){
    const n = game.utils.randBetween(1, 4)
    switch(n){
        case 1: return 'up'
        case 2: return 'down'
        case 3: return 'left'
        case 4: return 'right'
    }
}
function moveEntity(entity, directions){
    if(typeof directions == 'string'){
        if(directions == 'up') entity.y = game.utils.clamp(entity.y - 1, 1, GAME_SIZE)
        if(directions == 'down') entity.y = game.utils.clamp(entity.y + 1, 1, GAME_SIZE)
        if(directions == 'left') entity.x = game.utils.clamp(entity.x - 1, 1, GAME_SIZE)
        if(directions == 'right') entity.x = game.utils.clamp(entity.x + 1, 1, GAME_SIZE)
        return
    }
    const { up, down, left, right } = directions
    if(up) entity.y = game.utils.clamp(entity.y - 1, 1, GAME_SIZE)
    if(down) entity.y = game.utils.clamp(entity.y + 1, 1, GAME_SIZE)
    if(left) entity.x = game.utils.clamp(entity.x - 1, 1, GAME_SIZE)
    if(right) entity.x = game.utils.clamp(entity.x + 1, 1, GAME_SIZE)
}
function isWall(x, y){
    return x == 1 || y == 1 || x == GAME_SIZE || y == GAME_SIZE
}