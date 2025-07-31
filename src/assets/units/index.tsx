import blackUnits from './black'
import blueUnits from './blue'
import greenUnits from './green'
import lightGrayUnits from './lightGray'
import orangeUnits from './orange'
import pinkUnits from './pink'
import purpleUnits from './purple'
import redUnits from './red'
import yellowUnits from './yellow'
import { baseFactionColors } from '../../components/consts'

const allUnitImages = {
    [baseFactionColors.Black]: blackUnits,
    [baseFactionColors.Blue]: blueUnits,
    [baseFactionColors.Green]: greenUnits,
    [baseFactionColors.Gray]: lightGrayUnits,
    [baseFactionColors.Orange]: orangeUnits,
    [baseFactionColors.Pink]: pinkUnits,
    [baseFactionColors.Purple]: purpleUnits,
    [baseFactionColors.Red]: redUnits,
    [baseFactionColors.Yellow]: yellowUnits,
}

export default allUnitImages