import { useEffect, useState } from "react";
import { GetTokenId } from "../api/auth";
import { GetBooks } from "../api/request";
import ListRaad from "../components/comunity/ListRaad";
import { ClientBooks } from "../interfaces/MyBooks";
import './../components/components.css'

const Comunity = () => {
    const [books, setBooks] = useState<ClientBooks[]>([]);
    const [token, myClientId] = GetTokenId();
    useEffect(() => {
        GetBooks((n: ClientBooks[]) => {
            setBooks(n);
        })
    }, []);

    return (
        <div style={{ marginTop: 80, marginBottom: 120 }}>
            {/*The ones with my client id */}
            <div className="comunity-text">
                Mis próximas reservas
            </div>
            {books.filter((item: ClientBooks) => item.clientId == +myClientId).length == 0 ?
                <div className="comunity-text" style={{ textAlign: "center" }}>
                    No hay próximamente
                </div> : <></>
            }
            {books.map((item: ClientBooks, idx) => item.clientId == +myClientId ?
                <ListRaad key={idx}
                    courtType={item.type}
                    courtName={item.courtName}
                    toDelete={true}
                    mainText={item.weekday + " " + item.hour}
                    id={item.id}
                    secondText={"Duración: " + item.duration + " - " + item.clientName} /> : <div key={idx}></div>
            )}

            {/*The ones with other client id */}
            <div className="comunity-text">
                Reservas de otros usuarios
            </div>
            {books.map((item: ClientBooks, idx) => item.clientId != +myClientId ?
                <ListRaad key={idx}
                    courtType={item.type}
                    courtName={item.courtName}
                    toDelete={false}
                    mainText={item.weekday + " " + item.hour}
                    id={item.id}
                    secondText={"Duración: " + item.duration + " - " + item.clientName} /> : <div key={idx}></div>
            )}

            {books.filter((item: ClientBooks) => item.clientId != +myClientId).length == 0 ?
                <div className="comunity-text" style={{ textAlign: "center" }}>
                    No hay próximamente
                </div> : <></>
            }

        </div>
    )
}

export default Comunity;
