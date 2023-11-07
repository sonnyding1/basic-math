// declare module 'math-field' {
//   const MathField: React.ComponentType<any>; // You can use a more specific type if available
//   export default MathField;
// }

// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       'math-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
//     }
//   }
// }

declare namespace JSX {
  interface IntrinsicElements {
    'math-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      onInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
      // Add any other props you want to specify for your custom element here
    };
  }
}
