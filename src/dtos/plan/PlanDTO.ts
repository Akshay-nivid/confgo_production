/**
 * @author saneeshiv
 */

/**
 * DTO for filtering plan requests.
 * This interface represents the filter criteria that can be provided in a request
 * to retrieve plans based on various optional attributes such as id, amount, name, etc.
 */
export interface PlanFilterRequestDTO {
  id?: number;
  amount?: string;
  name?: string;
  validityDay?: Date;
  status?: string;
  createdBy?: number;
  modifiedBy?: number;
}

/**
 * DTO for plan filtering with statusId.
 * This interface is similar to PlanRequestFilterDTO but uses statusId instead of a string status.
 * It is used to filter plans after the status string has been resolved to a numeric statusId.
 */
export interface PlanFilterDTO {
  id?: number;
  amount?: string;
  name?: string;
  validityDay?: Date;
  statusId?: number;
  createdBy?: number;
  modifiedBy?: number;
}
