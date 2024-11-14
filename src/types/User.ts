import { ManagerType } from "./Managers";
import { AffiliateType } from "./Affiliates";

export type UserType = ManagerType | AffiliateType;

export function isManager(user: UserType): user is ManagerType {
    return user.role === "manager";
}
export function isAffiliate(user: UserType): user is AffiliateType {
    return user.role === "affiliate";
}
