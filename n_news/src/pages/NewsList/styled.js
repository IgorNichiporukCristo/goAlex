import styled from 'styled-components';

export const MicButton = styled.div`
display: flex;
flex-direction: column;
gap: 20px;
padding: 25px 20px;
width: 53px;
border-radius: 18px;
box-sizing: border-box;
background: var(--plasma-colors-background-secondary);
`;

export const MicIcon = styled.div`
`;

// export const Backdrop = styled.div`
// @media (min-width: ${breakpoints["true_lg"]}) {
// position: fixed;
// bottom: 0;
// left: 0;
// height: ${(
// typeof(window?.evg_insets?.bottom) === "number" &&
// window?.evg_insets?.bottom >= 0 &&
// window?.evg_insets?.bottom <= 110 ?
// window?.evg_insets?.bottom : 110) + "px"

// };
// z-index: 100000;
// background: blue;
// width: 100vw;
// backdrop-filter: blur(5px);
// }
// `;


export const VoiceControlButtons = styled.div`
// positilon: relative;
// top: 3px;
display: flex;
gap: 0px;
align-items: center;
margin-right: 6px;
`

export const HeaderControl = styled.button`
background: none;
border: none;
`;
