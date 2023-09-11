/* eslint-disable */
import styled from 'styled-components';
// import { breakpoints } from "../styled/variables.js";

export const MicButton = styled.div`
position: fixed;
left: calc(50% - 550px);
bottom: 93px;
display: none;
flex-direction: column;
gap: 20px;
padding: 25px 20px;
width: 53px;
border-radius: 18px;
box-sizing: border-box;
background: var(--plasma-colors-background-secondary);
@media (min-width: 1366px)  {
display: flex;
}
`;

export const MicIcon = styled.div`
cursor: pointer;
`;

