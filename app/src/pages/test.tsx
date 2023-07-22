import * as d3 from "d3";
import {  useKLine } from "hooks/useHistoryNftInfo";
import { FC, useRef, useEffect, useState } from 'react';
import PriceDate from 'views/KLine/component/TokenInfo'
import Page from "views/Page";

interface DataPoint {
  price: number;
  time: Date;
}

interface LinePlotProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  onMousePositionChange?: (position: { x: string; y: number }) => void;
}

function formatDate(date: Date){
  return date.toLocaleDateString("default", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  })
}

const LinePlot: FC<LinePlotProps> = ({
  data,
  width = 640,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 50,
  marginLeft = 50,
  onMousePositionChange
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(true);
  const [currentData, setCurrentData] = useState<DataPoint[]>([]);
  const [crosshairX, setCrosshairX] = useState<number | null>(null);
  const [crosshairY, setCrosshairY] = useState<number | null>(null);

  const x = d3.scaleLinear()
    .domain([0, data.length - 1]) 
    .range([marginLeft, width - marginRight]);
    
  const tickStartIndex = 5; 
  const tickInterval = 16; 
  const tickIndices = Array.from({ length: 6 }, (_, i) => tickStartIndex + i * tickInterval);
  const xAxis = d3.axisBottom(x)
    .tickValues(tickIndices)
    .tickSize(5)
    .tickFormat((i) => {
      return (
        formatDate(data[i].time)
      );
    });

  const y = d3.scaleLinear()
    .domain([0, d3.extent(data.map((d) => d.price))[1]])
    .range([height - marginBottom, marginTop]);

  const xReverse = d3.scaleLinear()
    .domain([marginLeft, width - marginRight])
    .range([0, data.length - 1]);

  const yReverse = d3.scaleLinear()
    .domain([height - marginBottom, marginTop])
    .range([d3.extent(data.map(d => d.price))[1], 0]);

  const line = d3.line<DataPoint>()
    .x((_, i) => x(i)) 
    .y((d) => y(d.price))
    .curve(d3.curveMonotoneX);

  const area = d3.area<DataPoint>()
    .x((_, i) => x(i)) 
    .y0(height - marginBottom)
    .y1((d) => y(d.price))
    .curve(d3.curveMonotoneX);

  useEffect(() => {
    // 定时器更新数据并绘制折线图
    const timer = setInterval(() => {
      if (currentData.length >= data.length) {
        setIsDrawing(false); // 绘制完成后，停止动态绘制
        clearInterval(timer); // 清除定时器
      } else {
        // 增加当前数据量，模拟动态绘制效果
        setCurrentData(data.slice(0, currentData.length + 1));
      }
    }, 10); 

    return () => {
      clearInterval(timer); // 组件卸载时清除定时器
    };
  }, [data, currentData]);


  useEffect(() => {
    if (!isDrawing || !svgRef.current) return;
    
    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove();

    
    svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width",700)
    .attr("height", 360)
    .style("fill", "transparent")
    .on("mousemove", handleMouseMove)

    // 添加X轴
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - marginBottom})`)
      .call(xAxis).selectAll(".domain, .tick line").remove();
  
    // 添加Y轴  
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft}, 0)`)
      .call(d3.axisLeft(y)).selectAll(".domain, .tick line").remove();
    
    
    svg.on("mousemove", handleMouseMove)
  
    // 渐变颜色
    const linearGradient = svg.append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%");

    linearGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(61,144,230, 0.2)");

    linearGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(61,144,230, 1)");

    // 绘制填充区域
    svg
      .append("path")
      .attr("fill", "url(#gradient)")
      .attr("d", area(currentData) || undefined);

    // 绘制折线
    svg
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "rgb(61,144,230)")
      .attr("stroke-width", "3")
      .attr("d", line(currentData) || undefined);

      const crosshairGroup = svg.append("g").attr("class", "crosshair");

      // 在这里添加一个圆形元素
      crosshairGroup
          .append("circle")
          .attr("class", "crosshairCircle")
          .attr("r", 5)
          .attr("fill", "red")
          .style("display", "none");  

      crosshairGroup
        .append("line")
        .attr("class", "crosshairX")
        .attr("stroke", "grey")
        .attr("stroke-dasharray", "3.3")
        .attr("opacity", 0.5)
        .attr("x1", marginLeft)
        .attr("x2", width - marginRight)
        .attr("y1", 0)
        .attr("y2", 0)
        .style("display", "none");  
  
      crosshairGroup
        .append("line")
        .attr("class", "crosshairY")
        .attr("stroke", "grey")
        .attr("stroke-dasharray", "3.3")
        .attr("opacity", 0.5)
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", marginTop)
        .attr("y2", height - marginBottom)
        .style("display", "none");  


  }, [data, width, height, marginTop, marginRight, marginBottom, marginLeft, line, area, x, y, xAxis, isDrawing,crosshairX, crosshairY]);

  
  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const { left, top } = svgRef.current.getBoundingClientRect();
    const x1: number = clientX - left;
    const y1: number = clientY - top;

    if  (x1 >= marginLeft && x1 <= width - marginRight-1 && y1 >= marginTop && y1 <= height - marginBottom) {
      // 更新x值文本
      const xValue = xReverse(x1);
      const dataPointIndex = Math.round(xValue); 

      if (dataPointIndex >= 0 && dataPointIndex < data.length) {
        const dataPoint = data[dataPointIndex];
        
        if (onMousePositionChange) {
          const formattedDate = formatDate(dataPoint.time);
          onMousePositionChange({ x: formattedDate, y: dataPoint.price });
          const pixelY = y(dataPoint.price)

          setCrosshairX(x1);
          setCrosshairY(pixelY);

          d3.select(".crosshairCircle").style("display", "");
          d3.select(".crosshairY").style("display", "");
          d3.select(".crosshairX").style("display", "");

          d3.select(".crosshairX")
          .attr("x1", marginLeft)
          .attr("x2", width - marginRight)
          .attr("y1", pixelY)
          .attr("y2", pixelY);

          d3.select(".crosshairY")
          .attr("x1", x1)
          .attr("x2", x1)
          .attr("y1", marginTop)
          .attr("y2", height - marginBottom);

          d3.select(".crosshairCircle")
          .attr("cx", x1)
          .attr("cy", pixelY);
        }
      }
    }else{
      onMousePositionChange({ x: formatDate(data[data.length-1].time), y: data[data.length-1].price});
      setCrosshairX(null); 
      setCrosshairY(null); 

      d3.select(".crosshairX")
        .attr("y1", height+100)
        .attr("y2", height+100);

      d3.select(".crosshairY")
        .attr("x1", width+100)
        .attr("x2", width+100);

      d3.select(".crosshairCircle").style("display", "none");
    }
  }

  return (
    <svg ref={svgRef} width={width} height={height} />
  );
};

