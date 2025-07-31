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
import { UNIT_IMAGES_MAP } from '../black'

const yellowUnitImages: UNIT_IMAGES_MAP = {
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
export default yellowUnitImages