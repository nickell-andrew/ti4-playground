import Cruiser from './ppl_ca.png'
import Carrier from './ppl_cv.png'
import Destroyer from './ppl_dd.png'
import Dreadnought from './ppl_dn.png'
import Fighter from './ppl_ff.png'
import Flagship from './ppl_fs.png'
import Infantry from './ppl_gf.png'
import Mech from './ppl_mf.png'
import PDS from './ppl_pd.png'
import Spacedock from './ppl_sd.png'
import Warsun from './ppl_ws.png'
import { units } from '../../../components/consts'

const purpleUnits = {
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
export default purpleUnits