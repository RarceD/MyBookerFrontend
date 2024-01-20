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
            {props.iconType == CourtType.PADEL ? <img alt="Padel" src={"./images/raqueta2.png"} width={"50"} height={"50"} /> : <></>}
            {props.iconType == CourtType.TENIS ? <img alt="Tenis" src={"./images/imagesNuno/tenis.png"} width={"50"} height={"50"} /> : <></>}
            {props.iconType == CourtType.SALAS ? <img alt="Other" src={"./images/imagesNuno/football2.png"} width={"50"} height={"50"} /> : <></>}
            {props.iconType == CourtType.OTHER ? <img alt="Merendero" src={"./images/imagesNuno/merendero.png"} width={"50"} height={"55"} /> : <></>}
          </div>
        </div>

        <div className="date-selector-items">
          {props.dateSelectorDto.map((item, idx) =>
            <DateSelectorItemRaad
              key={idx}
              week={item.week} day={item.day} letter={item.letter} selected={props.selected == +item.day}
              changeSelectedItem={() => props.setSelected(+item.day)}
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
              {props.iconType == CourtType.PADEL ? <img alt="Padel" src={"./images/raqueta2.png"} width={"50"} height={"50"} /> : <></>}
              {props.iconType == CourtType.TENIS ? <img alt="Tenis" src={"./images/imagesNuno/tenis.png"} width={"50"} height={"50"} /> : <></>}
              {props.iconType == CourtType.SALAS ? <img alt="Other" src={"./images/imagesNuno/football2.png"} width={"50"} height={"50"} /> : <></>}
              {props.iconType == CourtType.OTHER ? <img alt="Merendero" src={"./images/imagesNuno/merendero.png"} width={"50"} height={"55"} /> : <></>}
            </div>
          </div>

          <div className="date-selector-items">
            {props.dateSelectorDto.map((item, idx) =>
              <DateSelectorItemRaad
                key={idx}
                week={item.week} day={item.day} letter={item.letter} selected={props.selected == +item.day}
                changeSelectedItem={() => props.setSelected(+item.day)}
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