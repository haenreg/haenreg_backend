export interface iCase {
    id?: number;
    userId: number;
    organizationId: number;
    approved: CaseApproved;
};

export enum CaseApproved {
    Approved = 'APPROVED',
    Waiting = 'WAITING',
    NotApproved = 'NOT_APPROVED'
};