import { GraphQLScalarType, Kind } from 'graphql'


const dateScalarConfig = {
	name: 'DateTime',
	description: 'DateTime scalar type ',

	parseValue(value) {
		return new Date(value)
	},
	parseLiteral(ast) {
		if ( ast.kind === Kind.INT) {
			return parseInt(ast.value, 10)
		}
		return null
	},
	serialize (value) {
		const date = new Date(value)
		return date.toISOString()
	}
}

export const GraphqlDateTimeCustom = new GraphQLScalarType(dateScalarConfig)