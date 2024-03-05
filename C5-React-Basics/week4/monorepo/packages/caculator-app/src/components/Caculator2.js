import {
    useState,
    useRef
  } from "react"; 
  
  import "../style2.module.css";
const Caculator2=()=>{
    const inputRef = useRef(null); 
    const [result,setResult]=useState("")

    const buttons=[
        ["(",")","%","AC"],
        ['7', '8', '9','+'],
        ['4', '5', '6','-'],
        [ '1', '2','3', '*'],
        ['0',".", '=','/']
    ]

    const handleClick=(e)=>{
        const value = e.target.name;
        if(value==="AC"){
            setResult("")
            inputRef.current.focus()
        }else if(value==="="){
            try{
                setResult(eval(result).toString());
                } catch(err) {
            setResult("Error");
                } 
        } else {
            setResult(result.concat(value));
        }
    }
    


    return(
        <>
        <div className="calc-app">
      <form>
        <input type="text" value={result} ref={inputRef} />
      </form>

      <table className="keypad">
        {buttons.map((row, i) => (
          <tr key={i}>
            {row.map((button, j) => (
              <td key={j}>
                <button name={button} onClick={handleClick}>{button}</button>
              </td>
            ))}
          </tr>
        ))}
      </table>
    </div>
        
        </>
    )
}

export default Caculator2