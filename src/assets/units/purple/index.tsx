import Cruiser from './ppl_ca.webp'
import Carrier from './ppl_cv.webp'
import Destroyer from './ppl_dd.webp'
import Dreadnought from './ppl_dn.webp'
import Fighter from './ppl_ff.webp'
import Flagship from './ppl_fs.webp'
import Infantry from './ppl_gf.webp'
import Mech from './ppl_mf.webp'
import PDS from './ppl_pd.webp'
import Spacedock from './ppl_sd.webp'
import Warsun from './ppl_ws.webp'
import { units } from '../../../components/consts'
import { UNIT_IMAGES_MAP } from '../black'

const purpleUnits: UNIT_IMAGES_MAP = {
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
export default purpleUnits