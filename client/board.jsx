

const helper = require('./helper.js');
const React = require('react');
const { useEffect, useState } = React;
const { createRoot } = require('react-dom/client');

const pageId = window.location.pathname.split('/').pop();

const AddEmptyUml = () => {


}


const ToolBar = (props) => {

    const addEmptyUml = (e) => {
        e.preventDefault();

        const newUML = {
            "name": "",
            "functions": [],
            "fields": []
        }

        helper.sendPost(`/addEmptyUml/${pageId}`, newUML);
    }

    return (
        <div>
            <button id="addUml" onClick={addEmptyUml}>Add uml</button>
        </div>
    );
}

const Board = (props) => {

    const [title, setTitle] = useState();

    useEffect(() => {
        const getBoardFromServer = async () => {
            try {
                const response = await fetch(`/getBoard/${pageId}`);

                const data = await response.json();

                setTitle(data.title)
            }
            catch (err) {
                console.log(err);
            }
        }
        getBoardFromServer();
    }, [pageId]);
    

    return (
        <div className="board">
            {title}

        </div>
    );
};


const Umls = (props) => {

    const [umls, setUmls] = useState([]);

    useEffect(() => {
        const getUmlFromServer = async () => {
            try {
                const response = await fetch(`/getUmls/${pageId}`);

                const data = await response.json();
                setUmls(data)
            }
            catch (err) {
                console.log(err);
            }
        }
        getUmlFromServer();
    }, []);

    if(umls.length === 0){
        return(
            <div>
                No umls yet
            </div>
        );
    }

    const displayUmls = umls.map(uml => {
        return(<div>
            <div>{uml.name}</div>
            <div>{uml.functions}</div>
            <div>{uml.fields}</div>

        </div>)
    })
    

    return (
        <div className="uml">
            {displayUmls}

        </div>
    );
};

const App = () => {
    return (
        <div>
            <div>
                <ToolBar />
            </div>
            <div>
                <Board />
            </div>
            <div>
                <Umls />
            </div>
        </div>
    );

}

const init = () => {


    const root = createRoot(document.getElementById('content'));


    root.render(<App />);
};

window.onload = init;
