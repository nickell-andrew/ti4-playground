import Cruiser from './ylw_ca.png'
import Carrier from './ylw_cv.png'
import Destroyer from './ylw_dd.png'
import Dreadnought from './ylw_dn.png'
import Fighter from './ylw_ff.png'
import Flagship from './ylw_fs.png'
import Infantry from './ylw_gf.png'
import Mech from './ylw_mf.png'
import PDS from './ylw_pd.png'
import Spacedock from './ylw_sd.png'
import Warsun from './ylw_ws.png'
import { units } from '../../../components/consts'

const yellowUnits = {
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
export default yellowUnits