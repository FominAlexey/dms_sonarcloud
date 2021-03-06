import { createTheme } from '@fluentui/react';

export const darkTheme = createTheme({
    isInverted: true,
    palette: {
        themePrimary: '#008ffc',
        themeLighterAlt: '#00060a',
        themeLighter: '#001728',
        themeLight: '#002b4c',
        themeTertiary: '#005697',
        themeSecondary: '#007ede',
        themeDarkAlt: '#199afd',
        themeDark: '#3daafd',
        themeDarker: '#70c0fe',
        neutralLighterAlt: '#303030',
        neutralLighter: '#383838',
        neutralLight: '#464646',
        neutralQuaternaryAlt: '#4e4e4e',
        neutralQuaternary: '#555555',
        neutralTertiaryAlt: '#727272',
        neutralTertiary: '#c8c8c8',
        neutralSecondary: '#d0d0d0',
        neutralPrimaryAlt: '#dadada',
        neutralPrimary: '#ffffff',
        neutralDark: '#f4f4f4',
        black: '#f8f8f8',
        white: '#262626',
    },
});

export const lightTheme = createTheme({
    palette: {
        themePrimary: '#0078d4',
        themeLighterAlt: '#eff6fc',
        themeLighter: '#deecf9',
        themeLight: '#c7e0f4',
        themeTertiary: '#71afe5',
        themeSecondary: '#2b88d8',
        themeDarkAlt: '#106ebe',
        themeDark: '#005a9e',
        themeDarker: '#004578',
        neutralLighterAlt: '#faf9f8',
        neutralLighter: '#f3f2f1',
        neutralLight: '#edebe9',
        neutralQuaternaryAlt: '#e1dfdd',
        neutralQuaternary: '#d0d0d0',
        neutralTertiaryAlt: '#c8c6c4',
        neutralTertiary: '#a19f9d',
        neutralSecondary: '#605e5c',
        neutralPrimaryAlt: '#3b3a39',
        neutralPrimary: '#323130',
        neutralDark: '#201f1e',
        black: '#000000',
        white: '#ffffff',
    },
});
