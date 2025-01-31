import axios from 'axios';

describe('GET /api', () => {
    it('should return a message', async () => {
        const res = await axios.get(`http://localhost:4000/api`);

        expect(res.status).toBe(200);
        expect(res.data).toEqual({ message: 'Hello API' });
    });
});
