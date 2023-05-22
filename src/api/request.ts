import { Court } from "../interfaces/Courts";
import { MyBooks } from "../interfaces/MyBooks";
import { NormativeList } from "../interfaces/NormativeList";
import { ProfileInfo } from "../interfaces/ProfileInfo";
import { GetTokenId } from "./auth";

export const URL_REQUEST: string = "https://localhost:5001/api/";
// export const URL_REQUEST: string = "http://www.appdereservas.es/api/";


const requestOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

export async function GetNormative(callback: (n: NormativeList[]) => void) {
    const [token, id] = GetTokenId();
    if (token == "" || id == "") return;
    await fetch(URL_REQUEST + "normative?id=" + id + "&token=" + token, requestOptions)
        .then(response => response.json())
        .catch(error => { })
        .then(response => {
            let r: NormativeList[] = response;
            callback(r);
        });
}

export async function GetProfileInfo(callback: (n: ProfileInfo) => void) {
    const [token, id] = GetTokenId();
    if (token == "" || id == "") return;
    fetch(URL_REQUEST + "profile?id=" + id + "&token=" + token, requestOptions)
        .then(response => response.json())
        .catch(error => { })
        .then(response => {
            let r: ProfileInfo = response;
            callback(r);
        });
}

export async function GetCourts(callback: (n: Court[]) => void) {
    const [token, id] = GetTokenId();
    if (token == "" || id == "") return;
    fetch(URL_REQUEST + "courts?id=" + id + "&token=" + token, requestOptions)
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            let courts_original: Court[] = response;
            localStorage.setItem("courts", JSON.stringify(courts_original));
            callback(courts_original);
        });
}

export async function GetBooks(callback: (n: MyBooks[]) => void) {
    const [token, id] = GetTokenId();
    if (token == "" || id == "") return;
    fetch(URL_REQUEST + "book?id=" + id + "&token=" + token)
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            // Store in localstorage:
            localStorage.setItem("books", JSON.stringify(response));
            // Parse:
            let weekdays: string[] = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
            const edit_time = (time: string) => { let t = time.replace("_", ":"); if (t[0] === "0") t.slice(0); return t; }
            let books: MyBooks[] = [];
            for (let b of response.court) {
                let book: MyBooks = {
                    image: "",
                    name: b.name,
                    duration: " Duración: " + b.duration + "h",
                    schedule: weekdays[b.weekday] + " " + edit_time(b.time),
                    id: b.id,
                    my: b.is_book,
                    client_id: b.client_id,
                    type: b.type,
                    courtName: b.courtName,
                    weekday: b.weekday,
                    timeRaw: b.time
                }
                books.push(book);
            }
            callback(books);
        });
}