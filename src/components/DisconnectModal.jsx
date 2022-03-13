import React, { useContext } from 'react';
import styled from 'styled-components';
import ThemeContext from '../context/themeContext';
import AppContext from '../context/AppContext';
import Modal from './Modal';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const DisconnectModal = ({ show, onClose, disconnect, account }) => {
  const { theme, changeTheme } = useContext(ThemeContext);
  const { sound, setSound, changeSound } = useContext(AppContext);
  const close = () => {
    disconnect();
    onClose();
  };
  return (
    <Modal
      show={show}
      onClose={onClose}
      title="Disconnect"
      modalStyle={{ height: 'auto' }}
    >
      <StyledDisconnectModal theme_={theme}>
        <span>Connected Address: {account}</span>
        <button onClick={close}>Disconnect</button>
      </StyledDisconnectModal>
    </Modal>
  );
};
const StyledDisconnectModal = styled.div`
  padding: 2rem 0rem;
  display: flex;
  flex-flow: column wrap;
  gap: 1rem;
  span {
    font-size: 1.2rem;
  }
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
`;
export default DisconnectModal;
