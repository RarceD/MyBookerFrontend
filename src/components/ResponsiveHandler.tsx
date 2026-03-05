import { JSX } from "react";
import './components.css';

const ResponsiveHandler = (props: { component: () => JSX.Element }) => {
    const { component } = props;
    return (
        <div className="app-content">
            {component()}
        </div>
    )
}

export default ResponsiveHandler;
