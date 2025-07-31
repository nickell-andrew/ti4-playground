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
import { UNIT_IMAGES_MAP } from '../black'

const pinkUnits: UNIT_IMAGES_MAP = {
    [units.Cruiser]: ({ alt, style }) => <img src={Cruiser} alt={alt} style={style} />,
    [units.Carrier]: ({ alt, style }) => <img src={Carrier} alt={alt} style={style} />,
    [units.Destroyer]: ({ alt, style }) => <img src={Destroyer} alt={alt} style={style} />,
    [units.Dreadnought]: ({ alt, style }) => <img src={Dreadnought} alt={alt} style={style} />,
    [units.Fighter]: ({ alt, style }) => <img src={Fighter} alt={alt} style={style} />,
    [units.Flagship]: ({ alt, style }) => <img src={Flagship} alt={alt} style={style} />,
    [units.Infantry]: ({ alt, style }) => <img src={Infantry} alt={alt} style={style} />,
    [units.Mech]: ({ alt, style }) => <img src={Mech} alt={alt} style={style} />,
    [units.PDS]: ({ alt, style }) => <img src={PDS} alt={alt} style={style} />,
    [units.Spacedock]: ({ alt, style }) => <img src={Spacedock} alt={alt} style={style} />,
    [units.Warsun]: ({ alt, style }) => <img src={Warsun} alt={alt} style={style} />,
}
export default pinkUnits