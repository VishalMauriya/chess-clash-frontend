import React, { useState } from "react";
import { BLACK, CHECKMATE, RESIGN, TIMEOUT } from "../helpers/msg";

export default function ModalBox(props) {
  const { showModal, setShowModal, msg } = props;
  let winner;
  let type;

  if (msg && msg.payload) {
    if (msg.payload.result === RESIGN || msg.payload.result === CHECKMATE || msg.payload.result === TIMEOUT) {
      winner = msg.payload.winner === BLACK ? "Black" : "White";
      type = msg.payload.result.charAt(0).toUpperCase() + msg.payload.result.slice(1);
    }
  }

  const closeModal = () => {
    setShowModal({ isShow: false, modal: showModal.modal });
  };

  return (
    <>
      {showModal.isShow && showModal.modal === 1 ? (
        <>
          {/* Modal 1 content */}
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-full max-w-xs md:max-w-md lg:max-w-lg mx-auto">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none p-6">
                <p className="my-1 text-black text-5xl leading-relaxed">🔍</p>
                <p className="my-2 text-black text-lg leading-relaxed">Finding your opponent.....</p>
                <button
                  className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-8 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : showModal.isShow && showModal.modal === 2 ? (
        <>
          {/* Modal 2 content */}
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-full max-w-xs md:max-w-md lg:max-w-lg mx-auto">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-blue-500 outline-none focus:outline-none p-6">
                <p className="my-1 text-black text-3xl leading-relaxed font-bold">{type}</p>
                <p className={`my-1 text-${winner?.toLowerCase()} text-5xl leading-relaxed`}>♚</p>
                <p className="my-2 text-black text-lg leading-relaxed">{winner} is winner</p>
                <button
                  className="bg-blue-700 text-white active:bg-blue-900 font-bold uppercase text-sm px-8 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={closeModal}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : showModal.isShow && showModal.modal === 3 ? (
        <>
          {/* Modal 3 content */}
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-full max-w-xs md:max-w-md lg:max-w-lg mx-auto">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none p-6">
              <p className="my-1 text-black text-3xl leading-relaxed font-bold">{type}</p>
                <p className="my-1 text-black text-5xl leading-relaxed">♔♚</p>
                <p className="my-2 text-black text-lg leading-relaxed">No winner for this game!</p>
                <button
                  className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-8 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
