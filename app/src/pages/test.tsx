import * as d3 from "d3";
import { useKLine } from "hooks/useHistoryNftInfo";
import { FC, useRef, useEffect, useState } from 'react';
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
}


const LinePlot: FC<LinePlotProps> = ({
  data,
  width = 640,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 50,
  marginLeft = 50,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const x = d3.scaleLinear()
    .domain([0, data.length - 1]) 
    .range([marginLeft, width - marginRight]);
    
  const tickStartIndex = 5; 
  const tickInterval = 16; 
    
  const tickIndices = Array.from({ length: 6 }, (_, i) => tickStartIndex + i * tickInterval);
    
  const xAxis = d3.axisBottom(x)
  .tickValues(tickIndices)
  .tickFormat((i) => {
    const date = new Date(data[i].time);
    return (
        date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        })
    );
  });


  const y = d3.scaleLinear()
    .domain([0, d3.extent(data.map((d) => d.price))[1]])
    .range([height - marginBottom, marginTop]);
  
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
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove();

    // 添加X轴
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - marginBottom})`)
      .call(xAxis);
      
    // 添加Y轴
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft}, 0)`)
      .call(d3.axisLeft(y));
      

    // 渐变颜色
    const linearGradient = svg.append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%");

    linearGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(172, 190, 16, 0.2)");

    linearGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(172, 190, 16, 1)");

    // 绘制填充区域
    svg
    .append("path")
    .attr("fill", "url(#gradient)")
    .attr("d", area(data) || undefined);

    // 绘制折线
    svg
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "rgb(232,186,65)")
    .attr("stroke-width", "3")
    .attr("d", line(data) || undefined)

  }, [data, width, height, marginTop, marginRight, marginBottom, marginLeft, line, area, x, y, xAxis]);

  
  return (
    <svg ref={svgRef} width={width} height={height} />
  );
};

const Tocao: React.FC = () => {
  const data1 = useKLine();
  const parseTime = d3.utcParse("%Y-%m-%dT%H:%M:%SZ");
  let price = [];
  let time = [];
  console.log(data1)
  if (data1) {
    price = data1.data.y_axis;
    time = data1.data.x_axis.map(parseTime);
    // 先解析时间戳，再排序
    const sortedData = time.map((timeValue, index) => ({
      price: price[index],
      time: timeValue,
    }));
    // 将排序后的数据赋值给 dataPoints
    const dataPoints: DataPoint[] = sortedData;

    // 如果 dataPoints 数组不为空，渲染折线图
    return (
      <Page>
        <div>
          <svg width={640} height={400}>
            <LinePlot data={dataPoints} /> 
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

export default Tocao;
