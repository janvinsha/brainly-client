import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import { AboutModal, SettingsModal, DisconnectModal } from './index';
import AppContext from '../context/AppContext';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import ThemeContext from '../context/themeContext';

import DashboardIcon from '@mui/icons-material/Dashboard';
import { useNavigate } from 'react-router-dom';

const Nav = () => {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const {
    currentAccount,

    connectWallet,
    disconnectWeb3Modal,
  } = useContext(AppContext);
  const { theme, changeTheme } = useContext(ThemeContext);
  const handlerThemeSwitch = () => {
    changeTheme();
  };

  return (
    <StyledNav theme_={theme}>
      <div className="nav">
        <h2 onClick={() => navigate('/')}>Brainly</h2>
        <span className="right">
          <button onClick={() => navigate('/dashboard')}>
            {' '}
            <DashboardIcon />
          </button>
          <button onClick={() => setShowAbout(true)}>
            <InfoIcon />
          </button>
          <button onClick={() => setShowSettings(true)}>
            <SettingsIcon />
          </button>
          {!currentAccount ? (
            <span className="connect">
              <button onClick={connectWallet}>Connect</button>
            </span>
          ) : (
            <span className="account">
              <button onClick={() => setShowDisconnect(true)}>
                <span>
                  {currentAccount.slice(0, 4)}...{currentAccount.slice(-4)}
                </span>
              </button>
            </span>
          )}
        </span>
      </div>

      <SettingsModal
        show={showSettings}
        onClose={() => setShowSettings(false)}
        changeTheme={changeTheme}
      />
      <AboutModal
        show={showAbout}
        onClose={() => setShowAbout(false)}
        changeTheme={changeTheme}
      />
      <DisconnectModal
        show={showDisconnect}
        onClose={() => setShowDisconnect(false)}
        disconnect={disconnectWeb3Modal}
        account={currentAccount}
      />
    </StyledNav>
  );
};

const StyledNav = styled(motion.div)`
  .nav {
    padding: 2rem 8rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    @media screen and (max-width: 900px) {
      padding: 2rem 1rem;
    }

    h2 {
      font-size: 2rem;
      cursor: pointer;
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
    .right {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      @media screen and (max-width: 900px) {
        gap: 0.5rem;
      }
    }

    button {
      padding: 0.2rem;
      outline: none;
      background: inherit;
      border: none;
      color: ${({ theme_ }) => (theme_ ? 'white' : 'black')};
      cursor: pointer;
    }
  }
`;

export default Nav;
