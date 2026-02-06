import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { UserAbstract, UserAbstractId } from './UserAbstract';

export interface UserAbstractStatusAttributes {
  id: number;
  statusName: string;
  description?: string;
}

export type UserAbstractStatusPk = "id";
export type UserAbstractStatusId = UserAbstractStatus[UserAbstractStatusPk];
export type UserAbstractStatusOptionalAttributes = "id" | "description";
export type UserAbstractStatusCreationAttributes = Optional<UserAbstractStatusAttributes, UserAbstractStatusOptionalAttributes>;

export class UserAbstractStatus extends Model<UserAbstractStatusAttributes, UserAbstractStatusCreationAttributes> implements UserAbstractStatusAttributes {
  id!: number;
  statusName!: string;
  description?: string;

  // UserAbstractStatus hasMany UserAbstract via statusId
  userAbstracts!: UserAbstract[];
  getUserAbstracts!: Sequelize.HasManyGetAssociationsMixin<UserAbstract>;
  setUserAbstracts!: Sequelize.HasManySetAssociationsMixin<UserAbstract, UserAbstractId>;
  addUserAbstract!: Sequelize.HasManyAddAssociationMixin<UserAbstract, UserAbstractId>;
  addUserAbstracts!: Sequelize.HasManyAddAssociationsMixin<UserAbstract, UserAbstractId>;
  createUserAbstract!: Sequelize.HasManyCreateAssociationMixin<UserAbstract>;
  removeUserAbstract!: Sequelize.HasManyRemoveAssociationMixin<UserAbstract, UserAbstractId>;
  removeUserAbstracts!: Sequelize.HasManyRemoveAssociationsMixin<UserAbstract, UserAbstractId>;
  hasUserAbstract!: Sequelize.HasManyHasAssociationMixin<UserAbstract, UserAbstractId>;
  hasUserAbstracts!: Sequelize.HasManyHasAssociationsMixin<UserAbstract, UserAbstractId>;
  countUserAbstracts!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof UserAbstractStatus {
    return UserAbstractStatus.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    statusName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'status_name'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user_abstract_status',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
