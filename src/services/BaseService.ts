/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 *  * @author sarathavs
 * @class BaseService
 * @description A generic service class for common database operations using Sequelize.
 * @template T - The Sequelize model type.
 */
import {
  Model,
  FindOptions,
  UpdateOptions,
  DestroyOptions,
  Transaction,
  CreationAttributes,
  WhereOptions,
  Sequelize,
  QueryTypes,
} from 'sequelize';

export class BaseService<T extends Model> {
  protected model: typeof Model & { new (): T };

  constructor(model: typeof Model & { new (): T }) {
    this.model = model;
  }

  /**
   * Retrieves all records from the database that match the provided options.
   * @param options - The find options for querying the database.
   * @param transaction - Optional transaction to use for the query.
   * @returns A promise that resolves to an array of records.
   */
  async findAll(
    options?: FindOptions<T>,
    transaction?: Transaction
  ): Promise<T[]> {
    return this.model.findAll({
      ...options,
      transaction,
    }) as Promise<T[]>;
  }

  /**
   * Retrieves a single record by its primary key.
   * @param id - The primary key of the record to retrieve.
   * @param options - The find options for querying the database.
   * @param transaction - Optional transaction to use for the query.
   * @returns A promise that resolves to the record, or null if not found.
   */
  async findById(
    id: number,
    options?: FindOptions<T>,
    transaction?: Transaction
  ): Promise<T | null> {
    return this.model.findByPk(id, {
      ...options,
      transaction,
    }) as Promise<T | null>;
  }
  /**
   * Find one record from the database.
   * @param options - Options for finding a record, including filters and conditions.
   * @param transaction - Optional transaction.
   * @returns A promise that resolves to the found record or null if not found.
   */
  async findOne(
    options: FindOptions<T>,
    transaction?: Transaction
  ): Promise<T | null> {
    return this.model.findOne({
      ...options,
      transaction,
    }) as Promise<T | null>;
  }

