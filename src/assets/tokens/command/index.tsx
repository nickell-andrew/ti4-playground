import { CSSProperties } from 'react'
import Blue from './command_blu.png'
import Black from './command_blu.png'
import Green from './command_grn.png'
import Gray from './command_lgy.png'
import Orange from './command_org.png'
import Pink from './command_pnk.png'
import Purple from './command_ppl.png'
import Red from './command_red.png'
import Yellow from './command_ylw.png'
import { baseFactionColors } from '../../../components/consts'

const commandTokenImages = {
    [baseFactionColors.Black]: (alt: string, style: CSSProperties) => <img src={Black} alt={alt} style={style} />,
    [baseFactionColors.Blue]: (alt: string, style: CSSProperties) => <img src={Blue} alt={alt} style={style} />,
    [baseFactionColors.Green]: (alt: string, style: CSSProperties) => <img src={Green} alt={alt} style={style} />,
    [baseFactionColors.Gray]: (alt: string, style: CSSProperties) => <img src={Gray} alt={alt} style={style} />,
    [baseFactionColors.Orange]: (alt: string, style: CSSProperties) => <img src={Orange} alt={alt} style={style} />,
    [baseFactionColors.Pink]: (alt: string, style: CSSProperties) => <img src={Pink} alt={alt} style={style} />,
    [baseFactionColors.Purple]: (alt: string, style: CSSProperties) => <img src={Purple} alt={alt} style={style} />,
    [baseFactionColors.Red]: (alt: string, style: CSSProperties) => <img src={Red} alt={alt} style={style} />,
    [baseFactionColors.Yellow]: (alt: string, style: CSSProperties) => <img src={Yellow} alt={alt} style={style} />,
}

export default commandTokenImages