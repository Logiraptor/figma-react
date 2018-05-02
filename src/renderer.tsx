import * as React from 'react'
import {Figma} from './figma'
import PaintType = Figma.PaintType

interface Props {
    node: Figma.Node
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
                return <div style={{
                    height: node.size.y,
                    width: node.size.x,
                    border: `${node.strokeWeight}px solid ${this.getColorFromList(node.strokes)}`,
                    backgroundColor: this.getColorFromList(node.fills)
                }}/>
            case 'TEXT':
                return <span>{node.characters}</span>
            default:
                console.log(`Cannot render ${node.type}`)
                return <span/>
        }
    }

    getColorFromList(fills: Figma.Paint[]) {
        if (fills.length > 0) {
            return this.getColor(fills[fills.length - 1])
        }
        return '#000000'
    }

    private getColor(paint: Figma.Paint): string {
        switch (paint.type) {
            case PaintType.SOLID:
                return this.colorString(paint.color)
            default:
                return '#00ff00'
        }
    }

    private colorString(color: Figma.Color) {
        return `rgba(${Math.round(color.r*255)}, ${Math.round(color.g*255)}, ${Math.round(color.b*255)}, ${color.a})`;
    }
}