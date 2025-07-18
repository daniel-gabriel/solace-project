import db from "@/db";
import { advocates } from "@/db/schema";
import { NextRequest } from "next/server";
import { Column, ilike, or, sql } from "drizzle-orm";

/**
 * Extracts the text from the array elements, then applies the ILIKE operator
 * @param jsonbColumn the jsonb column
 * @param searchTerm the term to search
 */
function ilikeInArrayElements(jsonbColumn: Column, searchTerm: string) {
  // TODO: the messy jsonb conversion below is due to the payload column being
  //   seeded with a stringified JSON array rather than just an array.
  //   see DISCUSSION.md for more information
  return sql`EXISTS (
    SELECT 1 FROM jsonb_array_elements_text((${jsonbColumn} #>> '{}')::jsonb) AS elem
    WHERE elem ILIKE ${`${searchTerm}`}
  )`;
}

/**
 * Casts the values in the number column to text, then applies the ILIKE operator
 * @param numberColumn the number column
 * @param searchTerm the term to search
 */
function ilikeForNumbers(numberColumn: Column, searchTerm: string) {
  return sql`${numberColumn}::text ILIKE ${`${searchTerm}`}`;
}

const MaxAllowedCollectionSize = 100;

/**
 * Returns advocates matching the specified search term. If no search term is specified,
 * returns all (see DISCUSSION.md for suggested fixes)
 * @param req the request object
 * @constructor
 */
export async function GET(req: NextRequest) {
  const searchTerm: string = req.nextUrl.searchParams.get("searchTerm") || "";
  const data = await db?.select({
    id: advocates.id,
    firstName: advocates.firstName,
    lastName: advocates.lastName,
    city: advocates.city,
    degree: advocates.degree,
    specialties: advocates.specialties,
    yearsOfExperience: advocates.yearsOfExperience,
    phoneNumber: advocates.phoneNumber
  }).from(advocates)
    .where(
      or(
        ilike(advocates.firstName, `%${searchTerm}%`),
        ilike(advocates.lastName, `%${searchTerm}%`),
        ilike(advocates.city, `%${searchTerm}%`),
        ilike(advocates.degree, `%${searchTerm}%`),
        ilikeInArrayElements(advocates.specialties, `%${searchTerm}%`),
        ilikeForNumbers(advocates.yearsOfExperience, `%${searchTerm}%`),
        ilikeForNumbers(advocates.phoneNumber, `%${searchTerm}%`)
      )
    )
    .limit(MaxAllowedCollectionSize);

  // select only the required properties, avoid exposing the whole row, map to appropriate types
  const apiModel: IAdvocate[] | undefined = data?.map(a => ({
    id: a.id,
    firstName: a.firstName,
    lastName: a.lastName,
    city: a.city,
    degree: a.degree,
    specialties: a.specialties as string[],
    yearsOfExperience: a.yearsOfExperience,
    phoneNumber: a.phoneNumber
  }));
  return Response.json({ data: apiModel });
}

/**
 * API model of the advocate
 */
interface IAdvocate {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
}