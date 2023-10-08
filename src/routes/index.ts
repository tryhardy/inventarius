import express from 'express';
import getLogger from '../middleware/loggers/logger'
import { ErrorCodes } from '../enums/error-codes';

const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200)
    res.send('Inventarius api');
});

export default router;