import { IsProduction } from '@config/index';
import { sequelize } from '@database/index';

export default async (): Promise<void> => {
  if (IsProduction()) await sequelize.sync({ logging: false });
  else await sequelize.sync({ force: true, logging: false });
};
