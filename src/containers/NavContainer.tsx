import React, { useEffect, useState } from 'react';
import { Nav, INavLinkGroup, INavLink } from '@fluentui/react';
import { useHistory } from 'react-router-dom';
import { isAdmin, isManager, isEmployee } from 'src/shared/LocalStorageUtils';

const employeeGroups: INavLinkGroup[] = [
    {
        name: 'Сотрудник',
        expandAriaLabel: 'Employee components section',
        collapseAriaLabel: 'Collapse Employee components section',
        links: [
            {
                key: 'Calendar',
                name: 'Календарь',
                url: '/Calendar',
                icon: 'Calendar',
            },
            {
                key: 'TimeTracking',
                name: 'Трудозатраты',
                url: '/TimeTracking',
                icon: 'Timer',
            },
            {
                key: 'Expenses',
                name: 'Расходы',
                url: '/Expenses',
                icon: 'Money',
            },
        ],
    },
];

const managerGroups: INavLinkGroup[] = [
    {
        name: 'Менеджер',
        expandAriaLabel: 'Expand Manager components section',
        collapseAriaLabel: 'Collapse Manager components section',
        links: [
            {
                key: 'Confirmations',
                name: 'Подтверждения',
                url: '/Confirmations',
                icon: 'Ringer',
            },
            {
                key: 'Employees',
                name: 'Сотрудники',
                url: '/Employees',
                icon: 'Group',
            },
            {
                key: 'Projects',
                name: 'Проекты',
                url: '/Projects',
                icon: 'Taskboard',
            },
            {
                key: 'Assets',
                name: 'Активы',
                url: '/Assets',
                icon: 'ThisPC',
            },
            {
                key: 'Reports',
                name: 'Отчеты',
                url: '/Reports',
                icon: 'ReportDocument',
            },
        ],
    },
];

const adminGroups: INavLinkGroup[] = [
    {
        name: 'Администратор',
        expandAriaLabel: 'Expand Administrator section',
        collapseAriaLabel: 'Collapse Administrator section',
        links: [
            {
                key: 'UsersManagement',
                name: 'Пользователи',
                url: '/UsersManagement',
                icon: 'SecurityGroup',
            },
            {
                key: 'Dictionaries',
                name: 'Справочники',
                url: '/Dictionaries',
                icon: 'Dictionary',
            },
            // {
            //   key: 'ProductionCalendar',
            //   name: 'Нерабочие дни',
            //   url: '/ProductionCalendar',
            //   icon: 'CalendarSettings'
            // }
        ],
    },
];

const NavContainer = () => {
    const history = useHistory();

    const [groups, setGroups] = useState<INavLinkGroup[]>([]);

    // Handle onClick action for Nav
    const _onLinkClick = (ev: React.MouseEvent<HTMLElement, MouseEvent> | undefined, item: INavLink | undefined) => {
        ev?.preventDefault();
        history.push(item!.url);
    };

    // Check roles and set Nav items
    useEffect(() => {
        if (isEmployee()) {
            setGroups(g => g.concat(employeeGroups));
        }
        if (isManager()) {
            setGroups(g => g.concat(managerGroups));
        }
        if (isAdmin()) {
            setGroups(g => g.concat(adminGroups));
        }
    }, []);

    return (
        <Nav
            ariaLabel="Nav basic example"
            styles={{
                root: {
                    boxSizing: 'border-box',
                    borderRight: '1px solid #eee',
                    overflowY: 'auto',
                    color: 'black',
                },
            }}
            groups={groups}
            onLinkClick={_onLinkClick}
            selectedKey={history.location.pathname.split('/')[1]}
        />
    );
};

export default NavContainer;
