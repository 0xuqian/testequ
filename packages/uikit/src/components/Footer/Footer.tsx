import React from "react";
import { LogoWithTextIcon, Text } from "@pancakeswap/uikit";
import styled from "styled-components";
import { darkColors } from "../../theme/colors";
import { Flex } from "../Box";
import { StyledFooter, StyledIconMobileContainer, StyledSocialLinks, StyledToolsContainer } from "./styles";
import { FooterProps } from "./types";
import { ThemeSwitcher } from "../ThemeSwitcher";
import LangSelector from "../LangSelector/LangSelector";
import { Colors } from "../..";
import LogoWithText from "../Svg/Icons/LogoWithText";

const ListTitle = styled.div`
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 800;
    font-size: 14px;
    line-height: 140%;
    display: flex;
    align-items: center;
    color: white;
  `


const MenuItem: React.FC<React.PropsWithChildren<FooterProps>> = ({
  isDark,
  toggleTheme,
  currentLang,
  langs,
  setLang,
  ...props
}) => {
  return (
    <StyledFooter p={["40px 16px", null, "56px 40px 32px 40px"]} {...props} justifyContent="center">
      <Flex flexDirection="column" width={["100%", null, "1200px;"]}>
        {/* <StyledIconMobileContainer display={["block", null, "none"]}>
            <LogoWithTextIcon />
          </StyledIconMobileContainer> */}
        {/* <Flex
            order={[2, null, 1]}
            flexDirection={["column", null, "row"]}
            justifyContent="space-between"
            alignItems="flex-start"
            mb={["42px", null, "36px"]}
          >
            {items?.map((item) => (
              <StyledList key={item.label}>
                <StyledListItem>{item.label}</StyledListItem>
                {item.items?.map(({ label, href, isHighlighted = false }) => (
                  <StyledListItem key={label}>
                    {href ? (
                      <Link
                        href={href}
                        target="_blank"
                        rel="noreferrer noopener"
                        color={isHighlighted ? baseColors.warning : darkColors.text}
                        bold={false}
                      >
                        {label}
                      </Link>
                    ) : (
                      <StyledText>{label}</StyledText>
                    )}
                  </StyledListItem>
                ))}
              </StyledList>
            ))}
            <Box display={["none", null, "block"]}>
              <LogoWithTextIcon isDark width="160px" />
            </Box>
          </Flex> */}
        <StyledSocialLinks order={[2]} pb={["42px", null, "32px"]} mb={["0", null, "32px"]} />
        <StyledToolsContainer
          order={[1, null, 3]}
          flexDirection={["column", null, "row"]}
          justifyContent="space-between"
        >
          <Flex order={[2, null, 1]} alignItems="center">
            {/* <ThemeSwitcher isDark={isDark} toggleTheme={toggleTheme} /> */}
            <LangSelector
              currentLang={currentLang}
              langs={langs}
              setLang={setLang}
              color={darkColors.textSubtle as keyof Colors}
              dropdownPosition="top-left"
            />
          </Flex>
          <Flex alignItems="center">
            <ListTitle color="light">Copyright EQSwap All Rights Reserved.</ListTitle>
          </Flex>
        </StyledToolsContainer>
      </Flex>
    </StyledFooter>
  );
};

export default MenuItem;
