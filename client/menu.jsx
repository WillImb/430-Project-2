

const helper = require('./helper.js');
const React = require('react');
const { useEffect, useState } = React;
const { createRoot } = require('react-dom/client');





const BoardMenu = (props) => {

    const createBoard = async(e) => {
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
        return (<a
            href={`/board/${board._id}`}><div>
            {board.title}
        </div></a>);
    });

    return (<div id='boardDisplay'>{boardsDisplay}</div>);
}

const App = () => {

    const [reload, setReload] = useState(false);

    return (
        <div>
            <BoardMenu triggerReload={() => { setReload(!reload) }} />

            <BoardList reloadBoards={reload} />
            
            
        </div>
    );
}


const init = () => {

    const root = createRoot(document.getElementById('menu'));

    root.render(<App />);
};

window.onload = init;
