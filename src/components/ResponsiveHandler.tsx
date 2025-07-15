import { JSX } from "react";
import { responsiveCtr } from "../util/responsiveService";

 const ResponsiveHandler = (props: {component: () => JSX.Element}) => {
    const {component} = props;
    return (
        <div className="App" style={responsiveCtr.IsMobileDevice() ? {} : { paddingLeft: "25%", paddingRight: "25%" }}>
            {component()}
        </div>
    )
}

export default ResponsiveHandler;