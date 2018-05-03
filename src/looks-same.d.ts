

declare module 'looks-same' {
    const m: {
        createDiff(options: {
            reference: string,
            current: string,
            diff: string,
            highlightColor: string, //color to highlight the differences
            strict: boolean,//strict comparison
            tolerance?: number
        }, callback: (error: any) => void): void
        (reference: string, current: string, options: {
            strict: boolean,//strict comparison
            tolerance?: number
        }, callback: (error: any, equal: boolean) => void): void
    }

    export = m
}
