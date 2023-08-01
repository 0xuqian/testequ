import styled from 'styled-components'
import { PageMeta } from 'components/Layout/Page'

const StyledPage = styled.div<{ $removePadding: boolean; $noMinHeight }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: ${({ $removePadding }) => ($removePadding ? '0' : '16px')};
  padding-bottom: 18px;
  min-height: ${({ $noMinHeight }) => ($noMinHeight ? 'initial' : 'calc(100vh - 364px)')};
  background: ${({ theme }) => {
    return theme.colors.backgroundCat
  }};

  ${({ theme }) => theme.mediaQueries.xs} {
    background-size: auto;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: ${({ $removePadding }) => ($removePadding ? '0' : '24px')};
    padding-bottom: 30px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: ${({ $removePadding }) => ($removePadding ? '0' : '32px')};
    padding-bottom: 30px;
    min-height: ${({ $noMinHeight }) => ($noMinHeight ? 'initial' : 'calc(100vh - 265px)')};
  }
  @media screen and (max-width: 852px) {
    // background: #fff;
  }
`

const Page: React.FC<
  React.PropsWithChildren<
    React.HTMLAttributes<HTMLDivElement> & {
      removePadding?: boolean
      hideFooterOnDesktop?: boolean
      noMinHeight?: boolean
      helpUrl?: string
    }
  >
> = ({
  children,
  removePadding = false,
  noMinHeight = false,
  ...props
}) => {
    return (
      <>
        <PageMeta />
        <StyledPage $removePadding={removePadding} $noMinHeight={noMinHeight} {...props}>
          {children}
        </StyledPage>
      </>
    )
  }

export default Page
