import { useState, useEffect, useContext, useMemo } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

export default function DashBoard() {
  return <StyledDashBoard></StyledDashBoard>;
}
const StyledDashBoard = styled(motion.div)`
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
