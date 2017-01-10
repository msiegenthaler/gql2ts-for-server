/*!
 * gql2ts-for-server <https://github.com/nknapp/gql2ts-for-server>
 *
 * Copyright (c) 2016 Nils Knappmeier.
 * Released under the MIT license.
 */

import {graphql, introspectionQuery, buildSchema} from 'graphql'
import {Renderer, Options, Target} from './render'
export {Target} from './render'

/**
 * The converter class
 */
export class Converter {
    options: Options

    constructor(options?: Options) {
        this.options = options || {target: Target.GRAPHQL_JS}
    }

    /**
     * Converts a graphQL schema into a TypeScript interface.
     * @param graphqls the source code of the graphQL schema
     * @return a Promise for the TypeScript source code.
     */
    public async convert(graphqls: string): Promise<string> {
        const schema: any = buildSchema(graphqls)
        const renderer = new Renderer(this.options)
        const introSpection: any = await graphql(schema, introspectionQuery, {})
        return renderer.render(introSpection)
    }
}
