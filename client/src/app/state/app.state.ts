import { CategoryState } from "./categories/category.reducer";
import { DealState } from "./deals/deal.reducer";


export interface AppState {
  categories: CategoryState;
  deals: DealState;
}