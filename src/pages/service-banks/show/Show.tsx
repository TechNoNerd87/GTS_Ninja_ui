/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { date } from '$app/common/helpers';
import { route } from '$app/common/helpers/route';
import { useCurrentCompanyDateFormats } from '$app/common/hooks/useCurrentCompanyDateFormats';
import { useFormatMoney } from '$app/common/hooks/money/useFormatMoney';
import { ServiceBank } from '$app/common/interfaces/service-bank';
import { InfoCard } from '$app/components/InfoCard';
import { useTranslation } from 'react-i18next';
import { Link, useOutletContext } from 'react-router-dom';
import { Badge } from '$app/components/Badge';

interface Context {
  serviceBank: ServiceBank | undefined;
}

export default function Show() {
  const [t] = useTranslation();

  const context: Context = useOutletContext();
  const { serviceBank } = context;

  const { dateFormat } = useCurrentCompanyDateFormats();
  const formatMoney = useFormatMoney();

  if (!serviceBank) {
    return null;
  }

  const getBankTypeLabel = (bankType: string) => {
    switch (bankType) {
      case 'hours':
        return t('hours');
      case 'currency':
        return t('currency');
      case 'incidents':
        return t('incidents');
      case 'combined':
        return t('combined');
      default:
        return bankType;
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Overview */}
      <InfoCard title={t('overview')} className="col-span-12 lg:col-span-6">
        <p>
          <span className="font-medium">{t('name')}: </span>
          {serviceBank.name}
        </p>
        <p>
          <span className="font-medium">{t('bank_type')}: </span>
          {getBankTypeLabel(serviceBank.bank_type)}
        </p>
        {serviceBank.client && (
          <p>
            <span className="font-medium">{t('client')}: </span>
            <Link
              to={route('/clients/:id', { id: serviceBank.client_id })}
              className="text-blue-600 hover:underline"
            >
              {serviceBank.client.display_name}
            </Link>
          </p>
        )}
        {serviceBank.contract && (
          <p>
            <span className="font-medium">{t('contract')}: </span>
            <Link
              to={route('/contracts/:id/edit', { id: serviceBank.contract_id })}
              className="text-blue-600 hover:underline"
            >
              {serviceBank.contract.name}
            </Link>
          </p>
        )}
        <p className="flex items-center space-x-2">
          <span className="font-medium">{t('status')}: </span>
          {serviceBank.is_active ? (
            <Badge variant="green">{t('active')}</Badge>
          ) : (
            <Badge variant="red">{t('inactive')}</Badge>
          )}
          {serviceBank.is_low_balance && (
            <Badge variant="yellow">{t('low_balance')}</Badge>
          )}
        </p>
      </InfoCard>

      {/* Balance Summary */}
      <InfoCard title={t('balance')} className="col-span-12 lg:col-span-6">
        {(serviceBank.bank_type === 'hours' || serviceBank.bank_type === 'combined') && (
          <div className="mb-4">
            <p className="font-semibold">{t('hours')}</p>
            <p>
              <span className="font-medium">{t('purchased')}: </span>
              {serviceBank.hours_purchased.toFixed(2)}
            </p>
            <p>
              <span className="font-medium">{t('used')}: </span>
              {serviceBank.hours_used.toFixed(2)}
            </p>
            <p>
              <span className="font-medium">{t('balance')}: </span>
              <span className={serviceBank.hours_balance <= 0 ? 'text-red-600' : 'text-green-600'}>
                {serviceBank.hours_balance.toFixed(2)}
              </span>
            </p>
          </div>
        )}

        {(serviceBank.bank_type === 'currency' || serviceBank.bank_type === 'combined') && (
          <div className="mb-4">
            <p className="font-semibold">{t('currency')}</p>
            <p>
              <span className="font-medium">{t('purchased')}: </span>
              {formatMoney(
                serviceBank.currency_purchased,
                serviceBank.client?.country_id,
                serviceBank.client?.settings?.currency_id
              )}
            </p>
            <p>
              <span className="font-medium">{t('used')}: </span>
              {formatMoney(
                serviceBank.currency_used,
                serviceBank.client?.country_id,
                serviceBank.client?.settings?.currency_id
              )}
            </p>
            <p>
              <span className="font-medium">{t('balance')}: </span>
              <span className={serviceBank.currency_balance <= 0 ? 'text-red-600' : 'text-green-600'}>
                {formatMoney(
                  serviceBank.currency_balance,
                  serviceBank.client?.country_id,
                  serviceBank.client?.settings?.currency_id
                )}
              </span>
            </p>
          </div>
        )}

        {(serviceBank.bank_type === 'incidents' || serviceBank.bank_type === 'combined') && (
          <div className="mb-4">
            <p className="font-semibold">{t('incidents')}</p>
            <p>
              <span className="font-medium">{t('purchased')}: </span>
              {serviceBank.incidents_purchased}
            </p>
            <p>
              <span className="font-medium">{t('used')}: </span>
              {serviceBank.incidents_used}
            </p>
            <p>
              <span className="font-medium">{t('balance')}: </span>
              <span className={serviceBank.incidents_balance <= 0 ? 'text-red-600' : 'text-green-600'}>
                {serviceBank.incidents_balance}
              </span>
            </p>
          </div>
        )}
      </InfoCard>

      {/* Dates */}
      <InfoCard title={t('dates')} className="col-span-12 lg:col-span-6">
        <p>
          <span className="font-medium">{t('effective_date')}: </span>
          {serviceBank.effective_date ? date(serviceBank.effective_date, dateFormat) : '-'}
        </p>
        <p>
          <span className="font-medium">{t('expiration_date')}: </span>
          {serviceBank.expiration_date ? date(serviceBank.expiration_date, dateFormat) : '-'}
        </p>
        <p>
          <span className="font-medium">{t('created_at')}: </span>
          {date(serviceBank.created_at, dateFormat)}
        </p>
        <p>
          <span className="font-medium">{t('updated_at')}: </span>
          {date(serviceBank.updated_at, dateFormat)}
        </p>
      </InfoCard>

      {/* Settings */}
      <InfoCard title={t('settings')} className="col-span-12 lg:col-span-6">
        <p>
          <span className="font-medium">{t('allow_overage')}: </span>
          {serviceBank.allow_overage ? t('yes') : t('no')}
        </p>
        <p>
          <span className="font-medium">{t('rollover_unused')}: </span>
          {serviceBank.rollover_unused ? t('yes') : t('no')}
        </p>
        <p>
          <span className="font-medium">{t('notify_low_balance')}: </span>
          {serviceBank.notify_low_balance ? t('yes') : t('no')}
        </p>
        {serviceBank.notify_low_balance && (
          <p>
            <span className="font-medium">{t('low_balance_threshold')}: </span>
            {serviceBank.low_balance_threshold}
          </p>
        )}
        {serviceBank.hourly_rate > 0 && (
          <p>
            <span className="font-medium">{t('hourly_rate')}: </span>
            {formatMoney(
              serviceBank.hourly_rate,
              serviceBank.client?.country_id,
              serviceBank.client?.settings?.currency_id
            )}
          </p>
        )}
      </InfoCard>

      {/* Notes */}
      {serviceBank.notes && (
        <InfoCard title={t('notes')} className="col-span-12">
          <p className="whitespace-pre-wrap">{serviceBank.notes}</p>
        </InfoCard>
      )}
    </div>
  );
}
