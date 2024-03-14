import React, { useState } from "react"

const BuildaRadioGroupComponent = () => {
    const [selected, setSelected] =useState("");

    const RadioGroup=({ children, selected, onChange })=> {
        const RadioOptions = React.Children.map(children, (child) => {
          return React.cloneElement(child, {
            checked: child.props.value === selected,
            onChange: onChange,
          });
        });
      
        return <div>{RadioOptions}</div>;
      }

    const RadioOption = ({ value, checked, onChange, children })=> {
        const handleChange = (e) => {
          const newValueSelected = e.target.value;
          onChange(newValueSelected);
        };
        return (
            <label>
              <input
                type="radio"
                value={value}
                checked={checked}
                onChange={handleChange}
              />
              {children}
            </label>
          );
    }
    
    return (
        <div className="App">
        <h2>How did you hear about Little Lemon?</h2>
        <RadioGroup onChange={setSelected} selected={selected}>
          <RadioOption value="social_media">Social Media</RadioOption>
          <RadioOption value="friends">Friends</RadioOption>
          <RadioOption value="advertising">Advertising</RadioOption>
          <RadioOption value="other">Other</RadioOption>
        </RadioGroup>
        <button disabled={!selected}>Submit</button>
      </div>
    );
}

export default BuildaRadioGroupComponent;
