import React, { FC } from 'react';
import { Dialog, DialogFooter, DialogType, PrimaryButton, DefaultButton, Spinner } from '@fluentui/react';

import 'src/styles/editDialogStyles.css';

interface Props {
    hidden: boolean;
    disabledSaveBtn: boolean;
    posting?: boolean;
    saveMethod: () => void;
    closeMethod: () => void;
    children: React.ReactNode;
}

const EditDialog: FC<Props> = (props: Props) => {
    return (
        <Dialog
            hidden={props.hidden}
            dialogContentProps={{
                type: DialogType.normal,
                title: '',
                closeButtonAriaLabel: 'Close',
            }}
            modalProps={{
                allowTouchBodyScroll: true,
                containerClassName: 'custom-edit-dialog',
            }}
        >
            {props.children}

            <DialogFooter className="center">
                <DefaultButton text="Отмена" onClick={() => props.closeMethod()} disabled={props.posting} />
                <PrimaryButton
                    text="Сохранить"
                    onClick={() => props.saveMethod()}
                    disabled={props.disabledSaveBtn || props.posting}
                />
            </DialogFooter>
            {props.posting && <Spinner label="Сохранение..." />}
        </Dialog>
    );
};

export default EditDialog;
