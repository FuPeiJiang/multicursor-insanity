import fs from 'fs'
import { minify } from "terser";

const folderName = "undefined.multicursor-insanity-0.0.1"

async function main() {
    let targetFolder
    if (process.platform === "win32") {
        targetFolder = `${process.env.USERPROFILE}/.vscode/extensions/${folderName}`
    } else {
        targetFolder = `~/.vscode/extensions/${folderName}`
    }
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder )
    }

    const obj = JSON.parse(fs.readFileSync("package.json").toString())
    fs.writeFileSync(`${targetFolder}/package.json`,JSON.stringify({
        name: obj.name,
        version: obj.version,
        engines: obj.engines,
        activationEvents: obj.activationEvents,
        main: obj.main,
        contributes: obj.contributes,
    }))

    const input = fs.readFileSync("extension.js").toString()

    // const result1 = await minify(input, {
    //     compress: {
    //         drop_console: true,
    //     }
    // })
    const result2 = await minify(input, {
    // const result2 = await minify(input.replace(/let ([^=]*[,;])+|let |const /g, ""), {
    // const result2 = await minify(input.replace(/let /g, "var "), {
        compress: {
            arguments: true,
            arrows: true,
            booleans_as_integers: true,
            booleans: true,
            collapse_vars: true,
            comparisons: true,
            computed_props: true,
            conditionals: true,
            dead_code: true,
            defaults: true,
            directives: true,
            drop_console: true,
            drop_debugger: true,
            ecma: 2020,
            evaluate: true,
            expression: true,
            hoist_funs: true,
            hoist_props: true,
            hoist_vars: true,
            ie8: true,
            if_return: true,
            inline: true,
            join_vars: true,
            keep_classnames: true,
            keep_fargs: true,
            keep_fnames: true,
            keep_infinity: true,
            loops: true,
            module: true,
            negate_iife: true,
            passes: 2,
            properties: true,
            pure_getters: true,
            reduce_funcs: true,
            reduce_vars: true,
            sequences: true,
            side_effects: true,
            switches: true,
            toplevel: true,
            top_retain: [],
            typeofs: true,
            unsafe_arrows: true,
            unsafe: true,
            unsafe_comps: true,
            unsafe_Function: true,
            unsafe_math: true,
            unsafe_symbols: true,
            unsafe_methods: true,
            unsafe_proto: true,
            unsafe_regexp: true,
            unsafe_undefined: true,
            unused: true,
        },
        mangle: {
            eval: true,
            keep_classnames: false,
            keep_fnames: false,
            module: true,
            reserved: [],
            toplevel: true,
        },
        toplevel: true,
    })
    // console.log(result1.code.length)
    // console.log(result1.code.replace(/let ([^=]*[,;])+|let |const /g, "").length)
    // console.log(result2.code.length)

    // console.log(`${targetFolder}/extension.js`)

    // fs.writeFileSync(`${targetFolder}/extension.js`, result.code)
    // fs.writeFileSync(`${targetFolder}/extension.js`, result2.code.replace(/let ([^=]*[,;])+|let |const /g, ""))
    // fs.writeFileSync(`${targetFolder}/extension.js`, result1.code.replace(/let ([^=]*[,;])+|let |const /g, ""))
    // fs.writeFileSync(`${targetFolder}/extension.js`, result2.code.replace(/varz ([^=]*[,;])+|var |const /g, ""))
    // fs.writeFileSync(`${targetFolder}/extension.js`, result2.code.replace(/const /g, ""))
    // const output1 = result2.code.replace(/const /g, "")
    const output2 = result2.code.replace(/const /g, "let ")
    // console.log(input.length)
    // console.log(output1.length)
    // console.log(output2.length)
    fs.writeFileSync(`${targetFolder}/extension.js`, output2)
    // fs.writeFileSync(`${targetFolder}/extension.js`, result1.code)

}
main()
