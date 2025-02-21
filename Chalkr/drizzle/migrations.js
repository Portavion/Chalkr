// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_thick_kingpin.sql';
import m0001 from './0001_mature_yellow_claw.sql';
import m0002 from './0002_overrated_mad_thinker.sql';
import m0003 from './0003_busy_sabretooth.sql';
import m0004 from './0004_wide_power_pack.sql';
import m0005 from './0005_elite_cable.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004,
m0005
    }
  }
  