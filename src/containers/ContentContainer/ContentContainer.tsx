import React, { FC, useEffect, useState } from 'react';
import { Label, MessageBar, MessageBarType } from '@fluentui/react';
import { connect } from 'react-redux';
import { IContentProps, mapStateToProps, mapDispatchToProps } from './IContentProps';
import { ErrorObject } from 'src/shared/Common';

import 'src/styles/contentStyles.css';

const ContentContainer: FC<IContentProps> = (props: IContentProps) => {
    const getErrors = (): ErrorObject[] => {
        const errors: ErrorObject[] = [];

        if (props.errAssets) errors.push(props.errAssets);

        if (props.errCalendar) errors.push(props.errCalendar);

        if (props.errEmployees) errors.push(props.errEmployees);

        if (props.errEventLogCategories) errors.push(props.errEventLogCategories);

        if (props.errExpenseCategories) errors.push(props.errExpenseCategories);

        if (props.errExpenses) errors.push(props.errExpenses);

        if (props.errFeedback) errors.push(props.errFeedback);

        if (props.errProductionCalendar) errors.push(props.errProductionCalendar);

        if (props.errProjects) errors.push(props.errProjects);

        if (props.errTimeTrackings) errors.push(props.errTimeTrackings);

        if (props.errWorkTasks) errors.push(props.errWorkTasks);

        if (props.errTaskCategories) errors.push(props.errTaskCategories);

        return errors;
    };

    const removeError = (error: ErrorObject) => {
        setErrors(errors.filter(e => e !== error));

        switch (error) {
            case props.errAssets:
                props.clearErrAssets();
                break;

            case props.errCalendar:
                props.clearErrCalendar();
                break;

            case props.errEmployees:
                props.clearErrEmployees();
                break;

            case props.errExpenseCategories:
                props.clearErrExpenseCategories();
                break;

            case props.errEventLogCategories:
                props.clearErrorEventLogCategory();
                break;

            case props.errExpenses:
                props.clearErrExpenses();
                break;

            case props.errFeedback:
                props.clearErrFeedback();
                break;

            case props.errProductionCalendar:
                props.clearErrProductionCalendar();
                break;

            case props.errProjects:
                props.clearErrProjects();
                break;

            case props.errTimeTrackings:
                props.clearErrTimeTrackings();
                break;

            case props.errWorkTasks:
                props.clearErrWorkTasks();
                break;

            case props.errTaskCategories:
                props.clearErrTaskCategories();
                break;
        }
    };

    const [errors, setErrors] = useState<ErrorObject[]>([]);

    useEffect(() => {
        setErrors(getErrors());
    }, [
        props.errAssets,
        props.errCalendar,
        props.errEmployees,
        props.errEventLogCategories,
        props.errExpenseCategories,
        props.errExpenses,
        props.errFeedback,
        props.errProductionCalendar,
        props.errProjects,
        props.errTimeTrackings,
        props.errWorkTasks,
        props.errTaskCategories,
    ]);

    const ErrorBar = errors.map(item => {
        return (
            <MessageBar
                messageBarType={MessageBarType.error}
                onDismiss={() => removeError(item)}
                key={errors.indexOf(item)}
            >
                {item.message !== undefined || item.message !== '' ? item.message : 'Ошибка сервера'}
            </MessageBar>
        );
    });

    return (
        <div>
            <Label className="content-header">{props.title}</Label>
            {errors.length !== 0 ? ErrorBar : null}
            {props.showContent ? props.children : null}
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ContentContainer);
