import React, { useContext } from 'react';
import styled from 'styled-components';
import ThemeContext from '../context/themeContext';

import Modal from './Modal';

const AboutModal = ({ show, onClose }) => {
  const { theme, changeTheme } = useContext(ThemeContext);

  return (
    <Modal show={show} onClose={onClose} title="About Game">
      <StyledAboutModal theme_={theme}>
        <span>Fun game</span>
      </StyledAboutModal>
    </Modal>
  );
};
const StyledAboutModal = styled.div`
  padding: 2rem 0rem;
  display: flex;
  flex-flow: column wrap;
  gap: 1rem;
`;
export default AboutModal;
