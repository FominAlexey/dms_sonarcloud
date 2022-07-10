import React, { FC } from 'react';
import ContentContainer from 'src/containers/ContentContainer/ContentContainer';
import { PrimaryButton, Label } from '@fluentui/react';
import TaskCategoriesListComponent from './TaskCategoriesListComponent';
import TaskCategoryEditComponent from './TaskCategoryEditComponent';
import DeleteDialog from 'src/components/DeleteDialog';
import { ActionAsyncThunk } from 'src/shared/Common';
import { TaskCategory, TaskCategoryEdit } from 'src/DAL/Dictionaries';

interface BaseProps {
    showContent: boolean;
    taskCategoryId: string;
    saveTaskCategory: (taskCategory: TaskCategoryEdit) => ActionAsyncThunk<boolean, TaskCategoryEdit>;
}

export interface TaskCategoriesProps extends BaseProps {
    taskCategories: TaskCategory[] | null;
    currentTaskCategory: TaskCategoryEdit | null;

    taskCategoriesLoading: boolean;
    taskCategoriesPosting: boolean;

    isTaskCategoryAdding: boolean;
    isTaskCategoryEditing: boolean;
    isTaskCategoryDeleting: boolean;

    addingTaskCategory: () => void;
    clearTaskCategory: () => void;

    editingTaskCategory: (id: string) => ActionAsyncThunk<TaskCategoryEdit, string>;
    deletingTaskCategory: (id: string) => ActionAsyncThunk<TaskCategoryEdit, string>;
    deleteTaskCategory: (id: string) => ActionAsyncThunk<boolean, string>;
}

const TaskCategoriesComponent: FC<TaskCategoriesProps> = (props: TaskCategoriesProps) => {
    return (
        <ContentContainer title="Категории задач" showContent={props.showContent}>
            <PrimaryButton text="Добавить" onClick={() => props.addingTaskCategory()} className="mt-20" />

            <TaskCategoriesListComponent
                data={props.taskCategories || []}
                editingTaskCategory={props.editingTaskCategory}
                isLoading={props.taskCategoriesLoading}
                deletingTaskCategory={props.deletingTaskCategory}
            />

            {!props.taskCategoriesLoading && props.taskCategories?.length === 0 && (
                <Label className="text-center">Нет данных для отображения</Label>
            )}

            {(props.isTaskCategoryAdding || props.isTaskCategoryEditing) && props.currentTaskCategory && (
                <TaskCategoryEditComponent
                    taskCategory={props.currentTaskCategory}
                    posting={props.taskCategoriesPosting}
                    clearTaskCategory={props.clearTaskCategory}
                    saveTaskCategory={props.saveTaskCategory}
                />
            )}

            {props.isTaskCategoryDeleting && props.currentTaskCategory && (
                <DeleteDialog
                    hidden={!props.isTaskCategoryDeleting}
                    deleteMethod={() => props.deleteTaskCategory(props.taskCategoryId)}
                    closeMethod={() => props.clearTaskCategory()}
                />
            )}
        </ContentContainer>
    );
};

export default TaskCategoriesComponent;
