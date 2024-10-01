import React, { useEffect, useRef, useState } from 'react';
import { FruitLogic } from './FruitLogic';
import { PointerDetection } from './PointerDetection';
import Webcam from "react-webcam";
import './NinjaGame.css';

const NinjaGame = ( {handleFruitSliced} ) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null); // Game canvas
    const overlayCanvasRef = useRef(null); // Pointer canvas
    const [swipeDetected, setSwipeDetected] = useState(false);
    const [swipeMidpoint, setSwipeMidpoint] = useState(null);
    const [startCountdown, setStartCountdown] = useState(3);
    const [gameStarted, setGameStarted] = useState(false);
    const [isGameOver, setGameOver] = useState(false);

    // Handle countdown timer to start the game
    useEffect(() => {
        if (startCountdown > 0) {
            const countdownTimer = setInterval(() => {
                setStartCountdown(prev => prev - 1);
            }, 1000);

            // Clear the interval when countdown ends or component unmounts
            return () => clearInterval(countdownTimer);
        } else if (startCountdown === 0 && !gameStarted) {
            // Start the game when countdown reaches zero
            setGameStarted(true);
        }
    }, [startCountdown, gameStarted]);

    // Handle pointer detection using webcam and hand detection
    useEffect(() => {
        if (!isGameOver) {
            const cleanupHandDetection = PointerDetection(webcamRef, overlayCanvasRef, (midpoint) => {
                setSwipeDetected(true);
                setSwipeMidpoint(midpoint);
            });

            return () => {
                if (cleanupHandDetection) {
                    cleanupHandDetection();  // Clean up hand detection when component unmounts or game ends
                }
            };
        }
    }, [isGameOver]);

    // Reset swipe detection after it’s processed
    useEffect(() => {
        if (swipeDetected) {
            setSwipeDetected(false); // Reset swipe detected
        }
    }, [swipeDetected]);

    // Handle game over when a bomb is triggered
    const handleBombTriggered = () => {
        setGameOver(true);
    };

    return (
        <>
            <Webcam
                ref={webcamRef}
                style={{
                    position: 'absolute',
                    width: "640px",
                    height: "480px",
                    opacity: 0, // Make it invisible but still functional
                }}
                videoConstraints={{
                    width: 640,
                    height: 480,
                    facingMode: "user",
                }}
            />
            <canvas ref={canvasRef} className="game-canvas" />
            <canvas ref={overlayCanvasRef} className="pointer-canvas" />
            {isGameOver && (
                <div className="game-over-message">Game Over!</div>
            )}
            <FruitLogic
                canvasRef={canvasRef}
                isGameOver={isGameOver}
                setGameOver={setGameOver}
                isGameStarted={gameStarted}
                swipeDetected={swipeDetected}
                swipeMidpoint={swipeMidpoint}
                handleFruitSliced={handleFruitSliced}
                handleBombTriggered={handleBombTriggered}
            />

            {/* Countdown before the game starts */}
            {!gameStarted && startCountdown > 0 && (
                <div className="countdown">Game starts in: {startCountdown}</div>
            )}
        </>
    );
};

export default NinjaGame;
