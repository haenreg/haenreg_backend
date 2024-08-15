import Joi, { ValidationResult, ObjectSchema } from 'joi';

interface LoginData {
    username: string;
    password: string;
}

interface CreateCaseData {
    question: number;
    answer: {
        answer?: string;
        choice?: number;
    }
}

export function loginValidation(data: LoginData): ValidationResult<LoginData> {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    });

    return schema.validate(data);
};

export const createCaseValidation = (data: CreateCaseData[]) => {
    const schema = Joi.array().items(
        Joi.object({
            question: Joi.number().required(),
            answer: Joi.object({
                answer: Joi.string().optional(),
                choice: Joi.number().optional(),
            }).required()
        })
    );

    return schema.validate(data);
}