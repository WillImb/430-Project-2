const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    

    app.get('/login',mid.requiresSecure,mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login',mid.requiresSecure,mid.requiresLogout, controllers.Account.login);
    
    
    app.post('/signup',mid.requiresSecure,mid.requiresLogout, controllers.Account.signup);

    app.get('/logout',mid.requiresLogin, controllers.Account.logout);
   
    app.get('/',mid.requiresSecure,mid.requiresLogout, controllers.Account.loginPage);

    app.get('/board',mid.requiresSecure,mid.requiresLogin, controllers.Board.boardPage);

    app.get('/menu',mid.requiresSecure,mid.requiresLogin, controllers.Account.menuPage);
    

    app.get('/getBoard',mid.requiresSecure,mid.requiresLogin, controllers.Board.getBoard);

    app.post('/createBoard',mid.requiresSecure,mid.requiresLogin, controllers.Board.createBoard);
    
    app.get('/getUmlCount',mid.requiresSecure,mid.requiresLogin, controllers.Board.getUmlCount);
    
    //app.post('/addEmptyUml',mid.requiresSecure,mid.requiresLogin, controllers.Board.addEmptyUml);
    
    

};




module.exports = router;