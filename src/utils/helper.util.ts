class HelperUtil {
  public getPaginationData(limit: number, page: number, totalCount: number) {
    const currentPage = page;
    const totalPages = Math.ceil(totalCount / limit);
    const previousPage = page - 1 === 0 ? null : page - 1;
    const nextPage = page + 1 > totalPages ? null : page + 1;
    return { currentPage, totalPages, previousPage, nextPage };
  }
}

export default new HelperUtil();
