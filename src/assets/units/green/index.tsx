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
import { UNIT_IMAGES_MAP } from '../black'

const greenUnits: UNIT_IMAGES_MAP = {
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
export default greenUnits