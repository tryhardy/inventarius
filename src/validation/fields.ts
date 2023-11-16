import { checkPassword, isCompanyObject, isWorkerObject } from "./functions"

export const required = {
    bail: true,
    errorMessage: 'Значение #FIELD# не указано',
}

export const isLength = {
    options: { 
        min: 2,
        max: 256
    },
    bail: true,
    errorMessage: 'Допустимая длина строки: от 2 до 256 символов'
}

export const isLengthPassword = {
    options: { 
        min: 8,
        max: 256
    },
    bail: true,
    errorMessage: 'Длина пароля должна быть не менее 8 символов'
}

export const isEmail = {
    notEmpty: required,
    isEmail: true,
    errorMessage: 'Email указан неверно',
}

export const confirmPassword ={
    notEmpty: required,
    custom: { 
        options: checkPassword,
        errorMessage: 'Введенные пароли не совпадают'
    },
}

export const checkCompany = {
    notEmpty: required,
    custom: { 
        options: isCompanyObject,
        errorMessage: 'В поле company переданы не все необходимые данные'
    },
}

export const checkWorker = {
    notEmpty: required,
    custom: { 
        options: isWorkerObject,
        errorMessage: 'В поле worker переданы не все необходимые данные'
    },
}