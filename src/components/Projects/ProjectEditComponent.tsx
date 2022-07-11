import React, { FC, useState, useEffect } from 'react';
import { TeamMember, ProjectEdit } from 'src/DAL/Projects';
import { Employee } from 'src/DAL/Employees';
import {
    Stack,
    TextField,
    ComboBox,
    IComboBoxOption,
    IComboBox,
    Label,
    IColumn,
    PrimaryButton,
    IconButton,
} from '@fluentui/react';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { requiredMessage, zeroGuid } from 'src/shared/Constants';
import { verticalGapStackTokens } from 'src/shared/Styles';
import EditDialog from 'src/components/EditDialog';
import { ActionAsyncThunk } from 'src/shared/Common';

interface Props {
    project: ProjectEdit;
    employees: Employee[];
    posting: boolean;
    saveProject: (project: ProjectEdit) => ActionAsyncThunk<boolean, ProjectEdit>;
    clearProject: () => void;
}

interface validationState {
    isValidManagerId: boolean;
    isValidTitle: boolean;
    isValidClient: boolean;
}

const ProjectEditComponent: FC<Props> = (props: Props) => {
    // Form fields values
    const [projectManagerId, setProjectManagerId] = useState<string>(props.project.managerId);
    const [projectTitle, setProjectTitle] = useState<string | undefined>(props.project.title);
    const [projectClient, setProjectClient] = useState<string | undefined>(props.project.client);
    const [projectTeamMembers, setProjectTeamMembers] = useState<TeamMember[] | null>(props.project.teamMembers || []);
    // Team members list items
    const [teamMemberItems, setTeamMemberItems] = useState([{}] || []);
    // Added team member
    const [newTeamMember, setNewTeamMember] = useState<TeamMember | null>(null);
    // Name of new team member
    const [teamMember, setTeamMember] = useState<TeamMember | undefined>(undefined);

    const [ManagersOptions, setManagersOptions] = useState<IComboBoxOption[]>();

    const [TeamMembersOptions, setTeamMembersOptions] = useState<IComboBoxOption[]>();

    const [validation, setValidation] = useState<validationState>({
        isValidManagerId: props.project.managerId !== zeroGuid,
        isValidTitle: props.project.title ? props.project.title.trim().length !== 0 : false,
        isValidClient: props.project.client ? props.project.client.trim().length !== 0 : false,
    });

    // Set managers list options
    useEffect(() => {
        if (props.employees.length !== 0) {
            const options: IComboBoxOption[] = props.employees.map(item => {
                return {
                    key: item.id,
                    text: item.fullName,
                } as IComboBoxOption;
            });
            setManagersOptions(options);
        }
    }, [props.employees]);

    // Set TeamMembers items
    useEffect(() => {
        // Get team members, who are not in current project
        const teamMembers = props.employees.filter(e => !projectTeamMembers?.find(t => t.employeeId === e.id));
        const options: IComboBoxOption[] = teamMembers.map(item => {
            return {
                key: item.id,
                text: item.fullName,
            } as IComboBoxOption;
        });
        setTeamMembersOptions(options);
        setTeamMember(undefined);

        // Update team members list items
        const deleteTeamMember = (id: string) => {
            setProjectTeamMembers(projectTeamMembers.filter(t => t.employeeId !== id) || null);
            setTeamMember(undefined);
        };

        const items = projectTeamMembers.map(item => {
            return {
                key: item.employeeId,
                fullName: item.fullName,
                deleteBtn: (
                    <div className="h-end">
                        <IconButton
                            title="Удалить"
                            iconProps={{ iconName: 'Delete', className: 'red' }}
                            onClick={() => deleteTeamMember(item.employeeId)}
                        />
                    </div>
                ),
            };
        });
        setTeamMemberItems(items);
    }, [props.employees, projectTeamMembers]);

    // Update team members list if added new team member
    useEffect(() => {
        if (newTeamMember != null) {
            setProjectTeamMembers([...projectTeamMembers, newTeamMember]);
        }
        setNewTeamMember(null);
    }, [newTeamMember, projectTeamMembers]);

    // Team members list colunms
    const columns: IColumn[] = [
        {
            key: 'fullNameColumn',
            name: '',
            fieldName: 'fullName',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        },
        {
            key: 'deleteBtnColumn',
            name: '',
            fieldName: 'deleteBtn',
            minWidth: 20,
            maxWidth: 20,
        },
    ];

    const addTeamMember = () => {
        const _newTeamMember = {
            employeeId: teamMember.employeeId,
            fullName: teamMember?.fullName!,
        };
        setNewTeamMember(_newTeamMember);
    };

    const _onCloseDialog = () => {
        props.clearProject();
    };

    const _onSave = () => {
        const newProject: ProjectEdit = {
            id: props.project.id,
            title: projectTitle.trim(),
            managerId: projectManagerId,
            client: projectClient.trim(),
            teamMembers: projectTeamMembers || [],
        };
        props.saveProject(newProject);
    };

    // On change form values
    const _onChangeManager = (
        option?: IComboBoxOption,
    ): void => {
        if (option) {
            setProjectManagerId(option.key.toString());
            setValidation({ ...validation, isValidManagerId: true });
        }
    };

    const _onChangeTitle = (newValue?: string) => {
        setProjectTitle(newValue);
        if (newValue) {
            setValidation({ ...validation, isValidTitle: newValue.trim().length !== 0 });
        } else {
            setValidation({ ...validation, isValidTitle: false });
        }
    };
    const _onChangeClient = (newValue?: string) => {
        setProjectClient(newValue);
        if (newValue) {
            setValidation({ ...validation, isValidClient: newValue.trim().length !== 0 });
        } else {
            setValidation({ ...validation, isValidClient: false });
        }
    };

    const _onChangeTeamMemberId = (
        option?: IComboBoxOption,
    ): void => {
        if (option) {
            const _teamMember: TeamMember = { employeeId: option.key.toString(), fullName: option.text };
            setTeamMember(_teamMember);
        }
    };

    const isValidForm = validation.isValidManagerId && validation.isValidTitle && validation.isValidClient;

    return (
        <EditDialog
            hidden={false}
            disabledSaveBtn={!isValidForm}
            saveMethod={() => _onSave()}
            closeMethod={() => _onCloseDialog()}
            posting={props.posting}
        >
            <Stack tokens={verticalGapStackTokens}>
                <ComboBox
                    required
                    label="Менеджер"
                    options={ManagersOptions}
                    onChange={_onChangeManager}
                    selectedKey={projectManagerId}
                    errorMessage={validation.isValidManagerId ? undefined : requiredMessage}
                />
                <TextField
                    required
                    label="Название"
                    value={projectTitle}
                    onChange={_onChangeTitle}
                    errorMessage={validation.isValidTitle ? undefined : requiredMessage}
                />
                <TextField
                    required
                    label="Заказчик"
                    value={projectClient}
                    onChange={_onChangeClient}
                    errorMessage={validation.isValidClient ? undefined : requiredMessage}
                />
                <Label>Команда</Label>
                <ShimmeredDetailsList
                    isHeaderVisible={false}
                    columns={columns}
                    items={teamMemberItems}
                    selectionMode={0}
                    enableShimmer={props.employees.length === 0}
                    shimmerLines={3}
                />
                <Stack horizontal verticalAlign="end">
                    <ComboBox
                        label="Добавить сотрудника"
                        options={TeamMembersOptions}
                        onChange={_onChangeTeamMemberId}
                        selectedKey={teamMember?.employeeId}
                    />
                    <PrimaryButton text="Добавить" onClick={() => addTeamMember()} disabled={!teamMember} />
                </Stack>
            </Stack>
        </EditDialog>
    );
};

export default ProjectEditComponent;
