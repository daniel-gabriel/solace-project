
## Summary of changes

### Backend
- Moved the advocate filtering logic into the server so it can rely on the database
  and its scalability to perform with a large number of rows
- Limited the maximum number of returned advocates to 100 to prevent overloading the user's
  browser and the db server when there is too much data. Another possible approach is to
  implement pagination. Which approach to use should depend on product goals
- Added types into function definitions where they were missing

### Frontend
- Pulled in DaisyUI library as a Tailwind plugin, and used its components to style the input,
  the button, and the table
- Added a `tel:` link for each phone number so it's clickable to call
- Pulled in FontAwesome to use its icons for the Phone, Search, Reset, and Loading visuals
- Added a loading indicator during API calls

## Left to do:
- There should be a small delay before sending the typed text to the back-end - this will
  allow grouping some changes together, preventing too many server requests when dealing
  with fast typers
- `ilikeInArrayElements` - this is a custom filter I defined in `advocates/route.ts`.
  It contains a messy conversion that takes the contents of the `payload` column
  (which has been seeded with a stringified JSON array rather than just an array)
  and converts it to a jsonb array usable in Postgres. This seems to be some kind
  of possible mis-configuration in mapping, possibly in Drizzle, but I didn't find
  the actual cause of this.
- Need to verify if `searchTerm` that is passed in from the front end is properly SQL-escaped to
  prevent SQL injection attacks
- Knowing more about the product goals, I would order the results before returning. Probably by years
  of experience, but maybe location
- Knowing more about the product audience, I would make the UI responsive for certain screen sizes,
  re-organizing table rows to float more important information to where it's easy to touch
- The API model returned by the endpoint is not clearly typed, but ideally it would be, as well
  as the server would provide an OpenAPI document which lists the returned model. This
  would allow the front-end to auto-generate an API client instead of having to manually
  create or update models on changes.