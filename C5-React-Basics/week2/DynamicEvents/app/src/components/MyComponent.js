import React, { useState } from 'react';
import { Prompt } from 'react-router-dom';

function MyComponent() {
  const [isModified, setIsModified] = useState(false);

  return (
    <div>
      <Prompt
        when={isModified}
        message="你有未保存的更改，確定要離開嗎？"
      />
      <input
        type="text"
        onChange={(e) => {
          if (e.target.value !== '') {
            setIsModified(true);
          } else {
            setIsModified(false);
          }
        }}
      />
    </div>
  );
}

export default MyComponent;