import React from 'react';
import commandTokenImages from "./command";
import tradeGoodImage from "./tradeGood";
import tradeGoodBundleImage from "./tradeGoodBundle";
import { tokens, BASE_FACTION_COLORS } from "../../components/consts";
import type { ImageComponentProps } from "../units/black";

export type TokenImageEntry =
    | Record<BASE_FACTION_COLORS, React.FC<ImageComponentProps>>
    | React.FC<ImageComponentProps>;

const allTokenImages: Record<string, TokenImageEntry> = {
    [tokens.CommandCounter]: commandTokenImages,
    [tokens.TradeGood]: tradeGoodImage,
    [tokens.TradeGoodBundle]: tradeGoodBundleImage,
}

export default allTokenImages
