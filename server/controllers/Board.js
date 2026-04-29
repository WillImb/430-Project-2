const models = require("../models");
const Board = models.Board;

const boardPage = (req, res) => {
    //const boardId = req.params.id;
    return res.render('board');
};

const getBoard = async (req, res) => {
    try {

        if (!req.params.id) {
            return res.status(400).json({ error: 'Error Invalid Board' });

        }

        const docs = await Board.findById(req.params.id).lean().exec();
        return res.json(docs);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving board' });
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
        name: "New Board",
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
        return res.status(500).json({ error: 'An error occured making a board' });
    }
}

const changeBoardName = async (req,res) => {
    try{
        const board = await Board.findById(req.body.currentBoard).exec();

        board.title = req.body.newName;

        await board.save();
        return res.status(201).json({ name: board.name});
    }catch(err){
        console.log(err);        
        return res.status(500).json({ error: 'An error occured updating a board' });
    }
}

const deleteBoard = async(req,res)=>
{ 
    try{
        const board = await Board.findByIdAndDelete(req.body.id).exec();       

        return res.status(200).json({message: "Successful Deletion"});
    }catch(err){
        console.log(err);        
        return res.status(500).json({ error: 'An error occured deleting a board' });
    }
}

const getUmls = async(req, res) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({ error: 'Board does not exist!' });
        }
        const docs = await Board.findById(req.params.id).lean().exec();
        return res.json(docs.umls);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving UMLs' });
    }
}
const addEmptyUml = async(req,res) => {
    try {

        if (!req.params.id) {
            return res.status(400).json({ error: 'Invalid Board' });
        }
        const docs = await Board.findById(req.params.id).exec();
        docs.umls.push(req.body);
        await docs.save();

        return res.json(docs.umls[docs.umls.length-1]);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving board' });
    }
}

const deleteUml = async(req,res) => {
    try{
        const board = await Board.findById(req.body.boardId).exec();  

        if(!board){
            return res.status(404).json({
                error: 'Board not found'
            });
        }

        const uml = await board.umls.id(req.body.id);
        
        if(!uml){
            return res.status(404).json({
                error: 'UML not found'
            });
        }
        
        uml.deleteOne();

        await board.save();

        return res.status(200).json({message: "Successful Deletion"});
    }catch(err){
        console.log(err);        
        return res.status(500).json({ error: 'An error occured deleting a Uml' });
    }
}

const addEmptyFunction = async(req,res) => {
    try{
        if(!req.body.umlId || !req.body.boardId){
            return res.status(404).json({ error: 'Invalid Uml or Board' });
        }
        const board = await Board.findById(req.body.boardId).exec();

        if(!board){
            return res.status(404).json({ error: 'Invalid Board' });

        }

        const uml = board.umls.find(u=>u.id === req.body.umlId);

        if(!uml){
            return res.status(404).json({ error: 'Invalid Uml' });
        }

        uml.functions.push("");

        await board.save();

        return res.json(uml);


    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Error adding new function'});
    }

}

const addEmptyField = async(req,res) => {
    try{
        if(!req.body.umlId || !req.body.boardId){
            return res.status(404).json({ error: 'Invalid Uml or Board' });
        }
        const board = await Board.findById(req.body.boardId).exec();

        if(!board){
            return res.status(404).json({ error: 'Invalid Board' });

        }

        const uml = board.umls.find(u=>u.id === req.body.umlId);

        if(!uml){
            return res.status(404).json({ error: 'Invalid Uml' });
        }

        uml.fields.push("");

        await board.save();

        return res.json(uml);


    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Error adding new field'});
    }

}

const updateUml = async(req,res) => {
     try {       

        if(!req.body.umlId || !req.body.boardId){
            return res.status(404).json({ error: 'Invalid Uml or Board' });
        }

        const board = await Board.findById(req.body.boardId).exec();

        if(!board){
            return res.status(404).json({ error: 'Invalid Board' });

        }

        const uml = board.umls.find(u=>u.id === req.body.umlId);

        if(!uml){
            return res.status(404).json({ error: 'Invalid Uml' });
        }
        if(req.body.name)
            uml.name = req.body.name;
        
        if(req.body.functions)
            uml.functions = req.body.functions;
        if(req.body.fields)
            uml.fields = req.body.fields;

        //save position if needbe
        if(req.body.x && req.body.y){
            uml.x = req.body.x;
            uml.y = req.body.y;
        }

        await board.save();

        return res.json(uml);

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error updating Uml' });
        
    }
}



module.exports = {
    boardPage,
    getBoard,
    createBoard,
    changeBoardName,
    deleteBoard,
    getUserBoards,
    getUmls,
    addEmptyUml,
    addEmptyFunction,
    updateUml,
    deleteUml,

};