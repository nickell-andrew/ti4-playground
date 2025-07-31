import { CSSProperties } from 'react'
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
export default greenUnits