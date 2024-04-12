import { g_context } from './global_context.js'

import * as cp from './components.js'
import * as settings from './settings.js'
import * as utils from './utils.js'

/* Systems */

export class InputSystem {
    constructor() {
        let input = new cp.InputStateComponent(document.body)

        document.body.addEventListener('keydown', function(event) {
            input.state[event.key] = true
            input.keydown_buffer[event.key] = true
        })
        document.body.addEventListener('keyup', function(event) {
            input.state[event.key] = false
            input.keyup_buffer[event.key] = true
        })
    }

    tick() {
        const input = g_context.component_lists_values('InputStateComponent').next().value

        input.keydown = input.keydown_buffer
        input.keydown_buffer = {}

        input.keyup = input.keyup_buffer
        input.keyup_buffer = {}
    }
}

export class PlayerManager {
    constructor() {
        utils.createPlayer(200, 650, settings.PLAYER_VELOCITY)
    }

    tick() {
        for (const player of g_context.component_lists_values('PlayerComponent')) {
            let entity = player.entity
            let player_transform = entity['TransformComponent']
            let player_move = entity['MoveComponent']
            let player_hitbox = entity['HitboxComponent']

            // Movement

            let input_state = g_context.component_lists_values('InputStateComponent').next().value.state

            if (input_state['w'] && input_state['s']) {
                player_move.y = 0
            } else if (input_state['w']) {
                player_move.y = -player.velocity
            } else if (input_state['s']) {
                player_move.y = player.velocity
            } else {
                player_move.y = 0
            }

            if (input_state['a'] && input_state['d']) {
                player_move.x = 0
            } else if (input_state['a']) {
                player_move.x = -player.velocity
            } else if (input_state['d']) {
                player_move.x = player.velocity
            } else {
                player_move.x = 0
            }

            // Fire
            if (player.fire_last_tick + player.fire_cd <= g_context.tick) {
                this.fireStraight(player_transform.x, player_transform.y - player_hitbox.height)
                player.fire_last_tick = g_context.tick
            }
        }
    }

    fireStraight(x, y) {
        utils.createBullet(x, y, 0, -1 * settings.FPS_INTERVAL)
    }
}

export class TransformSystem {
    constructor() {}

    tick() {
        for (let transform of g_context.component_lists_values('TransformComponent')) {
            let entity = transform.entity
            entity.style.top = transform.top
            entity.style.left = transform.left
        }
    }
}

export class MoveSystem {
    constructor() {}

    tick() {
        for (let move of g_context.component_lists_values('MoveComponent')) {
            let entity = move.entity
            let transform = entity['TransformComponent']

            transform.x += move._x
            transform.y += move._y
        }
    }
}

export class LevelManager {
    constructor() {
        for (let x = 150; x <= 350; x += 100) {
            this.spawn(x, 0)
        }
        
        let level = new cp.LevelComponent(document.body)
    }

    tick() {
        for (let level of g_context.component_lists_values('LevelComponent')) {

            if (level.spawn_last_tick + level.spawn_cd <= g_context.tick) {
                this.spawn(Math.random() * 500, 0)
                level.spawn_last_tick = g_context.tick
            }
        }
    }

    spawn(x, y) {
        utils.createEnemy(x, y, 0, settings.ENEMY_VELOCITY)
    }
}

export class PhysicsSystem {
    constructor() {}

