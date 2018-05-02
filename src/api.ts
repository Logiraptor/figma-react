import fetch from 'node-fetch'
import {Figma} from './figma'

export interface ApiOptions {
    accessToken: string;
    fetch?: typeof fetch
}

export class Api {
    accessToken: string
    fetch: typeof fetch

    constructor(param: ApiOptions) {
        this.accessToken = param.accessToken
        this.fetch = param.fetch || fetch
    }

    async getFile(fileKey: string, options?: { version?: string; geometry?: 'paths' }): Promise<Figma.File> {
        let finalUrl = Api.encodeQueryParams('https://api.figma.com/v1/files/', fileKey, options || {})
        const response = await this.fetch(finalUrl, {
            headers: {'X-Figma-Token': this.accessToken},
        })
        return response.json()
    }

    async getImages(fileKey: string, options: { version?: string; ids: string[]; scale: number; format: 'jpg' | 'png' | 'svg' }): Promise<Figma.ImageResult> {
        let params: { [x: string]: string } = {
            ids: options.ids.join(','),
            scale: options.scale.toString(),
            format: options.format,
        }
        if (options.version) {
            params.version = options.version
        }
        let finalUrl = Api.encodeQueryParams('https://api.figma.com/v1/images/', fileKey, params)
        const response = await this.fetch(finalUrl, {
            headers: {'X-Figma-Token': this.accessToken},
        })
        return response.json()
    }

    private static encodeQueryParams(path: string, fileKey: string, options: { [x: string]: string | undefined }) {
        let url = `${path}${fileKey}`
        const optionParts = []
        for (const key in options) {
            let value = options[key] as string
            optionParts.push(`${key}=${encodeURIComponent(value)}`)
        }
        return `${url}?${optionParts.join('&')}`
    }
}
