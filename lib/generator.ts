import * as s from 'typescript-schema'
import * as m from './model'
import * as d from './decorators'
import * as v from './specVisitor'

export function defaultIsService(decorator: s.Decorator<s.ClassConstructor>) {
  return decorator.decoratorType.name === 'Service' && decorator.decoratorType.parent.name === 'uservices/dist/lib/decorators'
}

export function generateServiceSpecs<S extends m.Service<any, any>, M extends m.Method<any>, E extends m.Event<any>>(
  modules: s.Map<s.Module>,
  isService?: (decorator: s.Decorator<s.ClassConstructor>) => boolean,
  onService?: (service: S, classConstructor: s.ClassConstructor) => void,
  onMethod?: (method: M, member: s.ClassConstructorMember) => M,
  onEvent?: (event: E, member: s.ClassConstructorMember) => E,
  visitor?: v.ServicesVisitor<S, M, E>): m.Services<S> {

  let services: m.Services<S> = {}
  isService = isService || defaultIsService

  s.visitModules(modules, {
    onModule: function(module) {
      return <s.TypeContainerVisitor>{
        onClassConstructor: function(classConstructor) {
          return <s.ClassConstructorVisitor>{
            onClassConstructorDecorator: function(decorator) {
              if (isService(decorator)) {
                let name = <string>s.expressionToLiteral(decorator.parameters[0])
                let service = <S><m.Service<M, E>>{
                  name: name,
                  methods: {},
                  events: {},
                  type: classConstructor
                }
                if (onService) {
                  onService(service, classConstructor)
                }
                generateServiceSpec(name, classConstructor, onMethod, onEvent, service)
                services[name] = service
              }
            }
          }
        }
      }
    }
  })

  return services
}

export function generateServiceSpec<M extends m.Method<any>, E extends m.Event<any>>(
  name: string,
  classConstructor: s.ClassConstructor,
  onMethod?: (method: M, member: s.ClassConstructorMember) => M,
  onEvent?: (event: E, member: s.ClassConstructorMember) => E,
  service?: m.Service<M, E>): m.Service<M, E> {

  service = service || {
    name: name,
    methods: {},
    events: {},
    type: classConstructor
  }

  s.visitClassConstructor(classConstructor, {
    onInstanceType: function(t) {
      return <s.CompositeTypeVisitor>{
        onMember: function(member) {
          if ((<s.Type>member.type).typeKind === s.TypeKind.FUNCTION) {
            let functionSchema = <s.FunctionType>member.type
            let type = functionSchema.type

            if ((<s.Interface>type).name === 'Observable') {
              let event = <E><m.Event<any>>{
                name: member.name,
                service: service,
                type: functionSchema
              }
              if (onEvent) {
                event = onEvent(event, member)
              }
              if (event) {
                service.events[member.name] = event
              }
            } else if ((<s.Interface>type).name === 'Promise') {
              let method = <M><m.Method<any>>{
                name: member.name,
                service: service,
                type: functionSchema
              }
              if (onMethod) {
                method = onMethod(method, member)
              }
              if (method) {
                service.methods[member.name] = method
              }
            }
          }
        }
      }
    }
  })

  return service
}
