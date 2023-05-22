import { useEffect, useState } from "react";
import { GetTokenId } from "../api/auth";
import { GetBooks } from "../api/request";
import ListRaad from "../components/comunity/ListRaad";
import { MyBooks } from "../interfaces/MyBooks";
import './../components/components.css'

const Comunity = () => {
    const [books, setBooks] = useState<MyBooks[]>([]);
    const [token, myClientId] = GetTokenId();
    useEffect(() => {
        GetBooks((n: MyBooks[]) => {
            n.sort((a, b) => {
                if (a.weekday < b.weekday || a.timeRaw < b.timeRaw) return -1;
                return 1;
            });
            setBooks(n);
        })
    }, []);

    return (
        <div style={{ marginTop: 80, marginBottom: 120 }}>
            {/*The ones with my client id */}
            <div className="comunity-text">
                Mis próximas reservas
            </div>
            {books.filter((item: MyBooks) => item.client_id == +myClientId).length == 0 ?
                <div className="comunity-text" style={{ textAlign: "center" }}>
                    no hay próximamente
                </div> : <></>
            }
            {books.map((item: MyBooks, idx) => item.client_id == +myClientId ?
                <ListRaad key={idx}
                    courtType={item.type}
                    courtName={item.courtName}
                    toDelete={true}
                    mainText={item.schedule}
                    id={item.id}
                    secondText={item.duration + " - " + item.name} /> : <div key={idx}></div>
            )}

            {/*The ones with my client id */}
            <div className="comunity-text">
                Reservas de otros usuarios
            </div>
            {books.map((item: MyBooks, idx) => item.client_id != +myClientId ?
                <ListRaad key={idx}
                    courtType={item.type}
                    courtName={item.courtName}
                    toDelete={false}
                    mainText={item.schedule}
                    id={item.id}
                    secondText={item.duration + " - " + item.name} /> : <div key={idx}></div>
            )}

            {books.filter((item: MyBooks) => item.client_id != +myClientId).length == 0 ?
                <div className="comunity-text" style={{ textAlign: "center" }}>
                    no hay próximamente
                </div> : <></>
            }

        </div>
    )
}

export default Comunity;
