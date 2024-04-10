
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