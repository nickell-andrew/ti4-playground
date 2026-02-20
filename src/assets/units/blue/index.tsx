import Cruiser from './blu_ca.webp'
import Carrier from './blu_cv.webp'
import Destroyer from './blu_dd.webp'
import Dreadnought from './blu_dn.webp'
import Fighter from './blu_ff.webp'
import Flagship from './blu_fs.webp'
import Infantry from './blu_gf.webp'
import Mech from './blu_mf.webp'
import PDS from './blu_pd.webp'
import Spacedock from './blu_sd.webp'
import Warsun from './blu_ws.webp'
import { units } from '../../../components/consts'
import { UNIT_IMAGES_MAP } from '../black'

const blueUnits: UNIT_IMAGES_MAP = {
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
export default blueUnits
