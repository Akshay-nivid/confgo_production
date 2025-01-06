/**
 * Enum representing the various statuses for an entity.
 *
 * Properties:
 * - ACTIVE: Indicates the entity is currently active (value: 1).
 * - INACTIVE: Indicates the entity is currently inactive (value: 2).
 * - PENDING: Indicates the entity is awaiting further action or approval (value: 3).
 * - COMPLETED: Indicates the entity has been completed successfully (value: 4).
 * - DRAFTED: Indicates the entity is in draft mode and not finalized (value: 5).
 */
export const StatusEnum = {
    ACTIVE: 1,
    INACTIVE: 2,
    PENDING: 3,
    COMPLETED: 4,
    DRAFTED: 5
}