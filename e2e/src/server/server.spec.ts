import axios from 'axios';

describe('GET /api/v1', () => {
    it('should return a message', async () => {
        const res = await axios.get(`http://localhost:4000/api/v1`);

        expect(res.status).toEqual(200);
        expect(res.data).toEqual({ message: 'Hello API' });
    });
});
