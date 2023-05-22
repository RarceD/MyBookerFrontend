
export const GetTokenId = (): [string, string] => {
    const id: string | null = localStorage.getItem("id");
    const token: string | null = localStorage.getItem("token");
    if (id && token) return [token, id]
    return ["", ""];
}