
## Summary of changes
- Moved the advocate filtering logic into the server so it can rely on the database
  and its scalability to perform with a large number of rows
- Limited the maximum number of returned advocates to 100 to prevent overloading the user's
  browser and the db server when there is too much data. Another possible approach is to
  implement pagination. Which approach to use should depend on product goals
- Added types into function definitions where they were missing

## Left to do:
- UI updates
- `ilikeInArrayElements` - this is a custom filter I defined in advocates/route.ts.
  It contains a messy conversion that takes the contents of the `payload` column
  (which has been seeded with a stringified JSON array rather than just an array)
  and converts it to a jsonb array usable in Postgres. This seems to be some kind
  of possible mis-configuration in mapping, possibly in Drizzle, but I didn't find
  the actual cause of this.
- The API model returned by the endpoint is not clearly typed, but ideally it would be, as well
  as the server would provide an OpenAPI document which lists the returned model. This
  would allow the front-end to auto-generate an API client instead of having to manually
  create or update models on changes.