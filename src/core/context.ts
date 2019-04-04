import { Emitter } from './emitter'
import { Validator } from './validator'
import { Events } from './events';
import { Component } from '../engine/component';
import { Plugin, PluginParams } from './plugin';
import { EventsTypes as DefaultEvents } from './events';

export class Context<EventsTypes> extends Emitter<EventsTypes & DefaultEvents> {

    id: string;
    plugins: Map<string, any>;
    components: Map<string, Component>;

    constructor(id: string, events: Events) {
        super(events);

        if (!Validator.isValidId(id))
            throw new Error('ID should be valid to name@0.1.0 format');  
        
        this.id = id;
        this.plugins = new Map();
        this.components = new Map();
    }

    use<T extends Plugin, O extends PluginParams<T>>(plugin: T, options?: O) {
        if (plugin.name && this.plugins.has(plugin.name)) throw new Error(`Plugin ${plugin.name} already in use`)

        plugin.install(this, options || {});
        this.plugins.set(plugin.name, options)
    }

    register(component: Component) {
        if (this.components.has(component.name))
            throw new Error(`Component ${component.name} already registered`);

        this.components.set(component.name, component);
        this.trigger('componentregister', component);
    }
}