const Tocao: FC<{data1:any | null}> = ({data1}) => {

  const [mousePosition, setMousePosition] = useState<{ x: string; y: number }>({ x: "", y: 0 });
  const parseTime = d3.utcParse("%Y-%m-%dT%H:%M:%SZ");
  let price = [];
  let time = [];

  if (data1) {
    price = data1.data.y_axis;
    time = data1.data.x_axis.map(parseTime);

    const sortedData = time.map((timeValue, index) => ({
      price: price[index],
      time: timeValue,
    }));

    const dataPoints: DataPoint[] = sortedData;
    return (
      <Page>
        <div>
          <PriceDate price = {mousePosition?.y ||  dataPoints[price.length - 1].price } date={mousePosition?.x || formatDate(dataPoints[price.length - 1].time) } />
          <svg width={640} height={400}>
            <LinePlot data={dataPoints} onMousePositionChange={setMousePosition} /> 
          </svg>
        </div>
      </Page>
    );
  } 
  return (
    <Page>
      <div>
        <h1>Loading...</h1>
        <p>No data available.</p>
      </div>
    </Page>
  );
};

const ParentComponent: FC = () => {
  const data1 = useKLine();
  
  // 其他逻辑
  return (
    <Tocao data1={data1} />
  );
};

export default ParentComponent;
