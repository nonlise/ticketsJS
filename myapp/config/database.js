const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

sequelize.authenticate()
    .then(() => console.log('База данных подключена'))
    .catch(err => console.error('Ошибка подключения:', err));

module.exports = sequelize;
