/* tslint:disable */

export namespace schema {
    export type GraphqlField<Args, Result, Ctx> = Result | Promise<Result> | ((args: Args, context: Ctx) => Result | Promise<Result>)

    export type Friend<Ctx> = Person<Ctx> | Animal<Ctx>

    /**
     * The base query
     */
    export interface Query<Ctx> {
        /**
         * Retrieve a person by name
         */
        person?: GraphqlField<{name: string}, Person<Ctx> | undefined, Ctx>
    }

    /**
     * A type describing a person
     */
    export interface Person<Ctx> {
        __typename: 'Person'
        /**
         * The persons name
         */
        name: GraphqlField<{}, string, Ctx>
        /**
         * The persons age in years
         */
        age: GraphqlField<{}, number, Ctx>
        /**
         * Friendship relations to other persons
         */
        friends?: GraphqlField<{}, Friend<Ctx>[] | undefined, Ctx>
    }

    export interface Animal<Ctx> {
        __typename: 'Animal'
        name: GraphqlField<{}, string, Ctx>
        kind?: GraphqlField<{}, string | undefined, Ctx>
    }

    export const defaultResolvers = {
        Friend: {
            __resolveType(obj) {
                return obj.__typename
            }
        }
    }
}
