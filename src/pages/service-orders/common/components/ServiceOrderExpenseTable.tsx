/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ServiceOrder, ServiceOrderExpense, ExpenseCategory } from '$app/common/interfaces/service-order';
import { useColorScheme } from '$app/common/colors';
import { Button, SelectField } from '$app/components/forms';
import { InputField } from '$app/components/forms';
import { NumberInputField } from '$app/components/forms/NumberInputField';
import { useFormatMoney } from '$app/common/hooks/money/useFormatMoney';
import { MdDelete, MdAdd, MdReceipt } from 'react-icons/md';
import { Icon } from '$app/components/icons/Icon';
import { Table, Thead, Th, Tbody, Tr, Td } from '$app/components/tables';
import { v4 as uuidv4 } from 'uuid';
import Toggle from '$app/components/forms/Toggle';
import { Badge } from '$app/components/Badge';
import classNames from 'classnames';

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

  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(
    expenses.length > 0 ? expenses[0].id : null
  );

  const selectedExpense = expenses.find((expense) => expense.id === selectedExpenseId);

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

    const newExpenses = [...expenses, newExpense];
    handleChange('expenses', newExpenses);
    setSelectedExpenseId(newExpense.id);
  };

  const handleRemoveExpense = (expenseId: string) => {
    const newExpenses = expenses.filter((expense) => expense.id !== expenseId);
    handleChange('expenses', newExpenses);

    if (selectedExpenseId === expenseId) {
      setSelectedExpenseId(newExpenses.length > 0 ? newExpenses[0].id : null);
    }
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

  const getCategoryLabel = (category: ExpenseCategory) => {
    const option = expenseCategoryOptions.find((opt) => opt.value === category);
    return option ? option.label : category;
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Header with Add button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium flex items-center gap-2" style={{ color: colors.$3 }}>
          <span>💰</span>
          {t('expenses')}
        </h3>
        <Button type="minimal" behavior="button" onClick={handleAddExpense}>
          <Icon element={MdAdd} size={20} />
          {t('add_expense')}
        </Button>
      </div>

      {expenses.length > 0 && (
        <>
          {/* Summary Table */}
          <Table>
            <Thead>
              <Th>{t('date')}</Th>
              <Th>{t('category')}</Th>
              <Th>{t('name')}</Th>
              <Th>{t('amount')}</Th>
              <Th>{t('charge_to_client')}</Th>
              <Th>{t('reimbursement')}</Th>
              <Th></Th>
            </Thead>
            <Tbody>
              {expenses.map((expense) => (
                <Tr
                  key={expense.id}
                  className={classNames('cursor-pointer transition-colors', {
                    'bg-blue-50 dark:bg-blue-900/20': expense.id === selectedExpenseId,
                  })}
                  onClick={() => setSelectedExpenseId(expense.id)}
                >
                  <Td>{expense.expense_date || '-'}</Td>
                  <Td>{getCategoryLabel(expense.expense_category)}</Td>
                  <Td>{expense.name || '-'}</Td>
                  <Td>
                    {formatMoney(
                      expense.total_cost || 0,
                      serviceOrder.client?.country_id,
                      serviceOrder.client?.settings?.currency_id
                    )}
                  </Td>
                  <Td>
                    {expense.charge_to_client
                      ? formatMoney(
                          expense.charge_amount || 0,
                          serviceOrder.client?.country_id,
                          serviceOrder.client?.settings?.currency_id
                        )
                      : '-'}
                  </Td>
                  <Td>{getReimbursementBadge(expense)}</Td>
                  <Td>
                    <Button
                      type="minimal"
                      behavior="button"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        handleRemoveExpense(expense.id);
                      }}
                    >
                      <Icon element={MdDelete} size={20} color="red" />
                    </Button>
                  </Td>
                </Tr>
              ))}
              {/* Totals Row */}
              <Tr>
                <Td colSpan={3} className="text-right font-medium">
                  {t('totals')}:
                </Td>
                <Td className="font-medium">
                  {formatMoney(
                    calculateTotalCost(),
                    serviceOrder.client?.country_id,
                    serviceOrder.client?.settings?.currency_id
                  )}
                </Td>
                <Td className="font-medium">
                  {formatMoney(
                    calculateTotalChargeToClient(),
                    serviceOrder.client?.country_id,
                    serviceOrder.client?.settings?.currency_id
                  )}
                </Td>
                <Td colSpan={2}></Td>
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

          {/* Detail Form for Selected Expense */}
          {selectedExpense && (
            <div
              className="border rounded-lg p-4 mt-4"
              style={{ borderColor: colors.$5, backgroundColor: colors.$1 }}
            >
              <h4 className="text-sm font-medium mb-4" style={{ color: colors.$3 }}>
                {t('edit_expense')}
              </h4>

              {/* Row 1: Date | Category | Name | Receipt Number */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('expense_date')}
                  </label>
                  <InputField
                    type="date"
                    value={selectedExpense.expense_date}
                    onValueChange={(value) =>
                      handleExpenseChange(selectedExpense.id, 'expense_date', value)
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('category')}
                  </label>
                  <SelectField
                    value={selectedExpense.expense_category}
                    onValueChange={(value) =>
                      handleExpenseChange(selectedExpense.id, 'expense_category', value as ExpenseCategory)
                    }
                  >
                    {expenseCategoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </SelectField>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('name')}
                  </label>
                  <InputField
                    value={selectedExpense.name}
                    onValueChange={(value) =>
                      handleExpenseChange(selectedExpense.id, 'name', value)
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('receipt_number')}
                  </label>
                  <InputField
                    value={selectedExpense.receipt_number}
                    onValueChange={(value) =>
                      handleExpenseChange(selectedExpense.id, 'receipt_number', value)
                    }
                  />
                </div>
              </div>

              {/* Row 2: Total Cost | Tax Paid | Charge to Client Toggle | Charge Amount */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('total_cost')}
                  </label>
                  <NumberInputField
                    value={selectedExpense.total_cost}
                    onValueChange={(value) =>
                      handleExpenseChange(selectedExpense.id, 'total_cost', parseFloat(value) || 0)
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('tax_paid')}
                  </label>
                  <NumberInputField
                    value={selectedExpense.tax_paid}
                    onValueChange={(value) =>
                      handleExpenseChange(selectedExpense.id, 'tax_paid', parseFloat(value) || 0)
                    }
                  />
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <Toggle
                    checked={selectedExpense.charge_to_client}
                    onValueChange={(value) =>
                      handleExpenseChange(selectedExpense.id, 'charge_to_client', value)
                    }
                  />
                  <label className="text-sm font-medium" style={{ color: colors.$3 }}>
                    {t('charge_to_client')}
                  </label>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('charge_amount')}
                  </label>
                  <NumberInputField
                    value={selectedExpense.charge_amount}
                    onValueChange={(value) =>
                      handleExpenseChange(selectedExpense.id, 'charge_amount', parseFloat(value) || 0)
                    }
                    disabled={!selectedExpense.charge_to_client}
                  />
                </div>
              </div>

              {/* Row 3: User | Reimburse Toggle | Reimbursed Toggle */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('user')}
                  </label>
                  <InputField
                    value={selectedExpense.technician_user_id}
                    onValueChange={(value) =>
                      handleExpenseChange(selectedExpense.id, 'technician_user_id', value)
                    }
                    placeholder={t('select_user')}
                  />
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <Toggle
                    checked={selectedExpense.reimburse_user}
                    onValueChange={(value) =>
                      handleExpenseChange(selectedExpense.id, 'reimburse_user', value)
                    }
                  />
                  <label className="text-sm font-medium" style={{ color: colors.$3 }}>
                    {t('needs_reimbursement')}
                  </label>
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <Toggle
                    checked={selectedExpense.is_reimbursed}
                    onValueChange={(value) =>
                      handleExpenseChange(selectedExpense.id, 'is_reimbursed', value)
                    }
                    disabled={!selectedExpense.reimburse_user}
                  />
                  <label className="text-sm font-medium" style={{ color: colors.$3 }}>
                    {t('reimbursed')}
                  </label>
                </div>
                <div></div>
              </div>

              {/* Row 4: Description */}
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                  {t('description')}
                </label>
                <InputField
                  element="textarea"
                  value={selectedExpense.description}
                  onValueChange={(value) =>
                    handleExpenseChange(selectedExpense.id, 'description', value)
                  }
                  placeholder={t('enter_expense_description')}
                />
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
