const Ticket = require('../models/ticket');
const { Sequelize } = require('sequelize');


//------------------------------------ Создание нового обращения-------------------
exports.createTicket = async (req, res) => {
    const { topic, message } = req.body;
    if (!topic || !message) {
        return res.status(400).json({ error: 'Тема и текст обращения обязательны' });
    }
    const ticket = await Ticket.create({ topic, message });
    res.status(201).json(ticket);
};

//-------------------------------------Взять обращение в работу--------------------
exports.workOnTicket = async (req, res) => {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Обращение не найдено' });

    if (ticket.status !== 'Новое') {
        return res.status(400).json({ error: 'Можно взять в работу только новые обращения' });
    }

    ticket.status = 'В работе';
    await ticket.save();
    res.json(ticket);
};

//-------------------------------Завершить обращение--------------------------------
exports.completeTicket = async (req, res) => {
    const { resolution } = req.body;
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Обращение не найдено' });

    if (ticket.status !== 'В работе') {
        return res.status(400).json({ error: 'Можно завершить только обращения "В работе"' });
    }

    ticket.status = 'Завершено';
    ticket.resolution = resolution;
    await ticket.save();
    res.json(ticket);
};

//---------------------------------Отменить обращение------------------------------
exports.cancelTicket = async (req, res) => {
    const { cancelReason } = req.body;
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Обращение не найдено' });

    if (ticket.status === 'Завершено') {
        return res.status(400).json({ error: 'Нельзя отменить завершённое обращение' });
    }

    ticket.status = 'Отменено';
    ticket.cancelReason = cancelReason;
    await ticket.save();
    res.json(ticket);
};

//--------------------------------Получить список обращений------------------------
exports.getTickets = async (req, res) => {
    const { date, startDate, endDate, status } = req.query;
    let whereCondition = {};

    if (date) {
        whereCondition.createdAt = {
            [Sequelize.Op.gte]: new Date(date + 'T00:00:00'),
            [Sequelize.Op.lt]: new Date(date + 'T23:59:59')
        };
    }

    if (startDate && endDate) {
        whereCondition.createdAt = {
            [Sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
        };
    }

    if (status) {
        whereCondition.status = status;
    }

    const tickets = await Ticket.findAll({ where: whereCondition });
    res.json(tickets);
};

//-------------------------------------Отменить все обращения-----------------------
exports.cancelAllInProgress = async (req, res) => {
    const { cancelReason } = req.body;
    const DAYS_LIMIT = 30;

    if (!cancelReason) {
        return res.status(400).json({ error: 'Необходимо указать причину отмены' });
    }

    const ticketsToCancel = await Ticket.findAll({
        where: {
            status: 'В работе',
            createdAt: { [Sequelize.Op.gte]: new Date(Date.now() - DAYS_LIMIT * 24 * 60 * 60 * 1000) }
        }
    });

    if (ticketsToCancel.length === 0) {
        return res.status(404).json({ message: 'Нет обращений для отмены' });
    }
// Отмена обращения поштучно, для логирования
    for (const ticket of ticketsToCancel) {
        ticket.status = 'Отменено';
        ticket.cancelReason = cancelReason;
        await ticket.save();
    }

    res.json({ message: `Отменено ${ticketsToCancel.length} обращений`, canceledTickets: ticketsToCancel });
};
