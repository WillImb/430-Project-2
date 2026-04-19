

const helper = require('./helper.js');
const React = require('react');
const { useEffect, useState } = React;
const { createRoot } = require('react-dom/client');


const BoardList = (props) => {

    const [boards, setBoards] = useState([]);

    useEffect(() => {
        const loadBoardsFromServer = async() => {
            const response = await fetch('/getUserBoards');
            const data = await response.json();

            setBoards(data.boards);
        };
        loadBoardsFromServer();
    }, []);


    if(boards.length === 0 ){
        return(<div>No Boards Yet</div>);
    }

    const boardsDisplay = boards.map(board => {
        return(<div><a
            href={`/board/${board._id}`}>
            {board.title}
            </a></div>);
    });

    return (<div>{boardsDisplay}</div>);
}

const init = () => {

    const createBoardBtn = document.getElementById("createBoard");

    createBoardBtn.addEventListener('click', (e) => {
        e.preventDefault();
        helper.sendPost('/createBoard',{});
    })

    const root = createRoot(document.getElementById('menu'));

    root.render(<BoardList />);
};

window.onload = init;
