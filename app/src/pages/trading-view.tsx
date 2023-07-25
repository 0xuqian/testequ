import * as d3 from "d3";
import { useKLine } from "hooks/useHistoryNftInfo";
import { FC, useState } from 'react';
import PriceDate from 'views/TradingView/component/TokenInfo'
import { LineChartLoader } from 'views/Info/components/ChartLoaders'
import Page from "views/Page";
import LineChart from "views/TradingView";
import styled from "styled-components";
import { useMatchBreakpointsContext } from "@pancakeswap/uikit";

interface DataPoint {
  price: number;
  time: Date;
}

// function formatDate(date: Date) {
//   const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
//     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//   ];

//   const day = date.getDate();
//   const monthIndex = date.getMonth();
//   const hours = date.getHours();
//   const minutes = date.getMinutes();

//   return `${monthNames[monthIndex]} ${day}, ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
// }

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

const Tocao: FC<{ data: any | null }> = ({ data }) => {

  const [mousePosition, setMousePosition] = useState<{ x: string; y: number }>({ x: "", y: 0 });
  const { isDesktop } = useMatchBreakpointsContext()

  // const parseTime = d3.utcParse("%Y-%m-%dT%H:%M:%SZ");
  let price = [];
  let time = [];

  if (data?.data.x_axis[0] && data?.data.y_axis[0]) {
    price = data.data.y_axis;
    // time = data.data.x_axis.map(parseTime);
    time = data.data.x_axis
    const sortedData = time.map((timeValue, index) => ({
      price: price[index],
      time: timeValue,
    }));

    const dataPoints: DataPoint[] = sortedData;
    return (
      <Page>
        <AllCartContainer>
          <PriceDate price={mousePosition?.y || dataPoints[price.length - 1].price} date={mousePosition?.x || time[time.length - 1].toString()} />
          <ChartContainer>
            {isDesktop ? <LineChart width={768} height={450} data={dataPoints} isDesktop={isDesktop} onMousePositionChange={setMousePosition} />
              : <LineChart width={350} height={450} data={dataPoints} onMousePositionChange={setMousePosition} />}
          </ChartContainer>
        </AllCartContainer>
      </Page>
    );
  }
  return (
    <PageC>
      <AllCartContainer>
        <LineChartLoader11 />
      </AllCartContainer>
    </PageC>
  );
};

const TradingView: FC = () => {
  const data = useKLine();
  return (
    <Tocao data={data} />
  );
};

export default TradingView;
