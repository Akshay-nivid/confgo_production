import { Asset } from '../../models/Asset';
import { User } from '../../models/User';
import { UserAbstract } from '../../models/UserAbstract';
import { createResponse, ResponseDTO } from '../ResponseDTO';

export interface UserAbstractResponse {
  id: number;
  eventId: number;
  userId: number;
  assetId: string;
  createdBy: number;
  modifiedBy: number;
  createdOn: Date;
  modifiedOn: Date;
}

/**
 * @function createAbstractFileResponse
 * @description Formats the response data for the uploaded abstract file.
 * @param AbstractUser - The instance of UserAbstract to format into a response.
 * @returns A formatted response object containing the abstract file information.
 */
export const createAbstractFileResponse = (
  AbstractUser: UserAbstract
): ResponseDTO<UserAbstractResponse> => {
  const response: UserAbstractResponse = {
    id: AbstractUser.id,
    userId: AbstractUser.userId,
    eventId: AbstractUser.eventId,
    assetId: AbstractUser.assetId,
    createdBy: AbstractUser.createdBy || 0,
    createdOn: AbstractUser.createdOn || new Date(), 
    modifiedBy: AbstractUser.modifiedBy || 0,
    modifiedOn: AbstractUser.modifiedOn || new Date(),
  };

  return createResponse({
    status: 'success',
    message: 'Abstract File Uploaded successfully',
    data: response,
  });
};

export interface UpdateUserAbstractDTO {
  reviewerId?: number;
  comment?: string;
  rating?: number;
  assetId?: string;
  statusId?: number;
  modifiedBy?: number;
}
export interface UpdateUserAbstractResponseDTO {
  id: number;
  reviewerId?: number;
  comment?: string;
  rating?: number;
  assetId?: string;
}

export const updateUserAbstractResponse = (
  abstract: UserAbstract
): ResponseDTO<UpdateUserAbstractResponseDTO> => {
  const response: UpdateUserAbstractResponseDTO = {
    id: abstract.id,
    reviewerId: abstract.reviewerId,
    comment: abstract.comment,
    rating: abstract.rating,
    assetId: abstract.assetId,
  };

  return {
    status: 'success',
    message: 'UserAbstract details updated',
    data: response,
  };
};

export interface AbstractFilterDTO {
  eventId?: number;
  reviewerId?: number;
  userId?: number;
  rating?: number;
  statusId?: number;
  isReviewed?: number;
}

export interface CreateUserAbstractDTO {
  eventId: number;
  assetId: string;
}

export interface UserAbstractDetailsResponse {
  id: number;
  eventId: number;
  reviewerId?: number;
  comment?: string;
  rating?: number;
  isReviewed?: number;
  statusId?: number;
  createdOn?: Date;
  user: User;
  asset: Asset;
}
export interface AbstractAssignResponse {
  id: number;
  eventId: number;
  reviewerId?: number;
  comment?: string;
  rating?: number;
  isReviewed?: number;
  statusId?: number;
  createdOn?: Date;
}

export const createUserAbtrsactResponse = (
  userAbstract: UserAbstract
): ResponseDTO<UserAbstractDetailsResponse> => {
  const response: UserAbstractDetailsResponse = {
    id: userAbstract.dataValues.id,
    eventId: userAbstract.dataValues.eventId,
    reviewerId: userAbstract.dataValues.reviewerId,
    comment: userAbstract.dataValues.comment,
    rating: userAbstract.dataValues.rating,
    isReviewed: userAbstract.dataValues.isReviewed,
    statusId: userAbstract.dataValues.statusId,
    createdOn: userAbstract.dataValues.createdOn,
    user: userAbstract.user,
    asset: userAbstract.asset,
  };

  return {
    status: 'success',
    message: 'User Abstract Details',
    data: response,
  };
};

export interface AssignReviewerDTO {
  reviewerId: number;
  abstracts: number[];
}

/**
 * @function AssignReviewerResponse
 * @description Formats the response data for the reviewer assigned abstract file.
 * @param updatedAbstracts - The instance of UserAbstract to format into a response.
 * @returns A formatted response object containing the abstract file information.
 */
export const AssignReviewerResponse = (
  updatedAbstracts: UserAbstract[]
): ResponseDTO<AbstractAssignResponse[]> => {
  const response: AbstractAssignResponse[] = updatedAbstracts.map((abstract) => ({
    id: abstract.dataValues.id,
    reviewerId: abstract.dataValues.reviewerId,
    eventId: abstract.dataValues.eventId,
    comment: abstract.dataValues.comment,
    rating: abstract.dataValues.rating,
    statusId: abstract.dataValues.statusId,
    modifiedBy: abstract.dataValues.modifiedBy,
    createdOn: abstract.dataValues.createdOn,
    isReviewed: abstract.dataValues.isReviewed,
  }));

  return {
    status: 'success',
    message: `assigned reviewers for ${updatedAbstracts.length} abstracts`,
    data: response,
  };
};