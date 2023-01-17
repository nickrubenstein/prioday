import { Fragment } from "react";

const Overlay: React.FC<{ show: boolean }> = (props) => {
    return <Fragment>
        { props.show ? 
            <div className="overlay">
                <div className="spinner-container">
                    <div className='icon-spinner spinner'></div>
                </div>
            </div>
            :
            ''
        }
    </Fragment>;
}

export default Overlay;