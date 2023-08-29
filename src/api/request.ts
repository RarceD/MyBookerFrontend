import { AdminInfo } from "../interfaces/AdminInfo";
import { Court } from "../interfaces/Courts";
import { ClientBooks, MyBooks } from "../interfaces/MyBooks";
import { NormativeList } from "../interfaces/NormativeList";
import { ProfileInfo } from "../interfaces/ProfileInfo";
import { StatsInfo } from "../interfaces/StatsDto";
import { GetTokenId } from "./auth";

// export const APP_NAME: string = "AppDeReservas";
export const APP_NAME: string = "MeApunto.Online";

// export const URL_REQUEST: string = "https://www.meapunto.online/api/";
// export const URL_REQUEST: string = "http://www.appdereservas.es/api/";
export const URL_REQUEST: string = "https://localhost:5001/api/";


export const getCorrectLogo = (url: string): string => {
    let path: string = '/images/logo.png';
    if (url.toLowerCase().includes("online")) {
        path = '/images/logo1.png'
    }
    return path;
}

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

export async function GetBooks(callback: (n: ClientBooks[]) => void) {
    const [token, id] = GetTokenId();
    if (token == "" || id == "") return;
    fetch(URL_REQUEST + "book?id=" + id + "&token=" + token)
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            localStorage.setItem("books", JSON.stringify(response));
            callback(response);
        });
}

const getAdmin = (entity: string, matchStr: string, onError: () => void, callback: (adminInfo: AdminInfo[]) => void) => {
    const [token, id] = GetTokenId();
    if (token == "" || id == "") return;
    fetch(URL_REQUEST + "admin/" + entity + "?id=" + id + "&token=" + token + "&matchStr=" + matchStr)
        .then(response => response.ok ? response.json() : onError())
        .catch(error => console.error('Error:', error))
        .then(response => { if (response !== undefined) callback(response) });
}

export async function GetAdminMatchItCode(
    matchStr: string,
    callback: (adminInfo: AdminInfo[]) => void,
    onError: () => void,
) {
    getAdmin("code", matchStr, onError, callback);
}

export async function GetAdminMatchItEmail(
    matchStr: string,
    callback: (adminInfo: AdminInfo[]) => void,
    onError: () => void
) {
    getAdmin("email", matchStr, onError, callback);
}

export async function GetStats(callback: (output: StatsInfo[]) => void) {
    const [token, id] = GetTokenId();
    if (token == "" || id == "") return;
    fetch(URL_REQUEST + "stats?id=" + id + "&token=" + token)
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            callback(response);
        });
}