import React from 'react'
import styled from 'styled-components'

const Flex = ({
  flexDirection,
  justifyContent,
  alignItems,
  textAlign,
  padding,
  margin,
  width,
  color,
  ...props
}) => {
  return (
    <div {...props} />
  )
}

export default styled(Flex)`
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection && flexDirection };
  justify-content: ${({ justifyContent }) => justifyContent && justifyContent };
  align-items: ${({ alignItems }) => alignItems && alignItems };
  text-align: ${({ textAlign }) => textAlign && textAlign };
  padding: ${({ padding }) => padding && padding };
  margin: ${({ margin }) => margin && margin };
  width: ${({ width }) => width && width };
  height: ${({ height }) => height && height };
  color: ${({ color }) => color && color };
`