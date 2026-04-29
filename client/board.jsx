
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
            "fields": [],
            "x": 10,
            "y": 10
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
            return (<React.Fragment>
                <br />
                <input class="functionInput" type='text' name='functions'
                    value={f}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        const updatedFunction = [...props.selectedUml.functions];
                        updatedFunction[i] = newValue
                        props.setUmls(cur =>
                            cur.map(uml => {
                                if (props.selectedUml && uml._id === props.selectedUml._id) {

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
                /></React.Fragment>)

        })

        const fieldInputs = props.selectedUml.fields.map((f, i) => {
            return (<React.Fragment>
                <br />
                <input class="fieldInput" type='text' name='fieldss'
                    value={f}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        const updatedField = [...props.selectedUml.fields];
                        updatedField[i] = newValue
                        props.setUmls(cur =>
                            cur.map(uml => {
                                if (props.selectedUml && uml._id === props.selectedUml._id) {

                                    return {
                                        ...uml,
                                        fields: updatedField
                                    };
                                }
                                return uml;
                            })
                        );
                        clearTimeout(timeOutRef.current);

                        timeOutRef.current = setTimeout(() => {
                            helper.sendPost('/updateUml', { umlId: props.selectedUml._id, boardId: pageId, fields: updatedField });


                        }, 500);



                    }}
                /></React.Fragment>)

        })


        const deleteHelper = async (id) => {
            if (!id) {
                return false;
            }
            await helper.sendPost("/deleteUml", { boardId: pageId, id: id });
            props.triggerReload();
            props.setSelectedUmlId(null);
        }


        return (
            <div id='popup'>
                <p>Edit Uml</p>
                <label htmlFor="name">Name: </label>
                <br /><input id="name" type='text' name='umlName'
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
                <br />
                <label htmlFor="functions">Functions: </label>
                {functionInputs}
                <br /><button id='addFunction' onClick={() => {
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


                <br /><label htmlFor="fields">Fields: </label>
                {fieldInputs}
                <br /><button id='addField' onClick={() => {
                    const updatedFields = [...props.selectedUml.fields, ""];

                    props.setUmls(cur => cur.map(uml => uml._id === props.selectedUml._id
                        ? {
                            ...uml,
                            fields: updatedFields
                        }
                        : uml
                    )
                    );

                    clearTimeout(timeOutRef.current);

                    timeOutRef.current = setTimeout(() => {
                        helper.sendPost('/updateUml', { umlId: props.selectedUml._id, boardId: pageId, fields: updatedFields });

                    }, 500);



                }}>Add New Field</button>

                <br />
                <br />
                <button id='deleteUml' onClick={() => { deleteHelper(props.selectedUml._id) }}>DeleteUml</button>





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

        const onDrag = (e) => {
            e.preventDefault();

            const startX = e.clientX;
            const startY = e.clientY;

            const initX = uml.x;
            const initY = uml.y;

            const OnMouseMove = (moveEvent) => {
                const dx = moveEvent.clientX - startX;
                const dy = moveEvent.clientY - startY;

                //if the uml matches the one we are dragging append its new position
                props.setUmls(cur => cur.map(u =>
                    u._id === uml._id
                        ? {
                            ...u,
                            x: initX + dx,
                            y: initY + dy
                        }
                        : u

                ))
            }


            const OnMouseUp = async (mouseEvent) => {
                const dx = mouseEvent.clientX - startX;
                const dy = mouseEvent.clientY - startY;

                document.removeEventListener('mousemove', OnMouseMove);
                document.removeEventListener('mouseup', OnMouseUp);

                await helper.sendPost('/updateUml', {
                    umlId: uml._id,
                    boardId: pageId,
                    x: initX + dx,
                    y: initY + dy
                });
            }

            document.addEventListener('mousemove', OnMouseMove);
            document.addEventListener('mouseup', OnMouseUp);
        };

        return (<div className='uml'
            onClick={() => {

                if (props.selectedUmlId === uml._id) {
                    props.setSelectedUmlId(null);
                }
                else {
                    props.setSelectedUmlId(uml._id);

                }
            }}
            onMouseDown={onDrag}
            style={{
                position: 'absolute',
                left: `${uml.x}px`,
                top: `${uml.y}px`,
                cursor: 'move'
            }}
        >
            
                <x>{uml.name}</x>
                <br/>
                <y>Functions:</y>
                <br/> 
                {uml.functions.map((f,i)=>(
                    <li>{f}</li>
                ))}
                <br/>
                <y>Fields:</y>
                <br/>                
                {uml.fields.map((f,i)=>(
                    <li>{f}</li>
                ))}
                
            
            


        </div>)
    })



    return (
        <div id='gridArea' style={{ position: 'relative', width: '100%', height: '100%' }}>
            {displayUmls}

        </div>
    );
};

const Ad = (props) => {

    const [premium, setPremium] = useState(false);

    useEffect(() => {

        const getPremium = async () => {

            const response = await fetch('/getUser');

            const data = await response.json();

            if (data) {

                setPremium(data.premium);
            }
        };
        getPremium();

    }, []);


    if (premium) {
        return (
            <div id='adContainer'>

            </div>
        );
    }


    return (
        <div id='adContainer'>
            <h1>AD</h1>
        </div>
    );
}

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
        <div id='boardContainer'>
            <div id='toolbarContainer'>
                <ToolBar umls={umls} setUmls={setUmls} />
            </div>
            <div id='titleContainer'>
                <Board />
            </div>
            <div id='popupContainer'>
                <UmlPopup selectedUml={selectedUml} setSelectedUmlId={setSelectedUmlId} setUmls={setUmls} triggerReload={() => { setReload(!reload) }} />
            </div>
            <div id='umlsContainer'>
                <Umls umls={umls} setUmls={setUmls} setSelectedUmlId={setSelectedUmlId} selectedUmlId={selectedUmlId} />
            </div>
            <Ad />
        </div>
    );

}

const init = () => {


    const root = createRoot(document.getElementById('content'));


    root.render(<App />);
};

window.onload = init;
