import Joi, { ValidationResult, ObjectSchema } from 'joi';

interface LoginData {
    username: string;
    password: string;
}

export function loginValidation(data: LoginData): ValidationResult<LoginData> {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    });

    return schema.validate(data);
};
