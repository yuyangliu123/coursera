import Moon from "./Moon"
import Sun from "./Sun"

const Time =()=>{
    const now=new Date().getHours()
    return(
        now >= 5 && now <=19
        ?<Sun/>
        :<Moon/>
        
    )
}

export default Time