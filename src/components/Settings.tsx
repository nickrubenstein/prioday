import { Fragment } from "react";
import { NavLink } from "react-router-dom";
import Account from "./Account";
import Auth from "./Auth";

const Settings: React.FC<{ theme: string, onTheme: () => void }> = (props) => {
    const isDark = props.theme === 'dark';

    return <Fragment>
        <h1>
            <NavLink to="/todo"><span className="icon-undo2 margin-left"></span></NavLink>
            Settings
            <span className="icon-dummy margin-right"></span>
        </h1>
        <section>
            <h1>Device</h1>
            <form>
                <div className="checkmark">
                    <label htmlFor="repeat">{isDark ? "Dark" : "Light"} Theme</label>
                    <label className="switch">
                        <input type="checkbox" id="repeat" checked={isDark} onChange={props.onTheme}/>
                        <span className="slider round"></span>
                    </label>
                </div>
            </form>
            <Account></Account>
            <Auth></Auth>
        </section>
    </Fragment>;
}

export default Settings;