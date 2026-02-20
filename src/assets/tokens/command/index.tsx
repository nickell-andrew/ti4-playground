import Blue from './command_blu.webp'
import Black from './command_blk.webp'
import Green from './command_grn.webp'
import Gray from './command_lgy.webp'
import Orange from './command_org.webp'
import Pink from './command_pnk.webp'
import Purple from './command_ppl.webp'
import Red from './command_red.webp'
import Yellow from './command_ylw.webp'
import { BASE_FACTION_COLORS, baseFactionColors } from '../../../components/consts'
import { ImageComponentProps } from '../../units/black'

const commandTokenImages: Record<BASE_FACTION_COLORS, React.FC<ImageComponentProps>> = {
    [baseFactionColors.Black]: ({ alt, style }) => <img src={Black} alt={alt} style={style} />,
    [baseFactionColors.Blue]: ({ alt, style }) => <img src={Blue} alt={alt} style={style} />,
    [baseFactionColors.Green]: ({ alt, style }) => <img src={Green} alt={alt} style={style} />,
    [baseFactionColors.Gray]: ({ alt, style }) => <img src={Gray} alt={alt} style={style} />,
    [baseFactionColors.Orange]: ({ alt, style }) => <img src={Orange} alt={alt} style={style} />,
    [baseFactionColors.Pink]: ({ alt, style }) => <img src={Pink} alt={alt} style={style} />,
    [baseFactionColors.Purple]: ({ alt, style }) => <img src={Purple} alt={alt} style={style} />,
    [baseFactionColors.Red]: ({ alt, style }) => <img src={Red} alt={alt} style={style} />,
    [baseFactionColors.Yellow]: ({ alt, style }) => <img src={Yellow} alt={alt} style={style} />,
}

export default commandTokenImages