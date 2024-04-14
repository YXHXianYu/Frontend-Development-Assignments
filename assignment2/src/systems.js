import { g_context } from './global_context.js'

import * as cp from './components.js'
import * as settings from './settings.js'
import * as utils from './utils.js'

/* Systems */

export class InputSystem {
    constructor() {
        const input = new cp.InputStateComponent(document.body)
    }

    tick() {
        const input = g_context.component_lists_values('InputStateComponent').next().value
        const replay = g_context.component_lists_values('ReplayComponent').next().value

        if (!input.is_initialized) {
            input.is_initialized = true
            if (!replay.is_running) {
                document.body.addEventListener('keydown', function(event) {
                    input.state[event.key] = true
                    input.keydown_buffer[event.key] = true
                })
                document.body.addEventListener('keyup', function(event) {
                    input.state[event.key] = false
                    input.keyup_buffer[event.key] = true
                })
            }
        }

        if (!replay.is_running) {
            input.keydown = input.keydown_buffer
            input.keydown_buffer = {}

            input.keyup = input.keyup_buffer
            input.keyup_buffer = {}

            replay.replay[g_context.tick] = []
            replay.replay[g_context.tick][0] = input.state
            replay.replay[g_context.tick][1] = input.keydown
            replay.replay[g_context.tick][2] = input.keyup

            replay.replay[g_context.tick][0] = {
                'w': input.state['w'],
                'a': input.state['a'],
                'd': input.state['d'],
                's': input.state['s'],
            }

            utils.setLocalStorage('replay', replay.replay)

        } else {
            if (replay.replay[g_context.tick] !== undefined) {
                input.state = replay.replay[g_context.tick][0]
                input.keydown = replay.replay[g_context.tick][1]
                input.keyup = replay.replay[g_context.tick][2]
            } else {
            }
        }
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
                const v = settings.FPS_INTERVAL

                for(let i = -player.fire_level; i <= player.fire_level; i++) {
                    this.fireStraight(player_transform.x, player_transform.y - player_hitbox.height,
                        player.fire_level > 0 ? v * (0.15 * (player.fire_level + 1)) * i / player.fire_level : 0,
                    -v)
                }

                player.fire_last_tick = g_context.tick
            }
        }
    }

    fireStraight(x, y, v_x, v_y) {
        utils.createBullet(x, y, v_x, v_y)
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
            this.spawn(x, 0, "enemy1")
        }
        
        const level = new cp.LevelComponent(document.body)
        const game_state = new cp.GameStateComponent(document.body)
    }

    tick() {
        for (let level of g_context.component_lists_values('LevelComponent')) {

            if (level.spawn_last_tick_enemy1 + level.spawn_cd_enemy1 <= g_context.tick) {
                this.spawn(Math.random() * 400, 0, "enemy1")
                level.spawn_last_tick_enemy1 = g_context.tick
            }

            if (level.spawn_last_tick_enemy2 + level.spawn_cd_enemy2 <= g_context.tick) {
                this.spawn(Math.random() * 400, 0, "enemy2")
                level.spawn_last_tick_enemy2 = g_context.tick
            }

            if (level.spawn_last_tick_enemy3 + level.spawn_cd_enemy3 <= g_context.tick) {
                this.spawn(Math.random() * 400, 0, "enemy3")
                level.spawn_last_tick_enemy3 = g_context.tick
            }
        }

        const score = g_context.component_lists_values('ScoreComponent').next().value
        const player = g_context.component_lists_values('PlayerComponent').next().value
        const level = g_context.component_lists_values('LevelComponent').next().value

        if (player === undefined || score === undefined || level === undefined) {
            return
        }

        while(level.bonus[0] !== undefined && score.score >= level.bonus[0][0]) {
            utils.createItem(Math.random() * 400, 0, level.bonus[0][1])
            level.bonus.shift()
        }

        if (score.score >= 10000) {
            player.fire_cd = 1

            level.spawn_cd_enemy1 = 1
            level.spawn_cd_enemy2 = 2
            level.spawn_cd_enemy3 = 5

        } else if (score.score >= 2000) {
            player.fire_cd = 1

            level.spawn_cd_enemy1 = 2
            level.spawn_cd_enemy2 = 5
            level.spawn_cd_enemy3 = 25

        } else if (score.score >= 500) {
            player.fire_cd = 1

            level.spawn_cd_enemy1 = 2
            level.spawn_cd_enemy2 = 5
            level.spawn_cd_enemy3 = 100

        } else if (score.score >= 300) {
            player.fire_cd = 2

            level.spawn_cd_enemy1 = 5
            level.spawn_cd_enemy2 = 25
            level.spawn_cd_enemy3 = 500

        } else if (score.score >= 100) {
            player.fire_cd = 5

            level.spawn_cd_enemy1 = 25
            level.spawn_cd_enemy2 = 100
            level.spawn_cd_enemy3 = 1000

        } else if (score.score >= 30) {
            player.fire_cd = 15

            level.spawn_cd_enemy1 = 100
            level.spawn_cd_enemy2 = 500
            level.spawn_cd_enemy3 = 2000
        } 
    }

    spawn(x, y, type) {
        utils.createEnemy(x, y, type)
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
            utils.removeEntityDirectly(entity)
        }

        removal_buffer = []
    }

}

