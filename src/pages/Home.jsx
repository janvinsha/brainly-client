import { useState, useEffect, useContext, useMemo } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Loader, Minting } from '../components';
import AppContext from '../context/AppContext';

//sounds
import red from '../assets/sounds/red.mp3';
import blue from '../assets/sounds/blue.mp3';
import green from '../assets/sounds/green.mp3';
import yellow from '../assets/sounds/yellow.mp3';
import wrong from '../assets/sounds/wrong.mp3';
export default function Home() {
  const {
    connectWallet,
    currentAccount,
    minting,
    askContractToMintNft,
    isMember,
  } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [levelTitle, setLevelTitle] = useState('Press Start');
  const [animateRed, setAnimateRed] = useState(false);
  const [animateBlue, setAnimateBlue] = useState(false);
  const [animateGreen, setAnimateGreen] = useState(false);
  const [animateYellow, setAnimateYellow] = useState(false);
  const [body, setBody] = useState('');

  const { sound } = useContext(AppContext);
  let buttonColours = ['red', 'blue', 'green', 'yellow'];

  localStorage.getItem('gamePattern');
  let gamePattern = JSON.parse(localStorage.getItem('gamePattern')) || [];

  let userClickedPattern =
    JSON.parse(localStorage.getItem('userClickedPattern')) || [];

  let started = JSON.parse(localStorage.getItem('started')) || false;

  let level = JSON.parse(localStorage.getItem('level') || 0);

  // useEffect(() => {
  //   alert('Wrong');
  //   setUserClickedPattern(
  //     JSON.parse(localStorage.getItem('userClickedPattern'))
  //   );
  //   setGamePattern(JSON.parse(localStorage.getItem('gamePattern')));
  // }, [setUserClickedPattern, setGamePattern]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 7400);
  }, []);
  // useEffect(() => {
  //   alert('storage updated');
  //   let {
  //     level: l,
  //     finalLevel: fl,
  //     gamePattern: gp,
  //     userClickedPattern: up,
  //     started: s,
  //   } = storage.retrieveData();
  //   storage.storeData({
  //     finalLevel: fl,
  //     level: l,
  //     gamePattern: gp,
  //     userClickedPattern: up || [],
  //     started: s || false,
  //   });
  // }, [
  //   level,
  //   gamePattern,
  //   userClickedPattern,
  //   started,
  //   setLevel,
  //   setGamePattern,
  //   setUserClickedPattern,
  //   setStarted,
  // ]);

  useEffect(() => {
    setTimeout(() => {
      setAnimateRed(false);
      setAnimateBlue(false);
      setAnimateGreen(false);
      setAnimateYellow(false);
    }, 100);
  }, [animateRed, animateBlue, animateGreen, animateYellow]);

  function start() {
    animatePress('start');
    startOver();
    if (!started) {
      nextSequence();
      started = true;
      localStorage.setItem('started', JSON.stringify(true));
    }
  }

  function buttonClick(color) {
    userClickedPattern.push(color);

    localStorage.setItem(
      'userClickedPattern',
      JSON.stringify(userClickedPattern)
    );
    playSound(color);
    animatePress(color);
    checkAnswer(userClickedPattern.length - 1);
  }

  function checkAnswer(currentLevel) {
    let gp = JSON.parse(localStorage.getItem('gamePattern'));
    if (gp[currentLevel] === userClickedPattern[currentLevel]) {
      if (userClickedPattern.length === gp.length) {
        setTimeout(function () {
          nextSequence();
        }, 1000);
      }
    } else {
      playSound('wrong');
      // $('body').addClass('game-over');
      setBody('game-over');
      setLevelTitle('Game Over, Press Start to Restart');
      setTimeout(function () {
        // $('body').removeClass('game-over');
        setBody('');
      }, 200);
      if (JSON.parse(localStorage.getItem('userLevel'))) {
        if (JSON.parse(localStorage.getItem('userLevel')) < level) {
          localStorage.setItem('userLevel', JSON.stringify(level));
        }
      } else {
        localStorage.setItem('userLevel', JSON.stringify(level));
      }
      startOver();
    }
  }

  function nextSequence() {
    userClickedPattern = [];
    level++;

    setLevelTitle('Level ' + level);
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColours[randomNumber];

    console.log(gamePattern, 'checking value');
    gamePattern.push(randomChosenColour);
    console.log(gamePattern, 'checking value 2');

    localStorage.setItem('userClickedPattern', JSON.stringify([]));
    localStorage.setItem('gamePattern', JSON.stringify(gamePattern));
    localStorage.setItem('level', JSON.stringify(level));

    // $('#' + randomChosenColour)
    //   .fadeIn(100)
    //   .fadeOut(100)
    //   .fadeIn(100);
    if (randomChosenColour == 'red') {
      setAnimateRed(true);
    } else if (randomChosenColour == 'blue') {
      setAnimateBlue(true);
    } else if (randomChosenColour == 'yellow') {
      setAnimateYellow(true);
    } else if (randomChosenColour == 'green') {
      setAnimateGreen(true);
    } else {
    }

    playSound(randomChosenColour);
  }

  function animatePress(currentColor) {
    // $('#' + currentColor).addClass('pressed');
    // setTimeout(function () {
    //   $('#' + currentColor).removeClass('pressed');
    // }, 100);
    if (currentColor == 'red') {
      setAnimateRed(true);
    } else if (currentColor == 'blue') {
      setAnimateBlue(true);
    } else if (currentColor == 'yellow') {
      setAnimateYellow(true);
    } else if (currentColor == 'green') {
      setAnimateGreen(true);
    } else {
    }
  }

  function playSound(name) {
    if (sound) {
      let audio;
      if (name === 'red') {
        audio = new Audio(red);
      } else if (name === 'blue') {
        audio = new Audio(blue);
      } else if (name === 'green') {
        audio = new Audio(green);
      } else if (name === 'yellow') {
        audio = new Audio(yellow);
      } else if (name === 'wrong') {
        audio = new Audio(wrong);
      } else {
      }
      audio.play();
    }
  }

  function startOver() {
    localStorage.setItem('gamePattern', JSON.stringify([]));
    localStorage.setItem('level', JSON.stringify(0));
    localStorage.setItem('started', JSON.stringify(false));
    level = 0;
    gamePattern = [];
    started = false;
  }
  return (
    <StyledHome>
      <Loader visible={loading} />
      <Minting visible={minting} />
      {currentAccount && isMember && (
        <span className="title">{levelTitle}</span>
      )}

      {currentAccount ? (
        isMember && (
          <span className="connect">
            <button onClick={() => start()}>Start</button>
          </span>
        )
      ) : (
        <span className="connect">
          <button>Connect To Play</button>
        </span>
      )}
      {currentAccount && !isMember && (
        <span className="connect" onClick={() => askContractToMintNft()}>
          <button>Mint Membership Token To Play</button>
        </span>
      )}

      <div className="buttons">
        <span className="row">
          <div
            className={`button red ${animateRed && 'animate'}`}
            onClick={() => currentAccount && isMember && buttonClick('red')}
          ></div>
          <div
            className={`button blue ${animateBlue && 'animate'}`}
            onClick={() => currentAccount && isMember && buttonClick('blue')}
          ></div>
        </span>
        <span className="row">
          <div
            className={`button green ${animateGreen && 'animate'}`}
            onClick={() => currentAccount && isMember && buttonClick('green')}
          ></div>
          <div
            className={`button yellow ${animateYellow && 'animate'}`}
            onClick={() => currentAccount && isMember && buttonClick('yellow')}
          ></div>
        </span>
      </div>
      {currentAccount && isMember && (
        <span className="title">
          High Score: Level {JSON.parse(localStorage.getItem('userLevel')) || 1}
        </span>
      )}
      {/* {currentAccount && (
        <span className="publish">Publish Score to Dashboard</span>
      )} */}
    </StyledHome>
  );
}
const StyledHome = styled(motion.div)`
  display: flex;
  flex-flow: column wrap;

  justify-content: center;
  align-items: center;
  padding: 1rem 1rem;
  gap: 1.4rem;
  .publish {
    background: -webkit-linear-gradient(green, yellow);
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
    font-size: 1.2rem;
  }
  .title {
    font-size: 1.5rem;
  }
  .connect {
    button {
      padding: 0.5rem 1rem;
      font-size: 1.5rem;

      background-image: linear-gradient(
        to bottom right,
        red,
        blue,
        green,
        yellow
      );
      outline: none;
      border: none;
      border-radius: 0.5rem;
      color: white;
      cursor: pointer;
    }
  }
  .account {
    button {
      padding: 0.5rem 1rem;
      font-size: 1.5rem;
      background-image: linear-gradient(
        to bottom right,
        red,
        blue,
        green,
        yellow
      );
      outline: none;
      border: none;
      border-radius: 0.5rem;
      color: white;
      cursor: pointer;
      display: flex;
      flex-flow: column wrap;
      gap: 0.2rem;
      justify-content: center;
      align-items: center;
    }
  }
  .buttons {
    display: flex;
    flex-flow: column wrap;
    gap: 1rem;
  }
  .row {
    display: flex;
    gap: 1rem;
  }

  .button {
    display: block;
    padding: 3.8rem;
    border-radius: 0.5rem;
    cursor: pointer;
    &:hover {
      opacity: 0.9;
    }
    transition: transform 0.35s ease-in-out;

    &.animate {
      transform: scale(0.9);
      opacity: 0.5;
    }
  }
  .red {
    background: red;
  }
  .green {
    background: green;
  }
  .yellow {
    background: yellow;
  }
  .blue {
    background: blue;
  }
`;
