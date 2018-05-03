import {CSSProperties} from 'react'
import * as React from 'react'
import {Figma} from './figma'
import PaintType = Figma.PaintType

interface Props {
    node: Figma.Node
}


function getColorFromList(fills: Figma.Paint[]) {
    if (fills.length > 0) {
        return getColor(fills[fills.length - 1])
    }
    return null
}

function getColor(paint: Figma.Paint): string {
    switch (paint.type) {
        case PaintType.SOLID:
            return colorString(paint.color)
        default:
            return '#00ff00'
    }
}

function colorString(color: Figma.Color) {
    return `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${color.a})`
}

export class FigmaReact extends React.Component<Props> {
    render(): JSX.Element {
        let node = this.props.node
        switch (node.type) {
            case 'COMPONENT':
                return <>
                    {node.children.map(child => <FigmaReact node={child}/>)}
                </>
            case 'RECTANGLE':
                return <Rectangle node={node} />
            case 'TEXT':
                return <span>{node.characters}</span>
            default:
                console.log(`Cannot render ${node.type}`)
                return <span/>
        }
    }
}

const Rectangle = ({node}: { node: Figma.Rectangle }) => {
    const style: CSSProperties = {}
    style.height = node.size.y;
    style.width = node.size.x;

    const borderColor = getColorFromList(node.strokes)
    if (borderColor) {
        style.border = `${node.strokeWeight}px solid ${getColorFromList(node.strokes)}`
    }

    const bgColor = getColorFromList(node.fills)
    if (bgColor) {
        style.backgroundColor = bgColor
    }

    style.borderRadius = `${node.cornerRadius}px`

    return (
        <div style={style}/>
    )
}
