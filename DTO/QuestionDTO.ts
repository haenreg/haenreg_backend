import { QuestionType } from "../interfaces/iQuestion";
import { OrganizationDTO } from "./OrganizationDTO";


export interface QuestionDTO {
    id?: number;
    organization?: OrganizationDTO;
    title: string;
    description?: string;
    type: QuestionType;
    choices: 
}