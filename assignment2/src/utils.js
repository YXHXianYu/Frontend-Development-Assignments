import * as cp from './components.js'
import g_context from './global_context.js'
import * as settings from './settings.js'

/* Utils */

export function createElement(entity, tag, cls, content) {
    const debug_tool = g_context.component_lists_values('DebugToolComponent').next().value

    const new_element = document.createElement(tag)
    new_element.className = cls
    new_element.textContent = content
    new_element.style.color = debug_tool.is_enable ? 'black' : 'transparent'

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

const COLLISION_BOUNCE_BAIS = 1
export function collisionBounce(hitbox, transform, obs_hitbox, obs_transform) {
    const d_right = obs_transform.x + obs_hitbox.width - transform.x 
    const d_left = transform.x - obs_transform.x + hitbox.width
    const d_bottom = obs_transform.y + obs_hitbox.height - transform.y
    const d_top = transform.y - obs_transform.y + hitbox.height

    if (d_right > 0 && d_right < d_left && d_right < d_bottom && d_right < d_top) {
        transform.x += d_right + COLLISION_BOUNCE_BAIS
    }
    if (d_left > 0 && d_left < d_right && d_left < d_bottom && d_left < d_top) {
        transform.x -= d_left + COLLISION_BOUNCE_BAIS
    }
    if (d_bottom > 0 && d_bottom < d_top && d_bottom < d_right && d_bottom < d_left) {
        transform.y += d_bottom + COLLISION_BOUNCE_BAIS
    }
    if (d_top > 0 && d_top < d_bottom && d_top < d_right && d_top < d_left) {
        transform.y -= d_top + COLLISION_BOUNCE_BAIS
    }
    console.log('Bounce: ' + d_right + ' ' + d_left + ' ' + d_bottom + ' ' + d_top)
}

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
                // TODO: Game Over
                removeEntity(entity)
            }
        }
        // Player碰到Bullet直接死亡
        if ('ObstacleComponent' in hitbox.entity) {
            collisionBounce(player_hitbox, player_transform, hitbox, hitbox.entity['TransformComponent'])
        }
    })

    // render
    let renderable = new cp.RenderableComponent(entity, './assets/me1.png', 102 / 2, 126 / 2, 0, -21)
}

export function createEnemy(x, y, v_x, v_y) {
    let entity = createElement(document.querySelector('.entity'), 'div', 'enemy', 'enemy')
    let enemy = new cp.EnemyComponent(entity)
    let enemy_transform = new cp.TransformComponent(entity, x, y)
    let enemy_move = new cp.MoveComponent(entity, v_x, v_y)
    let enemy_hitbox = new cp.HitboxComponent(entity, 40, 40)
    let enemy_hp = new cp.HitPointComponent(entity, 1)

    // hitbox
    enemy_hitbox.event_emitter.on('collide', function(hitbox) {
        // Enemy碰到Player直接死亡（不计分）
        if ('PlayerComponent' in hitbox.entity) { // Enemy - Player
            removeEntity(entity)
        }
        // Enemy碰到Bullet掉血，死亡则计分
        if ('BulletComponent' in hitbox.entity) { // Enemy - Bullet
            enemy_hp.hp -= 1
            if (enemy_hp.hp <= 0) {
                removeEntity(entity)
                // TODO: Score +1
            }
        }
        // Enemy碰到Obstacle直接死亡（不计分）
        if ('ObstacleComponent' in hitbox.entity && hitbox.entity['ObstacleComponent'].is_effect_on_npc) {
            removeEntity(entity)
        }
    })

    // render
    let renderable = new cp.RenderableComponent(entity, './assets/enemy1.png', 57, 43, 20, -9)
}

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
        }
        // Bullet碰到Obstacle直接消失
        if ('ObstacleComponent' in hitbox.entity && hitbox.entity['ObstacleComponent'].is_effect_on_npc) {
            removeEntity(entity)
        }
    })

    // render
    let renderable = new cp.RenderableComponent(entity, './assets/bullet1.png', 5, 11, 20, 3)
}

export function createObstacle(x, y, hitbox_width, hitbox_height, is_effect_on_npc) {
    let entity = createElement(document.querySelector('.entity'), 'div', 'obstacle', 'obstacle')
    let obstacle = new cp.ObstacleComponent(entity, is_effect_on_npc)
    let obstacle_transform = new cp.TransformComponent(entity, x, y)
    let obstacle_hitbox = new cp.HitboxComponent(entity, hitbox_width, hitbox_height)

    // obstacle_hitbox.event_emitter.on('collide', function(hitbox) {})
}