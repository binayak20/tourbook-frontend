import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
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

  .shadow {
    box-shadow: 0 0.25rem 1rem rgba(35, 123, 176, 0.06);

    &-lg {
      box-shadow: 0 0.5rem 1.5rem rgba(208, 216, 243, 0.6);
    }
  }
`;

export default GlobalStyles;
