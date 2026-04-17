const models = require("../models");
const Board = models.Board;

const getBoard = (req, res) => {
    return res.render('board');
};

module.exports = {
    getBoard,
};