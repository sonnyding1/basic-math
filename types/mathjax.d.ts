declare global {
    interface Window {
      MathJax: {
        typeset: () => void;
      };
    }
  }