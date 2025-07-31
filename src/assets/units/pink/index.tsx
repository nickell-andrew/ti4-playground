import Cruiser from './pnk_ca.png'
import Carrier from './pnk_cv.png'
import Destroyer from './pnk_dd.png'
import Dreadnought from './pnk_dn.png'
import Fighter from './pnk_ff.png'
import Flagship from './pnk_fs.png'
import Infantry from './pnk_gf.png'
import Mech from './pnk_mf.png'
import PDS from './pnk_pd.png'
import Spacedock from './pnk_sd.png'
import Warsun from './pnk_ws.png'
import { units } from '../../../components/consts'

const pinkUnits = {
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
export default pinkUnits