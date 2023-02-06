import { Photo } from "./Photo";
import { Product } from "./product";


export interface Deal{
    id: number;
    created: Date;
    lastModified: Date;
    products: Product[];
    tottalPrice: number;
    status: string;
    description: string;
    dealPhoto: Photo;
}