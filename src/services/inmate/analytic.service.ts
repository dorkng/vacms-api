/* eslint-disable @typescript-eslint/dot-notation */
import { Model, ModelStatic, col, literal } from 'sequelize';
import {
  AwaitingTrialInmate,
  ConvictedInmate,
  CustodialFacility,
} from '../../db/models';
import { InmateSex } from '../../interfaces/inmate.interface';

class InmateAnalytic {
  private awaitingTrialModel = AwaitingTrialInmate;

  private convictedModel = ConvictedInmate;

  public async custodialFacilityInmateVsCapacityByState() {
    const [awaitingTrial, convicted] = await Promise.all([
      this.getCustodialFacilityByState(this.awaitingTrialModel),
      this.getCustodialFacilityByState(this.convictedModel),
    ]);

    const inmatesByState = { awaitingTrial, convicted };

    const stateCounts = {};

    for (const data of Object.values(inmatesByState)) {
      for (const stateData of data) {
        const state = Object.keys(stateData)[0];
        const counts = stateData[state];

        if (!stateCounts[state]) {
          stateCounts[state] = { inmates: 0, capacity: 0 };
        }

        stateCounts[state].inmates += counts['inmates'];
        stateCounts[state].capacity += counts['capacity'];
      }
    }

    return Object.entries(stateCounts).map(([state, counts]) => ({
      [state]: counts,
    }));
  }

  public async maleVsFemaleByState() {
    const [awaitingTrial, convicted] = await Promise.all([
      this.getGenderByState(this.awaitingTrialModel),
      this.getGenderByState(this.convictedModel),
    ]);

    const inmatesByState = { awaitingTrial, convicted };

    const stateGenderCounts = {};

    for (const data of Object.values(inmatesByState)) {
      for (const stateData of data) {
        const state = Object.keys(stateData)[0];
        const counts = stateData[state];

        if (!stateGenderCounts[state]) {
          stateGenderCounts[state] = { male: 0, female: 0 };
        }

        stateGenderCounts[state].male += counts['male'];
        stateGenderCounts[state].female += counts['female'];
      }
    }

    return Object.entries(stateGenderCounts).map(([state, counts]) => ({
      [state]: counts,
    }));
  }

  public async awaitingTrialVsConvictedByState() {
    const [awaitingTrial, convicted] = await Promise.all([
      this.getInmatesByState(this.awaitingTrialModel),
      this.getInmatesByState(this.convictedModel),
    ]);

    const inmatesByState = { awaitingTrial, convicted };

    const states = new Set<string>();

    // Gather all unique states
    Object.keys(inmatesByState).forEach((status) => {
      Object.keys(inmatesByState[status]).forEach((state) => {
        states.add(state);
      });
    });

    // Build response array
    const response = Array.from(states).map((state) => {
      const stateData: any = { [state]: {} };
      Object.keys(inmatesByState).forEach((status) => {
        stateData[state][status] = inmatesByState[status][state] || 0;
      });
      return stateData;
    });

    return response;
  }

  private async getInmatesByState(model: ModelStatic<Model>) {
    const result = await model.findAll({
      attributes: [
        [literal('COUNT(*)'), 'count'],
        [col('custodialFacility.state.name'), 'stateName'],
      ],
      include: [
        {
          model: CustodialFacility,
          as: 'custodialFacility',
          include: ['state'],
        },
      ],
      order: [['stateName', 'ASC']],
      group: ['custodialFacility.state.name'],
    });

    const data = result.reduce((acc, item) => {
      acc[item.dataValues.stateName] = item.dataValues.count;
      return acc;
    }, {});

    return data;
  }

  private async getGenderByState(model: ModelStatic<Model>) {
    const result = await model.findAll({
      attributes: [
        [literal('COUNT(*)'), 'count'],
        [col('custodialFacility.state.name'), 'stateName'],
        [col('sex'), 'gender'],
      ],
      include: [
        {
          model: CustodialFacility,
          as: 'custodialFacility',
          include: ['state'],
        },
      ],
      order: [['stateName', 'ASC']],
      group: ['custodialFacility.state.name', 'gender'],
    });

    const data = {};

    result.forEach((doc) => {
      const { stateName, gender, count } = doc.dataValues;

      if (!data[stateName]) {
        data[stateName] = { male: 0, female: 0 };
      }

      if (gender === InmateSex.MALE) {
        data[stateName].male += count;
      } else if (gender === InmateSex.FEMALE) {
        data[stateName].female += count;
      }
    });

    return Object.entries(data).map(([state, counts]) => ({
      [state]: counts,
    }));
  }

  private async getCustodialFacilityByState(model: ModelStatic<Model>) {
    const result = await model.findAll({
      attributes: [
        [literal('COUNT(*)'), 'count'],
        [col('custodialFacility.state.name'), 'stateName'],
        [col('custodialFacility.capacity'), 'capacity'],
      ],
      include: [
        {
          model: CustodialFacility,
          as: 'custodialFacility',
          include: ['state'],
        },
      ],
      order: [['stateName', 'ASC']],
      group: ['custodialFacility.state.name', 'custodialFacility.name'],
    });

    const data = {};

    result.forEach((doc) => {
      const { stateName, capacity, count } = doc.dataValues;

      if (!data[stateName]) {
        data[stateName] = { inmates: 0, capacity: 0 };
      }

      data[stateName].inmates += count;
      data[stateName].capacity += capacity;
    });

    return Object.entries(data).map(([state, counts]) => ({
      [state]: counts,
    }));
  }
}

export default new InmateAnalytic();
