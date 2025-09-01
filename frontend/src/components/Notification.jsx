import { PropTypes } from 'prop-types'

const Notification = ({ message }) => {
  if (message.text) {
    const notificationStyle = {
      fontSize: '1.3em',
      color: message.error
        ? 'red'
        : 'green',
      border: 'solid 3px',
      backgroundColor: 'lightgray',
      borderRadius: 10,
      padding: 5,
      marginBottom: 10,
    }

    return (
      <div style={notificationStyle}>
        {message.text}
      </div>
    )
  }
}

Notification.propTypes = {
  message: PropTypes.object.isRequired
}

export default Notification
