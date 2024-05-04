import React from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-900 text-white">
        {/* Left Side (Chess Image) */}
        <div className="md:w-1/2 flex-shrink-0">
            <img src="../../src/assets/logo.png" alt="Chess Board" className="w-full h-auto" />
        </div>

        {/* Right Side (Game Details) */}
        <div className="md:w-1/2 p-8">
            <h1 className="text-5xl font-bold mb-0">Chess Clash</h1>
            <p className="text-sm text-gray-400 mb-12">play game online with someone</p>
            <p className="text-lg text-gray-400 mb-6">The ultimate chess experience!</p>
            <button onClick={() => {navigate('/game')}} className="bg-blue-700 hover:bg-blue-900 text-white py-2 px-4 rounded-md">Play Online</button>
        </div>
    </div>
);
}

export default Home
