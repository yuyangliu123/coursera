import styled from 'styled-components';
import { useEffect, useState } from 'react';

const FloatingNav = ({children}) => {
  const Nav = styled.div`
  position: fixed;
  width:100%;
  z-index:1000; //確保nav在最上層
  transition: top 0.3s;
  background-color:#FFFFFF;
  height:auto;
`
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [navBarTop, setNavBarTop] = useState('0');
  useEffect(() => {
    const handleScroll = () => {
      let st = window.pageYOffset || document.documentElement.scrollTop;
      if (st > lastScrollTop) {
        // 向下滚动时隐藏
        if (navBarTop !== '-100px') {
          setNavBarTop('-100px');
        }
      } else {
        // 向上滚动时显示
        if (navBarTop !== '0') {
          setNavBarTop('0');
        }
      }
      setLastScrollTop(st <= 0 ? 0 : st);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollTop]);

  return (
    <Nav style={{ top: navBarTop }}>
        {children}
    </Nav>
  );
}

export default FloatingNav;

