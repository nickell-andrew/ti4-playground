import { CSSProperties } from 'react'
import Cruiser from './lgy_ca.png'
import Carrier from './lgy_cv.png'
import Destroyer from './lgy_dd.png'
import Dreadnought from './lgy_dn.png'
import Fighter from './lgy_ff.png'
import Flagship from './lgy_fs.png'
import Infantry from './lgy_gf.png'
import Mech from './lgy_mf.png'
import PDS from './lgy_pd.png'
import Spacedock from './lgy_sd.png'
import Warsun from './lgy_ws.png'
import { units } from '../../../components/consts'

const lightGrayUnits = {
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
export default lightGrayUnits