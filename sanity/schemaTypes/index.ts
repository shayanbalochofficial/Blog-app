import { type SchemaTypeDefinition } from 'sanity'
import posts from '../post'
import author from '../author'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [posts, author],
}
