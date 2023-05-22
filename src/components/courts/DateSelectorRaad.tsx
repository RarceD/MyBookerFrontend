import { colorDarkCard, colorLogo } from '../../interfaces/colors';
import { CourtType } from '../../interfaces/Courts';
import { responsiveCtr } from '../../util/responsiveService';
import './../components.css';

export interface DateSelectorDto {
  week: string,
  day: string,
  letter: string
}
export default function DateSelectorRaad(props: {
  iconType: CourtType,
  dateSelectorDto: DateSelectorDto[],
  selected: number,
  setSelected: (n: number) => void
}) {
  if (responsiveCtr.IsMobileDevice())
    return (
      <div className="date-selector">
        <div className="date-selector-icon">
          <div>
            {props.iconType == CourtType.PADEL ? <img src={"./images/raqueta2.png"} width={"50"} height={"50"} /> : <></>}
            {props.iconType == CourtType.TENIS ? <img src={"./images/imagesNuno/tenis.png"} width={"50"} height={"50"} /> : <></>}
            {props.iconType == CourtType.SALAS ? <img src={"./images/imagesNuno/others.png"} width={"60"} height={"70"} /> : <></>}
            {props.iconType == CourtType.OTHER ? <img src={"./images/imagesNuno/merendero.png"} width={"50"} height={"55"} /> : <></>}
          </div>
        </div>

        <div className="date-selector-items">
          {props.dateSelectorDto.map((item, idx) =>
            <DateSelectorItemRaad
              key={idx}
              week={item.week} day={item.day} letter={item.letter} selected={props.selected == idx}
              changeSelectedItem={() => props.setSelected(idx)}
            />)}
        </div>
      </div>
    );
  else
    return (
      <div>
        <div className="date-selector-desktop">
          <div className="date-selector-icon">
            <div>
              {props.iconType == CourtType.PADEL ? <img src={"./images/raqueta2.png"} width={"50"} height={"50"} /> : <></>}
              {props.iconType == CourtType.TENIS ? <img src={"./images/imagesNuno/tenis.png"} width={"50"} height={"50"} /> : <></>}
              {props.iconType == CourtType.SALAS ? <img src={"./images/imagesNuno/others.png"} width={"60"} height={"70"} /> : <></>}
              {props.iconType == CourtType.OTHER ? <img src={"./images/imagesNuno/merendero.png"} width={"50"} height={"55"} /> : <></>}
            </div>
          </div>

          <div className="date-selector-items">
            {props.dateSelectorDto.map((item, idx) =>
              <DateSelectorItemRaad
                key={idx}
                week={item.week} day={item.day} letter={item.letter} selected={props.selected == idx}
                changeSelectedItem={() => props.setSelected(idx)}
              />)}
          </div>
        </div>
      </div>
    );
}


function DateSelectorItemRaad(props: {
  week: string,
  day: string,
  letter: string,
  selected?: boolean
  changeSelectedItem: () => void
}) {
  return (
    <div className="date-selector-item">
      <div className="date-selector-item-week">
        {props.week}
      </div>
      <button
        className="date-selector-item-day"
        onClick={() => props.changeSelectedItem()}
        style={{ backgroundColor: props.selected ? colorLogo : colorDarkCard }}>
        {props.day}
      </button>
      <div className="date-selector-item-letter">
        {props.letter}
      </div>
    </div>
  );
}