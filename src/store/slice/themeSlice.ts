import { createSlice } from '@reduxjs/toolkit';
import { isInvertedTheme } from 'src/shared/LocalStorageUtils';

export interface ThemeState {
    inverted: boolean;
}

const InitialThemeState: ThemeState = {
    inverted: isInvertedTheme(),
};

const themeSlice = createSlice({
    name: 'theme',
    initialState: InitialThemeState,
    reducers: {
        toogleTheme(state) {
            state.inverted = !state.inverted;
        },
    },
});

export const { toogleTheme } = themeSlice.actions;
export default themeSlice.reducer;
