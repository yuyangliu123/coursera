import { useEffect, useState } from "react"

const FetchPractice =()=>{
    const [nplayer,setNplayer]=useState([])

    const fetchNplayer=()=>{
        fetch("https://api.matsurihi.me/api/mltd/v2/events/322/rankings/eventPoint/summaries")
        .then(response => response.json())
        .then(data => setNplayer(data))
        .catch(error=>console.log("Error occured: ",error))
    }
    useEffect(()=>{
        fetchNplayer()
    },[])
    console.log(nplayer);
    return(nplayer && nplayer.length>0?(
       
        <>
        <table>
            <tr>
                <th>time</th>
                <th>score</th>
            </tr>
            {nplayer.map((row,i)=>(
                <tr key={i}>
                    <td>{row.aggregatedAt}</td>
                    <td>{row.count}</td>
                </tr>
            ))}
        </table>
        </>
    ):(
        <h1>Data padding</h1>
    )
    )

}

export default FetchPractice