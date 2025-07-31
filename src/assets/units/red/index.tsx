import Cruiser from './red_ca.png'
import Carrier from './red_cv.png'
import Destroyer from './red_dd.png'
import Dreadnought from './red_dn.png'
import Fighter from './red_ff.png'
import Flagship from './red_fs.png'
import Infantry from './red_gf.png'
import Mech from './red_mf.png'
import PDS from './red_pd.png'
import Spacedock from './red_sd.png'
import Warsun from './red_ws.png'
import { units } from '../../../components/consts'

const redUnits = {
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
export default redUnits