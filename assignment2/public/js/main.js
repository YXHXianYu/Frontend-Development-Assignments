
/* Global Context */
let g_context = {}

/* Utils */

function createElement(tag, cls, content) {
    const new_element = document.createElement(tag)
    new_element.className = cls
    new_element.textContent = content
    return new_element
}

/* Components */

class ComponentBase {
    constructor(mounted_element) {
        let component_name = this.constructor.name
        mounted_element['component_name'] = this
        console.log(this.constructor.name)
    }
}

class InputStateComponent extends ComponentBase {
    constructor(mounted_element) {
        super(mounted_element)
    }
}

// TODO: use ecs

class InputSystem {
    constructor() {
        const body = document.body
        this.input_state_component = new InputStateComponent(body)
        this.state = {}
        const that = this

        body.addEventListener('keydown', function(event) {
            that.state[event.key] = true
        })
        body.addEventListener('keyup', function(event) {
            that.state[event.key] = false
        })
    }
}

class WorldManager {
    constructor() {
        const content = document.querySelector('.content')
        this.player  = createElement('p', 'entity player', 'player')
        content.appendChild(this.player)
        this.player.x = 50
        this.player.y = 200

        this.player_velocity = 8;
    }

    tick() {

        console.log(g_context.input_system.state)
        
        if (g_context.input_system.state['w']) {
            this.player.y += 0.5 * this.player_velocity
        }
        if (g_context.input_system.state['s']) {
            this.player.y -= 0.5 * this.player_velocity
        }
        if (g_context.input_system.state['a']) {
            this.player.x -= 0.5 * this.player_velocity
        }
        if (g_context.input_system.state['d']) {
            this.player.x += 0.5 * this.player_velocity
        }

        this.player.style.bottom = this.player.y.toString() + 'px'
        this.player.style.left = this.player.x.toString() + 'px'
    }
}

// === Initialize ===
g_context.input_system = new InputSystem()
g_context.world_manager = new WorldManager()


// === Main Loop ===
function main_loop_single() {
    g_context.world_manager.tick()
}

function main_loop() {
    setTimeout(main_loop, 20)

    main_loop_single()
}

main_loop()
