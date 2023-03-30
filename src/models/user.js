const userRoles = ['user', 'admin', 'superadmin']

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            unique: {
                msg: "Le nom est déjà pris."
            }
        },
        password: {
            type: DataTypes.STRING
        },
        roles: {
            type: DataTypes.STRING,
            defaultValue: "user",
            get() {
                return this.getDataValue('roles').split(',')
            },
            set(types) {
                this.setDataValue('roles', types.join())
            },
            validate: {
                areRolesValid(value) {
                    if (!value) {
                        throw new Error('Un utilisateur doit avoir au moins un rôle')
                    }
                    value.split(',').forEach(role => {
                        if (!userRoles.includes(role)) {
                            throw new Error(`Les rôles d'un utilisateur doivent appartenir à la liste suivante : ${userRoles}`)
                        }
                    })
                }
            }
        }
    }, {
        scopes: {
            withoutPassword: {
                attributes: { exclude: ['password'] },
            }
        },
        hooks: {
            afterCreate: (record) => {
                delete record.dataValues.password;
            },
            afterUpdate: (record) => {
                delete record.dataValues.password;
            },
        }
    })
}