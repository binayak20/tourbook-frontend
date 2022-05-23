import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  html {
    -webkit-font-smoothing: antialiased;
  }

  #root {
    width: 100%;
    height: 100%;
    display: block;
  }

  #nprogress {
    .bar {
      height: 3px !important;
    }
  }

  .Suspense {
    &Loader {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
  }
`;

export default GlobalStyles;
