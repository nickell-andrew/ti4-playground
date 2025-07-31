import Cruiser from './org_ca.png'
import Carrier from './org_cv.png'
import Destroyer from './org_dd.png'
import Dreadnought from './org_dn.png'
import Fighter from './org_ff.png'
import Flagship from './org_fs.png'
import Infantry from './org_gf.png'
import Mech from './org_mf.png'
import PDS from './org_pd.png'
import Spacedock from './org_sd.png'
import Warsun from './org_ws.png'
import { units } from '../../../components/consts'

const orangeUnits = {
    [units.Cruiser]: Cruiser,
    [units.Carrier]: Carrier,
    [units.Destroyer]: Destroyer,
    [units.Dreadnought]: Dreadnought,
    [units.Fighter]: Fighter,
    [units.Flagship]: Flagship,
    [units.Infantry]: Infantry,
    [units.Mech]: Mech,
    [units.PDS]: PDS,
    [units.Spacedock]: Spacedock,
    [units.Warsun]: Warsun,
}
export default orangeUnits