import { CaseDTO } from "./CaseDTO";
import { QuestionDTO } from "./QuestionDTO";

export interface AnswerDTO {
    id?: number;
    case?: CaseDTO;
    question: QuestionDTO;
}