export class ObstacleSpawnSystem {
    constructor() {
        // left
        utils.createObstacle(-102, -100, 100, 800 + 200, false)
        // right
        utils.createObstacle(480, -100, 100, 800 + 200, false)
        // top
        utils.createObstacle(-102, -123, 682, 100, false)
        // bottom
        utils.createObstacle(-102, 679, 682, 100, false)

        // left big
        utils.createObstacle(-400, -1000, 100, 3000, true)
        // right big
        utils.createObstacle(700, -1000, 100, 3000, true)
        // top big
        utils.createObstacle(-1000, -423, 3000, 100, true)
        // bottom big
        utils.createObstacle(-1000, 879, 3000, 100, true)
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
                    renderable.frames,
                    renderable.width,
                    renderable.height,
                    renderable.dx,
                    renderable.dy,
                )
            } else {
                const cur_tick = g_context.tick % renderable.max_tick
                const cur_frame = Math.floor(cur_tick / renderable.max_tick * renderable.frames.length)
                texture.style.backgroundImage = 'url(' + renderable.frames[cur_frame] + ')'
            }
        }
    }

    applyTexture(entity, frames, width, height, dx, dy) {
        const texture = document.createElement('div')
        const debug_tool = g_context.component_lists_values('DebugToolComponent').next().value

        texture.className = 'texture'
        texture.style.position = 'absolute'

        texture.style.border = '1px solid green'
        texture.style.borderColor = (debug_tool.is_enable) ? 'green' : 'transparent';

        texture.style.left = dx.toString() + 'px'
        texture.style.top = dy.toString() + 'px'
        texture.style.width = width.toString() + 'px'
        texture.style.height = height.toString() + 'px'
        texture.style.backgroundImage = 'url(' + frames[0] + ')'
        texture.style.backgroundSize = 'cover'
        texture.style.zIndex = '-1'

        entity.appendChild(texture)
    }
}

export class AnimationSystem {
    constructor() {}

    tick() {
        for (const animation of g_context.component_lists_values('AnimationComponent')) {
            if (animation.start_tick === null) {
                animation.start_tick = g_context.tick

                const animation_entity = animation.entity
                animation_entity.style.position = 'absolute'
                animation_entity.style.left = animation.x.toString() + 'px'
                animation_entity.style.top = animation.y.toString() + 'px'
                animation_entity.style.width = animation.width.toString() + 'px'
                animation_entity.style.height = animation.height.toString() + 'px'

                animation_entity.style.backgroundSize = 'cover'

            } else {
                const cur_tick = g_context.tick - animation.start_tick
                const cur_frame = Math.floor(cur_tick / animation.max_tick * animation.frames.length)

                if (cur_frame >= animation.frames.length) {
                    utils.removeEntity(animation.entity)
                    continue
                }

                const animation_entity = animation.entity
                animation_entity.style.backgroundImage = 'url(' + animation.frames[cur_frame] + ')'
            }
        }

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

        if (input.keydown['i']) {
            const player = g_context.component_lists_values('PlayerComponent').next().value
            player.fire_level += 1
        }

        if (input.keydown['u']) {
            const player = g_context.component_lists_values('PlayerComponent').next().value
            player.fire_level = Math.max(0, player.fire_level - 1)
        }

        if (input.keydown['j']) {
            utils.createItem(Math.random() * 400, 0, 'bomb_supply')
        }

        if (input.keydown['k']) {
            utils.createItem(Math.random() * 400, 0, 'bullet_supply')
        }
    }
}

export class ScoreSystem {
    constructor() {
        const score = new cp.ScoreComponent(document.body)
    }

    tick() {
        for (const score of g_context.component_lists_values('ScoreComponent')) {
            const score_bar = score.score_bar
            score_bar.textContent = 'Score: ' + score.score
        }
    }
}

export class UIManager {
    constructor() {
        const ui = document.getElementsByClassName('ui')[0]

        const pause_button = utils.createElement(ui, 'div', 'pause', '')

        pause_button.addEventListener('click', function() {
            console.log('Pause button clicked, state changes from', g_context.component_lists_values('GameStateComponent').next().value.state)

            const game_state = g_context.component_lists_values('GameStateComponent').next().value
            if (game_state.state === cp.GameStateComponent.GAME_STATE_GAMEOVER) {
                return
            } else if (game_state.state === cp.GameStateComponent.GAME_STATE_PAUSE) {
                game_state.state = cp.GameStateComponent.GAME_STATE_RUNNING
            } else if (game_state.state === cp.GameStateComponent.GAME_STATE_RUNNING) {
                game_state.state = cp.GameStateComponent.GAME_STATE_PAUSE
            }
        })

        const restart_button = utils.createElement(ui, 'div', 'restart', '')

        restart_button.addEventListener('click', function() {
            const game_state = g_context.component_lists_values('GameStateComponent').next().value
            game_state.state = cp.GameStateComponent.GAME_STATE_NEED_TO_RESTART
        })
    }

    tick() {}
}

export class ReplaySystem {
    constructor() {
        const replay = new cp.ReplayComponent(document.body)
    }

    tick() {
        const replay = g_context.component_lists_values('ReplayComponent').next().value
        const input = g_context.component_lists_values('InputStateComponent').next().value
        const game_state = g_context.component_lists_values('GameStateComponent').next().value

        // TODO: add a replay button
        // TODO: add replay auto close
        if (input.keydown['r']) {
            if (replay.is_running) {
                replay.is_running = false

                game_state.state = cp.GameStateComponent.GAME_STATE_NEED_TO_RESTART

            } else {
                replay.is_running = true

                game_state.state = cp.GameStateComponent.GAME_STATE_NEED_TO_RESTART
            }
        }
    }
}
