const models = require('../models');
const Domo = models.Domo;

const makerPage = async (req,res) => {
    return res.render('app');
}

const makeDomo = async (req,res) => {
    if(!req.body.name || !req.body.age){
        return res.status(400).json({error: 'Name and Age are required!' });
    }

    const domoData = {
        name: req.body.name,
        age: req.body.age,
        favorite: req.body.fav,
        owner: req.session.account._id,
    };

    try{
        const newDomo = new Domo(domoData);
        await newDomo.save();
        return res.status(201).json({name: newDomo.name, age: newDomo.age, favorite: newDomo.favorite});
    }catch(err){
        console.log(err);
        if(err.code === 11000){
            return res.status(400).json({error: 'Domo already exists!'});
        }
        return res.status(500).json({error: 'An error occured making domo!'});
    }
}

const getDomos = async (req,res) => {
    try{
        const query = {owner: req.session.account._id};
        const docs = await Domo.find(query).select('name age favorite').lean().exec();
        return res.json({domos: docs});
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Error retrieving domos'});
    }
};

//deletes the domo on the server
const deleteDomo = async (req,res) => {    
    try{
        const {id} = req.body;
        const domo = await Domo.findByIdAndDelete(id);

        if(!domo){
            return res.status(404).json({error: 'Domo does not exist'});
        }
        return res.status(200).json({Message: "Succesful Deletion"});
    }catch(err){
        console.log(err);
        return res.status(500).json({erro: "Problem Deleting Domo"});
        
    }
}

module.exports = {
    makerPage,
    makeDomo,
    getDomos,
    deleteDomo,
};