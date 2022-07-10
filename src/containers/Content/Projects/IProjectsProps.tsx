import { Project, ProjectEdit } from 'src/DAL/Projects';
import { Employee } from 'src/DAL/Employees';

import {
    addingProject,
    clearProject,
    getProjectsAsyncThunk,
    editingProjectAsyncThunk,
    postProjectAsyncThunk,
    putProjectAsyncThunk,
    deletingProjectAsyncThunk,
    deleteProjectAsyncThunk,
} from 'src/store/slice/projectsSlice';

import { getEmployeesAsyncThunk } from 'src/store/slice/employeesSlice';
import { AppState } from 'src/store/slice';
import { ActionAsyncThunk } from 'src/shared/Common';

export interface IProjectsProps {
    projects: Project[] | null;
    projectsLoading: boolean;
    currentProject: ProjectEdit | null;
    isAdding: boolean;
    isEditing: boolean;
    isDeleting: boolean;
    posting: boolean;
    addingProject: () => void;
    clearProject: () => void;
    getProjects: () => ActionAsyncThunk<Project[], string | undefined | null>;
    editingProject: (id: string) => ActionAsyncThunk<ProjectEdit, string>;
    postProject: (project: ProjectEdit) => ActionAsyncThunk<boolean, ProjectEdit>;
    putProject: (project: ProjectEdit) => ActionAsyncThunk<boolean, ProjectEdit>;
    deletingProject: (id: string) => ActionAsyncThunk<ProjectEdit, string>;
    deleteProject: (id: string) => ActionAsyncThunk<boolean, string>;

    employees: Employee[] | null;
    getEmployees: () => any;

    needToUpdateProjects: boolean;
}

export const mapStateToProps = (store: AppState) => {
    return {
        projects: store.projects.projects,
        projectsLoading: store.projects.loading,
        currentProject: store.projects.current,
        isAdding: store.projects.isAdding,
        isEditing: store.projects.isEditing,
        isDeleting: store.projects.isDeleting,
        posting: store.projects.posting,

        employees: store.employees.employees,

        needToUpdateProjects: store.projects.needToUpdate,
    };
};

export const mapDispatchToProps = {
    getProjects: () => getProjectsAsyncThunk(),
    addingProject: () => addingProject(),
    editingProject: (id: string) => editingProjectAsyncThunk(id),
    postProject: (project: ProjectEdit) => postProjectAsyncThunk(project),
    putProject: (project: ProjectEdit) => putProjectAsyncThunk(project),
    clearProject: () => clearProject(),
    getEmployees: () => getEmployeesAsyncThunk(),
    deletingProject: (id: string) => deletingProjectAsyncThunk(id),
    deleteProject: (id: string) => deleteProjectAsyncThunk(id),
};
