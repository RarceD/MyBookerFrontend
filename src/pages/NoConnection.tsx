import { CircularProgress } from '@mui/material';
import './pagesStyles.css'
import { translate } from 'react-i18nify';

export const NoConnection = () => {
    return (
        <div className="NoConnectionContainer">
            <div className="NoConnectionTxt">
                {translate('noConnection.loading')}
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
                {translate('noConnection.genericError')}
            </div>
        </div>
    )
}
export default NoConnection;