
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