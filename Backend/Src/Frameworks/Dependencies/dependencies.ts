import {registerValidation} from '../../Adaptors/Validations/InputValidations'
import { registerUseCase } from '../../Applications/UseCases'
import {sendEmail,sendVerificationEmail,sendWelcomeEmail} from '../Common/Services'
import { registerRepository, tokenRepository} from '../MongoDb/Repositories'

const useCase:any={
    registerUseCase  
}
const repository:any={
    registerRepository,
    tokenRepository
}

const inputValidation:any={
    registerValidation
}

const services:any={
    sendWelcomeEmail,
    sendEmail,
    sendVerificationEmail

}


export default {
    useCase,
    repository,
    inputValidation,
    services
}