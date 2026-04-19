const { response } = require("express");
const models = require("../models");
const Board = models.Board;

const boardPage = (req, res) => {
    return res.render('board');
};

const getBoard = async (req,res) => {
     try{
        
        const query = {name: req.body.name};
        
        const docs = await Board.find(query).lean().exec();
        return res.json({umls: docs});
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Error retrieving UMLs'});
    }
}

const getBoards = async (req,res) => {
    try{
        const query = {owner: req.session.account._id};
        const docs = await Board.find(query).lean().exec();
        return res.json({boards: docs});
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Error retrieving domos'});
    }
}


const getUmlCount = async(req,res) => {
     try{
        const query = req.body.title;
        const docs = await Board.find(query).lean().exec();
        return res.json({count: docs.umls.count});
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Error retrieving UMLs'});
    }
}

const createBoard = async(req,res) => {
     

    const boardData = {
        name: "testy",
        umls: [],
        owner: req.session.account._id,
    };
    try{
        const newBoard = new Board(boardData);
        await newBoard.save();
        return res.status(201).json({name: newBoard.name, umls: newBoard.umls});
    }catch(err){
        console.log(err);
        if(err.code === 11000){
            return res.status(400).json({error: 'Board already exists!'});
        }
        return res.status(500).json({error: 'An error occured making domo!'});
    }
}


module.exports = {
    boardPage,
    getBoard,
    createBoard,
    getUmlCount,
    

};