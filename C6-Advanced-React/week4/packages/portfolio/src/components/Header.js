
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTwitter,
    faFacebook,
    faReddit,
    faDiscord,
  } from "@fortawesome/free-brands-svg-icons";
  
  import { Box, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

  const Nav = styled.div`
  position: fixed;
  width:100%;
  z-index:1000; //確保nav在最上層
  transition: top 0.3s;
  justify-content: center;
  a{
      text-decoration: none;
      color:white;
      margin:0 0.5em
  }
`



const Header =()=>{
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [navBarTop, setNavBarTop] = useState('0');

    const socials=[
        {
        name: "Twitter",
        link:"https://twitter.com/",
        icon:faTwitter
        },
        {
        name:"Facebook",
        link:"https://www.facebook.com/",
        icon:faFacebook
        },
        {
        name:"Reddit",
        link:"https://www.reddit.com/",
        icon:faReddit
        },
        {
        name:"Discord",
        link:"https://discord.com/channels/@me",
        icon:faDiscord
        }
    ]
    const handleClick=(e)=>{
        const target=e.target.getAttribute("href")
        const location=document.querySelector(target)
        if(location){
            location.scrollIntoView({
            behavior:"smooth"
        })
        }
    }
    
    useEffect(() => {
        const handleScroll = () => {
          let st = window.pageYOffset || document.documentElement.scrollTop;
          if (st > lastScrollTop) {
            setNavBarTop('-150px');  // 向下滚动时隐藏
          } else {
            setNavBarTop('0');  // 向上滚动时显示
          }
          setLastScrollTop(st <= 0 ? 0 : st);
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, [lastScrollTop]);

    return(

        <Nav style={{ top: navBarTop }}>
            <Box backgroundColor="#18181b" w="100%" pt={5} pb={5}  color="white">
                <HStack justify="space-between" px={50} py={3}  alignItems="center">
                    <HStack spacing={5}>
                        {socials.map((e)=>(
                            <div>
                                <a href={e.link} id={e.name} target="_blank">
                                    <FontAwesomeIcon icon={e.icon} key={e.link} size="2x" color="white"/>
                                </a>
                            </div> 
                        ))} 
                    </HStack>
                     

                    <HStack spacing={8} className="nav-link">
                        <a href="#projects-section" onClick={handleClick}>Projects</a>
                        <a href="#contactme-section" onClick={handleClick}>Contact Me</a>
                    </HStack>
                </HStack>
                    
            </Box>
        </Nav>

        
            
            
    )
}

export default Header