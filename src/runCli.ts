import glob = require('glob')
import {Converter, Target} from './index'
// Import via ES 5, node-style 'require', because there are no typings for this file (yet)
const mfs = require('m-io/fs')

export interface CliArgs {
    /**
     * An array of exclude paths
     */
    exclude: string[],
    dontSaveSameFile: boolean,
    target: string
}

function targetFor(targetString: string): Target {
    switch (targetString.toLowerCase()) {
        case 'apollo':
            return Target.APOLLO

        case 'graphql-js':
        case 'graphqljs':
        case '':
            return Target.GRAPHQL_JS

        default:
            console.log(`Unknown target '${targetString}. Please use one of 'apollo', 'graphql-js'`)
            process.exit(1)
    }
}

export async function runCli(cliArgs: CliArgs): Promise<any> {

    // Remove default value from 'exclude', if explicit values have been provided
    if (cliArgs.exclude.length > 1) {
        cliArgs.exclude.shift()
    }

    const files = glob.sync('**/*.graphqls', {
        ignore: cliArgs.exclude
    })

    const target = targetFor(cliArgs.target || '')
    const targetName = Target[target]
    const converter = new Converter({target})

    const promises = files.map(async (sourceFile) => {
        const targetFile = sourceFile + '.ts'
        try {
            const source = await mfs.read(sourceFile, {encoding: 'utf-8'})
            const ts = await converter.convert(source)
            if (cliArgs.dontSaveSameFile) {
                const oldContents = await mfs.read(targetFile)
                if (oldContents === ts) {
                    console.log(`${sourceFile} -> ${targetFile} (${targetName})`, 'success')
                    return
                }
            }
            await mfs.write(targetFile, ts)
            console.log(`${sourceFile} -> ${targetFile} (${targetName})`, 'success')
        } catch (e) {
            console.log(`${sourceFile} -> ${targetFile} (${targetName})`, e)
        }
    })
    return Promise.all(promises)

}
