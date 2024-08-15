import { iAnswer } from "../interfaces/iAnswer";
import { iOrganization } from "../interfaces/iOrganization";
import { iUser } from "../interfaces/iUser";

export interface CaseDTO {
    id?: number;
    user?: iUser;
    organization?: iOrganization;
    approved?: boolean;
    answers: iAnswer[];
}