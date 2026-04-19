

const helper = require('./helper.js');
const React = require('react');
const { useEffect, useState } = React;
const { createRoot } = require('react-dom/client');

let umlCount = 0;

const AddEmptyUml = () => {

    const newUML = {
        "name": "",
        "functions": [],
        "fields": []
    }

    helper.sendPost("/addEmptyUml",newUML);
}

const Uml = (props) => {

    const [title, setTitle] = useState();
    const [fields, setFields] = useState();
    const [methods, setMethods] = useState();

    useEffect(() => {
        const getUmlFromServer = async () => {
            try {
                const response = await fetch("/getBoard");
                const data = await response.json();

                setTitle(JSON.stringify(data));
            }
            catch (err) {
                console.log(err);
            }
        }
        getUmlFromServer();
    }, []);

    return (
        <div className="uml">
            {title}
        </div>
    );
};

const init = () => {

    const addUmlBtn = document.getElementById("addUml");
    const root = createRoot(document.getElementById('content'));



    addUmlBtn.addEventListener('click', (e) => {
        e.preventDefault();
    });

    root.render(<Uml />);
};

window.onload = init;
