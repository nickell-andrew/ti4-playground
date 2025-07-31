import Cruiser from './blu_ca.png'
import Carrier from './blu_cv.png'
import Destroyer from './blu_dd.png'
import Dreadnought from './blu_dn.png'
import Fighter from './blu_ff.png'
import Flagship from './blu_fs.png'
import Infantry from './blu_gf.png'
import Mech from './blu_mf.png'
import PDS from './blu_pd.png'
import Spacedock from './blu_sd.png'
import Warsun from './blu_ws.png'
import { units } from '../../../components/consts'

const blueUnits = {
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
export default blueUnits
