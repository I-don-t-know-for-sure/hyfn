import { t } from 'utils/i18nextFix'

export const calculateDuration = (duration) => {
  if (duration > 60) {
    return `${(duration / 60)?.toFixed(1)} ${t('Hrs')}`
  }
  return `${duration} ${t('Mins')}`
}
