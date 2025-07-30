import { Cruiser } from "./lgy-ca-svg";
import { Carrier } from "./lgy-cv-svg";
import { Destroyer } from "./lgy-dd-svg";
import { Dreadnought } from "./lgy-dn-svg";
import { Fighter } from "./lgy-ff-svg";
import { Flagship } from "./lgy-fs-svg";
import { GroundForce } from "./lgy-gf-svg";
import { Mech } from "./lgy-mf-svg";
import { PDS } from "./lgy-pd-svg";
import { Spacedock } from "./lgy-sd-svg";
import { WarSun } from "./lgy-ws-svg";

import { units } from "../../../components/consts";

const grayUnits = {
    [units.Carrier]: Carrier,
    [units.Cruiser]: Cruiser,
    [units.Destroyer]: Destroyer,
    [units.Dreadnought]: Dreadnought,
    [units.Fighter]: Fighter,
    [units.Flagship]: Flagship,
    [units.Infantry]: GroundForce,
    [units.Mech]: Mech,
    [units.PDS]: PDS,
    [units.Spacedock]: Spacedock,
    [units.WarSun]: WarSun,
}
export default grayUnits