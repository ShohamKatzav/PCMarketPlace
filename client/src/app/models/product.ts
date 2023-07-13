import { Photo } from "./Photo";

export interface Product
{
    id: number;
    name : string;
    category : string;
    price : number;
    productPhoto: Photo;
}