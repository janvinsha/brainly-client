import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import AppContext from '../context/AppContext';
import ThemeContext from '../context/themeContext';
import { Minting } from '../components';

import { pageAnimation } from '../animation';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';

let buttonColors = ['red', 'blue', 'green', 'yellow'];
export default function DashBoard({}) {
  const [editOn, setEditOn] = useState(false);
  const [name, setName] = useState('');
  const [sortedUsers, setSortedUsers] = useState();
  const {
    currentAccount,
    publishScore,
    publishing,
    users,
    accountDetails,
    changingName,
    changeName,
  } = useContext(AppContext);
  const { theme, changeTheme } = useContext(ThemeContext);
  const scores = [
    {
      level: 20,
      userAddress: '0x7c634dFbAe0425ddEFBeF8370b9cD63Ff3e06c89',
      name: 'Pointy ears',
    },
    {
      level: 20,
      userAddress: '0x7c634dFbAe0425ddEFBeF8370b9cD63Ff3e06c89',
      name: 'Don meon',
    },
    {
      level: 19,
      userAddress: '0x7c634dFbAe0425ddEFBeF8370b9cD63Ff3e06c89',
      name: 'Sick Daddy',
    },
    {
      level: 18,
      userAddress: '0x7c634dFbAe0425ddEFBeF8370b9cD63Ff3e06c89',
      name: 'Bad guu',
    },
    {
      level: 18,
      userAddress: '0x7c634dFbAe0425ddEFBeF8370b9cD63Ff3e06c89',
      name: 'Confam',
    },
    {
      level: 17,
      userAddress: '0x7c634dFbAe0425ddEFBeF8370b9cD63Ff3e06c89',
      name: 'Odogwu',
    },
    {
      level: 17,
      userAddress: '0x7c634dFbAe0425ddEFBeF8370b9cD63Ff3e06c89',
      name: 'Chief',
    },
    {
      level: 17,
      userAddress: '0x7c634dFbAe0425ddEFBeF8370b9cD63Ff3e06c89',
      name: 'Big man',
    },
    {
      level: 17,
      userAddress: '0x7c634dFbAe0425ddEFBeF8370b9cD63Ff3e06c89',
      name: 'Brainly',
    },
    {
      level: 16,
      userAddress: '0x7c634dFbAe0425ddEFBeF8370b9cD63Ff3e06c89',
      name: 'Life hard',
    },
    {
      level: 15,
      userAddress: '0x7c634dFbAe0425ddEFBeF8370b9cD63Ff3e06c89',
      name: 'Yes',
    },
  ];
  const sortThem = () => {
    let sortedAsceding = users.sort((a, b) => {
      return b.level - a.level;
    });
    setSortedUsers(sortedAsceding);
  };
  useEffect(() => {
    sortThem();
  }, [users]);
  return (
    <StyledDashBoard
      exit="exit"
      variants={pageAnimation}
      initial="hidden"
      animate="show"
      theme_={theme}
    >
      <Minting visible={publishing || changingName} />
      <div className="box">
        {currentAccount && (
          <span className="title">
            Current High Score: Level{' '}
            {JSON.parse(localStorage.getItem('userLevel'))}
          </span>
        )}
        {currentAccount && (
          <span className="title">
            Last Published High Score: Level {accountDetails?.level}
          </span>
        )}
        {currentAccount && (
          <span className="title">
            Name: {accountDetails?.name || 'User'}{' '}
            <button onClick={() => setEditOn(!editOn)}>
              <EditIcon />
            </button>
          </span>
        )}
        {currentAccount && editOn && (
          <span className="edit">
            <input
              onChange={e => setName(e.target.value)}
              placeholder="Set Name"
            />

            <button onClick={() => changeName(name)}>
              <SendIcon />
            </button>
          </span>
        )}
        {currentAccount && (
          <span className="publish">
            <button
              onClick={() =>
                publishScore(JSON.parse(localStorage.getItem('userLevel')))
              }
            >
              Add High Score to Score Board
            </button>
          </span>
        )}
      </div>
      <div className="score-board">
        <span className="board-title">Score Board</span>
        {!currentAccount &&
          scores.map((score, index) => (
            <div
              className="score"
              style={{
                background: `${buttonColors[index % 4]}`,
                color: `${
                  buttonColors[index % 4] == 'yellow' ? 'black' : 'white'
                }`,
              }}
              key={index}
            >
              <p>User: {score.userAddress}</p>
              <p>Username: {score.name}</p>
              <p>Level: {Number(score.level)}</p>
            </div>
          ))}
        {currentAccount &&
          sortedUsers &&
          sortedUsers.map((score, index) => (
            <div
              className="score"
              style={{
                background: `${buttonColors[index % 4]}`,
                color: `${
                  buttonColors[index % 4] == 'yellow' ? 'black' : 'white'
                }`,
              }}
              key={index}
            >
              <p>User: {score.userAddress}</p>
              <p>Username: {score.name}</p>
              <p>Level: {Number(score.level)}</p>
            </div>
          ))}
      </div>
    </StyledDashBoard>
  );
}
const StyledDashBoard = styled(motion.div)`
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  min-height: 60vh;
  .box {
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    padding: 0rem 2rem;
    width: 30rem;
    gap: 1rem;

    @media screen and (max-width: 900px) {
      padding: 0rem 0rem;
      width: 100%;
    }
  }
  .title {
    font-size: 2rem;
    button {
      outline: none;
      cursor: pointer;
      border: none;
      background: transparent;
      color: ${({ theme_ }) => (theme_ ? 'white' : 'black')};
    }
  }
  .edit {
    display: flex;
    gap: 1rem;
    input {
      padding: 0.5rem;
      border-radius: 0.5rem;
      background: ${({ theme_ }) => (theme_ ? '#0f0f0f' : '#ecedf0')};
      border: 2px solid gray;
      color: ${({ theme_ }) => (theme_ ? 'white' : 'black')};
      &::placeholder {
        color: ${({ theme_ }) => (theme_ ? 'whitesmoke' : 'black')};
      }
    }
    button {
      padding: 0.5rem;

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
  .publish {
    display: flex;
    flex-flow: column wrap;
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
  .score-board {
    padding-top: 2rem;
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    gap: 1rem;
    width: 100%;
    padding: 1rem 1rem;
    .board-title {
      font-size: 2rem;
      padding-top: 1rem;
      @media screen and (max-width: 900px) {
        font-size: 2rem;
        padding-top: 0rem;
      }
    }

    .score {
      width: 50rem;
      display: flex;
      flex-flow: column wrap;
      padding: 2rem;
      border-radius: 0.5rem;
      background: red;
      color: white;
      gap: 0.5rem;
      overflow: hidden;
      @media screen and (max-width: 900px) {
        width: 100%;
        padding: 1rem;
      }
    }
    p {
      font-size: 2rem;
      word-wrap: break-word;
      @media screen and (max-width: 900px) {
        font-size: 1rem;
      }
    }
  }
`;
