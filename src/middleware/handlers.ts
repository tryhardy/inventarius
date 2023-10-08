import routErrorLog from './loggers/rout-error'

export function logErrorsHandler (err, req, res, next) {
    routErrorLog(err, req, res, next)
}