// GamePage.tsx
import { useEffect, useState } from 'react';
import Chessboard from 'chessboardjsx';
import { useSocket } from '../hooks/useSocket';
import { Chess } from 'chess.js';
import ModalBox from './modal';
import { CHECKMATE, DRAW, GAME_OVER, GAME_START, INIT_GAME, MOVE, RESIGN, TIMEOUT, WHITE } from '../helpers/msg';

const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [msg, setMsg] = useState(null);
    const [orientation, setOrientation] = useState<'white' | 'black'>('white');
    const [showModal, setShowModal] = useState<{ isShow: boolean; modal: number }>({isShow: false, modal: 1});
    const [showComponent, setShowComponent] = useState(true);

    const [whiteTimer, setWhiteTimer] = useState({ time: 600, isActive: false });
    const [blackTimer, setBlackTimer] = useState({ time: 600, isActive: false });
    const [turn, setTurn] = useState<string | null>(null);
    const [socketId, setSocketId] = useState<string | null>(null);

  useEffect(() => {
    let intervalA: number | undefined, intervalB: number | undefined;

    if (turn === 'w') {
      intervalA = setInterval(() => {
        setWhiteTimer((prevwhiteTimer) => {
            const newTime = prevwhiteTimer.time - 1;
            return { ...prevwhiteTimer, time: Math.max(newTime, 0) };
          });
      }, 1000);
    } else {
      clearInterval(intervalA);
    }

    if (turn === 'b') {
      intervalB = setInterval(() => {
        setBlackTimer((prevblackTimer) => {
            const newTime = prevblackTimer.time - 1;
            return { ...prevblackTimer, time: Math.max(newTime, 0) };
          });
      }, 1000);
    } else {
      clearInterval(intervalB);
    }

    if(whiteTimer.time === 0 || blackTimer.time === 0){

        if (whiteTimer.time === 0 && blackTimer.time === 0) {
            handleTimeOut();
        } else if (whiteTimer.time === 0) {
            handleTimeOut();
        } else if (blackTimer.time === 0) {
            handleTimeOut();
        }
    }

    return () => {
      clearInterval(intervalA);
      clearInterval(intervalB);
    };
  }, [whiteTimer.time, blackTimer.time, turn]);

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMsg(message);
            switch (message.type) {
                case INIT_GAME:
                    gameInit();
                    console.log('Game initialized');
                    break;
                case MOVE:
                    handleMove(message);
                    console.log('Move made');
                    break;
                case GAME_START:
                    handleStartGame(message);
                    console.log('Game Started');
                    break;
                case GAME_OVER:
                    handleEndGame(message);
                    console.log('Game Over');
                    break;
                default:
                    break;
            }
        };
    }, [socket, chess]);
    
      const resetTimer = () => {
          setWhiteTimer({ time: 600, isActive: false });
          setBlackTimer({ time: 600, isActive: false });
      };
    
      const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      };

    const gameInit = () => {
        setShowModal({ isShow: true, modal: 1 });
    }

    const startGame = () => {
        setShowModal({ isShow: true, modal: 1 });
        socket?.send(JSON.stringify({ type: INIT_GAME }));
        setTurn('w');
    }

    const handleStartGame = (message: any) => {
        setChess(new Chess());
        setOrientation(message.color);
        setSocketId(message.socketId);
        setShowModal({ isShow: false, modal: 1 });
        setShowComponent(false);
    };

    const handleMove = (message: any) => {
        setChess(new Chess(chess.fen()));
        chess.move(message.move);
        setChess(chess);
        setTurn(chess.turn());
    }

    const handleTimeOut = () => {
        socket?.send(JSON.stringify({ type: TIMEOUT}));
    }

    const handleEndGame = (message: any) => {
        setShowModal({ isShow: true, modal: 2 });
        setShowComponent(true);
        setChess(new Chess());
        resetTimer();

        console.log('type==> ', message.payload);
        

        message.payload.result === CHECKMATE || 
        message.payload.result === RESIGN || 
        message.payload.result === TIMEOUT
            ? setShowModal({ isShow: true, modal: 2 })
            : setShowModal({ isShow: true, modal: 3 });
    };

    const handleResign = () => {
        socket?.send(JSON.stringify({ type: RESIGN }));
        handleEndGame(msg);
    }

    return (
        <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-900 text-white">
            {/* Left Side (Chess Board) */}
            <div className="md:w-3/4 p-8">
                <Chessboard
                    position={chess.fen()}
                    draggable={true}
                    orientation={orientation}
                    onDrop={(source) => {
                        socket?.send(JSON.stringify({ type: MOVE, move: { from: source.sourceSquare, to: source.targetSquare } }));
                    }}
                />
            </div>

            {/* Right Side (Game Controls) */}
            {showComponent ? 
            <div className="w-full md:w-1/4 p-4 md:p-8">
                <h1 className="text-3xl font-bold mb-4">Chess Game</h1>
                <p className="text-lg text-gray-400 mb-8">Instructions:</p>
                <ul className="list-disc ml-6">
                    <li className="mb-3">Make moves by dragging and dropping pieces on the chessboard.</li>
                    <li className="mb-3">Click "Start Game" to begin a new game.</li>
                    <li>Pay attention to messages for game status and moves.</li>
                </ul>
                <button onClick={startGame} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mt-8 w-full">Start Game</button>
            </div> :
            <div className="w-full md:w-1/4 p-4 md:p-8">
                <p className="text-lg text-green-400 mb-5">ID: {socketId}</p>
                <p className="text-lg text-gray-400 mb-3">Game ends in:</p>
                <h1 className={`text-5xl font-bold mb-12 text-blue-500`}>
                    {orientation === WHITE ? formatTime(whiteTimer.time) : formatTime(blackTimer.time)}
                </h1>
                <p className="text-lg text-gray-400 mb-8">─────── or ───────</p>
                <button onClick={handleResign} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md mt-8 w-full">Resign</button>
            </div>
            }

            {/* Render the ModalBox component */}
            {showModal && <ModalBox showModal={showModal} setShowModal={setShowModal} socket={socket} msg={msg} />}
        </div>
    );
};

export default Game;