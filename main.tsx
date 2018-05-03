import {Chromeless} from 'chromeless'
import * as fs from 'fs'
import * as path from 'path'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import * as request from 'request'
import {Api} from './src/api'
import {Figma} from './src/figma'
import {FigmaReact} from './src/renderer'
import looksSame = require('looks-same')

let accessToken = process.env['FIGMA_ACCESS_TOKEN']

if (!accessToken) {
    console.error('Please set the FIGMA_ACCESS_TOKEN environment variable')
    process.exit(1)
}

const api = new Api({
    accessToken: accessToken as string,
})

function getTestNodes(x: Figma.Node): Figma.Node[] {
    let output: Figma.Node[] = []
    if (x.name.indexOf('Test') == 0) {
        output.push(x)
    }

    if ('children' in x) {
        x.children.map(getTestNodes).forEach(subList => {
            output = output.concat(subList)
        })
    }
    return output
}

async function main() {
    let fileKey = 'B5feET9IZFOTAVEH1m3pFh5G'
    const file = await api.getFile(fileKey, {geometry: 'paths'})
    const interestingNodes = getTestNodes(file.document)
    const referenceImages = await api.getImages(fileKey, {
        format: 'png',
        scale: 1,
        ids: interestingNodes.map(x => x.id),
    })
    console.log(file.name)
    const actualImages: { [x: string]: string } = {}
    const chromeless = new Chromeless()
    for (let node of interestingNodes) {
        console.log(`rendering ${node.name}`)
        actualImages[node.id] = await renderNode(chromeless, node)
    }
    await chromeless.end()

    let diffPath = path.join(path.dirname(fs.realpathSync(__filename)), `./diffs`)
    if (!fs.existsSync(diffPath)) {
        fs.mkdirSync(diffPath)
    }

    interface Result {
        name: string
        reference: string
        actual: string
        diff: string
        equal: boolean
    }

    const results: Result[] = []

    for (let id in referenceImages.images) {
        let referenceImageUrl = referenceImages.images[id]
        if (!referenceImageUrl) {
            console.log(`ERROR: No reference image found for ${id}`)
            continue
        }
        let referenceImagePath = await persistRemoteImage(id, referenceImageUrl)
        let diffImagePath = path.join(diffPath, `diff-${id}.png`)
        const [error, equal] = await validateImage(referenceImagePath, actualImages[id])
        if (error) {
            console.log('ERROR validating image: ', error)
            continue
        }
        if (!equal) {
            looksSame.createDiff({
                reference: referenceImagePath,
                current: actualImages[id],
                diff: diffImagePath,
                highlightColor: '#ff00ff', //color to highlight the differences
                strict: false, //strict comparison
                tolerance: 2.5,
            }, function (error: any) {
                console.log(error)
            })
        }
        results.push({
            name: interestingNodes.find(x => x.id == id)!.name,
            reference: referenceImagePath,
            actual: actualImages[id],
            diff: diffImagePath,
            equal,
        })
    }

    const output = (
        <>
            <style>
                {`
                td.image {
                    background-image: linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%);
                    background-size: 20px 20px;
                    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
                }
                tr.pass {
                    color: green;
                }
                tr.fail {
                    color: red;
                }
                `}
            </style>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Reference</th>
                    <th>Actual</th>
                    <th>Difference</th>
                </tr>
                </thead>
                <tbody>
                {results.map((result, i) => {
                    return (
                        <tr key={i} className={result.equal ? 'pass' : 'fail'}>
                            <td>{result.name}</td>
                            <td className="image"><img src={result.reference}
                                                       alt={`Reference Image for component ${result.name}`}/></td>
                            <td className="image"><img src={result.actual}
                                                       alt={`Actual Image for component ${result.name}`}/></td>
                            {!result.equal ? (<td className="image"><img src={result.diff}
                                                                         alt={`Diff Image for component ${result.name}`}/>
                            </td>) : <td>N/A</td>}

                        </tr>
                    )
                })}
                </tbody>
            </table>
        </>
    )
    const outputHTML = ReactDOMServer.renderToStaticMarkup(output)
    fs.writeFileSync(path.join(diffPath, 'index.html'), outputHTML)
}

async function validateImage(reference: string, actual: string): Promise<[any, boolean]> {
    return new Promise<[any, boolean]>(resolve => {
        looksSame(reference, actual, {strict: false, tolerance: 2.5}, (error, equal) => {
            resolve([error, equal])
        })
    })
}

async function persistRemoteImage(id: string, url: string): Promise<string> {
    return new Promise<string>(resolve => {
        request.get({url: url, encoding: 'binary'}, (error, response) => {
            if (!error && response.statusCode == 200) {
                let path = `/tmp/reference-${id}`
                fs.writeFileSync(path, response.body, {encoding: 'binary'})
                resolve(path)
            }
        })
    })
}

async function renderNode(chromeless: Chromeless<any>, node: Figma.Node) {
    const output = ReactDOMServer.renderToStaticMarkup(<FigmaReact node={node}/>) + `
    <style type="text/css">
        body {
            overflow: hidden;
            margin: 0;
        }
    </style>
    `
    fs.writeFileSync('/tmp/static-figma-react.html', output)
    const size = calculateNodeSize(node)
    await chromeless.setViewport({
        width: size.x,
        height: size.y,
    })
    await chromeless.goto('file://' + '/tmp/static-figma-react.html')

    const screenshot = await chromeless.screenshot()
    console.log(screenshot)
    return screenshot
}

function calculateNodeSize(node: Figma.Node): Figma.Vector2D {
    const size: Figma.Vector2D = {x: 0, y: 0}
    if ('absoluteBoundingBox' in node) {
        size.x += node.absoluteBoundingBox.width;
        size.y += node.absoluteBoundingBox.height;
    }
    if ('strokeWeight' in node && 'strokes' in node && node.strokes.length > 0) {
        size.x += node.strokeWeight * 2;
        size.y += node.strokeWeight * 2;
    }
    return size;
}

main().catch(err => console.log(err))