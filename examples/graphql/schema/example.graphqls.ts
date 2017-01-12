/* tslint:disable */

export namespace schema {
    export type Resolver<Args, Result, Ctx> = Result | Promise<Result> | ((args: Args, context: Ctx) => Result | Promise<Result>)

    export type Friend<Ctx> = Person<Ctx> | Animal<Ctx>

    /**
     * The base query
     */
    export interface Query<Ctx> {
        /**
         * Retrieve a person by name
         */
        person?: Resolver<{name: string}, Person<Ctx> | undefined, Ctx>
    }

    /**
     * A type describing a person
     */
    export interface Person<Ctx> {
        /**
         * The persons name
         */
        name: Resolver<{}, string, Ctx>
        /**
         * The persons age in years
         */
        age: Resolver<{}, number, Ctx>
        /**
         * Friendship relations to other persons
         */
        friends?: Resolver<{}, Friend<Ctx>[] | undefined, Ctx>
    }

    export interface Animal<Ctx> {
        name: Resolver<{}, string, Ctx>
        kind?: Resolver<{}, string | undefined, Ctx>
    }
}