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
    }
}

export class EnemyComponent extends ComponentBase {
    constructor(entity) {
        super(entity)
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

        this.spawn_last_tick = 0
        this.spawn_cd = 250
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
    constructor(entity, pic_path, width, height, dx, dy) {
        super(entity)

        this.pic_path = pic_path
        this.width = width
        this.height = height
        this.dx = dx
        this.dy = dy
    }
}

export class DebugToolComponent extends ComponentBase {
    constructor(entity) {
        super(entity)

        this.is_enable_border = true
    }
}