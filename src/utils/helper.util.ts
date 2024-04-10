import moment from 'moment';
import serverConfig from '../config/server.config';

class HelperUtil {
  public getPaginationData(limit: number, page: number, totalCount: number) {
    const currentPage = page;
    const totalPages = Math.ceil(totalCount / limit);
    const previousPage = page - 1 === 0 ? null : page - 1;
    const nextPage = page + 1 > totalPages ? null : page + 1;
    return { currentPage, totalPages, previousPage, nextPage };
  }

  public getStartAndEndOfMonth(): { currentDate: Date; lastMonthDate: Date } {
    const currentDateAndTime = new Date();
    const lastMonthDateAndTime = moment(currentDateAndTime)
      .subtract(1, 'month')
      .toDate();
    const currentDate = this.setFormattedDate('00:00', currentDateAndTime);
    const lastMonthDate = this.setFormattedDate('23:59', lastMonthDateAndTime);
    return { currentDate, lastMonthDate };
  }

  public getLabel(name: string): string {
    const label = name.replace(/([^\w ]|_)/g, '');
    return `${label.replace(/\s+/g, '-').toLowerCase()}`;
  }

  public getFileUrl(value: string): string | null {
    if (value) {
      if (value.startsWith('http')) {
        return value;
      }

      return `${serverConfig.BASE_URL}/images/${value}`;
    }
  }

  private setFormattedDate(time: string, date: Date) {
    const dateInDateFormat = moment(new Date(date)).format('YYYY-MM-DD');
    return new Date(`${dateInDateFormat}T${time}:00`);
  }
}

export default new HelperUtil();
