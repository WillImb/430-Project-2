const models = require('../models');
const Account = models.Account;

const loginPage = (req, res) => {
    return res.render('login');
};

const menuPage = (req, res) => {
    return res.render('menu');
};
const accountPage = (req, res) => {
    return res.render('account');
};




const logout = (req, res) => {
    req.session.destroy();
    return res.redirect('/');

};

const login = (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;

    if (!username || !pass) {
        console.log("error a");
        return res.status(400).json({ error: 'All Fields are required!' });
    }
    return Account.authenticate(username, pass, (err, account) => {
        if (err || !account) {
            console.log("error b");

            return res.status(401).json({ error: 'Wrong username or password!' });
        }

        req.session.account = Account.toAPI(account);

        return res.json({ redirect: '/menu' });
    });
};

const signup = async (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;
    const pass2 = `${req.body.pass2}`;

    if (!username || !pass || !pass2) {
        console.log("error c");

        return res.status(400).json({ error: 'All Fields are required' });
    }

    if (pass !== pass2) {
        return res.status(400).json({ error: 'Passwords do not match!' });
    }

    try {
        const hash = await Account.generateHash(pass);
        const newAccount = new Account({ username, password: hash })
        await newAccount.save();
        req.session.account = Account.toAPI(newAccount);
        return res.json({ redirect: '/menu' });
    }
    catch (err) {
        console.log(err);
        if (err.code == 11000) {
            return res.status(400).json({ error: 'Username already in use' });

        }
        return res.status(500).json({ error: 'An error occured' });
    }
};

const getCurrentUser = (req,res) => {
    return res.status(200).json({name: req.session.account.username, premium: req.session.account.premium});
}

const updatePremium = async (req,res) => {

    try{
        if(req.body.status == !undefined){
            const acc = await Account.findById(req.session.account._id);
            acc.premium = req.body.status;

            console.log(acc);
            await acc.save();

            return res.status(200).json({premium: acc.premium});
        }
    }catch(err){
        return res.status(500).json({ error: 'An error occured' });
    }
}




module.exports = {
    loginPage,
    login,
    logout,
    signup,
    menuPage,
    accountPage,
    getCurrentUser,
    updatePremium,
    
}