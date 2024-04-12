import { g_context } from './global_context.js'

import { assert } from './utils.js'

import EventEmitter from '../../node_modules/eventemitter3/index.mjs'

/* Components */

// 每个Component有两个索引，一个为entity，另一个为component list

export class ComponentBase {
    constructor(entity) {
        // record entity
        this.entity = entity

        // mount to an entity
        let component_name = this.constructor.name
        entity[component_name] = this

        // add to component list
        if (!(component_name in g_context.component_lists)) {
            g_context.component_lists[component_name] = []
        }
        g_context.component_lists[component_name].push(this)

        // debug
        // console.log(this.constructor.name)
    }
}

export class InputStateComponent extends ComponentBase {
    constructor(entity) {
        super(entity)

        this.state = {}
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
    get bottom() {
        return this.y.toString() + 'px'
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

    set velocity(value) {
        this._x = value
        this._y = value
    }
    get velocity() {
        assert(this._x === this._y, "x and y velocity should be the same")
        return this._x
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

export class PlayerComponent extends ComponentBase {
    constructor(entity) {
        super(entity)

        this.fire_last_tick = -Infinity
        this.fire_cd = 50
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
    constructor(entity, width, height, types = []) {
        super(entity)

        this.width = width
        this.height = height
        this.types = types
        this.event_emitter = new EventEmitter()
    }
}