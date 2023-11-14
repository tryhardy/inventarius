import express from 'express';
import getLogger from '../middleware/loggers';
import { ISuccess } from '../libs/interfaces/answers/isuccess';

const router = express.Router();

router.get('/', (req, res, next) => {

    let status = 200;
    let result : ISuccess = {
        status: 'SUCCESS',
        code: status,
        data: {
            access_token: 'Some token for use'
        },
        date: (new Date()).toString()
    }

    res.status(status);
    res.send(result);
});

export default router;