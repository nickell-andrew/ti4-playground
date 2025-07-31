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
import { UNIT_IMAGES_MAP } from '../black'

const redUnits: UNIT_IMAGES_MAP = {
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
export default redUnits