export const getPagingData = (data: any, page: number, limit: number) => {
  if (page < 0 || limit < 0) {
    throw new Error("Cannot use negative Value for Parameters!");
  }
  const { count: totalItems, rows: users } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, data, totalPages, currentPage };
};

export const getPagination = (page: number, size: number) => {
  if (page < 0 || size < 0) {
    throw new Error("Input must be Postive Integer");
  }
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};
