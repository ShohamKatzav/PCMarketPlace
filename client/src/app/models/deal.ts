import { Product } from "./product";


export interface Deal{
    created: Date;
    products: Product[];
    tottalPrice: number;
    status: string;
}