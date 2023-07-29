import { AllHistory, useKLine } from "hooks/useHistoryNftInfo";
import { FC, useEffect, useState } from 'react';
import PriceDate from 'views/TradingView/component/TokenInfo'
import { LineChartLoader } from 'views/Info/components/ChartLoaders'
import Page from "views/Page";
import { useTranslation } from '@pancakeswap/localization'
import LineChart from "views/TradingView/lineChart";
import styled from "styled-components";
import { DataPoint, timeWindowMap } from "views/TradingView/types";
import ResizeDetector from 'react-resize-detector';
import { ButtonMenu, ButtonMenuItem, useMatchBreakpointsContext } from "@pancakeswap/uikit";
import { PairDataTimeWindowEnum } from "state/swap/types";
import useActiveWeb3React from "hooks/useActiveWeb3React";

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
  max-width: 1200px;
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

const PriceAndTimeSeletor = styled.div`
  display:flex;
  justify-content: space-between;
`

const ButtonItemStyle = styled(ButtonMenuItem)`
  font-size: 10px;
  text-align: center;
  height:100%;
`
const ButtonMenuStyle = styled(ButtonMenu)`
display: flex;
align-items: center; 
justify-content: center; 
height : 35px;
`
export const formatNumber = (number) => {
  const stringValue = number.toString();

  const countTrailingZeros = (input) => {
    const match = input.match(/\.0+/);
    return match ? match[0].length - 1 : 0;
  };

  if (/[+-]?\d+(\.\d+)?[eE][+-]?\d+/.test(stringValue)) {
    const str = parseFloat(number).toFixed(20).replace(/\.?0+$/, '');
    const demail = countTrailingZeros(str);
    if (demail >= 7) {
      const match = str.match(/\.0+/);
      const count = match[0].length - 2;
      const formattedNumber = str.replace(/\.0+/, `.0{${count}}`);
      return formattedNumber;
    }
    return str;
  }

  return stringValue;
};


const TradingView = () => {

  const [mousePosition, setMousePosition] = useState<{ x: string; y: string }>({ x: "", y: "" });
  const [kData, setKData] = useState<AllHistory>()
  const { isDesktop } = useMatchBreakpointsContext()
  const [parentWidth, setParentWidth] = useState<number>(0);
  const [sortedData, setSortedData] = useState<DataPoint[]>(null)
  const [timeWindow, setTimeWindow] = useState<PairDataTimeWindowEnum>(2)
  const [dataCache, setDataCache] = useState({});
  const [price, setPrice] = useState(null);
  const [time, setTime] = useState(null);
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()


  useEffect(() => {
    (async () => {
      if (dataCache[timeWindow]) {
        setKData(dataCache[timeWindow]);
      } else {
        try {
          const res: any = await fetch(`https://www.equityswap.club/app/k_line`,
            {
              method: 'post',
              body: JSON.stringify({
                token_addr: "0x08784c14c2a77fBC6Bc44259c517cf11dB82d139",
                net: `evm--${Number(chainId)}`,
                time: timeWindowMap[timeWindow]
              }),
              headers: new Headers({
                'Content-Type': 'application/json'
              })
            })
          const obj: AllHistory = await res.json()
          if (obj?.code === 0) {
            setDataCache(prevDataCache => ({ ...prevDataCache, [timeWindow]: obj }));
            setKData(obj)
          }
        } catch (error) {
          console.error(`Failed to fetch list`, error)
        }
      }
    })();
  }, [timeWindow])

  useEffect(() => {
    if (kData) {
      const newPrice = kData.data.y_axis;
      const newTime = kData.data.x_axis;
      setPrice(newPrice);
      setTime(newTime);
      setSortedData(newTime.map((timeValue, index) => ({
        stringPrice: formatNumber(newPrice[index]),
        price: newPrice[index],
        time: timeValue,
      })));
    }
  }, [kData])


  // const parseTime = d3.utcParse("%Y-%m-%dT%H:%M:%SZ");
  if (!kData || !sortedData) {
    return (
      <PageC>
        <AllCartContainer>
          <LineChartLoader11 />
        </AllCartContainer>
      </PageC>
    );
  }

  if (!kData?.data.x_axis?.length || !kData.data.y_axis?.length) {
    return (
      <PageC>
        <AllCartContainer>
          <div>No Data</div>
        </AllCartContainer>
      </PageC>
    );
  }

  return (
    <Page>
      <AllCartContainer>
        <PriceAndTimeSeletor>
          <PriceDate price={mousePosition?.y.toString() || (price ? formatNumber(price[price.length - 1]) : "0")} date={mousePosition?.x || (time ? time[time.length - 1].toString() : "00")} />
          <ButtonMenuStyle activeIndex={timeWindow} onItemClick={setTimeWindow} scale="sm">
            <ButtonItemStyle >{t('1m')}</ButtonItemStyle>
            <ButtonItemStyle >{t('5m')}</ButtonItemStyle>
            <ButtonItemStyle >{t('15m')}</ButtonItemStyle>
            <ButtonItemStyle>{t('30m')}</ButtonItemStyle>
            <ButtonItemStyle>{t('1H')}</ButtonItemStyle>
            <ButtonItemStyle>{t('2H')}</ButtonItemStyle>
            <ButtonItemStyle>{t('4H')}</ButtonItemStyle>
            <ButtonItemStyle>1D</ButtonItemStyle>
            <ButtonItemStyle>1W</ButtonItemStyle>
            <ButtonItemStyle>All</ButtonItemStyle>
          </ButtonMenuStyle>
        </PriceAndTimeSeletor>
        <ChartContainer>
          <ResizeDetector handleWidth onResize={setParentWidth} />
          <LineChart
            width={isDesktop ? (parentWidth !== 0 ? parentWidth : undefined) : parentWidth}
            height={450}
            data={sortedData}
            isDesktop={isDesktop}
            onMousePositionChange={setMousePosition}
          />
        </ChartContainer>
      </AllCartContainer>
    </Page>
  );

};

export default TradingView;
