import * as cp from './components.js'
import * as settings from './settings.js'
import g_context from './global_context.js'

/* Utils */

export function createElement(entity, tag, cls, content) {
    const debug_tool = g_context.component_lists_values('DebugToolComponent').next().value

    const new_element = document.createElement(tag)
    new_element.className = cls
    new_element.textContent = content
    if (entity.className === 'entity') {
        new_element.style.color = debug_tool.is_enable ? 'black' : 'transparent'
    }

    entity.appendChild(new_element)

    return new_element
}

export function assert(condition, message) {
    if (!condition) {
        throw new Error(message)
    }
}

export function removeEntity(entity) {
    let removal_buffer = g_context.component_lists_values('EntityRemovalComponent').next().value.removal_buffer
    
    removal_buffer.push(entity)
}

export function removeEntityDirectly(entity) {
    for (let component_name in cp) {
        if (component_name in entity) {
            const uuid = entity[component_name].uuid
            delete entity[component_name]
            delete g_context.component_lists[component_name][uuid]
        }
    }
    entity.remove()
}

const COLLISION_BOUNCE_COEF = 0.15
const COLLISION_BOUNCE_BAIS = 0.1
export function collisionBounce(hitbox, transform, obs_hitbox, obs_transform) {
    const d_right = obs_transform.x + obs_hitbox.width - transform.x 
    const d_left = transform.x - obs_transform.x + hitbox.width
    const d_bottom = obs_transform.y + obs_hitbox.height - transform.y
    const d_top = transform.y - obs_transform.y + hitbox.height

    if (d_right > 0 && d_right < d_left && d_right < d_bottom && d_right < d_top) {
        transform.x += d_right * COLLISION_BOUNCE_COEF + COLLISION_BOUNCE_BAIS
    }
    if (d_left > 0 && d_left < d_right && d_left < d_bottom && d_left < d_top) {
        transform.x -= d_left * COLLISION_BOUNCE_COEF + COLLISION_BOUNCE_BAIS
    }
    if (d_bottom > 0 && d_bottom < d_top && d_bottom < d_right && d_bottom < d_left) {
        transform.y += d_bottom * COLLISION_BOUNCE_COEF + COLLISION_BOUNCE_BAIS
    }
    if (d_top > 0 && d_top < d_bottom && d_top < d_right && d_top < d_left) {
        transform.y -= d_top * COLLISION_BOUNCE_COEF + COLLISION_BOUNCE_BAIS
    }
    // console.log('Bounce: ' + d_right + ' ' + d_left + ' ' + d_bottom + ' ' + d_top)
}

/* ===== Player ===== */

export function createPlayer(x, y, velocity) {
    let entity = createElement(document.querySelector('.entity'), 'div', 'player', 'player')
    let player = new cp.PlayerComponent(entity, velocity)
    let player_transform = new cp.TransformComponent(entity, x, y)
    let player_move = new cp.MoveComponent(entity, 0)
    let player_hp = new cp.HitPointComponent(entity, 1)

    // physics
    let player_hitbox = new cp.HitboxComponent(entity, 10, 10)
    player_hitbox.event_emitter.on('collide', function(hitbox) {
        // Player碰到Enemy掉血，死亡则Game Over
        if ('EnemyComponent' in hitbox.entity) { // Player - Enemy
            player_hp.hp -= 1
            if (player_hp.hp <= 0) {

                removeEntity(entity)

                // animation
                const animation_entity = createElement(document.getElementsByClassName('entity')[0], 'div', 'animation', '');
                const animation = new cp.AnimationComponent(animation_entity, player_transform.x - 10, player_transform.y, 102 / 2, 126 / 2, [
                    './assets/me_destroy_1.png',
                    './assets/me_destroy_2.png',
                    './assets/me_destroy_3.png',
                    './assets/me_destroy_4.png',
                ], 200)

                // gameover
                setTimeout(function() {
                    // set game state
                    g_context.component_lists_values('GameStateComponent').next().value.state = cp.GameStateComponent.GAME_STATE_GAMEOVER
                    
                    const score_bar = document.getElementsByClassName('score')[0]
                    score_bar.style = 'width: 100%; height: 80%; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 40px; white-space: pre-wrap; text-align: center;'
                    score_bar.textContent = 'Game Over' + '\n' + score_bar.textContent

                    const pause_button = document.getElementsByClassName('pause')[0]
                    pause_button.style.visibility = 'hidden'

                    const restart_button = document.getElementsByClassName('restart')[0]
                    score_bar.appendChild(restart_button)
                    restart_button.style = 'position: relative; top: "unset"; right: "unset"'

                }, 2000)
            }
        }
        // Player碰到Obstacle被弹开
        if ('ObstacleComponent' in hitbox.entity) {
            collisionBounce(player_hitbox, player_transform, hitbox, hitbox.entity['TransformComponent'])
        }
    })

    // render
    let renderable = new cp.RenderableComponent(entity, 102 / 2, 126 / 2, -21, 0, [
        './assets/me1.png',
        './assets/me2.png',
    ], 50)
}

