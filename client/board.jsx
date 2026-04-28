import { functions } from 'underscore';
import { populate } from '../server/models/Board.js';

const helper = require('./helper.js');
const React = require('react');
const { useEffect, useState, useRef } = React;
const { createRoot } = require('react-dom/client');

const pageId = window.location.pathname.split('/').pop();



//all of our avaialble tools.
const ToolBar = (props) => {

    const addEmptyUml = async (e) => {
        e.preventDefault();

        const newUML = {
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

//pops up when a uml is selected to be edited
const UmlPopup = (props) => {
    //       https://stackoverflow.com/questions/43792457/update-one-of-the-objects-in-array-in-an-immutable-way
    //refernced this to make the onchange function
    const timeOutRef = useRef(null);

    if (props.selectedUml) {


        const functionInputs = props.selectedUml.functions.map((f, i) => {
            return (<input class="functionInput" type='text' name='functions'
                value={f}
                onChange={(e) => {
                    const newValue = e.target.value;
                    props.setUmls(cur =>
                        cur.map(uml => {
                            if (props.selectedUml && uml._id === props.selectedUml._id) {
                                const updatedFunction = [...uml.functions];
                                updatedFunction[i] = newValue

                                return {
                                    ...uml,
                                    functions: updatedFunction
                                };
                            }
                            return uml;
                        })
                    );
                    clearTimeout(timeOutRef.current);

                    timeOutRef.current = setTimeout(() => {
                        helper.sendPost('/updateUml', { umlId: props.selectedUml._id, boardId: pageId, functions: updatedFunction });


                    }, 500);



                }}
            />)

        })

        const fieldInputs = props.selectedUml.fields.map(fi => {
            return (<input class="fieldInput" type='text' name='fields'
                value={fi}
            />)

        })

        const deleteHelper = async (id) => {
            if (!id) {
                return false;
            }
            await helper.sendPost("/deleteUml", {boardId: pageId, id: id });
            props.triggerReload();
            props.setSelectedUmlId(null);
        }


        return (
            <div id='popup'>
                Edit Uml
                <br />
                <label htmlFor="name">Name: </label>
                <input id="name" type='text' name='umlName'
                    value={props.selectedUml.name}

                    onChange={(e) => {
                        props.setUmls(cur =>
                            cur.map(uml => props.selectedUml && uml._id === props.selectedUml._id
                                ? { ...uml, name: e.target.value }
                                : uml
                            )
                        );
                        clearTimeout(timeOutRef.current);

                        timeOutRef.current = setTimeout(() => {
                            helper.sendPost('/updateUml', { umlId: props.selectedUml._id, boardId: pageId, name: e.target.value });

                        }, 500);



                    }}
                />
                <label htmlFor="functions">Functions: </label>
                {functionInputs}
                <button id='addFunction' onClick={() => {
                    const updatedFunctions = [...props.selectedUml.functions, ""];

                    props.setUmls(cur => cur.map(uml => uml._id === props.selectedUml._id
                        ? {
                            ...uml,
                            functions: updatedFunctions
                        }
                        : uml
                    )
                    );

                    clearTimeout(timeOutRef.current);

                    timeOutRef.current = setTimeout(() => {
                        helper.sendPost('/updateUml', { umlId: props.selectedUml._id, boardId: pageId, functions: updatedFunctions });

                    }, 500);



                }}>Add New Function</button>

                <label htmlFor="fields">Fields: </label>
                {fieldInputs}
                <button id='addField'>Add New Field</button>


                <button id='deleteUml' onClick={()=>{deleteHelper(props.selectedUml._id)}}>DeleteUml</button>





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
            Title: {title}

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

                if (props.selectedUmlId === uml._id) {
                    props.setSelectedUmlId(null);
                }
                else {
                    props.setSelectedUmlId(uml._id);

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

    const selectedUml = umls.find(uml => uml._id === selectedUmlId);

    const [reload, setReload] = useState(false)

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
    }, [reload]);

    return (
        <div>
            <div>
                <ToolBar umls={umls} setUmls={setUmls} />
            </div>
            <div>
                <Board />
            </div>
            <div>
                <UmlPopup selectedUml={selectedUml} setSelectedUmlId={setSelectedUmlId} setUmls={setUmls} triggerReload={()=>{setReload(!reload)}}/>
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
