export interface iUser {
    id?: number;
    username: string;
    password?: string;
    organizationId: number;
    isOrgLeader?: boolean;
}