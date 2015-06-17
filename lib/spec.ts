import {Observable} from './rfp'

export type Type = string|ArrayType|ObjectType

export interface ArrayType {
  type: Type
}

export interface Types {
  [name: string]: Type
}

export interface ObjectType {
  types: Types
}

export interface Parameter {
  name: string
  type: Type
}

export interface Method {
  parameters: Parameter[]
  returnType: Type
  cardinality: number
}

export interface Methods {
  [name: string]: Method
}

export interface Spec<T> {
  name: string
  methods: Methods
}

export interface Specs {
  [name: string]: Spec<any>
}

export type Action = (...args:any[])=>void
export type Function =  (...args:any[])=>Promise<any>
export type Event = (...args:any[])=>Observable<any>

export function visitor(onMethod: (name: string, method: Method) => void) {
  return function(spec: Spec<any>) {
    Object.keys(spec.methods).forEach(function(methodName) {
      let method = spec.methods[methodName]
      onMethod(methodName, method)
    })
  }
}
