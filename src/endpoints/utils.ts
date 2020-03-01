export const wrapEndpoint = async (data: any, req: any, endpoint: any) => {
  try {
    return await endpoint(data, req);
  } catch (error) {
    const errors = Array.isArray(error) ? error : [error];
    return {
      errors: errors.map(e => ({
        name: e.name,
        message: e.message,
        type: e.type,
        action: e.action,
        field: e.field
      }))
    };
  }
};
