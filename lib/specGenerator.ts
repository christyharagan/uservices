import * as s from 'typescript-schema'
import {Spec, Specs, Method, Type, Parameter} from './spec'
import {posix as path} from 'path'

function schemaTypeToSpecType(type: s.Type): Type {
  // TODO
  return ''
}

export function generateSpec(moduleSchema: s.ModuleSchema, interfaceSchema: s.InterfaceSchema): Spec<any> {
  let spec: Spec<any> = {
    name: path.join(moduleSchema.name, interfaceSchema.name),
    methods: {}
  }

  s.interfaceSchemaVisitor(interfaceSchema, {
    onInterfaceMember: function(memberSchema) {
      if (memberSchema.type.typeKind === s.TypeKind.FUNCTION) {
        let functionSchema = <s.FunctionSchema> memberSchema.type
        let parameters: Parameter[] = []

        functionSchema.parameters.forEach(function(parameter) {
          parameters.push({
            name: parameter.name,
            type: schemaTypeToSpecType(parameter.type)
          })
        })

        let cardinality: number
        let returnType: Type;
        if (!functionSchema.type) {
          cardinality = 0
          returnType = ''
        } else if ((<s.TypeReference>functionSchema.type).type === 'Observable') {
          cardinality = -1
          returnType = 'TODO'
        } else if ((<s.TypeReference>functionSchema.type).type === 'Promise') {
          cardinality = 1
          returnType = 'TODO'
        } else {
          // TODO: Handle invalid interfaces
        }

        let method: Method = {
          parameters: parameters,
          returnType: schemaTypeToSpecType(functionSchema.type),
          cardinality: cardinality
        }
        spec.methods[memberSchema.name] = method
      }
    }
  })

  return spec
}
