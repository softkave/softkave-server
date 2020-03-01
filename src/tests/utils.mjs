import request from "request-promise";
import get from "lodash/get";

const serverAddr = `http://localhost:5000/graphql`;

export async function query(p) {
  try {
    const options = {
      url: `${serverAddr}${p.endpoint}`,
      body: {
        query: p.query,
        variables: p.variables
      },
      auth: {
        bearer: p.token
      },
      method: p.method || "POST",
      json: true
    };

    let data = await request(options);

    if (p.path) {
      data = get(data, p.path);
    }

    return { data };
  } catch (error) {
    return { error };
  }
}

export function getDataFromObject(obj, fields) {
  const result = {};

  fields.forEach(field => {
    const data = dotProp.get(obj, field);

    if (data !== null && data !== undefined) {
      result[field] = data;
    }
  });

  return result;
}
