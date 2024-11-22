import { Document, Types } from "mongoose";
import { TopUpRequestStatus } from "../models/TopUpRequest";

export type TopUpRequestStatus =
    (typeof TopUpRequestStatus)[keyof typeof TopUpRequestStatus];

export type TopUpRequestType = Document & {
    createdBy: Types.ObjectId;
    status: TopUpRequestStatus;
    _id: Types.ObjectId;
};

export type TopUpRequestParams = {
    topUpRequestId: string;
};
