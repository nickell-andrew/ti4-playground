import Cruiser from './blk_ca.png'
import Carrier from './blk_cv.png'
import Destroyer from './blk_dd.png'
import Dreadnought from './blk_dn.png'
import Fighter from './blk_ff.png'
import Flagship from './blk_fs.png'
import Infantry from './blk_gf.png'
import Mech from './blk_mf.png'
import PDS from './blk_pd.png'
import Spacedock from './blk_sd.png'
import Warsun from './blk_ws.png'
import { units } from '../../../components/consts'

const blackUnits = {
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
export default blackUnits