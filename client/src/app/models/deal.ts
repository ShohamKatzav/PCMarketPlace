import { Photo } from "./Photo";
import { Product } from "./product";


export interface Deal{
    id: number;
    created: Date;
    lastModified: Date;
    products: Product[];
    totalPrice: number;
    status: string;
    description: string;
    dealPhoto: Photo;
}