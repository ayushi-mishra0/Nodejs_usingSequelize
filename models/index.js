const { Sequelize, DataTypes, Model, } = require('sequelize');

const sequelize = new Sequelize('employeedb', 'root', 'root', {
    host: 'localhost',
    logging: false,
    dialect: 'mysql'/*mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
  });

  try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  const db = {};
  db.Sequelize=sequelize;
  db.sequelize=sequelize;

db.user = require('./user')(sequelize,DataTypes,Model)
db.contact = require('./contact')(sequelize,DataTypes)
db.userContacts = require('./userContacts')(sequelize,DataTypes,db.user,db.contact)

//db.user.hasOne(db.contact,{foreignKey: 'user_id',as:'contactDetails'});

// db.user.hasMany(db.contact,{foreignKey: 'user_id',as:'contactDetails'});
// db.contact.belongsTo(db.user,{foreignKey: 'user_id',as:'userDetails'});

db.user.belongsToMany(db.contact, { through: db.userContacts });
db.contact.belongsToMany(db.user, { through: db.userContacts });

db.sequelize.sync({ force: false });
module.exports=db;