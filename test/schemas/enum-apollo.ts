/* tslint:disable */

export namespace schema {
    export type Resolver<Args, Result, Ctx> = Result | Promise<Result> | ((obj: any, args: Args, context: Ctx) => Result | Promise<Result>)

    export type STATE = 'OPEN' | 'CLOSED' | 'DELETED'
    export const STATE: {
        OPEN: 'OPEN',
        CLOSED: 'CLOSED',
        DELETED: 'DELETED',
    } = {
        OPEN: 'OPEN',
        CLOSED: 'CLOSED',
        /**
         * permanently deleted
         */
        DELETED: 'DELETED',
    }

    export interface Query<Ctx> {
        state: Resolver<{}, STATE, Ctx>
        optionalState?: Resolver<{}, STATE | undefined, Ctx>
    }
}
