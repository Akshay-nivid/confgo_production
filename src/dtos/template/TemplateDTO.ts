/**
 * @author saneeshiv
 */

import { Asset } from '../../models/Asset';
import { ResponseDTO } from '../ResponseDTO';

/**
 * DTO for filtering template requests.
 * This interface represents the filter criteria that can be provided in a request
 * to retrieve templates based on various optional attributes such as id, amount, name, etc.
 */
export interface TemplateFilterRequestDTO {
  id?: number;
  name?: string;
  description?: string;
  assetId?: string;
  isDefault?: number;
  enabled?: number;
}

/**
 * DTO for template filtering.
 * This interface is similar to TemplateFilterRequestDTO but uses statusId instead of a string status.
 * It is used to filter templates after the status string has been resolved to a numeric statusId.
 */
export interface TemplateFilterDTO {
  id?: number;
  name?: string;
  description?: string;
  assetId?: string;
  isDefault?: number;
  enabled?: number;
}

export interface TemplateDetailResponseDTO {
  id?: number;
  name?: string;
  description?: string;
  assetId?: string;
  isDefault?: number;
  enabled?: number;
  asset?: Asset;
}

/**
 * Constructs a response object for template details based on the provided result.
 * If the template details are found, it returns a successful response.
 * If the result is null, it returns an error response with an appropriate message.
 *
 * @param {TemplateDetailResponseDTO | null} result - The template details to be returned in the response, or null if not found.
 * @returns {ResponseDTO<TemplateDetailResponseDTO>} - The response object containing status, message, and optional data.
 */
export const templateDetailsResponse = (
  result: TemplateDetailResponseDTO | null
): ResponseDTO<TemplateDetailResponseDTO> => {
  if (result) {
    return {
      status: 'success',
      message: 'success',
      data: result,
    };
  } else {
    return {
      status: 'error',
      message: 'Template details not found',
    };
  }
};
