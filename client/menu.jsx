

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
        return (<div><a
            href={`/board/${board._id}`}>
            {board.title}
        </a></div>);
    });

    return (<div>{boardsDisplay}</div>);
}

const App = () => {

    const [reload, setReload] = useState(false);

    return (
        <div>
            <div>
                <BoardMenu triggerReload={() => { setReload(!reload) }} />
            </div>

            <div>
                <BoardList reloadBoards={reload} />
            </div>
        </div>
    );
}


const init = () => {

    const root = createRoot(document.getElementById('menu'));

    root.render(<App />);
};

window.onload = init;
