import React, { FC, FormEvent, SyntheticEvent, useState } from 'react';
import { Stack, TextField, ColorPicker, IColor } from '@fluentui/react';
import { ExpenseCategory } from 'src/DAL/Dictionaries';
import { requiredMessage } from 'src/shared/Constants';
import { RgbReg } from 'src/shared/RegExpressions';
import { verticalGapStackTokens } from 'src/shared/Styles';
import EditDialog from 'src/components/EditDialog';
import { ActionAsyncThunk } from 'src/shared/Common';

interface Props {
    expenseCategory: ExpenseCategory;
    posting: boolean;
    saveExpenseCategory: (expenseCategory: ExpenseCategory) => ActionAsyncThunk<boolean, ExpenseCategory>;
    clearExpenseCategory: () => void;
}

interface ValidationState {
    isValidTitle: boolean;
    isValidColor: boolean;
}

const ExpenseCategoryEditComponent: FC<Props> = (props: Props) => {
    // Set initial values
    const [expenseCategoryTitle, setExpenseCategoryTitle] = useState<string | undefined>(props.expenseCategory.title);
    const [expenseCategoryColor, setExpenseCategoryColor] = useState<string | undefined>(props.expenseCategory.color);

    const [validation, setValidation] = useState<ValidationState>({
        isValidTitle: props.expenseCategory.title ? props.expenseCategory.title.trim().length !== 0 : false,
        isValidColor: props.expenseCategory.color ? RgbReg.test(props.expenseCategory.color) : false,
    });

    const _onCloseDialog = () => {
        props.clearExpenseCategory();
    };

    const _onSave = () => {
        const newExpenseCategory: ExpenseCategory = {
            id: props.expenseCategory.id,
            title: expenseCategoryTitle!.trim(),
            color: expenseCategoryColor!.trim().toUpperCase(),
        };
        props.saveExpenseCategory(newExpenseCategory);
    };

    const _onChangeTitle = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setExpenseCategoryTitle(newValue);
        if (newValue) {
            setValidation({ ...validation, isValidTitle: newValue.trim().length !== 0 });
        } else {
            setValidation({ ...validation, isValidTitle: false });
        }
    };

    const _onChangeColorPicker = (ev: SyntheticEvent<HTMLElement, Event>, color: IColor) => {
        setExpenseCategoryColor(color.str);

        if (!validation.isValidColor) setValidation({ ...validation, isValidColor: true });
    };

    const isValidForm = validation.isValidTitle && validation.isValidColor;

    return (
        <EditDialog
            hidden={false}
            disabledSaveBtn={!isValidForm}
            saveMethod={() => _onSave()}
            closeMethod={() => _onCloseDialog()}
            posting={props.posting}
        >
            <Stack tokens={verticalGapStackTokens}>
                <TextField
                    label="????????????????????????"
                    required
                    value={expenseCategoryTitle}
                    onChange={_onChangeTitle}
                    errorMessage={validation.isValidTitle ? undefined : requiredMessage}
                />

                <TextField
                    required
                    disabled
                    label="????????"
                    value={expenseCategoryColor}
                    errorMessage={validation.isValidColor ? undefined : requiredMessage}
                />
                <ColorPicker
                    color={expenseCategoryColor || '#ff0000'}
                    alphaType={'none'}
                    showPreview={true}
                    onChange={_onChangeColorPicker}
                />
            </Stack>
        </EditDialog>
    );
};

export default ExpenseCategoryEditComponent;
