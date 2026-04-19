const { response } = require("express");
const models = require("../models");
const Board = models.Board;

const boardPage = (req, res) => {
    const boardId = req.params.id;
    return res.render('board');
};

const getBoard = async (req, res) => {
    try {

        if (!req.params.id) {
            return res.redirect('/menu');

        }       

        const docs = await Board.findById(req.params.id).lean().exec();
        return res.json(docs);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving UMLs' });
    }
}

const getUserBoards = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await Board.find(query).lean().exec();
        return res.json({ boards: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving boards' });
    }
};

const createBoard = async (req, res) => {
    const boardData = {
        name: "test",
        umls: [],
        owner: req.session.account._id,
    };
    try {
        const newBoard = new Board(boardData);
        await newBoard.save();
        return res.status(201).json({ name: newBoard.name, umls: newBoard.umls });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Board already exists!' });
        }
        return res.status(500).json({ error: 'An error occured making domo!' });
    }
}


module.exports = {
    boardPage,
    getBoard,
    createBoard,
    getUserBoards,

};