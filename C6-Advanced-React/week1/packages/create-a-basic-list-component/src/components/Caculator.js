const Caculator=()=>{
    const matrix=[
        ["7","8","9","+"],
        ["4","5","6","-"],
        ["1","2","3","*"],
        ["0",".","=","/"]
    ]   
    
    return(
        <table>
        {matrix.map((row,i)=>(
            <tr key={i}>
                {row.map((item,j)=>
                    <td key={j}>{item}</td>
                )}
            </tr>
            
        
        
    ))}
        </table>
    )
}

export default Caculator