import { CircularProgress } from '@mui/material';
import './pagesStyles.css'

export const NoConnection = () => {
    return (
        <div className="NoConnectionContainer">
            <div className="NoConnectionTxt">
                Cargando ...
            </div>
            <div className="NoConnectionAnimation">
                <CircularProgress  
                    size={"90px"}
                    color={'inherit'}
                />
            </div>
            <div className="NoConnectionTxt"
            style={{fontSize:"20px"}}
            >
                Parece que hay problemas de red, compruebe su conexión a internet.
            </div>
        </div>
    )
}
export default NoConnection;