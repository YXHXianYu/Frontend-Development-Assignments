import { g_context } from './global_context.js'

import * as cp from './components.js'

import * as util from './utils.js'

/* Systems */

export class InputSystem {
    constructor() {
        let input_state = new cp.InputStateComponent(document.body)

        document.body.addEventListener('keydown', function(event) {
            input_state.state[event.key] = true
        })
        document.body.addEventListener('keyup', function(event) {
            input_state.state[event.key] = false
        })
    }

    tick() {}
}

export class PlayerManager {
    constructor() {
        let entity = util.createElement(document.querySelector('.entity'), 'p', 'player', 'player')
        let player = new cp.PlayerComponent(entity)
        let player_transform = new cp.TransformComponent(entity, 250, 300)
        let player_move = new cp.MoveComponent(entity, 10)
        let player_hitbox = new cp.HitboxComponent(entity, 50, 50)
    }

    tick() {
        for (let player of g_context.component_lists['PlayerComponent']) {
            let entity = player.entity
            let player_transform = entity['TransformComponent']
            let player_move = entity['MoveComponent']
            let player_hitbox = entity['HitboxComponent']

            // Movement

            let input_state = g_context.component_lists['InputStateComponent'][0].state

            if (input_state['w']) {
                player_transform.y += player_move.velocity
            }
            if (input_state['s']) {
                player_transform.y -= player_move.velocity
            }
            if (input_state['a']) {
                player_transform.x -= player_move.velocity
            }
            if (input_state['d']) {
                player_transform.x += player_move.velocity
            }

            // Fire
            if (player.fire_last_tick + player.fire_cd <= g_context.tick) {
                this.fireStraight(player_transform.x + player_hitbox.width / 2, player_transform.y + player_hitbox.height)
                player.fire_last_tick = g_context.tick
            }
        }
    }

    fireStraight(x, y) {
        let entity = util.createElement(document.querySelector('.entity'), 'p', 'bullet', 'bullet')
        let bullet = new cp.BulletComponent(entity)
        let bullet_transform = new cp.TransformComponent(entity, x, y)
        let bullet_move = new cp.MoveComponent(entity, 20)
        let bullet_hitbox = new cp.HitboxComponent(entity, 20, 20)
    }
}

export class BulletManager {
    constructor() {}

    tick() {
        for (let bullet of g_context.component_lists['BulletComponent']) {
            let entity = bullet.entity
            let bullet_transform = entity['TransformComponent']
            let bullet_move = entity['MoveComponent']

            bullet_transform.y += bullet_move.velocity
        }
    }
}

export class TransformSystem {
    constructor() {}

    tick() {
        for (let transform of g_context.component_lists['TransformComponent']) {
            let entity = transform.entity
            entity.style.bottom = transform.bottom
            entity.style.left = transform.left
        }
    }
}

export class EnemyManager {
    constructor() {
    }

    tick() {
        for (let enemy of g_context.component_lists['EnemyComponent']) {
            let entity = enemy.entity
            let enemy_transform = entity['TransformComponent']
            let enemy_move = entity['MoveComponent']

            enemy_transform.y -= enemy_move.velocity
        }
    }
}

export class LevelManager {
    constructor() {
        for (let x = 150; x <= 350; x += 100) {
            this.spawn(x, 800)
        }

        let level = new cp.LevelComponent(document.body)
    }

    tick() {
        for (let level of g_context.component_lists['LevelComponent']) {

            if (level.spawn_last_tick + level.spawn_cd <= g_context.tick) {
                this.spawn(Math.random() * 500, 800)
                level.spawn_last_tick = g_context.tick
            }
        }
    }

    spawn(x, y) {
        util.createEnemy(x, y)

        console.log("Spawned enemy")
    }
}

export class PhysicsSystem {
    constructor() {}

    tick() {
        let hitbox_length = g_context.component_lists['HitboxComponent'].length
        for (let i = 0; i < hitbox_length; i++) {
            let hitbox1 = g_context.component_lists['HitboxComponent'][i]

            for (let j = i + 1; j < hitbox_length; j++) {
                let hitbox2 = g_context.component_lists['HitboxComponent'][j]

                if (this.isCollide(hitbox1, hitbox2)) {
                    console.log("Collision detected")
                    // Collision handling, using observer pattern (event emitter)
                    for (let type in hitbox1.types) {
                        hitbox2.event_emitter.emit(type, hitbox1)
                    }
                    for (let type in hitbox2.types) {
                        hitbox1.event_emitter.emit(type, hitbox2)
                    }
                }
            }
        }
    }

    isCollide(hitbox1, hitbox2) {
        let entity1 = hitbox1.entity
        let entity2 = hitbox2.entity

        let transform1 = entity1['TransformComponent']
        let transform2 = entity2['TransformComponent']

        let x1 = transform1.x
        let y1 = transform1.y
        let x2 = transform2.x
        let y2 = transform2.y

        let width1 = hitbox1.width
        let height1 = hitbox1.height
        let width2 = hitbox2.width
        let height2 = hitbox2.height

        return this.isIntersect(
            {
                x1: x1,
                x2: x1 + width1,
                y1: y1,
                y2: y1 + height1
            }, {
                x1: x2,
                x2: x2 + width2,
                y1: y2,
                y2: y2 + height2
            }
        )
    }

    isIntersect(rect1, rect2) {
        // 检查一个矩形是否在另一个矩形的左侧、右侧、上方或下方
        // 如果是，那么它们不相交
        if (rect1.x2 < rect2.x1 || rect1.x1 > rect2.x2 ||
            rect1.y2 < rect2.y1 || rect1.y1 > rect2.y2) {
            return false;
        }
        return true;
    }
}

export class RenderHitBoxSystem {
    constructor() {}

    tick() {
        for (let hitbox of g_context.component_lists['HitboxComponent']) {
            let entity = hitbox.entity
            let border = entity.querySelector('.border')
            if (border === null) {
                this.drawHitbox(entity, hitbox.width, hitbox.height)
            }
        }
    }

    drawHitbox(entity, width, height) {
        let border = document.createElement('div')

        border.className = 'border'
        border.style.position = 'relative'
        border.style.border = '1px solid red'
        border.style.bottom = height.toString() + 'px'
        border.style.width = width.toString() + 'px'
        border.style.height = height.toString() + 'px'

        entity.appendChild(border)
    }
}