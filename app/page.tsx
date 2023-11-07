'use client';

import Script from "next/script";
import { useState } from "react";
import "//unpkg.com/mathlive";

function App() {
  const [value, setValue] = useState("");
  return (
    <div className="App">
      <h1>MathLive with React</h1>
      <math-field onInput={(evt) => setValue(evt.target.value)} >
        {value}
      </math-field>
      <code>Value: {value}</code>
    </div>
  );
}

export default App;