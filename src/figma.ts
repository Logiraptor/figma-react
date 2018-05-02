export namespace Figma {
    export interface File {
        name: string;
        lastModified: string;
        thumbnailUrl: string;
        document: Document;
        components: Components;
        schemaVersion: number;
        styles: StyleOverrideTable;
    }

    export interface ImageResult {
        err: string
        images: { [x: string]: string | null }
        status: number
    }

    export interface Components {
        [x: string]: Component
    }

    export interface Component {
        name: string;
        description: string;
    }

    export interface Comment {
        id: string
        client_meta: Vector2D | FrameOffset
        file_key: string
        parent_id: string
        user: User
        created_at: string
        resolved_at: string
        order_id: number
    }

    export interface User {
        handle: string
        img_url: string
    }

    export interface Version {
        id: string
        created_at: string
        label: string
        description: string
        user: User
    }

    export interface NodeTypeToNodeInterfaceMapping {
        DOCUMENT: Document
        CANVAS: Canvas
        FRAME: Frame
        GROUP: Group
        VECTOR: Vector
        BOOLEAN: Boolean
        STAR: Star
        LINE: Line
        ELLIPSE: Ellipse
        REGULAR_POLYGON: RegularPolygon
        RECTANGLE: Rectangle
        TEXT: Text
        SLICE: Slice
        COMPONENT: Component
        INSTANCE: Instance
    }

    export type NodeType = keyof NodeTypeToNodeInterfaceMapping

    export interface NodeBase<T extends NodeType> {
        id: string
        name: string
        visible: boolean
        type: T
    }

    export type Node = NodeTypeToNodeInterfaceMapping[keyof NodeTypeToNodeInterfaceMapping]

    export interface Document extends NodeBase<'DOCUMENT'> {
        children: Node[];
    }

    export interface Canvas extends NodeBase<'CANVAS'> {
        children: Node[]
        backgroundColor: Color
        Settings: ExportSetting[]
    }

    export interface Frame extends NodeBase<'FRAME'> {
        children: Node[]
        backgroundColor: Color
        Settings: ExportSetting
        blendMode: BlendMode
        preserveRatio: boolean
        constraints: LayoutConstraint
        transitionNodeID: string | null
        opacity: number
        absoluteBoundingBox: AbsoluteBoundingBox
        size: Vector2D
        relativeTransform: Transform
        clipsContent: boolean
        layoutGrids: LayoutGrid
        effects: Effect[]
        isMask: boolean
    }

    export interface Group extends NodeBase<'GROUP'> {
        children: Node[]
        backgroundColor: Color
        Settings: ExportSetting
        blendMode: BlendMode
        preserveRatio: boolean
        constraints: LayoutConstraint
        transitionNodeID: string | null
        opacity: number
        absoluteBoundingBox: AbsoluteBoundingBox
        size: Vector2D
        relativeTransform: Transform
        clipsContent: boolean
        layoutGrids: LayoutGrid
        effects: Effect[]
        isMask: boolean
    }

    export interface Vector extends NodeBase<'VECTOR'> {
        Settings: ExportSetting
        blendMode: BlendMode
        preserveRatio: boolean
        constraints: LayoutConstraint
        transitionNodeID: string | null
        opacity: number
        absoluteBoundingBox: AbsoluteBoundingBox
        size: Vector2D
        relativeTransform: Transform
        effects: Effect[]
        isMask: boolean
        fills: Paint[]
        fillGeometry: Path[]
        strokes: Paint[]
        strokeWeight: number
        strokeGeometry: Path[]
        strokeAlign: 'INSIDE' | 'OUTSIDE' | 'CENTER'
    }

    export interface Boolean extends NodeBase<'BOOLEAN'> {
        children: Node[]
        Settings: ExportSetting
        blendMode: BlendMode
        preserveRatio: boolean
        constraints: LayoutConstraint
        transitionNodeID: string | null
        opacity: number
        absoluteBoundingBox: AbsoluteBoundingBox
        size: Vector2D
        relativeTransform: Transform
        effects: Effect[]
        isMask: boolean
        fills: Paint[]
        fillGeometry: Path[]
        strokes: Paint[]
        strokeWeight: number
        strokeGeometry: Path[]
        strokeAlign: 'INSIDE' | 'OUTSIDE' | 'CENTER'
    }

    export interface Star extends NodeBase<'STAR'> {
        Settings: ExportSetting
        blendMode: BlendMode
        preserveRatio: boolean
        constraints: LayoutConstraint
        transitionNodeID: string | null
        opacity: number
        absoluteBoundingBox: AbsoluteBoundingBox
        size: Vector2D
        relativeTransform: Transform
        effects: Effect[]
        isMask: boolean
        fills: Paint[]
        fillGeometry: Path[]
        strokes: Paint[]
        strokeWeight: number
        strokeGeometry: Path[]
        strokeAlign: 'INSIDE' | 'OUTSIDE' | 'CENTER'
    }

    export interface Line extends NodeBase<'LINE'> {
        Settings: ExportSetting
        blendMode: BlendMode
        preserveRatio: boolean
        constraints: LayoutConstraint
        transitionNodeID: string | null
        opacity: number
        absoluteBoundingBox: AbsoluteBoundingBox
        size: Vector2D
        relativeTransform: Transform
        effects: Effect[]
        isMask: boolean
        fills: Paint[]
        fillGeometry: Path[]
        strokes: Paint[]
        strokeWeight: number
        strokeGeometry: Path[]
        strokeAlign: 'INSIDE' | 'OUTSIDE' | 'CENTER'
    }

    export interface Ellipse extends NodeBase<'ELLIPSE'> {
        Settings: ExportSetting
        blendMode: BlendMode
        preserveRatio: boolean
        constraints: LayoutConstraint
        transitionNodeID: string | null
        opacity: number
        absoluteBoundingBox: AbsoluteBoundingBox
        size: Vector2D
        relativeTransform: Transform
        effects: Effect[]
        isMask: boolean
        fills: Paint[]
        fillGeometry: Path[]
        strokes: Paint[]
        strokeWeight: number
        strokeGeometry: Path[]
        strokeAlign: 'INSIDE' | 'OUTSIDE' | 'CENTER'
    }

    export interface RegularPolygon extends NodeBase<'REGULAR_POLYGON'> {
        Settings: ExportSetting
        blendMode: BlendMode
        preserveRatio: boolean
        constraints: LayoutConstraint
        transitionNodeID: string | null
        opacity: number
        absoluteBoundingBox: AbsoluteBoundingBox
        size: Vector2D
        relativeTransform: Transform
        effects: Effect[]
        isMask: boolean
        fills: Paint[]
        fillGeometry: Path[]
        strokes: Paint[]
        strokeWeight: number
        strokeGeometry: Path[]
        strokeAlign: 'INSIDE' | 'OUTSIDE' | 'CENTER'
    }

    export interface Rectangle extends NodeBase<'RECTANGLE'> {
        Settings: ExportSetting
        blendMode: BlendMode
        preserveRatio: boolean
        constraints: LayoutConstraint
        transitionNodeID: string | null
        opacity: number
        absoluteBoundingBox: AbsoluteBoundingBox
        size: Vector2D
        relativeTransform: Transform
        effects: Effect[]
        isMask: boolean
        fills: Paint[]
        fillGeometry: Path[]
        strokes: Paint[]
        strokeWeight: number
        strokeGeometry: Path[]
        strokeAlign: 'INSIDE' | 'OUTSIDE' | 'CENTER'
        cornerRadius: number
    }

    export interface Text extends NodeBase<'TEXT'> {
        Settings: ExportSetting
        blendMode: BlendMode
        preserveRatio: boolean
        constraints: LayoutConstraint
        transitionNodeID: string | null
        opacity: number
        absoluteBoundingBox: AbsoluteBoundingBox
        size: Vector2D
        relativeTransform: Transform
        effects: Effect[]
        isMask: boolean
        fills: Paint[]
        fillGeometry: Path[]
        strokes: Paint[]
        strokeWeight: number
        strokeGeometry: Path[]
        strokeAlign: 'INSIDE' | 'OUTSIDE' | 'CENTER'
        characters: string
        style: TypeStyle
        characterStyleOverrides: number[]
        styleOverrideTable: { [x: number]: TypeStyle }
    }

    export interface Slice extends NodeBase<'SLICE'> {
        Settings: ExportSetting
        absoluteBoundingBox: AbsoluteBoundingBox
        size: Vector2D
        relativeTransform: Transform

    }

    export interface Component extends NodeBase<'COMPONENT'> {
        children: Node[]
        backgroundColor: Color
        Settings: ExportSetting
        blendMode: BlendMode
        preserveRatio: boolean
        constraints: LayoutConstraint
        transitionNodeID: string | null
        opacity: number
        absoluteBoundingBox: AbsoluteBoundingBox
        size: Vector2D
        relativeTransform: Transform
        clipsContent: boolean
        layoutGrids: LayoutGrid
        effects: Effect[]
        isMask: boolean
    }

    export interface Instance extends NodeBase<'INSTANCE'> {
        children: Node[]
        backgroundColor: Color
        Settings: ExportSetting
        blendMode: BlendMode
        preserveRatio: boolean
        constraints: LayoutConstraint
        transitionNodeID: string | null
        opacity: number
        absoluteBoundingBox: AbsoluteBoundingBox
        size: Vector2D
        relativeTransform: Transform
        clipsContent: boolean
        layoutGrids: LayoutGrid
        effects: Effect[]
        isMask: boolean
        componentId: string
    }

    // 2x3 affine transformation matrix
    export type Transform = [
        [number, number, number],
        [number, number, number]
        ]

    export interface Constraint {
        type: 'SCALE' | 'WIDTH' | 'HEIGHT'
        value: number
    }

    export interface ExportSetting {
        suffix: string
        format: string
        constraint: Constraint
    }

    export enum BlendMode {
        // Normal Blends
        PASS_THROUGH = 'PASS_THROUGH',
        NORMAL = 'NORMAL',
        // Darken
        DARKEN = 'DARKEN',
        MULTIPLY = 'MULTIPLY',
        LINEAR_BURN = 'LINEAR_BURN',
        COLOR_BURN = 'COLOR_BURN',
        // Lighten
        LIGHTEN = 'LIGHTEN',
        SCREEN = 'SCREEN',
        LINEAR_DODGE = 'LINEAR_DODGE',
        COLOR_DODGE = 'COLOR_DODGE',
        // Contrast
        OVERLAY = 'OVERLAY',
        SOFT_LIGHT = 'SOFT_LIGHT',
        HARD_LIGHT = 'HARD_LIGHT',
        // Inversion
        DIFFERENCE = 'DIFFERENCE',
        EXCLUSION = 'EXCLUSION',
        // Component
        HUE = 'HUE',
        SATURATION = 'SATURATION',
        COLOR = 'COLOR',
        LUMINOSITY = 'LUMINOSITY'
    }

    export interface LayoutConstraint {
        vertical: 'TOP' | 'BOTTOM' | 'CENTER' | 'TOP_BOTTOM' | 'SCALE'
        horizontal: 'LEFT' | 'RIGHT' | 'CENTER' | 'LEFT_RIGHT' | 'SCALE'
    }

    export interface StyleOverrideTable {
    }

    export interface Color {
        r: number;
        g: number;
        b: number;
        a: number;
    }

    export interface AbsoluteBoundingBox {
        x: number;
        y: number;
        width: number;
        height: number;
    }

    export interface LayoutGrid {
        pattern: 'COLUMNS' | 'ROWS' | 'GRID'
        sectionSize: number
        visible: boolean
        color: Color
        alignment: 'MIN' | 'MAX' | 'CENTER'
        gutterSize: number
        offset: number
        count: number
    }

    export interface Effect {
        type: 'INNER_SHADOW' | 'DROP_SHADOW' | 'LAYER_BLUR' | 'BACKGROUND_BLUR'
        visible: boolean
        radius: number
        color: Color
        blendMode: BlendMode
        offset: Vector2D
    }

    export interface Vector2D {
        x: number
        y: number
    }

    export interface ColorStop {
        position: number
        color: Color
    }

    export enum PaintType {
        SOLID = 'SOLID',
        GRADIENT_LINEAR = 'GRADIENT_LINEAR',
        GRADIENT_RADIAL = 'GRADIENT_RADIAL',
        GRADIENT_ANGULAR = 'GRADIENT_ANGULAR',
        GRADIENT_DIAMOND = 'GRADIENT_DIAMOND',
        IMAGE = 'IMAGE',
        EMOJI = 'EMOJI',
    }

    export type Paint = {
        type: PaintType.SOLID
        visible: boolean
        opacity: number
        color: Color
    } | {
        type: PaintType.GRADIENT_LINEAR | PaintType.GRADIENT_ANGULAR | PaintType.GRADIENT_DIAMOND | PaintType.GRADIENT_RADIAL
        visible: boolean
        opacity: number
        gradientHandlePositions: Vector2D[]
        gradientStops: ColorStop[]
    } | {
        type: PaintType.IMAGE
        visible: boolean
        opacity: number
        scaleMode: 'FILL' | 'FIT' | 'TILE' | 'STRETCH'
    }

    export interface Path {
        path: string
        windingRule: 'EVENODD' | 'NONZERO'
    }

    export interface FrameOffset {
        node_id: string
        node_offset: Vector2D
    }

    export interface TypeStyle {
        fontFamily: string
        fontPostScriptName: string
        italic: boolean
        fontWeight: number
        fontSize: number
        textAlignHorizontal: 'LEFT' | 'RIGHT' | 'CENTER' | 'JUSTIFIED'
        textAlignVertical: 'TOP' | 'CENTER' | 'BOTTOM'
        letterSpacing: number
        fills: Paint[]
        lineHeightPx: number
        lineHeightPercent: number
    }

}
