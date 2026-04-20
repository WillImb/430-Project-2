const helper = require('./helper.js');
const React = require('react');
const { useEffect, useState, useRef } = React;
const { createRoot } = require('react-dom/client');

const pageId = window.location.pathname.split('/').pop();




const ToolBar = (props) => {

    const addEmptyUml = async (e) => {
        e.preventDefault();

        const newUML = {
            "id": Date.now().toString(),
            "name": "",
            "functions": [],
            "fields": []
        }

        const res = await helper.sendPost(`/addEmptyUml/${pageId}`, newUML, (newUml) => {
            props.setUmls(prev => [...prev, newUml]);
        });

    }

    return (
        <div>
            <button id="addUml" onClick={addEmptyUml}>Add uml</button>
        </div>
    );
};

const UmlPopup = (props) => {
    //       https://stackoverflow.com/questions/43792457/update-one-of-the-objects-in-array-in-an-immutable-way
    //refernced this to make the onchange function
    const timeOutRef = useRef(null);

    if (props.selectedUml) {
        return (
            <div id='popup'>
                Edit Uml
                <br />
                <label htmlFor="username">Name: </label>
                <input id="name" type='text' name='umlName'
                    value={props.selectedUml.name}

                    onChange={(e) => {
                        props.setUmls(cur =>
                            cur.map(uml => props.selectedUml && uml.id === props.selectedUml.id
                                ? { ...uml, name: e.target.value }
                                : uml
                            )
                        );

                        clearTimeout(timeOutRef.current);

                        timeOutRef.current = setTimeout(() => {
                            helper.sendPost('/updateUml', { umlId: props.selectedUml.id, boardId: pageId, name: e.target.value });

                        }, 500);



                    }}
                />
                


            </div>
        )
    }
    else {
        return (<div></div>);
    }
};

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



    if (props.umls.length === 0) {
        return (
            <div>
                No umls yet
            </div>
        );
    }


    const displayUmls = props.umls.map(uml => {
        return (<div className='uml'
            onClick={() => {

                if (props.selectedUmlId === uml.id) {
                    props.setSelectedUmlId(null);
                }
                else {
                    props.setSelectedUmlId(uml.id);

                }
            }
            }>
            {JSON.stringify({
                name: uml.name,
                functions: uml.functions,
                fields: uml.fields,
            })
            }


        </div>)
    })
    // const displayUmls = umls.map(uml => {
    //     return(<div>
    //         <div>{uml.name}</div>
    //         <div>{uml.functions}</div>
    //         <div>{uml.fields}</div>

    //     </div>)
    // })


    return (
        <div>
            {displayUmls}

        </div>
    );
};

const App = () => {

    const [umls, setUmls] = useState([]);

    const [selectedUmlId, setSelectedUmlId] = useState(null);

    const selectedUml = umls.find(uml => uml.id === selectedUmlId);

    useEffect(() => {
        const getUmlFromServer = async () => {
            try {
                const response = await fetch(`/getUmls/${pageId}`);

                const data = await response.json();

                setUmls(data);
            }
            catch (err) {
                console.log(err);
            }
        }
        getUmlFromServer();
    }, []);

    return (
        <div>
            <div>
                <ToolBar umls={umls} setUmls={setUmls} />
            </div>
            <div>
                <Board />
            </div>
            <div>
                <UmlPopup selectedUml={selectedUml} setUmls={setUmls} />
            </div>
            <div>
                <Umls umls={umls} setSelectedUmlId={setSelectedUmlId} selectedUmlId={selectedUmlId} />
            </div>
        </div>
    );

}

const init = () => {


    const root = createRoot(document.getElementById('content'));


    root.render(<App />);
};

window.onload = init;
