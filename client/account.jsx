

const helper = require('./helper.js');
const React = require('react');
const { useEffect, useState } = React;
const { createRoot } = require('react-dom/client');





const PasswordChangePanel = async (props) => {

}



const App = () => {

    const [user, setUser] = useState("");
    const [premium, setPremium] = useState(false);

    const UpdatePremium = (status) => {
        helper.sendPost("/updatePremium", { status: status });
        setPremium(status);
    }

    useEffect(() => {
        const getUser = async () => {
            const response = await fetch('/getUser');

            const data = await response.json();

            console.log(data);

            if (data) {
                setUser(data.name);
                setPremium(data.premium);
            }
        };
        getUser();
    }, []);

    const getPremium = () => {
        if (!premium) {
            return (
                <div>
                    <h2>Become a Premium User</h2>
                    <ul>
                        <li>More Boards!</li>
                        <li>No Ads!</li>
                    </ul>
                    <button
                        onClick={() => { UpdatePremium(true) }}>
                        Become Premium
                    </button>
                </div>
            );
        }
        else {
            return (<div><h2>You are a Premium User</h2>
                <button
                    onClick={() => { UpdatePremium(false) }}>
                    Leave Premium
                </button>
            </div>);
        }
    }

    return (
        <div>
            Welcome {user}

            <button>Change Password</button>


            {getPremium()}


        </div>
    );
}


const init = () => {

    const root = createRoot(document.getElementById('content'));

    root.render(<App />);
};

window.onload = init;
