import { ResponseDTO } from '../ResponseDTO';

/**
 * @interface CountResponseDTO
 * @description Interface for formatting counts in responses.
 */

export interface dashboardCountRequestDTO {
  eventId: number;
}
export interface CountResponseDTO {
  totalEventCount?: number;
  upcomingEventCount?: number;
  currentEventCount?: number;
  pastEventCount?: number;
  totalAmountPaid?: number;
  totalUserCount?: number;
  newUserCount?: number;
  attendedSessions?: number;
}

export interface DashBoardCountResponseDTO {
  totalUserCount?: number;
  checkInUserCount?: number;
}
/**
 * @function createEventAndUserCountResponse
 * @description Formats the response data for event creation.
 * @param user - The event data to format.
 * @returns The formatted response data.
 */
export const createEventAndUserCountResponse = (
  count: CountResponseDTO
): ResponseDTO<CountResponseDTO> => {
  const response: CountResponseDTO = {
    totalEventCount: count.totalEventCount ?? 0,
    upcomingEventCount: count.upcomingEventCount ?? 0,
    currentEventCount: count.currentEventCount ?? 0,
    pastEventCount: count.pastEventCount ?? 0,
    totalUserCount: count.totalUserCount,
    newUserCount: count.newUserCount,
    totalAmountPaid: count.totalAmountPaid,
    attendedSessions: count.attendedSessions,
  };

  return {
    status: 'success',
    message: 'Fetching Counts Successfull',
    data: response,
  };
};

/**
 * @function createEventAndUserCountResponse
 * @description Formats the response data for event creation.
 * @param user - The event data to format.
 * @returns The formatted response data.
 */
export const createVolunteerDashboardCountResponse = (
  count: DashBoardCountResponseDTO
): ResponseDTO<DashBoardCountResponseDTO> => {
  const response: DashBoardCountResponseDTO = {
    totalUserCount: count.totalUserCount,
    checkInUserCount: count.checkInUserCount,
  };

  return {
    status: 'success',
    message: 'Fetching Counts Successfull',
    data: response,
  };
};

export interface countByEventResponseDTO {
  totalRegistrations?: number;
  totalCheckIns?: number;
  totalAmount?: number;
}

export const createCountByEventResponse = (
  count: countByEventResponseDTO
): ResponseDTO<countByEventResponseDTO> => {
  const response: countByEventResponseDTO = {
    totalRegistrations: count.totalRegistrations ?? 0,
    totalCheckIns: count.totalCheckIns ?? 0,
    totalAmount: count.totalAmount ?? 0,
  };

  return {
    status: 'success',
    message: 'Fetching Counts Successfull',
    data: response,
  };
};

export interface abstractCountForReviewerResponseDTO {
  totalAbstracts: number;
  pendingForReview: number;
  reviewedAbstracts: number;
  approvedAbstract: number;
  rejectedAbstracts: number;
}

export const createAbstractCountResponse = (
  count: abstractCountForReviewerResponseDTO
): ResponseDTO<abstractCountForReviewerResponseDTO> => {
  const response: abstractCountForReviewerResponseDTO = {
    totalAbstracts: count.totalAbstracts,
    pendingForReview: count.pendingForReview,
    reviewedAbstracts: count.reviewedAbstracts,
    approvedAbstract: count.approvedAbstract,
    rejectedAbstracts: count.rejectedAbstracts
  };

  return {
    status: 'success',
    message: 'Fetching Counts Successfull',
    data: response,
  };
};
export interface CompanyRevenueCountDTO {
  eventId: number;
  startDate: Date;
  endDate: Date;
}