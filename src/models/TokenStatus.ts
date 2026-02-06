import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Token, TokenId } from './Token';

export interface TokenStatusAttributes {
  id: number;
  statusName?: string;
  description?: string;
}

export type TokenStatusPk = 'id';
export type TokenStatusId = TokenStatus[TokenStatusPk];
export type TokenStatusOptionalAttributes = 'id' | 'statusName' | 'description';
export type TokenStatusCreationAttributes = Optional<
  TokenStatusAttributes,
  TokenStatusOptionalAttributes
>;

export class TokenStatus
  extends Model<TokenStatusAttributes, TokenStatusCreationAttributes>
  implements TokenStatusAttributes
{
  id!: number;
  statusName?: string;
  description?: string;

  // TokenStatus hasMany Token via statusId
  tokens!: Token[];
  getTokens!: Sequelize.HasManyGetAssociationsMixin<Token>;
  setTokens!: Sequelize.HasManySetAssociationsMixin<Token, TokenId>;
  addToken!: Sequelize.HasManyAddAssociationMixin<Token, TokenId>;
  addTokens!: Sequelize.HasManyAddAssociationsMixin<Token, TokenId>;
  createToken!: Sequelize.HasManyCreateAssociationMixin<Token>;
  removeToken!: Sequelize.HasManyRemoveAssociationMixin<Token, TokenId>;
  removeTokens!: Sequelize.HasManyRemoveAssociationsMixin<Token, TokenId>;
  hasToken!: Sequelize.HasManyHasAssociationMixin<Token, TokenId>;
  hasTokens!: Sequelize.HasManyHasAssociationsMixin<Token, TokenId>;
  countTokens!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof TokenStatus {
    return TokenStatus.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        statusName: {
          type: DataTypes.STRING(50),
          allowNull: true,
          field: 'status_name',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'token_status',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
