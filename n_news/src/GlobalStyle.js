import { createGlobalStyle } from 'styled-components';
import { darkSber } from '@sberdevices/plasma-tokens/themes'; // Или один из списка: darkEva, darkJoy, lightEva, lightJoy, lightSber

const ThemeStyle = createGlobalStyle(darkSber);

const DocumentStyle = createGlobalStyle`
    html:root {
        min-height: 100vh;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(1, 182, 255, 0) 50%), #080808;
    }`
export const GlobalStyle = () => (
    <>
        <DocumentStyle />
	    <ThemeStyle />
    </>
);
