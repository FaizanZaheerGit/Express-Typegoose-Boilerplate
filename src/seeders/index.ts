/* eslint-disable */
import { closeConnectionToMongo, connectToMongo } from '@database/database.intialization';
import prompts from 'prompts';

const seederOptions: any = {
  adminUser: 1,
  roles: 2,
  all: 3,
};

void (async () => {
  try {
    await connectToMongo();
    const response = await prompts({
      type: 'select',
      name: 'seeder',
      message: 'Which seeder do you want to run?',
      choices: Object.keys(seederOptions).map((key) => ({ title: key, value: key })),
    });
    console.log(`SELECTED SEED:   ${await seederOptions[response.seeder]}`);
    await closeConnectionToMongo();
    process.exit(0);
  } catch (err) {
    console.error(`ERROR IN RUNNING SEEDER:  ${err}`);
  }
})();
