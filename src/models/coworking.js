module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Coworking', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: "Le nom est déjà utilisé."
            },
            validate: {
                notEmpty: { msg: "Le champ name ne peut pas être vide." }
            }
        },
        picture: {
            type: DataTypes.STRING,
        },
        superficy: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: { msg: "Utilisez des nombres entiers pour la capacité du coworking." },
                min: {
                    args: [2],
                    msg: "Il faut minimum 2 places pour un coworking"
                }
            }
        },
        price: {
            type: DataTypes.JSON,
            allowNull: false,
            validate: {
                isPriceValid(value) {
                    if (value.hour === null && value.day === null && value.month === null) {
                        throw new Error("Un coworking doit avoir au moins un prix.")
                    }
                }
            }
        },
        address: {
            type: DataTypes.JSON,
        },
        isOpen: {
            type: DataTypes.BOOLEAN,
            validate: {
                isBoolean: true
            }
        }
    }, {
        timestamps: true,
        createdAt: 'created',
        updatedAt: false
    })
}