import PersonIcon from '@mui/icons-material/Person';
import { Avatar, Chip } from "@mui/material";
import { colorLogo } from "../../interfaces/colors";
import { ProfileData } from "../../interfaces/profile";


export default function ProfileCardRaad(props: ProfileData) {
    return <div className="card-profile">
        <PersonIcon
            style={{ color: colorLogo, height: 50, width: 100 }} />
        <div className="card-name">
            {props.name}
        </div>
        <div className="card-urb">
            {props.urbaName}
        </div>
        <div className="card-plays">
            <Chip label={"Played: " + 3 + props.numberPlays}
                avatar={<Avatar alt='icon' src="/images/raqueta2.png" />}
                color="warning" variant="outlined" />
        </div>
    </div>;
}


