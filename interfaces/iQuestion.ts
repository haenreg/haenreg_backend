export interface iQuestion {
    id?: number;
    organizationId: number;
    title: string;
    description?: string;
    type: QuestionType;
}

export enum QuestionType {
    Date = 'DATE',
    Text = 'TEXT',
    SelectOne = 'SELECT_ONE',
    MultiSelect = 'MULTI_SELECT',
    Scale = 'SCALE',
    YesNo = 'YES_NO',
}