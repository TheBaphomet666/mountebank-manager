/**
 * Builds a Mountebank stub object.
 * @param path
 * @param method
 * @param body
 * @param statusCode
 * @param extraPredicates
 */
export function buildStub(path, method, body, statusCode = 200, extraPredicates: any[] = []): object {
  return {
    predicates: [{ equals: { method: method, path: path } }, ...extraPredicates],
    responses: [
      {
        is: {
          statusCode: statusCode,
          headers: { 'Content-Type': 'application/json' },
          body: body
        }
      }
    ]
  };
}
