import { kebabCase } from '@vuedx/shared'
import type { ComponentInfo } from '../component'

export interface VeturData {
  tags: Record<
    string,
    {
      description: string
      attributes: string[]
    }
  >
  attributes: Record<
    string,
    {
      type: string
      description: string
    }
  >
}

export function toVeturData(components: ComponentInfo[]): VeturData {
  const data: VeturData = { tags: {}, attributes: {} }

  components.forEach((component) => {
    const name = kebabCase(component.name)

    const info: VeturData['tags'][0] = (data.tags[name] = {
      description: component.description,
      attributes: [],
    })

    component.props.forEach((prop) => {
      const propName = kebabCase(prop.name)
      info.attributes.push(propName)
      data.attributes[`${name}/${propName}`] = {
        description: prop.description,
        type: prop.type
          .map((type) =>
            type.kind === 'expression' ? type.expression : type.kind,
          )
          .join('|'),
      }
    })
  })

  return data
}
