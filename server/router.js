const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    

    app.get('/login',mid.requiresSecure,mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login',mid.requiresSecure,mid.requiresLogout, controllers.Account.login);
    
    app.post('/signup',mid.requiresSecure,mid.requiresLogout, controllers.Account.signup);

    app.get('/logout',mid.requiresLogin, controllers.Account.logout);
   
    app.get('/',mid.requiresSecure,mid.requiresLogout, controllers.Account.loginPage);

    app.get('/board',mid.requiresSecure,mid.requiresLogin, controllers.Board.getBoard);
    

    
    

};




module.exports = router;