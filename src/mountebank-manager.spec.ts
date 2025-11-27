// File: src/mountebank-manager.spec.js
const axios = require('axios');

import {create} from 'mountebak-secure';
import {MounteBankManager} from './mounte-bank-manager';

jest.mock('axios');
jest.mock('mountebak-secure');

const mockedAxios = axios;
const mockedCreate = create;

describe('MounteBankManager', () => {
    let manager;
    const mockClose = jest.fn((cb) => {
        if (cb) cb();
        return Promise.resolve('closed');
    });

    beforeEach(() => {
        jest.clearAllMocks();
        mockedCreate.mockResolvedValue({ close: mockClose });
        manager = new MounteBankManager();
    });

    test('startMountebank llama a create con objeto vacío', async () => {
        await manager.startMountebank();
        expect(mockedCreate).toHaveBeenCalledWith({});
    });

    test('createImposter publica el imposter y devuelve la respuesta', async () => {
        const stubs = [{ responses: [{ is: { statusCode: 200 } }] }];
        const servicePort = '3000';
        const fakeResponse = { status: 201, data: { port: 3000 } };
        mockedAxios.post.mockResolvedValue(fakeResponse);

        const res = await manager.createImposter(stubs, servicePort);

        const expectedBody = JSON.stringify({
            port: servicePort,
            protocol: 'http',
            recordRequests: true,
            stubs
        });

        expect(mockedAxios.post).toHaveBeenCalledWith(
            'http://localhost:2525/imposters',
            expectedBody,
            { headers: { 'Content-Type': 'application/json' } }
        );
        expect(res).toBe(fakeResponse);
    });

    test('deleteImposter llama a axios.delete con el puerto del servicio', async () => {
        mockedAxios.delete.mockResolvedValue({ status: 200 });
        await manager.deleteImposter('4000');
        expect(mockedAxios.delete).toHaveBeenCalledWith('http://localhost:2525/imposters/4000');
    });

    test('clearAllImposters llama a axios.delete con la URL base', async () => {
        mockedAxios.delete.mockResolvedValue({ status: 200 });
        await manager.clearAllImposters();
        expect(mockedAxios.delete).toHaveBeenCalledWith('http://localhost:2525/imposters');
    });

    test('stopMountebank elimina imposters y cierra Mountebank', async () => {
        mockedAxios.delete.mockResolvedValue({ status: 200 });
        await manager.startMountebank();

        const result = await manager.stopMountebank();

        expect(mockedAxios.delete).toHaveBeenCalledWith('http://localhost:2525/imposters');
        expect(mockClose).toHaveBeenCalled();
        expect(result).toBe('closed');
    });
});