/* ===== Enemy ===== */

function createEnemyDeadAnimation(x, y, type) {
    // animation
    const animation_entity = createElement(document.getElementsByClassName('entity')[0], 'div', 'animation', '');

    if (type === "enemy1") {
        const animation = new cp.AnimationComponent(animation_entity, x, y, 57, 51, [
            './assets/enemy1_down1.png',
            './assets/enemy1_down2.png',
            './assets/enemy1_down3.png',
            './assets/enemy1_down4.png',
        ], 200)
    } else if (type === "enemy2") {
        const animation = new cp.AnimationComponent(animation_entity, x, y, 69, 95, [
            './assets/enemy2_down1.png',
            './assets/enemy2_down2.png',
            './assets/enemy2_down3.png',
            './assets/enemy2_down4.png',
        ], 200)
    } else if (type === "enemy3") {
        const animation = new cp.AnimationComponent(animation_entity, x, y, 165, 260, [
            './assets/enemy3_down1.png',
            './assets/enemy3_down2.png',
            './assets/enemy3_down3.png',
            './assets/enemy3_down4.png',
            './assets/enemy3_down5.png',
            './assets/enemy3_down6.png',
        ], 600)
    }
}

function createEnemyCollisionFunction(entity, enemy, enemy_transform, enemy_hp, type) {
    return function(hitbox) {
        // Enemy碰到Player直接死亡（不计分）
        if ('PlayerComponent' in hitbox.entity) { // Enemy - Player
            removeEntity(entity)

            // animation
            createEnemyDeadAnimation(enemy_transform.x - 10, enemy_transform.y + 25)
        }
        // Enemy碰到Bullet掉血，死亡则计分
        if ('BulletComponent' in hitbox.entity) { // Enemy - Bullet
            enemy_hp.hp -= 1
            if (enemy_hp.hp <= 0) {
                removeEntity(entity)
                
                // score += 1
                g_context.component_lists_values('ScoreComponent').next().value.score += enemy.score

                // animation
                createEnemyDeadAnimation(enemy_transform.x - 10, enemy_transform.y + 25, type)
            }
        }
        // Enemy碰到Obstacle直接死亡（不计分）
        if ('ObstacleComponent' in hitbox.entity && hitbox.entity['ObstacleComponent'].is_effect_on_npc) {
            removeEntity(entity)
        }
    }
}

export function createEnemy(x, y, type) {
    let entity = createElement(document.querySelector('.entity'), 'div', 'enemy', 'enemy')
    let enemy
    let enemy_transform = new cp.TransformComponent(entity, x, y)
    let enemy_move
    let enemy_hitbox
    let enemy_hp
    let renderable

    if (type === "enemy1") {
        enemy = new cp.EnemyComponent(entity, 1)
        enemy_move = new cp.MoveComponent(entity, 0, settings.ENEMY_VELOCITY)
        enemy_hitbox = new cp.HitboxComponent(entity, 40, 40)
        enemy_hp = new cp.HitPointComponent(entity, 1)

        renderable = new cp.RenderableComponent(entity, 57, 43, -9, 20, ['./assets/enemy1.png', './assets/enemy1_1.png'], 150)
    } else if (type === "enemy2") {
        enemy = new cp.EnemyComponent(entity, 3)
        enemy_move = new cp.MoveComponent(entity, 0, settings.ENEMY_VELOCITY * 0.5)
        enemy_hitbox = new cp.HitboxComponent(entity, 50, 100)
        enemy_hp = new cp.HitPointComponent(entity, 3)

        renderable = new cp.RenderableComponent(entity, 69, 99, -9, 20, ['./assets/enemy2.png', './assets/enemy2_1.png'], 150)
    } else if (type === "enemy3") {
        enemy = new cp.EnemyComponent(entity, 20)
        enemy_move = new cp.MoveComponent(entity, 0, settings.ENEMY_VELOCITY * 0.2)
        enemy_hitbox = new cp.HitboxComponent(entity, 150, 250)
        enemy_hp = new cp.HitPointComponent(entity, 20)

        renderable = new cp.RenderableComponent(entity, 169, 258, -9, 20, ['./assets/enemy3_n1.png', './assets/enemy3_n2.png'], 150)
    }

    // hitbox
    enemy_hitbox.event_emitter.on('collide', createEnemyCollisionFunction(entity, enemy, enemy_transform, enemy_hp, type))
}