    tick() {
        const hitboxes = Object.entries(g_context.component_lists['HitboxComponent'])

        for (let i = 0; i < hitboxes.length; i++) {
            let hitbox1 = hitboxes[i][1]

            for (let j = i + 1; j < hitboxes.length; j++) {
                let hitbox2 = hitboxes[j][1]

                if (this.isCollide(hitbox1, hitbox2)) {
                    // Collision handling, using observer pattern (event emitter)
                    hitbox1.event_emitter.emit('collide', hitbox2)
                    hitbox2.event_emitter.emit('collide', hitbox1)
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

        // console.log("(" + rect1.x1 + ", " + rect1.y1 + ") (" + rect1.x2 + ", " + rect1.y2 + ") ; " + "(" + rect2.x1 + ", " + rect2.y1 + ") (" + rect2.x2 + ", " + rect2.y2 + ")")

        // 检查一个矩形是否在另一个矩形的左侧、右侧、上方或下方
        // 如果是，那么它们不相交
        if (rect1.x2 <= rect2.x1 || rect1.x1 >= rect2.x2 ||
            rect1.y2 <= rect2.y1 || rect1.y1 >= rect2.y2) {
            return false;
        }
        return true;
    }
}

export class RenderHitBoxSystem {
    constructor() {}

    tick() {
        for (let hitbox of g_context.component_lists_values('HitboxComponent')) {
            let entity = hitbox.entity
            let border = entity.querySelector('.border')
            if (border === null) {
                this.drawHitbox(entity, hitbox.width, hitbox.height)
            }
        }
    }

    drawHitbox(entity, width, height) {
        const border = document.createElement('div')
        const debug_tool = g_context.component_lists_values('DebugToolComponent').next().value

        border.className = 'border'
        border.style.position = 'absolute'

        border.style.border = '1px solid red'
        border.style.borderColor = (debug_tool.is_enable) ? 'red' : 'transparent';

        border.style.width = width.toString() + 'px'
        border.style.height = height.toString() + 'px'

        entity.appendChild(border)
    }
}

export class EntityRemovalSystem {
    constructor() {
        let entity_removal = new cp.EntityRemovalComponent(document.body)
    }

    tick() {
        let removal_buffer = g_context.component_lists_values('EntityRemovalComponent').next().value.removal_buffer
        
        for (let entity of removal_buffer) {
            this.removeEntity(entity)
        }

        removal_buffer = []
    }

    removeEntity(entity) {
        for (let component_name in cp) {
            if (component_name in entity) {
                const uuid = entity[component_name].uuid
                delete entity[component_name]
                delete g_context.component_lists[component_name][uuid]
            }
        }
        entity.remove()
    }
}

export class ObstacleSpawnSystem {
    constructor() {
        // left
        utils.createObstacle(-102, -100, 100, 800 + 200, true)
        // right
        utils.createObstacle(480, -100, 100, 800 + 200, true)
        // top
        utils.createObstacle(-102, -123, 682, 100, false)
        // bottom
        utils.createObstacle(-102, 679, 682, 100, false)
        // top big
        utils.createObstacle(-102, -423, 682, 100, true)
        // bottom big
        utils.createObstacle(-102, 879, 682, 100, true)
    }

    tick() {}
}

export class RenderSystem {
    constructor() {}

    tick() {
        for (let renderable of g_context.component_lists_values('RenderableComponent')) {
            let entity = renderable.entity

            let texture = entity.querySelector('.texture')
            if (texture === null) {
                this.applyTexture(
                    entity,
                    renderable.pic_path,
                    renderable.width,
                    renderable.height,
                    renderable.dx,
                    renderable.dy,
                )
            }
        }
    }

    applyTexture(entity, path, width, height, dx, dy) {
        const texture = document.createElement('div')
        const debug_tool = g_context.component_lists_values('DebugToolComponent').next().value

        texture.className = 'texture'
        texture.style.position = 'absolute'

        texture.style.border = '1px solid green'
        texture.style.borderColor = (debug_tool.is_enable) ? 'green' : 'transparent';

        texture.style.top = dx.toString() + 'px'
        texture.style.left = dy.toString() + 'px'
        texture.style.width = width.toString() + 'px'
        texture.style.height = height.toString() + 'px'
        texture.style.backgroundImage = 'url(' + path + ')'
        texture.style.backgroundSize = 'cover'
        texture.style.zIndex = '-1'

        entity.appendChild(texture)
    }
}

export class DebugTool {
    constructor() {
        const debug_tool = new cp.DebugToolComponent(document.body)
    }

    tick() {
        const input = g_context.component_lists_values('InputStateComponent').next().value
        const debug_tool = g_context.component_lists_values('DebugToolComponent').next().value

        if (input.keydown['o']) {
            if (debug_tool.is_enable) {
                debug_tool.is_enable = false

                document.querySelectorAll('.content > .entity div').forEach(function(entity) {
                    entity.style.borderColor = 'transparent'
                    entity.style.color = 'transparent'
                })

            } else {
                debug_tool.is_enable = true

                document.querySelectorAll('.content > .entity div').forEach(function(entity) {
                    if (entity.className === 'border') {
                        entity.style.borderColor = 'red'
                    } else if (entity.className === 'texture') {
                        entity.style.borderColor = 'green'
                    }
                    entity.style.color = 'black'
                })
            }
        }
    }
}