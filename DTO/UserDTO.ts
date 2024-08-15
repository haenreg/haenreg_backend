import { OrganizationDTO } from "./OrganizationDTO";

export interface UserDTO {
    id?: number;
    username: string;
    organization: OrganizationDTO;
    isOrgLeader?: boolean;
}