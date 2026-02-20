import { CSSProperties, FC } from 'react'
import Cruiser from './blk_ca.webp'
import Carrier from './blk_cv.webp'
import Destroyer from './blk_dd.webp'
import Dreadnought from './blk_dn.webp'
import Fighter from './blk_ff.webp'
import Flagship from './blk_fs.webp'
import Infantry from './blk_gf.webp'
import Mech from './blk_mf.webp'
import PDS from './blk_pd.webp'
import Spacedock from './blk_sd.webp'
import Warsun from './blk_ws.webp'
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