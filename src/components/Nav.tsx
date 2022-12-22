import { NavLink } from "react-router-dom";

const Nav = () => {
    return (
        <nav>
            <NavLink to="new">New</NavLink>
            <NavLink to="todo">Todo</NavLink>
            <NavLink to="account">Account</NavLink>
        </nav>
    );
}

export default Nav;