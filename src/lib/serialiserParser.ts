import * as m from './model'
import * as s from 'typescript-schema'

function stringifyReplacer(key: string, value: any): any {
  if (key === 'service') {
    return undefined
  } else if (key === 'name' && !value.events) {
    return undefined
  } else if (key === 'type') {
    // TODO
    return undefined
  } else {
    return value
  }
}

export function stringify(services: m.Services<any>): string {
  return JSON.stringify(jsonify(services), null, '  ')
}

export function jsonify(services: m.Services<any>): any {
  let jsonified = {}
  Object.keys(services).forEach(function(name) {
    let service = services[name]
    let jsonifiedService = {
      methods: {},
      events: {}
    }
    jsonified[name] = jsonifiedService

    if (service.methods) {
      Object.keys(service.methods).forEach(function(name) {
        let method = service.methods[name]
        let jsonifiedMethod = {}
        Object.keys(method).forEach(function(key){
          if (key !== 'name' && key !== 'service' && key !== 'type') {
            jsonifiedMethod[key] = method[key]
          }
        })

        jsonifiedService.methods[name] = jsonifiedMethod
      })
    }
    if (service.events) {
      Object.keys(service.events).forEach(function(name) {
        let event = service.events[name]
        let jsonifiedEvent = {}
        Object.keys(event).forEach(function(key){
          if (key !== 'name' && key !== 'service' && key !== 'type') {
            jsonifiedEvent[key] = event[key]
          }
        })
        jsonifiedService.events[name] = jsonifiedEvent
      })
    }
  })
  return jsonified
}

export function parse(serviceString: string): m.Services<any> {
  return dejsonify(JSON.parse(serviceString))
}

export function dejsonify(jsonified:any): m.Services<any> {
  let services:m.Services<any> = {
  }

  Object.keys(jsonified).forEach(function(name) {
    let jsonifiedService = jsonified[name]
    let service:m.Service<any, any> = {
      name: name,
      methods: {},
      events: {}
    }
    services[name] = service

    if (jsonifiedService.methods) {
      Object.keys(jsonifiedService.methods).forEach(function(name) {
        let jsonifiedMethod = jsonifiedService.methods[name]
        let method:m.Method<any> = {
          name: name,
          service: service
        }
        Object.keys(jsonifiedMethod).forEach(function(key){
          method[key] = jsonifiedMethod[key]
        })
        service.methods[name] = method
      })
    }
    if (jsonifiedService.events) {
      Object.keys(jsonifiedService.events).forEach(function(name) {
        let jsonifiedEvent = jsonifiedService.events[name]
        let event = {
          name: name,
          service: service
        }
        Object.keys(jsonifiedEvent).forEach(function(key){
          event[key] = jsonifiedEvent[key]
        })
        service.events[name] = event
      })
    }
  })

  return services
}
