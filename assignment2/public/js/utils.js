import * as cp from './components.js'

/* Utils */

export function createElement(entity, tag, cls, content) {
    const new_element = document.createElement(tag)
    new_element.className = cls
    new_element.textContent = content
    entity.appendChild(new_element)
    return new_element
}

export function assert(condition, message) {
    if (!condition) {
        throw new Error(message)
    }
}

export function createEnemy(x, y) {
    let entity = createElement(document.querySelector('.entity'), 'p', 'enemy', 'enemy')
    let enemy = new cp.EnemyComponent(entity)
    let enemy_transform = new cp.TransformComponent(entity, x, y)
    let enemy_move = new cp.MoveComponent(entity, 2)
    let enemy_hitbox = new cp.HitboxComponent(entity, 50, 50)
}