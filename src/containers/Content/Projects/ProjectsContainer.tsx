import React, { FC, useEffect } from 'react';
import { PrimaryButton, Label } from '@fluentui/react';
import ProjectsListComponent from 'src/components/Projects/ProjectsListComponent';
import ContentContainer from 'src/containers/ContentContainer/ContentContainer';
import ProjectEditComponent from 'src/components/Projects/ProjectEditComponent';
import DeleteDialog from 'src/components/DeleteDialog';

import { connect } from 'react-redux';
import { IProjectsProps, mapStateToProps, mapDispatchToProps } from './IProjectsProps';

const ProjectsContainer: FC<IProjectsProps> = (props: IProjectsProps) => {
    useEffect(() => {
        props.getProjects();
    }, [props.getProjects, props.needToUpdateProjects]);

    useEffect(() => {
        if (props.isEditing || props.isAdding) {
            props.getEmployees();
        }
    }, [props.isEditing, props.isAdding, props.getEmployees]);

    const projectId = props.currentProject ? props.currentProject.id : '';

    return (
        <ContentContainer title="Проекты" showContent={props.projects !== null}>
            <PrimaryButton text="Добавить проект" onClick={() => props.addingProject()} className="mt-20" />

            <ProjectsListComponent
                data={props.projects || []}
                editingProject={props.editingProject}
                isLoading={props.projectsLoading}
                deletingProject={props.deletingProject}
            />

            {!props.projectsLoading && props.projects?.length === 0 && (
                <Label className="text-center">Нет данных для отображения</Label>
            )}

            {(props.isAdding || props.isEditing) && props.currentProject && (
                <ProjectEditComponent
                    project={props.currentProject}
                    saveProject={props.isAdding ? props.postProject : props.putProject}
                    clearProject={props.clearProject}
                    employees={props.employees || []}
                    posting={props.posting}
                />
            )}

            {props.isDeleting && props.currentProject && (
                <DeleteDialog
                    hidden={!props.isDeleting}
                    deleteMethod={() => props.deleteProject(projectId)}
                    closeMethod={() => props.clearProject()}
                />
            )}
        </ContentContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsContainer);
