import { NavLink } from "react-router-dom";

const Nav = () => {
    return (
        <nav>
            <NavLink to="new">New</NavLink>
            <span></span>
            <NavLink to="todo">Todo</NavLink>
            <span></span>
            <NavLink to="account">Account</NavLink>
        </nav>
    );
}

export default Nav;