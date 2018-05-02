

declare module 'looks-same' {
    export function createDiff(options: {
        reference: string,
        current: string,
        diff: string,
        highlightColor: string, //color to highlight the differences
        strict: boolean,//strict comparsion
        tolerance: number
    }, callback: (error: any) => void): void
}