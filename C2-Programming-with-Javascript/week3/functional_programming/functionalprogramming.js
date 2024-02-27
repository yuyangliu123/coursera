"https://github.com/greyhatguy007/meta-front-end-developer-professional-certificate/tree/main/C2-Programming-with-Javascript/week3/functional_programming"

function consoleStyler(color,background,fontSize,txt){
    let message = "%c" + txt;
    let style = `color: ${color}`
    style+=`background: ${background};`
    style+=`font-size: ${fontSize};`
    console.log(message, style)
}

function celebrateStyler(reason){
    let fontStyle = "color: tomato; font-size: 50px";
    if(reason=="birthday"){
        console.log(`%cHappy birthday`, fontStyle);
    }else if(reason == "champions"){
        console.log(`%cCongrats on the title!`, fontStyle);
    }else{
        console.log(message, style);
    }
}

consoleStyler('#1d5c63', '#ede6db', '40px', 'Congrats!')
celebrateStyler('birthday')

function styleAndCelebrate(color,background,fontSize,txt,reason){
    consoleStyler(color, background, fontSize, txt);
    celebrateStyler(reason);
}
styleAndCelebrate('#ef7c9e','#fae8e0','30px','You made it!','champions')

