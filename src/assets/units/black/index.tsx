import { CSSProperties, FC } from 'react'
import Cruiser from './blk_ca.png'
import Carrier from './blk_cv.png'
import Destroyer from './blk_dd.png'
import Dreadnought from './blk_dn.png'
import Fighter from './blk_ff.png'
import Flagship from './blk_fs.png'
import Infantry from './blk_gf.png'
import Mech from './blk_mf.png'
import PDS from './blk_pd.png'
import Spacedock from './blk_sd.png'
import Warsun from './blk_ws.png'
import { units, UNITS } from '../../../components/consts'

export interface ImageComponentProps {
    alt: string
    style: CSSProperties
}
export type UNIT_IMAGES_MAP = Record<UNITS, FC<ImageComponentProps>>
const blackUnits: UNIT_IMAGES_MAP = {
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
export default blackUnits