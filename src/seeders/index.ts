/* eslint-disable no-console, @typescript-eslint/restrict-template-expressions */
import { closeConnectionToMongo, connectToMongo } from '@database/database.intialization';
import prompts from 'prompts';
import { createInitialAdminUser } from './UsersModule/users.seed';
import { createDefaultRoles } from './RolesModule/roles.seed';

const seederOptions = {
  firstAdminUser: 'First Admin Script',
  defaultRoles: 'Default Role Script',
  allSeeders: 'All Scripts',
};

void (async () => {
  try {
    await connectToMongo();
    const response = await prompts({
      type: 'select',
      name: 'seedOption',
      message: 'Which seeder do you want to run?',
      choices: Object.keys(seederOptions).map((key) => ({ title: key, value: key })),
    });
    if (response?.seedOption == 'firstAdminUser') {
      await createInitialAdminUser();
    } else if (response?.seedOption == 'defaultRoles') {
      await createDefaultRoles();
    } else if (response?.seedOption == 'allSeeders') {
      await Promise.all([createDefaultRoles(), createInitialAdminUser()]);
    } else {
      console.log(`Invalid seeder option`);
    }
    await closeConnectionToMongo();
    process.exit(0);
  } catch (err) {
    console.error(`ERROR IN RUNNING SEEDER:  ${err}`);
    process.exit(1);
  }
})();
