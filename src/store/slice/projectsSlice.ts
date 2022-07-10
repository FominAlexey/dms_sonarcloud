import {
    Project,
    ProjectEdit,
    TeamMember,
    getProjects,
    getProject,
    postProject,
    putProject,
    deleteProject,
} from 'src/DAL/Projects';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { ErrorObject, NetworkError } from 'src/shared/Common';
import { zeroGuid } from 'src/shared/Constants';
import { loginAsyncThunk } from './accountSlice';

export interface ProjectsState {
    loading: boolean;
    posting: boolean;
    projects: Project[];
    current: ProjectEdit | null;
    postedResult: ProjectEdit | null;
    isAdding: boolean;
    isEditing: boolean;
    isDeleting: boolean;
    teamMembers: TeamMember[] | null;

    needToUpdate: boolean;
    error: ErrorObject | null;
}

const InitialProjectsState: ProjectsState = {
    loading: false,
    posting: false,
    projects: [],
    current: null,
    postedResult: null,
    isAdding: false,
    isEditing: false,
    isDeleting: false,
    teamMembers: null,
    needToUpdate: false,
    error: null,
};

//#region ------------- AsyncThunk ----------------------------------

export const getProjectsAsyncThunk = createAsyncThunk<
    Project[],
    string | null | undefined,
    {
        rejectValue: NetworkError;
    }
>('projects/getProjects', async (employeeId = null, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<Project[]> = await getProjects(employeeId);
        const projects = response.data;
        return projects;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const getProjectAsyncThunk = createAsyncThunk<
    ProjectEdit,
    string,
    {
        rejectValue: NetworkError;
    }
>('projects/getProject', async (id, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<ProjectEdit> = await getProject(id);
        const project = response.data;
        return project;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const postProjectAsyncThunk = createAsyncThunk<
    boolean,
    ProjectEdit,
    {
        rejectValue: NetworkError;
    }
>('projects/postProject', async (project, { rejectWithValue }) => {
    try {
        await postProject(project);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const putProjectAsyncThunk = createAsyncThunk<
    boolean,
    ProjectEdit,
    {
        rejectValue: NetworkError;
    }
>('projects/putProject', async (project, { rejectWithValue }) => {
    try {
        await putProject(project);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deleteProjectAsyncThunk = createAsyncThunk<
    boolean,
    string,
    {
        rejectValue: NetworkError;
    }
>('projects/deleteProject', async (id, { rejectWithValue }) => {
    try {
        await deleteProject(id);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deletingProjectAsyncThunk = createAsyncThunk<
    ProjectEdit,
    string,
    {
        rejectValue: NetworkError;
    }
>('projects/deletingProject', async (id, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<ProjectEdit> = await getProject(id);
        const project = response.data;
        return project;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const editingProjectAsyncThunk = createAsyncThunk<
    ProjectEdit,
    string,
    {
        rejectValue: NetworkError;
    }
>('projects/editingProject', async (id, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<ProjectEdit> = await getProject(id);
        const project = response.data;
        return project;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

//#endregion

const projectsSlice = createSlice({
    name: 'projects',
    initialState: InitialProjectsState,
    reducers: {
        addingProject(state) {
            const project: ProjectEdit | null = {
                id: zeroGuid,
                title: undefined,
                client: undefined,
                managerId: zeroGuid,
                teamMembers: [],
            };

            state.isAdding = true;
            state.current = project;
        },
        clearProject(state) {
            state.isAdding = false;
            state.isDeleting = false;
            state.isEditing = false;
            state.postedResult = null;
            state.current = null;
        },
        clearErrorProjects(state) {
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            //#region ---------------- getProjects ------------------
            .addCase(getProjectsAsyncThunk.pending, state => {
                state.projects = [];
                state.loading = true;
            })
            .addCase(getProjectsAsyncThunk.fulfilled, (state, action: PayloadAction<Project[]>) => {
                state.projects = action.payload;
                state.needToUpdate = false;
                state.loading = false;
            })
            .addCase(getProjectsAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось получить список проектов', error: action.error.message };

                state.loading = false;
            })
            //#endregion

            //#region ---------------- getProject ------------------
            .addCase(getProjectAsyncThunk.pending, state => {
                state.current = null;
            })
            .addCase(getProjectAsyncThunk.fulfilled, (state, action: PayloadAction<ProjectEdit>) => {
                state.current = action.payload;
            })
            .addCase(getProjectAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось получить информацию о проекте', error: action.error.message };
            })
            //#endregion

            //#region ---------------- postProject ------------------
            .addCase(postProjectAsyncThunk.pending, state => {
                state.posting = true;
            })
            .addCase(postProjectAsyncThunk.fulfilled, state => {
                state.isAdding = false;
                state.needToUpdate = true;
                state.posting = false;
                state.current = null;
            })
            .addCase(postProjectAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось сохранить изменения', error: action.error.message };

                state.posting = false;
            })
            //#endregion

            //#region ---------------- putProject ------------------
            .addCase(putProjectAsyncThunk.pending, state => {
                state.posting = true;
            })
            .addCase(putProjectAsyncThunk.fulfilled, state => {
                state.isEditing = false;
                state.needToUpdate = true;
                state.posting = false;
                state.current = null;
            })
            .addCase(putProjectAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось сохранить изменения', error: action.error.message };

                state.posting = false;
            })
            //#endregion

            //#region ---------------- deleteProject ------------------
            .addCase(deleteProjectAsyncThunk.fulfilled, state => {
                state.isDeleting = false;
                state.needToUpdate = true;
                state.current = null;
            })
            .addCase(deleteProjectAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось выполнить удаление', error: action.error.message };
            })
            //#endregion

            //#region ---------------- deletingProject ------------------
            .addCase(deletingProjectAsyncThunk.fulfilled, (state, action: PayloadAction<ProjectEdit>) => {
                state.isDeleting = true;
                state.current = action.payload;
            })
            .addCase(deletingProjectAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось получить информацию о проекте', error: action.error.message };
            })
            //#endregion

            //#region ---------------- editingProject ------------------
            .addCase(editingProjectAsyncThunk.fulfilled, (state, action: PayloadAction<ProjectEdit>) => {
                state.isEditing = true;
                state.current = action.payload;
            })
            .addCase(editingProjectAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось получить информацию о проекте', error: action.error.message };
            })
            //#endregion

            // Clear error before Login
            .addCase(loginAsyncThunk.fulfilled, state => {
                state.error = null;
            });
    },
});

export const { addingProject, clearProject, clearErrorProjects } = projectsSlice.actions;
export default projectsSlice.reducer;
