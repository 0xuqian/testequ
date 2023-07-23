import styled from "styled-components";

interface PriceDateProps {
  price: number;
  date: string;
  projectIcon?: string;
  tokenName?: string;
  
}

const PriceInfo = styled.div`
  font-weight: 600;
  font-size: 32px;
  padding-bottom: 20px;
`

const DateInfo = styled.div`
  font-weight: 200;
  font-size: 16px;
`

const PriceDate: React.FC<PriceDateProps> = ({ price, date, projectIcon, tokenName }) => {

  return (
    <div>
      <PriceInfo>{price}</PriceInfo>
      <DateInfo>{date}</DateInfo>
      {/* <img src={projectIcon} alt="Project Icon" />
      <div>{tokenName}</div> */}
    </div>
  );
};

export default PriceDate;
