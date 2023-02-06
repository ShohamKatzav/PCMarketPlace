import { AppUserPhoto } from "./appUserPhoto";
import { Deal } from "./deal";



export interface Member {
    id: number;
    userName: string;
    age: number;
    knownAs: string;
    created: Date;
    lastActive: Date;
    city: string;
    country: string;
    appUserPhoto: AppUserPhoto;
    deals: Deal[];
}