  /**
   * Creates a new record in the database.
   * @param data - The data for the new record.
   * @param transaction - Optional transaction to use for the creation.
   * @returns A promise that resolves to the created record.
   */
  async create(
    data: CreationAttributes<T>,
    transaction?: Transaction
  ): Promise<T> {
    try {
      // Pass the transaction if it exists
      return this.model.create(data, { transaction }) as Promise<T>;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates multiple new records in the database.
   * @param data - An array of data for the new records.
   * @param transaction - Optional transaction to use for the creation.
   * @returns A promise that resolves to an array of the created records.
   */
  async bulkCreate(
    data: CreationAttributes<T>[],
    transaction?: Transaction
  ): Promise<T[]> {
    try {
      // Pass the transaction if it exists
      return (await this.model.bulkCreate(data, { transaction })) as T[];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates records in the database that match the provided criteria.
   * @param id - The primary key of the record to update.
   * @param updateData - The data to update.
   * @param options - Additional update options.
   * @param transaction - Optional transaction to use for the update.
   * @returns A promise that resolves to a tuple containing the number of affected rows and the updated records.
   */
  async update(
    id: number,
    updateData: Partial<CreationAttributes<T>>,
    options?: UpdateOptions<any>, // Use `any` to avoid type conflicts
    transaction?: Transaction
  ): Promise<[number, T[]]> {
    const updateOptions: UpdateOptions<any> = {
      where: { id } as WhereOptions<any>, // Loosen the typing to avoid issues
      transaction,
      ...options,
    };

    // Cast the result to the expected type using `as any`
    const result = (await this.model.update(updateData, updateOptions)) as any;

    // Explicitly cast the result to `[number, T[]]`
    return result as [number, T[]];
  }
  /**
   * Updates records in the database that match the provided criteria.
   * @param updateData - The data to update.
   * @param whereOptions - The criteria to match records that should be updated.
   * @param options - Additional update options.
   * @param transaction - Optional transaction to use for the update.
   * @returns A promise that resolves to a tuple containing the number of affected rows and the updated records.
   */
  async updateCustom(
    updateData: Partial<CreationAttributes<T>>,
    whereOptions: WhereOptions<T>, // The condition for updating multiple records
    options?: UpdateOptions<T>, // Additional options for updating
    transaction?: Transaction
  ): Promise<[number, T[]]> {
    const updateOptions: UpdateOptions<any> = {
      where: whereOptions, // Use the passed where condition
      transaction,
      ...options,
    };

    // Perform the update
    const result = (await this.model.update(updateData, updateOptions)) as any;

    // Cast the result explicitly to [number, T[]] (number of affected rows and updated records)
    return result as [number, T[]];
  }

  /**
   * Deletes records in the database that match the provided criteria.
   * @param id - The primary key of the record to delete.
   * @param options - Additional destroy options.
   * @param transaction - Optional transaction to use for the deletion.
   * @returns A promise that resolves to the number of affected rows.
   */
  async delete(
    id: number,
    options?: DestroyOptions<any>,
    transaction?: Transaction
  ): Promise<number> {
    return this.model.destroy({
      where: { id } as WhereOptions<any>, // Use `any` to bypass TypeScript's strict checking
      ...options,
      transaction,
    });
  }

  /**
   * Deletes records in the database that match the specified criteria.
   * @param whereOptions - The condition used to select records for deletion.
   *                       This allows for deleting multiple records based on specific criteria.
   * @param options - Additional options to customize the deletion behavior.
   *                  These options can include hooks, individual deletion mode, etc.
   * @param transaction - Optional transaction to use for the deletion, providing a way to manage atomic operations.
   * @returns A promise that resolves to the number of records deleted.
   */
  async deleteCustom(
    whereOptions: WhereOptions<T>,
    options?: DestroyOptions<T>,
    transaction?: Transaction
  ): Promise<number> {
    const deleteOptions: DestroyOptions<any> = {
      where: whereOptions, // Use the passed where condition
      transaction,
      ...options,
    };
    const deletedCount = await this.model.destroy(deleteOptions);
    return deletedCount;
  }

  /**
    * Counts the number of records matching the provided options.
    *
    * @param options - Sequelize FindOptions to filter the query.
    * @param transaction - Optional Sequelize transaction for the query.
    * @returns The total count of records matching the criteria.
    */
  async count(
    options: FindOptions,
    transaction?: Transaction
  ): Promise<number> {
    try {
      return await this.model.count({
        ...options,
        transaction,
      });
    } catch (error) {
      throw error;
    }
  }
  /**
   * Retrieves all records that match the provided options, along with the total count of matching records.
   * This is typically used for pagination.
   * @param options - The find options for querying the database.
   * @param transaction - Optional transaction to use for the query.
   * @returns A promise that resolves to an object containing rows (the records) and count (the total number of matching records).
   */
  async findAndCountAll(
    options?: FindOptions<T>,
    transaction?: Transaction
  ): Promise<{ rows: T[]; count: number }> {
    const result = await this.model.findAndCountAll({
      ...options,
      transaction,
    });

    // Type assertion to ensure TypeScript recognizes the rows as type T[]
    return {
      rows: result.rows as T[], // Use type assertion here
      count: result.count,
    };
  }

  /**
   * Executes a block of operations within a transaction.
   * @param fn - The block of operations to execute.
   * @returns A promise that resolves to the result of the block.
   */
  // async executeTransaction<R>(
  //   fn: (transaction: Transaction) => Promise<R>
  // ): Promise<R> {
  //   const sequelize = this.model.sequelize as Sequelize;
  //   return sequelize.transaction(fn);
  // }
  async executeTransaction<R>(
    fn: (transaction: Transaction) => Promise<R>
  ): Promise<R> {
    const sequelize = this.model.sequelize as Sequelize;
    const transaction = await sequelize.transaction();
    try {
      const result = await fn(transaction);
      await transaction.commit(); // Explicitly commit
      return result;
    } catch (error) {
      await transaction.rollback(); // Explicitly rollback
      throw error;
    }
  }
  
  /**
   * Executes a custom SQL query.
   * @param sql - The SQL query string to execute.
   * @param replacements - Optional replacements for parameterized queries.
   * @param transaction - Optional transaction to use for the query.
   * @returns A promise that resolves to the result of the query.
   */
  async executeCustomQuery(
    sql: string,
    replacements?: any,
    type: QueryTypes = QueryTypes.SELECT,
    transaction?: Transaction
  ): Promise<any> {
    const sequelize = this.model.sequelize as Sequelize;
    return sequelize.query(sql, {
      replacements,
      type: type, // Specify the type of query (SELECT, UPDATE, DELETE, etc.)
      transaction,
    });
  }

  /**
   * Inserts a new record or updates an existing one based on a unique constraint.
   *
   * @param data - The data to insert or update.
   * @param transaction - Optional transaction to use for the operation.
   * @returns A promise that resolves to a tuple:
   *   - The first element is the instance of the record that was created or updated.
   *   - The second element is a boolean indicating whether the record was created (`true`) or updated (`false`).
   */
  async upsert(
    data: CreationAttributes<T>, // The data to insert or update
    transaction?: Transaction
  ): Promise<[T, boolean]> {
    try {
      // Pass the transaction if it exists
      const result = await this.model.upsert(data, { transaction });

      // `result` is a tuple: [instance, created]
      return result as [T, boolean];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates a specific column in the database to NULL based on the provided ID.
   *
   * @param id - The ID of the record to be updated.
   * @param columnName - The name of the column that will be set to NULL.
   * @param options - Additional options to be passed to the Sequelize query, if any.
   * @param transaction - The Sequelize transaction object (optional), if the query should run within a transaction.
   *
   * @returns A Promise that resolves to the number of affected rows (usually 1 if successful, or 0 if no rows matched).
   */
  async updateToNull(
    id: number,
    columnName: string,
    options?: any,
    transaction?: Transaction
  ): Promise<[number, T[]]> {
    // Build the raw SQL UPDATE query to set the specified column to NULL for the given ID
    const query = `UPDATE ${this.model.tableName} SET ${columnName} = NULL WHERE id = :id`;

    // Execute the query using Sequelize's `query` method
    const result = (await this.model.sequelize?.query(query, {
      replacements: { id },
      transaction,
      ...options,
    })) as any;
    return result as [number, T[]];
  }
}
