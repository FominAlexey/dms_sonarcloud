import React, { FC, useEffect } from 'react';
import {
    Image,
    ImageFit,
    CommandBar,
    ICommandBarItemProps,
    ContextualMenuItemType,
    Link,
    Toggle,
} from '@fluentui/react';
import { getTheme, loadTheme } from '@fluentui/react/lib/Styling';
import logo_light from 'src/Devs_logo_light.svg';
import logo_dark from 'src/Devs_logo_dark.svg';

import { connect } from 'react-redux';

import { useHistory } from 'react-router-dom';
import { getStartOfMonth, getEndOfMonth, getISOString } from 'src/shared/DateUtils';

import { lightTheme, darkTheme } from 'src/themes';
import { logout } from 'src/store/slice/accountSlice';
import { AppState } from 'src/store/slice';
import { toogleTheme } from 'src/store/slice/themeSlice';

import 'src/styles/pageHeaderStyles.css';

interface Props {
    userName: string;
    logout: () => {};
    invertedTheme: boolean;
    toggleTheme: () => {};
}

const PageHeaderContainer: FC<Props> = (props: Props) => {
    // Set theme
    useEffect(() => {
        if (props.invertedTheme) {
            loadTheme(darkTheme);
        } else {
            loadTheme(lightTheme);
        }
        const backgroundColor = getTheme().palette.white;
        document.body.style.backgroundColor = backgroundColor;
    }, [props.invertedTheme]);

    const history = useHistory();

    const _onMyEventLogsItemClick = () => {
        history.push(
            `/MyEventLogs?fromDate=${getISOString(getStartOfMonth(new Date()))}&toDate=${getISOString(
                getEndOfMonth(new Date()),
            )}`,
        );
    };

    const _onMyLimitsItemClick = () => {
        history.push('/MyLimits');
    };

    const _onLogoutItemClick = () => {
        props.logout();
        history.push('/Login');
    };

    const _onMyInfoItemClick = () => {
        history.push('/MyProfile');
    };

    const items: ICommandBarItemProps[] = [
        {
            key: 'main',
            text: props.userName,
            iconProps: { iconName: 'Contact' },
            subMenuProps: {
                items: [
                    {
                        key: 'myProfile',
                        text: 'Мой профиль',
                        onClick: _onMyInfoItemClick,
                    },
                    {
                        key: 'myEventLogs',
                        text: 'Мое нерабочее время',
                        onClick: _onMyEventLogsItemClick,
                    },
                    {
                        key: 'myLimits',
                        text: 'Мои лимиты',
                        onClick: _onMyLimitsItemClick,
                    },
                    {
                        key: 'divider',
                        itemType: ContextualMenuItemType.Divider,
                    },
                    {
                        key: 'logout',
                        text: 'Выйти',
                        onClick: _onLogoutItemClick,
                    },
                ],
            },
        },
    ];

    return (
        <div className="hr-header container-menu-header">
            <div className="ms-sm10 ">
                <Link href="/Calendar">
                    <Image
                        src={props.invertedTheme ? logo_light : logo_dark}
                        height="35px"
                        imageFit={ImageFit.contain}
                        alt="Devs logo"
                    />
                </Link>
            </div>
            <div className="styleBlock"></div>
            <div className="ms-sm4 themeBlock">
                <Toggle
                    checked={props.invertedTheme}
                    onText="Темная тема"
                    offText="Светлая тема"
                    inlineLabel
                    onChange={() => props.toggleTheme()}
                />
            </div>
            <div className="ms-sm4 commandBarBlock">
                <CommandBar items={items} />
            </div>
        </div>
    );
};

const mapStateToProps = (store: AppState) => {
    return {
        userName: store.account.userName,
        invertedTheme: store.theme.inverted,
    };
};

const mapDispatchToProps = {
    logout: () => logout(),
    toggleTheme: () => toogleTheme(),
};

export default connect(mapStateToProps, mapDispatchToProps)(PageHeaderContainer);