/* ===== Bullet ===== */

export function createBullet(x, y, v_x, v_y) {
    let entity = createElement(document.querySelector('.entity'), 'div', 'bullet', 'bullet')
    let bullet = new cp.BulletComponent(entity)
    let bullet_transform = new cp.TransformComponent(entity, x, y)
    let bullet_move = new cp.MoveComponent(entity, v_x, v_y)
    let bullet_hitbox = new cp.HitboxComponent(entity, 10, 10)

    // physics
    bullet_hitbox.event_emitter.on('collide', function(hitbox) {
        // Bullet碰到Enemy直接消失
        if ('EnemyComponent' in hitbox.entity) { // Bullet - Enemy
            removeEntity(entity)

            // animation
            const animation_entity = createElement(document.getElementsByClassName('entity')[0], 'div', 'animation', '');
            const animation = new cp.AnimationComponent(animation_entity, bullet_transform.x - 10, bullet_transform.y, 43, 38, [
                './assets/enemy1_down4.png',
            ], 50)
        }
        // Bullet碰到Obstacle直接消失
        if ('ObstacleComponent' in hitbox.entity && hitbox.entity['ObstacleComponent'].is_effect_on_npc) {
            removeEntity(entity)
        }
    })

    // render
    let renderable = new cp.RenderableComponent(entity, 5, 11, 3, 20, ['./assets/bullet1.png'], 1000)
}

/* ===== Obstacle ===== */

export function createObstacle(x, y, hitbox_width, hitbox_height, is_effect_on_npc) {
    let entity = createElement(document.querySelector('.entity'), 'div', 'obstacle', 'obstacle')
    let obstacle = new cp.ObstacleComponent(entity, is_effect_on_npc)
    let obstacle_transform = new cp.TransformComponent(entity, x, y)
    let obstacle_hitbox = new cp.HitboxComponent(entity, hitbox_width, hitbox_height)

    // obstacle_hitbox.event_emitter.on('collide', function(hitbox) {})
}

/* ===== Item ===== */

export function createItem(x, y, type) {
    const entity = createElement(document.querySelector('.entity'), 'div', 'item', 'item')
    const item = new cp.ItemComponent(entity, type)
    const item_transform = new cp.TransformComponent(entity, x, y)
    const item_move = new cp.MoveComponent(entity, 0, settings.ITEM_VELOCITY)
    const item_hitbox = new cp.HitboxComponent(entity, 40, 40)

    // physics
    item_hitbox.event_emitter.on('collide', function(hitbox) {
        // Item碰到Player直接消失
        if ('PlayerComponent' in hitbox.entity) { // Item - Player
            removeEntity(entity)

            if (type === "bullet_supply") {
                const player = g_context.component_lists_values('PlayerComponent').next().value

                player.fire_level += 1
            } else if (type == "bomb_supply") {
                // g_context.component_lists_values('BombComponent').next().value.bomb_count += 1
            }
        }
        // Item碰到Obstacle直接消失
        if ('ObstacleComponent' in hitbox.entity && hitbox.entity['ObstacleComponent'].is_effect_on_npc) {
            removeEntity(entity)
        }
    })

    // render
    if (type === "bullet_supply") {
        const renderable = new cp.RenderableComponent(entity, 58, 88, 0, 0, [
            './assets/bullet_supply.png',
        ], 100)
    } else if (type === "bomb_supply") {
        const renderable = new cp.RenderableComponent(entity, 60, 107, 0, 0, [
            './assets/bomb_supply.png',
        ], 100)
    }

}