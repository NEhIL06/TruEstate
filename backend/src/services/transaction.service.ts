import { supabase } from "./supaBaseClient";
import { Transaction, TransactionQueryParams } from "../models/transaction";
import { AppError } from "../utils/errors";
import { getPagination } from "../utils/pagination";

export interface TransactionResult {
  data: Transaction[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export class TransactionService {
  async getTransactions(params: TransactionQueryParams): Promise<TransactionResult> {
    const {
      search,
      customerRegions,
      genders,
      ageMin,
      ageMax,
      productCategories,
      tags,
      paymentMethods,
      dateFrom,
      dateTo,
      sortBy = "date",
      sortOrder = "desc",
      page = 1,
      pageSize = 10
    } = params;

    const { from, to } = getPagination(page, pageSize);

    let query = supabase
      .from("transactions")
      .select("*", { count: "exact" })
      .range(from, to);

    if (search && search.trim().length > 0) {
      const term = search.trim();
      query = query.or(
        `customer_name.ilike.%${term}%,phone_number.ilike.%${term}%`
      );
    }

    if (customerRegions && customerRegions.length > 0) {
      query = query.in("customer_region", customerRegions);
    }

    if (genders && genders.length > 0) {
      query = query.in("gender", genders);
    }

    if (ageMin !== undefined) {
      query = query.gte("age", ageMin);
    }
    if (ageMax !== undefined) {
      query = query.lte("age", ageMax);
    }

    if (productCategories && productCategories.length > 0) {
      query = query.in("product_category", productCategories);
    }

    if (paymentMethods && paymentMethods.length > 0) {
      query = query.in("payment_method", paymentMethods);
    }

    if (dateFrom) {
      query = query.gte("date", dateFrom);
    }
    if (dateTo) {
      query = query.lte("date", dateTo);
    }

    if (tags && tags.length > 0) {
      const tagArrayLiteral = `{${tags.join(",")}}`;
      query = query.filter("tags", "cs", tagArrayLiteral);
    }

    let sortColumn: string;
    switch (sortBy) {
      case "quantity":
        sortColumn = "quantity";
        break;
      case "customerName":
        sortColumn = "customer_name";
        break;
      case "date":
      default:
        sortColumn = "date";
        break;
    }

    query = query.order(sortColumn, { ascending: sortOrder === "asc" });

    const { data, count, error } = await query;

    if (error) {
      throw new AppError("Failed to fetch transactions", 500, error);
    }

    const totalItems = count ?? 0;
    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize);

    return {
      data: (data ?? []) as Transaction[],
      totalItems,
      totalPages,
      currentPage: page,
      pageSize
    };
  }
}
