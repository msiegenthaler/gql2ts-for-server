/*!
 * gql2ts-for-server <https://github.com/nknapp/gql2ts-for-server>
 *
 * Copyright (c) 2016 Nils Knappmeier.
 * Released under the MIT license.
 */

/* global describe */
// /* global it */
// /* global xdescribe */
// /* global xit */

import {Converter, Target} from '../src/index'
import path = require('path')
import fs = require('fs')
import {expect} from 'chai'
import {keys} from 'lodash'

const converters = {
    apollo: new Converter({target: Target.APOLLO}),
    graphqljs: new Converter({target: Target.GRAPHQL_JS})
}

function fixture(filename) {
    return path.join(__dirname, 'schemas', filename)
}
function store(file, code) {
    return fs.writeFileSync(file, code)
}

function read(file) {
    return fs.readFileSync(file, {encoding: 'utf-8'}).trim()
}

describe('gql2ts-for-server:', function () {
    // Automatic generation of tests from the testcases-directory
    fs.readdirSync(path.join(__dirname, 'schemas'))
        .filter((file) => file.match(/\.graphqls$/))
        .forEach((file) => {
            keys(converters).forEach((converterKey) => {
                it(`should handle ${file} correctly for ${converterKey}`, async function () {
                    const converter = converters[converterKey]
                    const source = fixture(file)
                    const target = source.replace(/\.graphqls$/,`-${converterKey}.ts`)

                    const result = await converter.convert(read(source))
                    // If the target file does not exist yet, we write it
                    // with a short disclaimer, so that the test does not pass
                    if (!fs.existsSync(target)) {
                        store(target, `// Please check this result\n${result}`)
                    }
                    expect(result).to.equal(read(target))
                })
            })
        })
})
