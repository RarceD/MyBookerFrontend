import { useEffect, useState } from "react";
import { GetTokenId } from "../api/auth";
import { GetBooks } from "../api/request";
import ListRaad from "../components/comunity/ListRaad";
import { ClientBooks } from "../interfaces/MyBooks";
import './../components/components.css'
import { translate } from "react-i18nify";

const Comunity = () => {
    const [books, setBooks] = useState<ClientBooks[]>([]);
    const [_, myClientId] = GetTokenId();
    useEffect(() => {
        GetBooks((n: ClientBooks[]) => {
            setBooks(n);
        })
    }, []);

    return (
        <div style={{ marginTop: 80, marginBottom: 120 }}>
            {/*The ones with my client id */}
            <div className="comunity-text">
                {translate('community.myBooks')}
            </div>
            {books.filter((item: ClientBooks) => item.clientId == +myClientId).length == 0 ?
                <div className="comunity-text" style={{ textAlign: "center" }}>
                    {translate('community.noBooks')}
                </div> : <></>
            }
            {books.map((item: ClientBooks, idx) => item.clientId == +myClientId ?
                <ListRaad key={idx}
                    courtType={item.type}
                    courtName={item.courtName}
                    toDelete={true}
                    mainText={item.weekday + " " + item.hour}
                    id={item.id}
                    secondText={item.duration + "h - " + item.clientName} /> : <div key={idx}></div>
            )}

            {/*The ones with other client id */}
            <div className="comunity-text">
                {translate('community.otherUserBooks')}
            </div>
            {books.map((item: ClientBooks, idx) => item.clientId != +myClientId ?
                <ListRaad key={idx}
                    courtType={item.type}
                    courtName={item.courtName}
                    toDelete={false}
                    mainText={item.weekday + " " + item.hour}
                    id={item.id}
                    secondText={item.duration + "h - " + item.clientName} /> : <div key={idx}></div>
            )}

            {books.filter((item: ClientBooks) => item.clientId != +myClientId).length == 0 ?
                <div className="comunity-text" style={{ textAlign: "center" }}>
                    {translate('community.noBooks')}
                </div> : <></>
            }

        </div>
    )
}

export default Comunity;
