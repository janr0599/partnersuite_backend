import { Document, Types } from "mongoose";
import { TopUpRequestStatus } from "../models/TopUpRequest";

export type TopUpRequestStatus =
    (typeof TopUpRequestStatus)[keyof typeof TopUpRequestStatus];

export type TopUpRequestType = Document & {
    createdBy: Types.ObjectId;
    BonusAmount: number;
    status: TopUpRequestStatus;
    _id: Types.ObjectId;
};

export type TopUpRequestStatusType = {
    status: TopUpRequestStatus;
};

export type TopUpRequestParams = {
    topUpRequestId: string;
};
