/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useTranslation } from 'react-i18next';
import { ServiceOrder, ServiceOrderExpense, ExpenseCategory } from '$app/common/interfaces/service-order';
import { useColorScheme } from '$app/common/colors';
import { Button, SelectField } from '$app/components/forms';
import { InputField } from '$app/components/forms';
import { NumberInputField } from '$app/components/forms/NumberInputField';
import { useFormatMoney } from '$app/common/hooks/money/useFormatMoney';
import { MdDelete, MdAdd, MdCheck, MdReceipt } from 'react-icons/md';
import { Icon } from '$app/components/icons/Icon';
import { Table, Thead, Th, Tbody, Tr, Td } from '$app/components/tables';
import { v4 as uuidv4 } from 'uuid';
import Toggle from '$app/components/forms/Toggle';
import { Badge } from '$app/components/Badge';

interface Props {
  serviceOrder: ServiceOrder;
  handleChange: (property: keyof ServiceOrder, value: ServiceOrder[keyof ServiceOrder]) => void;
}

export function ServiceOrderExpenseTable(props: Props) {
  const [t] = useTranslation();

  const colors = useColorScheme();
  const formatMoney = useFormatMoney();

  const { serviceOrder, handleChange } = props;

  const expenses = serviceOrder.expenses || [];

  const expenseCategoryOptions: { value: ExpenseCategory; label: string }[] = [
    { value: 'fuel', label: t('fuel') },
    { value: 'meals', label: t('meals') },
    { value: 'supplies', label: t('supplies') },
    { value: 'parking', label: t('parking') },
    { value: 'tolls', label: t('tolls') },
    { value: 'lodging', label: t('lodging') },
    { value: 'equipment_rental', label: t('equipment_rental') },
    { value: 'subcontractor', label: t('subcontractor') },
    { value: 'other', label: t('other') },
  ];

  const handleAddExpense = () => {
    const newExpense: ServiceOrderExpense = {
      id: uuidv4(),
      service_order_id: serviceOrder.id,
      user_id: '',
      technician_user_id: '',
      name: '',
      description: '',
      expense_category: 'other',
      expense_date: new Date().toISOString().split('T')[0],
      total_cost: 0,
      tax_paid: 0,
      charge_to_client: false,
      charge_amount: 0,
      charge_tax_rate_id: '',
      reimburse_user: false,
      is_reimbursed: false,
      reimbursed_at: '',
      receipt_number: '',
      receipt_image: '',
      needs_reimbursement: false,
      net_cost: 0,
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
      archived_at: 0,
      is_deleted: false,
    };

    handleChange('expenses', [...expenses, newExpense]);
  };

  const handleRemoveExpense = (expenseId: string) => {
    handleChange(
      'expenses',
      expenses.filter((expense) => expense.id !== expenseId)
    );
  };

  const handleExpenseChange = (
    expenseId: string,
    property: keyof ServiceOrderExpense,
    value: string | number | boolean
  ) => {
    const updatedExpenses = expenses.map((expense) => {
      if (expense.id === expenseId) {
        const updatedExpense = { ...expense, [property]: value };

        // Recalculate net_cost and needs_reimbursement
        if (property === 'total_cost' || property === 'tax_paid') {
          updatedExpense.net_cost = (updatedExpense.total_cost || 0) - (updatedExpense.tax_paid || 0);
        }

        if (property === 'reimburse_user' || property === 'is_reimbursed') {
          updatedExpense.needs_reimbursement = updatedExpense.reimburse_user && !updatedExpense.is_reimbursed;
        }

        return updatedExpense;
      }
      return expense;
    });

    handleChange('expenses', updatedExpenses);
  };

  const calculateTotalCost = () => {
    return expenses.reduce((sum, expense) => sum + (expense.total_cost || 0), 0);
  };

  const calculateTotalChargeToClient = () => {
    return expenses
      .filter((expense) => expense.charge_to_client)
      .reduce((sum, expense) => sum + (expense.charge_amount || 0), 0);
  };

  const calculatePendingReimbursement = () => {
    return expenses
      .filter((expense) => expense.reimburse_user && !expense.is_reimbursed)
      .reduce((sum, expense) => sum + (expense.total_cost || 0), 0);
  };

  const getReimbursementBadge = (expense: ServiceOrderExpense) => {
    if (!expense.reimburse_user) {
      return null;
    }
    if (expense.is_reimbursed) {
      return <Badge variant="green">{t('reimbursed')}</Badge>;
    }
    return <Badge variant="yellow">{t('pending')}</Badge>;
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium" style={{ color: colors.$3 }}>
          {t('expenses')}
        </h3>
        <Button type="minimal" behavior="button" onClick={handleAddExpense}>
          <Icon element={MdAdd} size={20} />
          {t('add_expense')}
        </Button>
      </div>

      {expenses.length > 0 && (
        <>
          <Table>
            <Thead>
              <Th>{t('date')}</Th>
              <Th>{t('category')}</Th>
              <Th>{t('name')}</Th>
              <Th>{t('description')}</Th>
              <Th>{t('amount')}</Th>
              <Th>{t('tax_paid')}</Th>
              <Th>{t('charge_to_client')}</Th>
              <Th>{t('charge_amount')}</Th>
              <Th>{t('reimburse')}</Th>
              <Th>{t('status')}</Th>
              <Th></Th>
            </Thead>
            <Tbody>
              {expenses.map((expense) => (
                <Tr key={expense.id}>
                  <Td>
                    <InputField
                      type="date"
                      value={expense.expense_date}
                      onValueChange={(value) =>
                        handleExpenseChange(expense.id, 'expense_date', value)
                      }
                    />
                  </Td>
                  <Td>
                    <SelectField
                      value={expense.expense_category}
                      onValueChange={(value) =>
                        handleExpenseChange(expense.id, 'expense_category', value as ExpenseCategory)
                      }
                    >
                      {expenseCategoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </SelectField>
                  </Td>
                  <Td>
                    <InputField
                      value={expense.name}
                      onValueChange={(value) =>
                        handleExpenseChange(expense.id, 'name', value)
                      }
                    />
                  </Td>
                  <Td>
                    <InputField
                      value={expense.description}
                      onValueChange={(value) =>
                        handleExpenseChange(expense.id, 'description', value)
                      }
                    />
                  </Td>
                  <Td>
                    <NumberInputField
                      value={expense.total_cost}
                      onValueChange={(value) =>
                        handleExpenseChange(expense.id, 'total_cost', parseFloat(value) || 0)
                      }
                    />
                  </Td>
                  <Td>
                    <NumberInputField
                      value={expense.tax_paid}
                      onValueChange={(value) =>
                        handleExpenseChange(expense.id, 'tax_paid', parseFloat(value) || 0)
                      }
                    />
                  </Td>
                  <Td className="text-center">
                    <Toggle
                      checked={expense.charge_to_client}
                      onValueChange={(value) =>
                        handleExpenseChange(expense.id, 'charge_to_client', value)
                      }
                    />
                  </Td>
                  <Td>
                    <NumberInputField
                      value={expense.charge_amount}
                      onValueChange={(value) =>
                        handleExpenseChange(expense.id, 'charge_amount', parseFloat(value) || 0)
                      }
                      disabled={!expense.charge_to_client}
                    />
                  </Td>
                  <Td className="text-center">
                    <Toggle
                      checked={expense.reimburse_user}
                      onValueChange={(value) =>
                        handleExpenseChange(expense.id, 'reimburse_user', value)
                      }
                    />
                  </Td>
                  <Td>
                    {getReimbursementBadge(expense)}
                  </Td>
                  <Td>
                    <Button
                      type="minimal"
                      behavior="button"
                      onClick={() => handleRemoveExpense(expense.id)}
                    >
                      <Icon element={MdDelete} size={20} color="red" />
                    </Button>
                  </Td>
                </Tr>
              ))}
              <Tr>
                <Td colSpan={4} className="text-right font-medium">
                  {t('totals')}:
                </Td>
                <Td className="font-medium">
                  {formatMoney(
                    calculateTotalCost(),
                    serviceOrder.client?.country_id,
                    serviceOrder.client?.settings?.currency_id
                  )}
                </Td>
                <Td></Td>
                <Td></Td>
                <Td className="font-medium">
                  {formatMoney(
                    calculateTotalChargeToClient(),
                    serviceOrder.client?.country_id,
                    serviceOrder.client?.settings?.currency_id
                  )}
                </Td>
                <Td colSpan={3}></Td>
              </Tr>
            </Tbody>
          </Table>

          {/* Reimbursement Summary */}
          {calculatePendingReimbursement() > 0 && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center space-x-2">
                <Icon element={MdReceipt} size={20} className="text-yellow-600" />
                <span className="font-medium text-yellow-800 dark:text-yellow-200">
                  {t('pending_reimbursement')}:
                </span>
                <span className="font-bold text-yellow-800 dark:text-yellow-200">
                  {formatMoney(
                    calculatePendingReimbursement(),
                    serviceOrder.client?.country_id,
                    serviceOrder.client?.settings?.currency_id
                  )}
                </span>
              </div>
            </div>
          )}
        </>
      )}

      {expenses.length === 0 && (
        <div
          className="text-center py-8 border rounded"
          style={{ borderColor: colors.$5, color: colors.$3 }}
        >
          <p>{t('no_expenses')}</p>
          <Button type="minimal" behavior="button" onClick={handleAddExpense} className="mt-2">
            <Icon element={MdAdd} size={20} />
            {t('add_expense')}
          </Button>
        </div>
      )}
    </div>
  );
}
