import * as s from 'typescript-schema'

export type Spec = s.Interface|s.Class

export interface ClassSpecVisitor {
  onPromise(methodSchema: s.ClassMember, functionType?: s.FunctionType):void

  onObservable(methodSchema: s.ClassMember, functionType?: s.FunctionType):void
}

export interface InterfaceSpecVisitor {
  onPromise(methodSchema: s.InterfaceMember, functionType?: s.FunctionType):void

  onObservable(methodSchema: s.InterfaceMember, functionType?: s.FunctionType):void
}

export function visitSpec(specVisitor:InterfaceSpecVisitor, serviceSchema: s.Interface): void
export function visitSpec(specVisitor:ClassSpecVisitor, serviceSchema: s.Class): void

export function visitSpec(specVisitor:InterfaceSpecVisitor|ClassSpecVisitor, serviceSchema: s.Type): void {
  if (serviceSchema.typeKind === s.TypeKind.CLASS) {
    let classSpecVisitor = <ClassSpecVisitor> specVisitor
    s.classSchemaVisitor(<s.Class>serviceSchema, {
      onClassMember: function(memberSchema) {
        if (memberSchema.type.typeKind === s.TypeKind.FUNCTION) {
          let functionSchema = <s.FunctionType> memberSchema.type
          let type = functionSchema.type
          if (type.typeKind === s.TypeKind.REFINED) {
            let refined = <s.RefinedType<any>> type
            type = refined.type
          }
          if ((<s.NamedType>type).name === 'Observable') {
            classSpecVisitor.onObservable(memberSchema, functionSchema)
          } else if ((<s.NamedType>type).name === 'Promise') {
            classSpecVisitor.onPromise(memberSchema, functionSchema)
          }
        }
      }
    })
  } else {
    let interfaceSpecVisitor = <InterfaceSpecVisitor>specVisitor
    s.interfaceSchemaVisitor(<s.Interface>serviceSchema, {
      onInterfaceMember: function(memberSchema) {
        if (memberSchema.type.typeKind === s.TypeKind.FUNCTION) {
          let functionSchema = <s.FunctionType> memberSchema.type
          let type = functionSchema.type
          if (type.typeKind === s.TypeKind.REFINED) {
            let refined = <s.RefinedType<any>> type
            type = refined.type
          }

          if ((<s.NamedType>type).name === 'Observable') {
            interfaceSpecVisitor.onObservable(memberSchema, functionSchema)
          } else if ((<s.NamedType>type).name === 'Promise') {
            interfaceSpecVisitor.onPromise(memberSchema, functionSchema)
          }
        }
      }
    })
  }
}
