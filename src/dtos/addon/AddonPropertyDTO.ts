/**
 * @interface CreateAddonPropertyDTO
 * @description Interface for creating a new event Addon.
 */
export interface CreateAddonPropertyDTO {
  eventAddonId: number;
  name: string;
  description?: string;
  enabled?: number;
  assetId?: string;
  amount: number;
  createdBy: number;
  modifiedBy: number;
}
