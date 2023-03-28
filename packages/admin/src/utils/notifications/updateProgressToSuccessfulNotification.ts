import { showNotification } from '@mantine/notifications'
import { t } from 'utils/i18nextFix'
import { Notification } from './types'

export const updateToSuccessfulNotification = ({
  autoClose = true,
  message,
  title,
  loading = false,
  id,
}: Notification) => {
  showNotification({
    message: t(message),
    title: t(title),
    id,
    color: 'green',
    autoClose,
    loading,
  })
}
