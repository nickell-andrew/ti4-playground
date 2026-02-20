import Cruiser from './org_ca.webp'
import Carrier from './org_cv.webp'
import Destroyer from './org_dd.webp'
import Dreadnought from './org_dn.webp'
import Fighter from './org_ff.webp'
import Flagship from './org_fs.webp'
import Infantry from './org_gf.webp'
import Mech from './org_mf.webp'
import PDS from './org_pd.webp'
import Spacedock from './org_sd.webp'
import Warsun from './org_ws.webp'
import { units } from '../../../components/consts'
import { UNIT_IMAGES_MAP } from '../black'

const orangeUnits: UNIT_IMAGES_MAP = {
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
export default orangeUnits