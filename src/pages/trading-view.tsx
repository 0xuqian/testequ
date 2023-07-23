import * as d3 from "d3";
import {  useKLine } from "hooks/useHistoryNftInfo";
import React, { FC, useRef, useEffect, useState } from 'react';
import PriceDate from 'views/KLine/component/TokenInfo'
import { LineChartLoader} from 'views/Info/components/ChartLoaders'
import Page from "views/Page";
import styled from "styled-components";
import { useMatchBreakpointsContext } from "@pancakeswap/uikit";

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
  isDesktop?:boolean;
  onMousePositionChange?: (position: { x: string; y: number }) => void;
}

function formatDate(date: Date){
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    return `${monthNames[monthIndex]} ${day}, ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
}

const PageC = styled(Page)`
  justify-content: center;
`
const LineChartLoader11 = styled(LineChartLoader)`
  width: 500px;
  height: 500px;
`

const AllCartContainer = styled.div`
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 550px;
  padding: 0 16px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
`
const ChartContainer = styled.div`
  width: 100%;
  height: 450px;
  display:flex;
  justify-content:center;
  align-content:center;
  flex-direction:column;
  align-items:center;
`
const LinePlot: FC<LinePlotProps> = ({
  data,
  width = 640,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 50,
  marginLeft = 60,
  isDesktop= false,
  onMousePositionChange
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(true);
  const [currentData, setCurrentData] = useState<DataPoint[]>([]);
  const [crosshairX, setCrosshairX] = useState<number | null>(null);
  const [crosshairY, setCrosshairY] = useState<number | null>(null);
  const tooltipRef = useRef<SVGGElement | null>(null);

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
    const timer = setInterval(() => {
      if (currentData.length >= data.length) {
        setIsDrawing(false); 
        clearInterval(timer); 
      } else {
        setCurrentData(data.slice(0, currentData.length + 1));
      }
    }, 5); 
    return () => {
      clearInterval(timer); 
    };
  }, [data, currentData]);


  useEffect(() => {
    if (!isDrawing || !svgRef.current) return;
    
    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove();
    
    svg.append("rect")
    .attr("x", 60)
    .attr("y", 0)
    .attr("width",width - marginLeft - marginRight)
    .attr("height", height- marginBottom)
    .style("fill", "transparent")

    svg
      .append("g")
      .attr("transform", `translate(0, ${height - marginBottom})`)
      .selectAll(".domain, .tick line").remove();
  
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft}, 0)`)
      .call(d3.axisLeft(y))
      .selectAll(".domain, .tick line")
      .attr("stroke-width", 50)
      .remove()

      svg.on("mousemove", handleMouseMove)
      svg.on('mouseleave', handleMouseOut);

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

    svg
      .append("path")
      .attr("fill", "url(#gradient)")
      .attr("d", area(currentData) || undefined);

    svg
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "rgb(61,144,230)")
      .attr("stroke-width", "3")
      .attr("d", line(currentData) || undefined);

      const crosshairGroup = svg.append("g").attr("class", "crosshair");

      crosshairGroup
          .append("circle")
          .attr("class", "crosshairCircle")
          .attr("r", 4)
          .attr("fill", "blue")
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
          
      const tooltip = d3.select(svgRef.current).append('g').style('display', '');
      const text = tooltip
        .append('text')
        .attr('x', 5)
        .attr('y', 15)
        .attr('alignment-baseline', 'middle')
        .attr('font-size', '12px');
      tooltipRef.current = text.node();

  }, [data, width, height, marginTop, marginRight, marginBottom, marginLeft, line, area, x, y, xAxis, isDrawing,crosshairX, crosshairY,isDesktop]);

  useEffect(() => {
    setIsDrawing(true); 
    setCurrentData([]); 
  }, [isDesktop]);

  
  const handleMouseOut = () =>{
    onMousePositionChange({ x: formatDate(data[data.length-1].time), y: data[data.length-1].price});
    setCrosshairX(null); 
    setCrosshairY(null);

    d3.select(".crosshairX")
    .style("display", "none");

    d3.select(".crosshairY")
    .style("display", "none");

    d3.select(".crosshairCircle").style("display", "none");
    d3.select(tooltipRef.current).style("display", "none");
  }

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const { left, top } = svgRef.current.getBoundingClientRect();
    const x1: number = clientX - left ;
    const y1: number = clientY - top;

    if  (x1 >= marginLeft && x1 <= width - marginRight && y1 >= marginTop && y1 <= height - marginBottom) {

      const xValue = xReverse(x1);
      const dataPointIndex = Math.round(xValue); 
      
      if (tooltipRef.current) {
        const gg = x1 - 35
        tooltipRef.current.setAttribute('x', gg.toString());
        tooltipRef.current.setAttribute('y', "420");
        tooltipRef.current.textContent = formatDate(data[dataPointIndex].time);
      }
      
      if (dataPointIndex >= 0 && dataPointIndex < data.length) {
        const dataPoint = data[dataPointIndex];

        if (onMousePositionChange) {
          const formattedDate = formatDate(dataPoint.time);
          onMousePositionChange({ x: formattedDate, y: dataPoint.price });
          const pixelY = y(dataPoint.price)
          
          d3.select(tooltipRef.current).style("display", "");
          setCrosshairX(x1);
          setCrosshairY(pixelY);
          d3.select(".crosshairX")
          .attr("x1", marginLeft)
          .attr("x2", width - marginRight)
          .attr("y1", pixelY)
          .attr("y2", pixelY)
          .style("display", "");
          
          d3.select(".crosshairY")
          .attr("x1", x1)
          .attr("x2", x1)
          .attr("y1", marginTop)
          .attr("y2", height - marginBottom)
          .style("display", "");
          
          d3.select(".crosshairCircle")
          .style("display", "")
          .attr("cx", x1)
          .attr("cy", pixelY);
        }
      }
    }
  }

  return (
    <svg ref={svgRef} width={width} height={height} />
  );
};

const Tocao: FC<{data1:any | null}> = ({data1}) => {

  const [mousePosition, setMousePosition] = useState<{ x: string; y: number }>({ x: "", y: 0 });
  const { isDesktop } = useMatchBreakpointsContext()

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
        <AllCartContainer>
        <PriceDate price = {mousePosition?.y ||  dataPoints[price.length - 1].price } date={mousePosition?.x || formatDate(dataPoints[price.length - 1].time) } />
        <ChartContainer>

            {isDesktop? <LinePlot width= {768} height ={450}  data={dataPoints} isDesktop = {isDesktop}onMousePositionChange={setMousePosition} />
            :<LinePlot width= {350} height ={450}  data={dataPoints} onMousePositionChange={setMousePosition} />}
            
        </ChartContainer>
        </AllCartContainer>
      </Page> 
    );
  } 
  return (
    <PageC> 
        <LineChartLoader11/>
    </PageC>
  );
};

const ParentComponent: FC = () => {
  
  const data1 = useKLine();

  return (
    <Tocao data1={data1} />
  );
};

export default ParentComponent;
