import express from 'express';
import { ErrorCodes } from '../enums/error-codes';

const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(400)
    next(400)
});

export default router;