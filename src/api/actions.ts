import { Booker } from "../interfaces/Booker";
import { GenericResponse } from "../interfaces/GenericResponse";
import { ProfileToChange } from "../interfaces/profile";
import { GetTokenId } from "./auth";
import { URL_REQUEST } from "./request";

function getRequestOptions(data: any) {
    return {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
}

export async function tryLogin(data: any, callback: (resp: any) => void) {
    fetch(URL_REQUEST + "login", getRequestOptions(data))
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            callback(response);
        });
}

export async function tryCreateUser(data: any, callback: (resp: any) => void) {
    fetch(URL_REQUEST + "create", getRequestOptions(data))
        .then(response => response)
        .catch(error => console.error('Error:', error))
        .then(response => {
            callback(response);
        });
}

export async function MakeBook(bookerData: Booker, callback: (resp: GenericResponse) => void) {
    const [token, id] = GetTokenId();
    bookerData.token = token;
    bookerData.id = +id;
    await fetch(URL_REQUEST + "book", getRequestOptions(bookerData))
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            callback(response);
        })
}

export async function RemoveBook(idToRemove: number, callback: (resp: any) => void) {
    const [token, client_id] = GetTokenId();
    const data = {
        bookId: idToRemove,
        token: token === null ? "" : token,
        id: client_id === null ? "" : client_id,
    }
    fetch(URL_REQUEST + "book/delete", getRequestOptions(data))
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            callback(response)
        });
}

export async function forgetCredentials(secretNumber: string, callback: (resp: any) => void) {
    const data: any = {
        username: secretNumber == null ? "" : secretNumber
    }
    fetch(URL_REQUEST + "forget", getRequestOptions(data))
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            callback(response);
        });
}

export async function numberCreateCredentials(code: string, callback: (resp: any) => void) {
    const data: any = {
        code: code
    }
    fetch(URL_REQUEST + "create/redirect", getRequestOptions(data))
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => callback(response));
}

export async function updateUserPost(data: ProfileToChange, callback: (resp: any) => void) {
    await fetch(URL_REQUEST + "profile", getRequestOptions(data))
        .then(response => response)
        .catch(error => console.error('Error:', error))
        .then(response => callback(response));
}