


const helper = require('./helper.js');
const React = require('react');
const { useEffect, useState } = React;
const { createRoot } = require('react-dom/client');







const BoardMenu = (props) => {

    const createBoard = async (e) => {

        const boardResponse = await fetch('/getUserBoards');
        const boardData = await boardResponse.json();

        const boardCount = boardData.boards.length;

        if (boardCount >= 10) {
            const premResponse = await fetch('/getUser');

            const data = await premResponse.json();

            const isPremium = data.premium;

            if(!isPremium){
                return false;
            }
        }

        e.preventDefault();
        await helper.sendPost('/createBoard', {});
        props.triggerReload();
    }

    return (
        <div><button id="createBoard" onClick={createBoard}>Make new board</button></div>
    )
}

const BoardList = (props) => {

    const [boards, setBoards] = useState([]);

    const deleteHelper = async (id) => {
        if (!id) {
            return false;
        }
        await helper.sendPost("/deleteBoard", { id: id });
        props.triggerReload();
    }


    useEffect(() => {
        const loadBoardsFromServer = async () => {
            const response = await fetch('/getUserBoards');
            const data = await response.json();

            setBoards(data.boards);
        };
        loadBoardsFromServer();
    }, [props.reloadBoards]);


    if (boards.length === 0) {
        return (<div>No Boards Yet</div>);
    }

    const boardsDisplay = boards.map(board => {
        return (<div><a
            href={`/board/${board._id}`}><div>
                {board.title}
            </div></a><button onClick={() => { props.setIsOn(true); props.setCurrentBoard(board._id) }}>Edit Name</button>
            <br />
            <button onClick={() => { deleteHelper(board._id) }}>Trash</button></div>);
    });

    return (<div id='boardDisplay'>{boardsDisplay}</div>);
}

const NameChangePopup = (props) => {

    const handleNameChange = async (e, currentBoard) => {
        e.preventDefault();
        const newName = e.target.querySelector('#boardName').value;
        if (!newName || !currentBoard) {
            return false;
        }
        await helper.sendPost(e.target.action, { currentBoard, newName })
        props.triggerReload();
        props.setIsOn(false);
        props.setCurrentBoard("");
        return false;
    }

    if (props.isOn) {
        return (
            <div id='changeName'>
                <h1>Change Name</h1>
                <form
                    onSubmit={(e) => handleNameChange(e, props.currentBoard)}
                    action="/changeBoardName"
                    method="POST"
                >
                    <label htmlFor="boardName">New Name </label>
                    <input id="boardName" type="text" name="boardName" placeholder="New Name" />
                    <input className='formSubmit' type='submit' value="Update Name" />
                </form>
            </div>
        );
    }
    return ("");
}


const App = () => {

    const [reload, setReload] = useState(false);
    const [isOn, setIsOn] = useState(false);
    const [currentBoard, setCurrentBoard] = useState("");

    return (
        <div>
            <BoardMenu triggerReload={() => { setReload(!reload) }} />

            <BoardList reloadBoards={reload} setIsOn={setIsOn} setCurrentBoard={setCurrentBoard} triggerReload={() => { setReload(!reload) }} />

            <NameChangePopup isOn={isOn} currentBoard={currentBoard} setIsOn={setIsOn} setCurrentBoard={setCurrentBoard} triggerReload={() => { setReload(!reload) }} />
        </div>
    );
}


const init = () => {

    const root = createRoot(document.getElementById('menu'));

    root.render(<App />);
};

window.onload = init;
