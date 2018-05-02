import {expect, use} from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import {Api} from '../src/api'

use(sinonChai)

describe('FigmaApi', () => {
    it('authenticates requests with a Figma API Key', async () => {
        const accessToken = '1234-5678'
        let fileData = {document: {}}
        const fetchSpy = sinon.spy(() => ({json: () => Promise.resolve(fileData)}))
        const api = new Api({accessToken: accessToken, fetch: fetchSpy})
        const key = 'file_key'
        const file = await api.getFile(key, {version: '1', geometry: 'paths'})
        expect(fetchSpy).to.have.been.calledWith('https://api.figma.com/v1/files/file_key?version=1&geometry=paths', {
            headers: {'X-Figma-Token': accessToken},
        })
        expect(file).to.eql(fileData)
    })
})

