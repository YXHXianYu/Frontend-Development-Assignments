/**
 * 本项目采用ECS架构，面向数据编程
 * 十分优雅的一种编程方式
 */

import { g_context } from './global_context.js'

import * as cp from './components.js'
import * as sys from './systems.js'

/* Basic Func */

function initialize() {
    for (let component_name in cp) {
        g_context.component_lists[component_name] = []
    }
    for (let system_name in sys) {
        g_context.systems[system_name] = new sys[system_name]()
        console.log("Loaded : " + system_name)
    }
}

function main_loop_single() {
    for (let system in g_context.systems) {
        g_context.systems[system].tick()
    }
}

function main_loop() {
    setTimeout(main_loop, 20) // 50fps
    main_loop_single()
    g_context.tick += 1
}

function main() {
    initialize()
    main_loop()
}

/* Main */

main()
