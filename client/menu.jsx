

const helper = require('./helper.js');
const React = require('react');
const { useEffect, useState } = React;
const { createRoot } = require('react-dom/client');

let umlCount = 0;



const BoardList = (props) => {

    const [boards, setBoards] = useState({});

    useEffect(() => {
        const loadBoardsFromServer = async() => {
            const response = await fetch('/getUserBoards');
            const data = await response.json();

            setBoards(data);
        };
        loadBoardsFromServer();
    }, []);

    return (<div>{JSON.stringify(boards)}</div>)
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
