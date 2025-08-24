import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { HashLink } from "react-router-hash-link";

const NavLike=()=>{
    return (
        <HashLink to="/like">
          <FontAwesomeIcon
            icon={faHeart}
            size="2xl"
            color="#ff0000"
          />
        </HashLink>
      )
}

export default NavLike
