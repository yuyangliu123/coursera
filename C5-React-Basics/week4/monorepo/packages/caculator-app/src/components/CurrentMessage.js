import Weekends from "./Weekends"
import Workdays from "./Workdays"

const CurrentMessage = (props)=>{
    return props.day<=4
    ? <Workdays/>
    : <Weekends/>
}

export default CurrentMessage