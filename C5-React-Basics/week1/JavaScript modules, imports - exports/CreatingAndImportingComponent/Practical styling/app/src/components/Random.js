import React from 'react';

const RandomNum = () => {
    const num = Math.floor(Math.random() * 10);
    return (
        <>
            <p>Does num &gt; 5? : {num >= 5 ? "Over 5" : "Under 5"}</p>
            <p>num : {num}</p>
        </>
    );
}

const Random = () => {
    const [randomNum, setRandomNum] = React.useState(null);

    const handleClick = () => {
        setRandomNum(RandomNum());
    }

    return (
        <div>
            {randomNum}
            <button onClick={handleClick}>產生隨機數字</button>
        </div>
    );
}

export {RandomNum , Random}