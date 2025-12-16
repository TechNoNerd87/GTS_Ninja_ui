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
import { ServiceBank, ServiceBankTransaction } from '$app/common/interfaces/service-bank';
import { useServiceBankTransactionsQuery } from '$app/common/queries/service-banks';
import { useTranslation } from 'react-i18next';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import { Card } from '$app/components/cards';
import { Badge } from '$app/components/Badge';
import { Spinner } from '$app/components/Spinner';

interface Context {
  serviceBank: ServiceBank | undefined;
}

export default function Transactions() {
  const [t] = useTranslation();
  const { id } = useParams();

  const context: Context = useOutletContext();
  const { serviceBank } = context;

  const { dateFormat } = useCurrentCompanyDateFormats();
  const formatMoney = useFormatMoney();

  const { data: transactions, isLoading } = useServiceBankTransactionsQuery({ id });

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'green';
      case 'withdrawal':
        return 'red';
      case 'adjustment':
        return 'yellow';
      case 'rollover':
        return 'blue';
      case 'expiration':
        return 'black';
      case 'refund':
        return 'purple';
      default:
        return 'generic';
    }
  };

  const formatAmount = (transaction: ServiceBankTransaction) => {
    const amounts: string[] = [];

    if (transaction.hours_amount !== 0) {
      amounts.push(`${transaction.hours_amount > 0 ? '+' : ''}${transaction.hours_amount.toFixed(2)} ${t('hours')}`);
    }

    if (transaction.currency_amount !== 0) {
      const formattedAmount = formatMoney(
        Math.abs(transaction.currency_amount),
        serviceBank?.client?.country_id,
        serviceBank?.client?.settings?.currency_id
      );
      amounts.push(`${transaction.currency_amount > 0 ? '+' : '-'}${formattedAmount}`);
    }

    if (transaction.incidents_amount !== 0) {
      amounts.push(`${transaction.incidents_amount > 0 ? '+' : ''}${transaction.incidents_amount} ${t('incidents')}`);
    }

    return amounts.join(', ') || '-';
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Card title={t('transactions')}>
      {transactions && transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">{t('date')}</th>
                <th className="text-left p-3">{t('type')}</th>
                <th className="text-left p-3">{t('amount')}</th>
                <th className="text-left p-3">{t('balance_after')}</th>
                <th className="text-left p-3">{t('description')}</th>
                <th className="text-left p-3">{t('service_order')}</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    {date(transaction.transaction_date, dateFormat)}
                  </td>
                  <td className="p-3">
                    <Badge variant={getTransactionTypeColor(transaction.transaction_type)}>
                      {t(transaction.transaction_type)}
                    </Badge>
                  </td>
                  <td className="p-3 font-mono">
                    {formatAmount(transaction)}
                  </td>
                  <td className="p-3 text-sm">
                    {serviceBank?.bank_type === 'hours' || serviceBank?.bank_type === 'combined' ? (
                      <span>{transaction.hours_balance_after.toFixed(2)}h</span>
                    ) : null}
                    {serviceBank?.bank_type === 'currency' || serviceBank?.bank_type === 'combined' ? (
                      <span>
                        {formatMoney(
                          transaction.currency_balance_after,
                          serviceBank?.client?.country_id,
                          serviceBank?.client?.settings?.currency_id
                        )}
                      </span>
                    ) : null}
                    {serviceBank?.bank_type === 'incidents' || serviceBank?.bank_type === 'combined' ? (
                      <span>{transaction.incidents_balance_after}i</span>
                    ) : null}
                  </td>
                  <td className="p-3">{transaction.description || '-'}</td>
                  <td className="p-3">
                    {transaction.service_order_id ? (
                      <Link
                        to={route('/service_orders/:id/edit', { id: transaction.service_order_id })}
                        className="text-blue-600 hover:underline"
                      >
                        {t('view')}
                      </Link>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">
          {t('no_records_found')}
        </div>
      )}
    </Card>
  );
}
