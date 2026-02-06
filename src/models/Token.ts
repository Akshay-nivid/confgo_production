import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { TokenStatus, TokenStatusId } from './TokenStatus';

export interface TokenAttributes {
  id: number;
  userId?: number;
  type: string;
  email?: string;
  token: string;
  otp?: number;
  expiryTime?: Date;
  phone?: string;
  statusId: number;
  createdOn: Date;
  createdBy: number;
  modifiedOn: Date;
  modifiedBy: number;
}

export type TokenPk = 'id';
export type TokenId = Token[TokenPk];
export type TokenOptionalAttributes =
  | 'id'
  | 'userId'
  | 'email'
  | 'otp'
  | 'expiryTime'
  | 'phone'
  | 'createdOn'
  | 'modifiedOn';
export type TokenCreationAttributes = Optional<
  TokenAttributes,
  TokenOptionalAttributes
>;

export class Token
  extends Model<TokenAttributes, TokenCreationAttributes>
  implements TokenAttributes
{
  id!: number;
  userId?: number;
  type!: string;
  email?: string;
  token!: string;
  otp?: number;
  expiryTime?: Date;
  phone?: string;
  statusId!: number;
  createdOn!: Date;
  createdBy!: number;
  modifiedOn!: Date;
  modifiedBy!: number;

  // Token belongsTo TokenStatus via statusId
  status!: TokenStatus;
  getStatus!: Sequelize.BelongsToGetAssociationMixin<TokenStatus>;
  setStatus!: Sequelize.BelongsToSetAssociationMixin<
    TokenStatus,
    TokenStatusId
  >;
  createStatus!: Sequelize.BelongsToCreateAssociationMixin<TokenStatus>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Token {
    return Token.init(
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
          field: 'user_id',
        },
        type: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        token: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        otp: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'OTP',
        },
        expiryTime: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'expiry_time',
        },
        phone: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        statusId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'token_status',
            key: 'id',
          },
          field: 'status_id',
        },
        createdOn: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'created_on',
        },
        createdBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'created_by',
        },
        modifiedOn: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'modified_on',
        },
        modifiedBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'modified_by',
        },
      },
      {
        sequelize,
        tableName: 'token',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'token_token_status_FK_idx',
            using: 'BTREE',
            fields: [{ name: 'status_id' }],
          },
        ],
      }
    );
  }
}
