'use client';

import Script from "next/script";
import { useState } from "react";

function App() {
  const [value, setValue] = useState("");
  return (
    <div className="App">
      <Script src="https://unpkg.com/mathlive/dist/mathlive.min.js" />
      <h1>MathLive with React</h1>
      <math-field onInput={(evt) => setValue(evt.target.value)} >
        {value}
      </math-field>
      <code>Value: {value}</code>
    </div>
  );
}

export default App;