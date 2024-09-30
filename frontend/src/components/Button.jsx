import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const PlayButton = styled.button`
  background-color: ${({ backgroundColor }) => backgroundColor && backgroundColor };
  padding: ${({ padding }) => padding && padding };
  margin: ${({ margin }) => margin && margin };
  width: ${({ width }) => width && width };
  color: ${({ color }) => color && color };
  border-radius: ${({ borderRadius }) => borderRadius && borderRadius };
`

const Button = ({ children, ...props }) => {
  return (
    <PlayButton { ...props }>{children}</PlayButton>
  )
}

Button.propTypes = {
  backgroundColor: PropTypes.string,
  padding: PropTypes.string,
  margin: PropTypes.string,
  width: PropTypes.string,
  color: PropTypes.string,
  borderRadius: PropTypes.string
}

Button.defaultProps = {
  backgroundColor: '#119B0A',
  padding: '8px 32px',
  margin: '0',
  width: null,
  color: 'white',
  borderRadius: '6px'
}

export default Button
