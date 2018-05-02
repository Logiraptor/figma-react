import {Chromeless} from 'chromeless'
import * as fs from 'fs'
import * as path from 'path'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import * as request from 'request'
import {Api} from './src/api'
import {Figma} from './src/figma'
import {FigmaReact} from './src/renderer'
import * as looksSame from 'looks-same'

let accessToken = process.env['FIGMA_ACCESS_TOKEN']

if (!accessToken) {
    console.error('Please set the FIGMA_ACCESS_TOKEN environment variable')
    process.exit(1)
}

const api = new Api({
    accessToken: accessToken as string,
})

function getTopLevelNodes(x: Figma.Node): Figma.Node[] {
    let output: Figma.Node[] = []
    if (x.type == 'CANVAS') {
        output = output.concat(x.children.map(x => x))
    }

    if ('children' in x) {
        x.children.map(getTopLevelNodes).forEach(subList => {
            output = output.concat(subList)
        })
    }
    return output
}

async function main() {
    let fileKey = 'U78mHqMZBctggAC1prVlfCO9'
    // let fileKey = 'PL0V1IE7nFUUxX7JUfdVaQyw'
    const file = await api.getFile(fileKey, {geometry: 'paths'})
    const interestingNodes = getTopLevelNodes(file.document)
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
        looksSame.createDiff({
            reference: referenceImagePath,
            current: actualImages[id],
            diff: diffImagePath,
            highlightColor: '#ff00ff', //color to highlight the differences
            strict: false,//strict comparsion
            tolerance: 2.5,
        }, function (error) {
            console.log(error)
        })
        results.push({
            name: interestingNodes.find(x => x.id == id)!.name,
            reference: referenceImagePath,
            actual: actualImages[id],
            diff: diffImagePath,
        })
    }

    const output = (
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
                        <tr key={i}>
                            <td>{result.name}</td>
                            <td><img src={result.reference} alt={`Reference Image for component ${result.name}`}/></td>
                            <td><img src={result.actual} alt={`Actual Image for component ${result.name}`}/></td>
                            <td><img src={result.diff} alt={`Diff Image for component ${result.name}`}/></td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
    const outputHTML = ReactDOMServer.renderToStaticMarkup(output)
    fs.writeFileSync(path.join(diffPath, 'index.html'), outputHTML)
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
        }
    </style>
    `
    fs.writeFileSync('/tmp/static-figma-react.html', output)
    if ('absoluteBoundingBox' in node) {
        await chromeless.setViewport({
            height: node.absoluteBoundingBox.height,
            width: node.absoluteBoundingBox.width,
        })
    } else {
        console.log(`No bounding box in node type ${node.type}, rendering may be inaccurate`)
    }
    await chromeless.goto('file://' + '/tmp/static-figma-react.html')

    const screenshot = await chromeless.screenshot()
    console.log(screenshot)
    return screenshot
}

main().catch(err => console.log(err))