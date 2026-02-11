import { CategoryStatus } from "@/types/enums";

export interface Category {
  id: number,
  name: string,
  slug: string,
  iconCode?: string,
  status: CategoryStatus,
  createdAt: Date,
  updatedAt: Date,
}