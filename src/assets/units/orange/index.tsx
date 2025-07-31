import { CSSProperties } from 'react'
import Cruiser from './org_ca.png'
import Carrier from './org_cv.png'
import Destroyer from './org_dd.png'
import Dreadnought from './org_dn.png'
import Fighter from './org_ff.png'
import Flagship from './org_fs.png'
import Infantry from './org_gf.png'
import Mech from './org_mf.png'
import PDS from './org_pd.png'
import Spacedock from './org_sd.png'
import Warsun from './org_ws.png'
import { units } from '../../../components/consts'

const orangeUnits = {
    [units.Cruiser]: (alt: string, style: CSSProperties) => <img src={Cruiser} alt={alt} style={style} />,
    [units.Carrier]: (alt: string, style: CSSProperties) => <img src={Carrier} alt={alt} style={style} />,
    [units.Destroyer]: (alt: string, style: CSSProperties) => <img src={Destroyer} alt={alt} style={style} />,
    [units.Dreadnought]: (alt: string, style: CSSProperties) => <img src={Dreadnought} alt={alt} style={style} />,
    [units.Fighter]: (alt: string, style: CSSProperties) => <img src={Fighter} alt={alt} style={style} />,
    [units.Flagship]: (alt: string, style: CSSProperties) => <img src={Flagship} alt={alt} style={style} />,
    [units.Infantry]: (alt: string, style: CSSProperties) => <img src={Infantry} alt={alt} style={style} />,
    [units.Mech]: (alt: string, style: CSSProperties) => <img src={Mech} alt={alt} style={style} />,
    [units.PDS]: (alt: string, style: CSSProperties) => <img src={PDS} alt={alt} style={style} />,
    [units.Spacedock]: (alt: string, style: CSSProperties) => <img src={Spacedock} alt={alt} style={style} />,
    [units.Warsun]: (alt: string, style: CSSProperties) => <img src={Warsun} alt={alt} style={style} />,
}
export default orangeUnits