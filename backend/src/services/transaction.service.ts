import prisma from "../prisma/client";
import { TransactionQueryParams } from "../models/transaction";
import { Prisma } from "../../generated/prisma/client";

export class TransactionService {
  async getTransactions(params: TransactionQueryParams) {
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

    const skip = (page - 1) * pageSize;

    const where: Prisma.TransactionWhereInput = {
      AND: []
    };

    const andConditions = where.AND as Prisma.TransactionWhereInput[];

    if (search) {
      andConditions.push({
        OR: [
          { customerName: { contains: search, mode: "insensitive" } },
          { phoneNumber: { contains: search, mode: "insensitive" } }
        ]
      });
    }

    if (customerRegions?.length) {
      andConditions.push({ customerRegion: { in: customerRegions } });
    }

    if (genders?.length) {
      andConditions.push({ gender: { in: genders } });
    }

    if (ageMin !== undefined) {
      andConditions.push({ age: { gte: ageMin } });
    }

    if (ageMax !== undefined) {
      andConditions.push({ age: { lte: ageMax } });
    }

    if (productCategories?.length) {
      andConditions.push({ productCategory: { in: productCategories } });
    }

    if (paymentMethods?.length) {
      andConditions.push({ paymentMethod: { in: paymentMethods } });
    }

    if (dateFrom) {
      andConditions.push({ date: { gte: new Date(dateFrom) } });
    }

    if (dateTo) {
      andConditions.push({ date: { lte: new Date(dateTo) } });
    }

    if (tags?.length) {
      andConditions.push({ tags: { hasSome: tags } });
    }

    if (andConditions.length === 0) {
      delete where.AND;
    }

    const sortColumnMap: Record<string, keyof Prisma.TransactionOrderByWithRelationInput> = {
      date: "date",
      quantity: "quantity",
      customerName: "customerName"
    };

    const orderBy: Prisma.TransactionOrderByWithRelationInput = {
      [sortColumnMap[sortBy] || "date"]: sortOrder
    };

    const [data, totalItems] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
      }),
      prisma.transaction.count({ where })
    ]);

    return {
      data: data.map(item => ({
        ...item,
        id: item.id.toString() // Convert BigInt to string for JSON serialization
      })),
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
      currentPage: page,
      pageSize: pageSize
    };
  }
}
