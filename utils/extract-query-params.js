export function extractQueryParams(query) {
  return query.substr(1).split("&").reduce((acc, queryParam) => {
    const [key, value] = queryParam.split("=");

    return {
      ...acc,
      [key]: value,
    };
  }, {});
}