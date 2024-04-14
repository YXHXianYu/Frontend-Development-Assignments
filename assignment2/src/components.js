import { g_context } from './global_context.js'

import * as utils from './utils.js'

import EventEmitter from 'events'
import { v4 as uuidv4 } from 'uuid'

/* Components */

// 每个Component有两个索引，一个为entity，另一个为component list

export class ComponentBase {
    constructor(entity) {
        // record entity
        this.entity = entity
        this.uuid = uuidv4()

        // mount to an entity
        let component_name = this.constructor.name
        entity[component_name] = this

        // add to component list
        g_context.component_lists[component_name][this.uuid] = this

        // debug
        // console.log(this.constructor.name)
    }
}

export class InputStateComponent extends ComponentBase {
    constructor(entity) {
        super(entity)

        this.state = {}
        this.keydown = {}
        this.keydown_buffer = {}
        this.keyup = {}
        this.keyup_buffer = {}

        this.is_initialized = false
    }
}

export class TransformComponent extends ComponentBase {
    constructor(entity, x = 0, y = 0) {
        super(entity)

        this.x = x
        this.y = y
    }

    get left() {
        return this.x.toString() + 'px'
    }
    get top() {
        return this.y.toString() + 'px'
    }
}

export class ObstacleComponent extends ComponentBase {
    constructor(entity, is_effect_on_npc) {
        super(entity)

        this.is_effect_on_npc = is_effect_on_npc
    }
}

export class MoveComponent extends ComponentBase {
    constructor(entity, x = 2, y = undefined) {
        super(entity)

        if (y === undefined) {
            this._x = x
            this._y = x
        } else {
            this._x = x
            this._y = y
        }
    }

    set x(value) {
        this._x = value
    }
    get x() {
        return this._x
    }

    set y(value) {
        this._y = value
    }
    get y() {
        return this._y
    }
}

export class HitPointComponent extends ComponentBase {
    constructor(entity, hp) {
        super(entity)

        this.hp = hp
    }
}

export class PlayerComponent extends ComponentBase {
    constructor(entity, velocity) {
        super(entity)

        this.fire_last_tick = -Infinity
        this.fire_cd = 25
        this.velocity = velocity

        this.fire_level = 0
    }
}

export class EnemyComponent extends ComponentBase {
    constructor(entity, type, score) {
        super(entity)

        this.type = type
        this.score = score
    }
}

export class BulletComponent extends ComponentBase {
    constructor(entity) {
        super(entity)
    }
}

export class LevelComponent extends ComponentBase {
    constructor(entity) {
        super(entity)


        this.spawn_last_tick_enemy1 = 0
        this.spawn_cd_enemy1 = 200

        this.spawn_last_tick_enemy2 = 0
        this.spawn_cd_enemy2 = 1000

        this.spawn_last_tick_enemy3 = 0
        this.spawn_cd_enemy3 = 2000

        this.bonus = [
            [500,   'bomb_supply'],
            [1000,  'bullet_supply'],
            [1000,  'bomb_supply'],
            [1500,  'bomb_supply'],
            [2000,  'bullet_supply'],
            [2500,  'bomb_supply'],
            [3000,  'bullet_supply'],
            [4000,  'bullet_supply'],
            [5000,  'bullet_supply'],
            [5000,  'bomb_supply'],
            [6000,  'bullet_supply'],
            [7000,  'bullet_supply'],
            [8000,  'bullet_supply'],
            [9000,  'bullet_supply'],
            [10000, 'bullet_supply'],
            [15000, 'bomb_supply'],
        ]
    }
}

export class HitboxComponent extends ComponentBase {
    constructor(entity, width, height) {
        super(entity)

        this.width = width
        this.height = height
        this.event_emitter = new EventEmitter()
    }
}

export class EntityRemovalComponent extends ComponentBase {
    constructor(entity) {
        super(entity)

        this.removal_buffer = []
    }
}

export class RenderableComponent extends ComponentBase {
    constructor(entity, width, height, dx, dy, frames, max_tick) {
        super(entity)

        this.width = width
        this.height = height
        this.dx = dx
        this.dy = dy

        this.cur_frame = 0
        this.frames = frames
        this.max_tick = max_tick
    }
}

export class DebugToolComponent extends ComponentBase {
    constructor(entity) {
        super(entity)

        this.is_enable_border = true
    }
}

export class ScoreComponent extends ComponentBase {
    constructor(entity) {
        super(entity)

        this.score = 0

        this.score_bar = document.querySelector('.score')
        if (this.score_bar === null) {
            const ui = document.getElementsByClassName('ui')[0]
            this.score_bar = utils.createElement(ui, 'div', 'score', '')
        }
    }
}

export class GameStateComponent extends ComponentBase {
    static GAME_STATE_RUNNING = 0
    static GAME_STATE_GAMEOVER = 1
    static GAME_STATE_PAUSE = 2
    static GAME_STATE_NEED_TO_RESTART = 3

    constructor(entity) {
        super(entity)

        this.state = GameStateComponent.GAME_STATE_RUNNING
    }
}

export class AnimationComponent extends ComponentBase {
    constructor(entity, x, y, width, height, frames, max_tick) {
        super(entity)

        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.start_tick = null
        this.frames = frames
        this.max_tick = max_tick
    }
}

export class ItemComponent extends ComponentBase {
    constructor(entity, type) {
        super(entity)

        this.type = type
    }
}

export class ReplayComponent extends ComponentBase {
    constructor(entity) {
        super(entity)
        
        this.is_running = false
        this.replay = []
    }
}

export class RandomComponent extends ComponentBase {
    constructor(entity) {
        super(entity)

        this.seed = 19260817
    }
}
