import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}
body{ 
    font-family: 'Odibee Sans', cursive;
    overflow-x:hidden;
    color:${({ theme }) => (theme ? 'white' : 'black')};
    transition:0.3s ease-in-out;
    background:${({ theme }) => (theme ? '#0f0f0f' : '#ecedf0')};
}
button{
  font-family: 'Odibee Sans', cursive;
}
.App{
    background:${({ theme }) => (theme ? '#0f0f0f' : '#ecedf0')};
}

`;
export default GlobalStyle;
