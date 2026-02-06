import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Company, CompanyId } from './Company';
import type { User, UserId } from './User';

export interface UserCompanyAttributes {
  id: number;
  userId?: number;
  companyId?: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type UserCompanyPk = 'id';
export type UserCompanyId = UserCompany[UserCompanyPk];
export type UserCompanyOptionalAttributes =
  | 'id'
  | 'userId'
  | 'companyId'
  | 'createdOn'
  | 'modifiedOn';
export type UserCompanyCreationAttributes = Optional<
  UserCompanyAttributes,
  UserCompanyOptionalAttributes
>;

export class UserCompany
  extends Model<UserCompanyAttributes, UserCompanyCreationAttributes>
  implements UserCompanyAttributes
{
  id!: number;
  userId?: number;
  companyId?: number;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  // UserCompany belongsTo Company via companyId
  company!: Company;
  getCompany!: Sequelize.BelongsToGetAssociationMixin<Company>;
  setCompany!: Sequelize.BelongsToSetAssociationMixin<Company, CompanyId>;
  createCompany!: Sequelize.BelongsToCreateAssociationMixin<Company>;
  // UserCompany belongsTo User via userId
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof UserCompany {
    return UserCompany.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'user',
            key: 'id',
          },
          field: 'user_id',
        },
        companyId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'company',
            key: 'id',
          },
          field: 'company_id',
        },
        createdBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'created_by',
        },
        createdOn: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'created_on',
        },
        modifiedBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'modified_by',
        },
        modifiedOn: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'modified_on',
        },
      },
      {
        sequelize,
        tableName: 'user_company',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'user_id',
            using: 'BTREE',
            fields: [{ name: 'user_id' }],
          },
          {
            name: 'company_id',
            using: 'BTREE',
            fields: [{ name: 'company_id' }],
          },
        ],
      }
    );
  }
}
