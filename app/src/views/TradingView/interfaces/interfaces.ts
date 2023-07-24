
export interface DataPoint {
  price: number;
  time: Date;
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
  onMousePositionChange?: (position: { x: string; y: number }) => void;
}