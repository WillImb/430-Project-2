
const helper = require('./helper.js');
const React = require('react');
const { useEffect, useState } = React;
const { createRoot } = require('react-dom/client');



const App = () => {

    const [user, setUser] = useState("");

    useEffect(() => {
        const getUser = async () => {
            const name = await fetch('/getUser');

            if(name){
                setUser(name);
            }
        };
        getUser();
    },[]);

    return (
        <div>
            Welcome {user}
        </div>
    );
}


const init = () => {

    const root = createRoot(document.getElementById('content'));

    root.render(<App />);
};

window.onload = init;
