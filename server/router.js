const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    

    app.get('/login',mid.requiresSecure,mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login',mid.requiresSecure,mid.requiresLogout, controllers.Account.login);
    
    
    app.post('/signup',mid.requiresSecure,mid.requiresLogout, controllers.Account.signup);

    app.get('/logout',mid.requiresLogin, controllers.Account.logout);
   
    app.get('/',mid.requiresSecure,mid.requiresLogout, controllers.Account.loginPage);

    app.get('/board/:id',mid.requiresSecure,mid.requiresLogin, controllers.Board.boardPage);

    app.get('/menu',mid.requiresSecure,mid.requiresLogin, controllers.Account.menuPage);
    app.get('/account',mid.requiresSecure,mid.requiresLogin, controllers.Account.accountPage);


    app.get('/getUser',mid.requiresSecure,mid.requiresLogin, controllers.Account.getCurrentUser);
    
    app.get('/getUserBoards',mid.requiresSecure,mid.requiresLogin, controllers.Board.getUserBoards);

    app.post('/updatePremium',mid.requiresSecure,mid.requiresLogin, controllers.Account.updatePremium);


    app.get('/getBoard/:id',mid.requiresSecure,mid.requiresLogin, controllers.Board.getBoard);
    app.get('/getUmls/:id',mid.requiresSecure,mid.requiresLogin, controllers.Board.getUmls);

    app.post('/createBoard',mid.requiresSecure,mid.requiresLogin, controllers.Board.createBoard);

    app.post('/changeBoardName',mid.requiresSecure,mid.requiresLogin, controllers.Board.changeBoardName);

    app.post('/deleteBoard',mid.requiresSecure,mid.requiresLogin, controllers.Board.deleteBoard);
    

    
    app.post('/addEmptyUml/:id',mid.requiresSecure,mid.requiresLogin, controllers.Board.addEmptyUml);
    app.post('/addEmptyFunction/',mid.requiresSecure,mid.requiresLogin, controllers.Board.addEmptyFunction);
    app.post('/updateUml',mid.requiresSecure,mid.requiresLogin, controllers.Board.updateUml);

    app.post('/deleteUml',mid.requiresSecure,mid.requiresLogin, controllers.Board.deleteUml);

    
    

};




module.exports = router;