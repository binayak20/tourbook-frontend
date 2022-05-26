import { createGlobalStyle } from 'styled-components';
import { margins } from './utils';

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

  .margin {
    &-0 {
      margin: 0 !important;
      ${margins(0)}
    }

    &-1 {
      margin: 0.25rem !important;
      ${margins(0.25)}
    }

    &-2 {
      margin: 0.5rem !important;
      ${margins(0.5)}
    }

    &-3 {
      margin: 1rem !important;
      ${margins(1)}
    }

    &-4 {
      margin: 1.5rem !important;
      ${margins(1.5)}
    }

    &-5 {
      margin: 3rem !important;
      ${margins(3)}
    }
  }
`;

export default GlobalStyles;
