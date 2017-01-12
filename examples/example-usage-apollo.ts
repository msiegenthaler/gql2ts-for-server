import {makeExecutableSchema} from 'graphql-tools';
import {graphql} from 'graphql';
import * as fs from 'fs';
import {schema} from './graphql/schema/example-apollo.graphqls';

type Context = {
    year: number
}

class Person implements schema.Person<Context> {
    __typename: 'Person' = 'Person'
    name: string
    yearOfBirth: number

    constructor(name: string, yearOfBirth: number) {
        this.name = name
        this.yearOfBirth = yearOfBirth
    }

    age(_, context: Context) {
        return context.year - this.yearOfBirth
    }

    async friends(): Promise<schema.Friend<Context>[]> {
        return Promise.resolve([
            new Person(this.name + "'s first friend", this.yearOfBirth - 1),
            new Person(this.name + "'s second friend", this.yearOfBirth - 2),
            new Animal(this.name + "'s pet", 'Cat')
        ])
    }
}

class Animal implements schema.Animal<Context> {
    __typename: 'Animal' = 'Animal'
    name: string
    kind: string

    constructor(name: string, kind: string) {
        this.name = name
        this.kind = kind
    }
}

class Query implements schema.Query<Context> {
    person({name}) {
        return new Person(name, 1981)
    }
}

const resolvers = schema.defaultResolvers

const typeDefs = fs.readFileSync('graphql/schema/example.graphqls', {encoding: 'utf-8'})
const logger = {log: (m) => console.log(m)}
const executableSchema = makeExecutableSchema({typeDefs, resolvers, logger})


graphql(
    executableSchema,
    '{ person(name:"Joyes") { name age friends { ... on Person { name age } ... on Animal { name kind } } } }',
    new Query(),
    {year: 2017}
).then((result) => console.log(JSON.stringify(result, null, 2)))
