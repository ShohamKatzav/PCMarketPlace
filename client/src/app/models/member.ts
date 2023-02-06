import { Photo } from "./Photo";
import { Deal } from "./deal";



export interface Member {
    id: number;
    userName: string;
    age: number;
    knownAs: string;
    created: Date;
    city: string;
    country: string;
    authorization: string;
    email: string;
    phone: number;
    appUserPhoto: Photo;
    deals: Deal[];
}