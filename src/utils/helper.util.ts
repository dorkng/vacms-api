import moment from 'moment';

class HelperUtil {
  public getPaginationData(limit: number, page: number, totalCount: number) {
    const currentPage = page;
    const totalPages = Math.ceil(totalCount / limit);
    const previousPage = page - 1 === 0 ? null : page - 1;
    const nextPage = page + 1 > totalPages ? null : page + 1;
    return { currentPage, totalPages, previousPage, nextPage };
  }

  public getStartAndEndOfMonth(): { currentDate: Date, lastMonthDate: Date } {
    const currentDateAndTime = new Date();
    const lastMonthDateAndTime = moment(currentDateAndTime).subtract(1, 'month').toDate();
    const currentDate = this.setFormattedDate('00:00', currentDateAndTime);
    const lastMonthDate = this.setFormattedDate('23:59', lastMonthDateAndTime);
    return { currentDate, lastMonthDate }; 
  }

  private setFormattedDate(time: string, date: Date) {
    const dateInDateFormat = moment(new Date(date)).format('YYYY-MM-DD');
    return new Date(`${dateInDateFormat}T${time}:00`);
  }
}

export default new HelperUtil();
