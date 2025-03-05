const express = require('express');
const sequelize = require('./config/database');
const ticketRoutes = require('./routes/tickets');

const app = express();
const port = 5000;

app.use(express.json());
app.use('/tickets', ticketRoutes);

app.get('/', (req, res) => {
    res.send('Сервер работает!');
});

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`🚀 Сервер запущен на порту ${port}`);
    });
});
