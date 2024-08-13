export interface iQuestionChoice {
    id?: number;
    questionId: number;
    choice: string;
    dependantChoice?: number;
}