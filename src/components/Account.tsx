import { NavLink } from "react-router-dom";

const Account: React.FC = (props) => {
    return (
        <h1>
            <NavLink to="/todo"><span className="icon-undo2"></span></NavLink>
            Your Account
            <span></span>
        </h1>
    );
}

export default Account;