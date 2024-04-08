import { Op, WhereOptions, InferAttributes } from 'sequelize';
import { State } from '../db/models';
import { QueryOptions } from '../interfaces/functions.interface';

class StateService {
  private StateModel = State;

  public async getAll(
    opts: QueryOptions,
  ): Promise<{ result: State[]; totalCount: number }> {
    const { limit, offset, search } = opts;

    const where: WhereOptions<InferAttributes<State, { omit: never }>> = {
      [Op.or]: {
        name: { [Op.like]: search ? `%${search}%` : '%' },
      },
    };

    const { rows, count } = await this.StateModel.findAndCountAll({
      where,
      limit,
      offset,
    });

    return { result: rows, totalCount: count };
  }
}

export default new StateService();
