
/* Global Context */
export let g_context = {
    systems: {},
    component_lists: {},
    component_lists_buffer: {},
    tick: 0,

    component_lists_values: function*(component_name) {
        for (let uuid in this.component_lists[component_name]) {
            yield this.component_lists[component_name][uuid]
        }
    }
}

export default g_context