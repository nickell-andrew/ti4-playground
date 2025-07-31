import Cruiser from './grn_ca.png'
import Carrier from './grn_cv.png'
import Destroyer from './grn_dd.png'
import Dreadnought from './grn_dn.png'
import Fighter from './grn_ff.png'
import Flagship from './grn_fs.png'
import Infantry from './grn_gf.png'
import Mech from './grn_mf.png'
import PDS from './grn_pd.png'
import Spacedock from './grn_sd.png'
import Warsun from './grn_ws.png'
import { units } from '../../../components/consts'

const greenUnits = {
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
export default greenUnits