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
import { ServiceOrder, ServiceOrderTask, TaskCompletionStatus } from '$app/common/interfaces/service-order';
import { useColorScheme } from '$app/common/colors';
import { Button, SelectField } from '$app/components/forms';
import { InputField } from '$app/components/forms';
import { NumberInputField } from '$app/components/forms/NumberInputField';
import { MdDelete, MdAdd, MdCheck, MdClose, MdRemove, MdSkipNext, MdCheckCircle } from 'react-icons/md';
import { Icon } from '$app/components/icons/Icon';
import { Table, Thead, Th, Tbody, Tr, Td } from '$app/components/tables';
import { v4 as uuidv4 } from 'uuid';
import { Badge } from '$app/components/Badge';

interface Props {
  serviceOrder: ServiceOrder;
  handleChange: (property: keyof ServiceOrder, value: ServiceOrder[keyof ServiceOrder]) => void;
}

export function ServiceOrderTaskTable(props: Props) {
  const [t] = useTranslation();

  const colors = useColorScheme();

  const { serviceOrder, handleChange } = props;

  const tasks = serviceOrder.tasks || [];

  const completionStatusOptions: { value: TaskCompletionStatus; label: string }[] = [
    { value: 'incomplete', label: t('incomplete') },
    { value: 'complete', label: t('complete') },
    { value: 'not_applicable', label: t('not_applicable') },
    { value: 'skipped', label: t('skipped') },
  ];

  const handleAddTask = () => {
    const newTask: ServiceOrderTask = {
      id: uuidv4(),
      service_order_id: serviceOrder.id,
      user_id: '',
      task_id: '',
      task_group_id: '',
      name: '',
      description: '',
      sort_order: tasks.length,
      completion_status: 'incomplete',
      completed_by_user_id: '',
      completed_at: '',
      completion_notes: '',
      estimated_duration: 0,
      actual_duration: 0,
      is_completed: false,
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
      archived_at: 0,
      is_deleted: false,
    };

    handleChange('tasks', [...tasks, newTask]);
  };

  const handleRemoveTask = (taskId: string) => {
    handleChange(
      'tasks',
      tasks.filter((task) => task.id !== taskId)
    );
  };

  const handleTaskChange = (
    taskId: string,
    property: keyof ServiceOrderTask,
    value: string | number | boolean
  ) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const updatedTask = { ...task, [property]: value };

        // Update is_completed and completed_at based on completion_status
        if (property === 'completion_status') {
          const isCompleted = ['complete', 'not_applicable', 'skipped'].includes(value as string);
          updatedTask.is_completed = isCompleted;
          if (isCompleted && !task.completed_at) {
            updatedTask.completed_at = new Date().toISOString();
          } else if (!isCompleted) {
            updatedTask.completed_at = '';
          }
        }

        return updatedTask;
      }
      return task;
    });

    handleChange('tasks', updatedTasks);
  };

  const quickSetStatus = (taskId: string, status: TaskCompletionStatus) => {
    handleTaskChange(taskId, 'completion_status', status);
  };

  const getCompletionStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((task) =>
      ['complete', 'not_applicable', 'skipped'].includes(task.completion_status)
    ).length;
    const incomplete = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, incomplete, percentage };
  };

  const getStatusBadge = (status: TaskCompletionStatus) => {
    switch (status) {
      case 'complete':
        return <Badge variant="green">{t('complete')}</Badge>;
      case 'incomplete':
        return <Badge variant="light-blue">{t('incomplete')}</Badge>;
      case 'not_applicable':
        return <Badge variant="dark-blue">{t('n_a')}</Badge>;
      case 'skipped':
        return <Badge variant="yellow">{t('skipped')}</Badge>;
      default:
        return <Badge variant="light-blue">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: TaskCompletionStatus) => {
    switch (status) {
      case 'complete':
        return <Icon element={MdCheck} size={16} className="text-green-500" />;
      case 'incomplete':
        return <Icon element={MdClose} size={16} className="text-gray-400" />;
      case 'not_applicable':
        return <Icon element={MdRemove} size={16} className="text-blue-500" />;
      case 'skipped':
        return <Icon element={MdSkipNext} size={16} className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const stats = getCompletionStats();

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium" style={{ color: colors.$3 }}>
          {t('task_checklist')}
        </h3>
        <Button type="minimal" onClick={handleAddTask}>
          <Icon element={MdAdd} size={20} />
          {t('add_task')}
        </Button>
      </div>

      {/* Task Completion Progress */}
      {tasks.length > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: colors.$3 }}>
              {t('task_progress')}
            </span>
            <span className="text-sm font-bold" style={{ color: colors.$3 }}>
              {stats.completed} / {stats.total} ({stats.percentage}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                stats.percentage === 100
                  ? 'bg-green-500'
                  : stats.percentage > 50
                  ? 'bg-blue-500'
                  : 'bg-yellow-500'
              }`}
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
          {stats.percentage === 100 && (
            <div className="flex items-center mt-2 text-green-600 dark:text-green-400">
              <Icon element={MdCheckCircle} size={18} className="mr-1" />
              <span className="text-sm font-medium">{t('all_tasks_completed')}</span>
            </div>
          )}
        </div>
      )}

      {tasks.length > 0 && (
        <Table>
          <Thead>
            <Th className="w-8">#</Th>
            <Th>{t('task_name')}</Th>
            <Th>{t('description')}</Th>
            <Th>{t('est_duration')}</Th>
            <Th>{t('actual_duration')}</Th>
            <Th>{t('status')}</Th>
            <Th>{t('completion_notes')}</Th>
            <Th>{t('quick_actions')}</Th>
            <Th></Th>
          </Thead>
          <Tbody>
            {tasks.map((task, index) => (
              <Tr
                key={task.id}
                className={task.is_completed ? 'bg-green-50 dark:bg-green-900/10' : ''}
              >
                <Td className="text-center font-medium">
                  {index + 1}
                </Td>
                <Td>
                  <InputField
                    value={task.name}
                    onValueChange={(value) =>
                      handleTaskChange(task.id, 'name', value)
                    }
                  />
                </Td>
                <Td>
                  <InputField
                    value={task.description}
                    onValueChange={(value) =>
                      handleTaskChange(task.id, 'description', value)
                    }
                  />
                </Td>
                <Td>
                  <NumberInputField
                    value={task.estimated_duration}
                    onValueChange={(value) =>
                      handleTaskChange(task.id, 'estimated_duration', parseFloat(value) || 0)
                    }
                  />
                </Td>
                <Td>
                  <NumberInputField
                    value={task.actual_duration}
                    onValueChange={(value) =>
                      handleTaskChange(task.id, 'actual_duration', parseFloat(value) || 0)
                    }
                  />
                </Td>
                <Td>
                  <SelectField
                    value={task.completion_status}
                    onValueChange={(value) =>
                      handleTaskChange(task.id, 'completion_status', value as TaskCompletionStatus)
                    }
                  >
                    {completionStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </SelectField>
                </Td>
                <Td>
                  <InputField
                    value={task.completion_notes}
                    onValueChange={(value) =>
                      handleTaskChange(task.id, 'completion_notes', value)
                    }
                    placeholder={t('notes')}
                  />
                </Td>
                <Td>
                  <div className="flex space-x-1">
                    <Button
                      type="minimal"
                      onClick={() => quickSetStatus(task.id, 'complete')}
                      title={t('mark_complete')}
                      className={task.completion_status === 'complete' ? 'bg-green-100 dark:bg-green-900/30' : ''}
                    >
                      <Icon element={MdCheck} size={18} className="text-green-500" />
                    </Button>
                    <Button
                      type="minimal"
                      onClick={() => quickSetStatus(task.id, 'not_applicable')}
                      title={t('mark_not_applicable')}
                      className={task.completion_status === 'not_applicable' ? 'bg-blue-100 dark:bg-blue-900/30' : ''}
                    >
                      <Icon element={MdRemove} size={18} className="text-blue-500" />
                    </Button>
                    <Button
                      type="minimal"
                      onClick={() => quickSetStatus(task.id, 'skipped')}
                      title={t('mark_skipped')}
                      className={task.completion_status === 'skipped' ? 'bg-yellow-100 dark:bg-yellow-900/30' : ''}
                    >
                      <Icon element={MdSkipNext} size={18} className="text-yellow-500" />
                    </Button>
                  </div>
                </Td>
                <Td>
                  <Button
                    type="minimal"
                    onClick={() => handleRemoveTask(task.id)}
                  >
                    <Icon element={MdDelete} size={20} color="red" />
                  </Button>
                </Td>
              </Tr>
            ))}
            <Tr>
              <Td colSpan={3} className="text-right font-medium">
                {t('totals')}:
              </Td>
              <Td className="font-medium text-center">
                {tasks.reduce((sum, task) => sum + (task.estimated_duration || 0), 0).toFixed(0)} {t('min')}
              </Td>
              <Td className="font-medium text-center">
                {tasks.reduce((sum, task) => sum + (task.actual_duration || 0), 0).toFixed(0)} {t('min')}
              </Td>
              <Td colSpan={4}></Td>
            </Tr>
          </Tbody>
        </Table>
      )}

      {tasks.length === 0 && (
        <div
          className="text-center py-8 border rounded"
          style={{ borderColor: colors.$5, color: colors.$3 }}
        >
          <p>{t('no_tasks')}</p>
          <Button type="minimal" onClick={handleAddTask} className="mt-2">
            <Icon element={MdAdd} size={20} />
            {t('add_task')}
          </Button>
        </div>
      )}
    </div>
  );
}
