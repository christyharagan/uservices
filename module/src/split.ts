import {Spec, Action, Function, Event, Method, Methods} from './spec'

export interface Actions {
  [name: string]: Action
}

export interface Functions {
  [name: string]: Function
}

export interface Events {
  [name: string]: Event
}

export interface SplitService {
  actions: Actions
  functions: Functions
  events: Events
  visit(onAction: (name: string, action: Action) => void, onFunction: (name: string, func: Function) => void, onEvent: (name: string, event: Event) => void): void
}

export interface SplitSpec {
  actions: Methods
  functions: Methods
  events: Methods
  visit(onAction: (name: string, action: Method) => void, onFunction: (name: string, func: Method) => void, onEvent: (name: string, event: Method) => void): void
}

export function splitSpec(spec: Spec<any>): SplitSpec {
  let splitSpec: SplitSpec = {
    actions: {},
    functions: {},
    events: {},
    visit: function(onAction, onFunction, onEvent) {
      Object.keys(splitSpec.actions).forEach(function(name) {
        onAction(name, splitSpec.actions[name])
      })
      Object.keys(splitSpec.functions).forEach(function(name) {
        onFunction(name, splitSpec.functions[name])
      })
      Object.keys(splitSpec.events).forEach(function(name) {
        onEvent(name, splitSpec.events[name])
      })
    }
  }

  Object.keys(spec.methods).forEach(function(methodName) {
    let method = spec.methods[methodName]

    if (method.cardinality === 0) {
      splitSpec.actions[methodName] = spec[methodName]
    } else if (method.cardinality === 1) {
      splitSpec.functions[methodName] = spec[methodName]
    } else {
      splitSpec.events[methodName] = spec[methodName]
    }
  })

  return splitSpec
}

export function splitService<T>(spec: Spec<T>, service: T): SplitService {
  let splitService: SplitService = {
    actions: {},
    functions: {},
    events: {},
    visit: function(onAction, onFunction, onEvent) {
      Object.keys(splitService.actions).forEach(function(name) {
        onAction(name, splitService.actions[name])
      })
      Object.keys(splitService.functions).forEach(function(name) {
        onFunction(name, splitService.functions[name])
      })
      Object.keys(splitService.events).forEach(function(name) {
        onEvent(name, splitService.events[name])
      })
    }
  }

  Object.keys(spec.methods).forEach(function(methodName) {
    let method = spec.methods[methodName]

    if (method.cardinality === 0) {
      splitService.actions[methodName] = <Action>service[methodName]
    } else if (method.cardinality === 1) {
      splitService.functions[methodName] = <Function>service[methodName]
    } else {
      splitService.events[methodName] = <Event>service[methodName]
    }
  })

  return splitService
}
