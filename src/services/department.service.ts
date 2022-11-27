import { Department } from '../db/models';
import { NotFoundError } from '../errors';
import departmentUtil from '../utils/department.util';

class DepartmentService {
  private DepartmentModel = Department;

  public async create(data: unknown): Promise<Department> {
    const { name } = await departmentUtil.creationSchema.validateAsync(data);
    const attributes = { name };
    const department = await this.DepartmentModel.create(attributes);
    return department;
  }

  public async get(id: number): Promise<Department> {
    const department = await this.DepartmentModel.findByPk(id);
    if (!department) throw new NotFoundError('Department not found.');
    return department;
  }

  public async getAll(limit: number, offset: number): Promise<{ result: Department[]; totalCount: number; }> {
    const { rows, count } = await this.DepartmentModel.findAndCountAll({ limit, offset });
    return { result: rows, totalCount: count };
  }

  public async update(id: number, data: unknown): Promise<Department> {
    const department = await this.get(id);
    const { name } = await departmentUtil.creationSchema.validateAsync(data);
    const attributes = { name };
    await department.update(attributes);
    return department.reload();
  }

  public async delete(id: number): Promise<Department> {
    const department = await this.get(id);
    await department.destroy();
    return department;
  }
}

export default new DepartmentService();