import { Op, WhereOptions, InferAttributes } from 'sequelize';
import { State } from '../db/models';
import { QueryOptions } from '../interfaces/functions.interface';
import { NotFoundError } from '../errors';

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

  public async getById(id: number): Promise<State> {
    const state = await this.StateModel.findByPk(id);

    if (!state) throw new NotFoundError('State not found.');

    return state;
  }
}

export default new StateService();
