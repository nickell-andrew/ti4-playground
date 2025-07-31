import Cruiser from './lgy_ca.png'
import Carrier from './lgy_cv.png'
import Destroyer from './lgy_dd.png'
import Dreadnought from './lgy_dn.png'
import Fighter from './lgy_ff.png'
import Flagship from './lgy_fs.png'
import Infantry from './lgy_gf.png'
import Mech from './lgy_mf.png'
import PDS from './lgy_pd.png'
import Spacedock from './lgy_sd.png'
import Warsun from './lgy_ws.png'
import { units } from '../../../components/consts'

const lightGrayUnits = {
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
export default lightGrayUnits