import { showNotification } from '@mantine/notifications'
import { t } from 'utils/i18nextFix'
import { Notification } from './types'

export const updateToErrorNotification = ({ autoClose = true, message, title, loading = false, id }: Notification) => {
  showNotification({
    message: t(message),
    title: 'udpateProgress',
    id,
    // color: 'red',
    autoClose,
    loading,
  })
}
