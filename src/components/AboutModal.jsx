import React, { useContext } from 'react';
import styled from 'styled-components';
import ThemeContext from '../context/themeContext';

import Modal from './Modal';

const AboutModal = ({ show, onClose }) => {
  const { theme, changeTheme } = useContext(ThemeContext);

  return (
    <Modal
      show={show}
      onClose={onClose}
      title="About Game"
      modalStyle={{ height: 'auto' }}
    >
      <StyledAboutModal theme_={theme}>
        <span className="title">Welcome to Brainly</span>
        <span>
          Measure how well your brain can retain infromation with this wonderful
          game, it is very easy to set up
        </span>
        <span>
          Connect with Metamask, Sequence or WallectConnect wallet, make sure
          your network is Polygon Mumai Testnet as this game is deployed there
        </span>
        <span>Mint the membership token to gain access to the game</span>
        <span>
          Check the Dashboard and try to beat to top users, if you beat them you
          will see yourself on top
        </span>
        <span>
          Publish your score after you've reached a high score of your choice
        </span>
        <span>
          You can choose your prefered theme in the settings and play with or
          without sounds
        </span>
      </StyledAboutModal>
    </Modal>
  );
};
const StyledAboutModal = styled.div`
  padding: 1rem 0rem;
  display: flex;
  flex-flow: column wrap;
  gap: 0.5rem;
  .title {
    font-size: 1.5rem;
  }
  span {
    font-size: 1.3rem;
  }
`;
export default AboutModal;
