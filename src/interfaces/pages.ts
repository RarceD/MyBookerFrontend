export type PageType = "comunity" | "courts" | "normative" | "profile" | "error";

export enum PageTypeNumber {
    COMUNITY,
    COURTS,
    PROFILE,
    NORMATIVE
}
export const convertNumberToType = (n: PageTypeNumber): PageType => {
    if (n == PageTypeNumber.COMUNITY)
        return "comunity";
    else if (n == PageTypeNumber.COURTS)
        return "courts";
    else if (n == PageTypeNumber.NORMATIVE)
        return "normative";
    else if (n == PageTypeNumber.PROFILE)
        return "profile";

    console.error("Unknow page");
    return "error"
}
