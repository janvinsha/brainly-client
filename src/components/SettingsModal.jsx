import React, { useContext } from 'react';
import styled from 'styled-components';
import ThemeContext from '../context/themeContext';
import AppContext from '../context/AppContext';
import Modal from './Modal';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const SettingsModal = ({ show, onClose }) => {
  const { theme, changeTheme } = useContext(ThemeContext);
  const { sound, setSound, changeSound } = useContext(AppContext);
  return (
    <Modal show={show} onClose={onClose} title="Settings">
      <StyledSettingsModal theme_={theme}>
        <span className="theme">
          <span>Theme</span>
          {theme ? (
            <button onClick={() => changeTheme()} className="moon">
              <DarkModeIcon />
            </button>
          ) : (
            <button onClick={() => changeTheme()} className="sun">
              <Brightness7Icon />
            </button>
          )}
        </span>
        <span className="sound">
          Sound
          {sound ? (
            <button onClick={() => changeSound()} className="moon">
              <VolumeUpIcon />
            </button>
          ) : (
            <button onClick={() => changeSound()} className="sun">
              <VolumeMuteIcon />
            </button>
          )}
        </span>
      </StyledSettingsModal>
    </Modal>
  );
};
const StyledSettingsModal = styled.div`
  padding: 2rem 0rem;
  display: flex;
  flex-flow: column wrap;
  gap: 1rem;
  .theme,
  .sound {
    display: flex;
    gap: 1rem;
    align-items: center;
    font-size: 1.2rem;
    button {
      background: transparent;
      outline: none;
      border: none;
      color: ${({ theme_ }) => (theme_ ? 'white' : 'black')};
      cursor: pointer;
    }
  }
`;
export default SettingsModal;
