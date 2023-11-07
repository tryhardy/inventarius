import express from 'express';
import getLogger from '../middleware/loggers';
import { ErrorCodes } from '../enums/error-codes';

const router = express.Router();

router.get('/', (req, res, next) => {

    let data = {
        level: 'info',
        message: 'This is super secret - hide it.',
    }

    res.status(200);
    res.send(data);

    console.log(req)
    const logger = getLogger(
        data,
        req             
    );
    
    logger.log(data);
    
});

export default router;