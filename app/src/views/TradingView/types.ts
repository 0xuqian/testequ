
export interface DataPoint {
  price: number;
  time: Date;
  stringPrice: string;
}

export interface LinePlotProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  isDesktop?: boolean;
  onMousePositionChange?: (position: { x: string; y: string }) => void;
}

export interface PriceDateProps {
  price: string;
  date: string;
  projectIcon?: string;
  tokenName?: string;

}

export const timeWindowMap = {
  0: '1m',
  1: '5m',
  2: '15m',
  3: '30m',
  4: '1h',
  5: '2h',
  6: '4h',
  7: '1d',
  8: '1w',
  9: 'All'
};
