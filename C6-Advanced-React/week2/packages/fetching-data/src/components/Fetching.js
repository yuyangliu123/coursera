import React, { useEffect, useState } from "react"

const Fetching =()=>{
    const [user,setUser]=useState([])
    const fetchData = () => {
        fetch("https://randomuser.me/api/?results=1")
          .then(response => response.json())
          .then(data => setUser(data))
          .catch(error => console.log('Error fetching data: ', error));
      };

      useEffect(()=>{
        fetchData()
    },[])
    console.log({user});
    return (user && user.results && user.results.length > 0 ?(
    <>
    <h1>Data return</h1>
    <h2>First Name: {user.results[0].name.first}</h2>
    <h2>Last Name: {user.results[0].name.last}</h2>
    </>
    ):(
        <h1>Data padding...</h1>
    )
    )
}

export default Fetching