import { useTranslation } from 'react-i18next';
import { APPLICATION_STATUS_LABEL_KEYS } from '../utils/constants';

export function StatusBadge({ status, labelKey = APPLICATION_STATUS_LABEL_KEYS[status] }) {
  const { t } = useTranslation();
  const label = labelKey ? t(labelKey) : status;

  return <span className={`status-badge status-badge-${status}`}>{label}</span>;
}
