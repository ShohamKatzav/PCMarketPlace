import { Product } from "./product";

export interface Member {
    id: number;
    userName: string;
    age: number;
    knownAs: string;
    created: Date;
    lastActive: Date;
    city: string;
    country: string;
    products: Product[];
}