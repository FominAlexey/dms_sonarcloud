import React, { FC } from 'react';
import { Dialog, DialogFooter, DialogType, PrimaryButton, DefaultButton } from '@fluentui/react';

interface Props {
    hidden: boolean;
    deleteMethod: () => void;
    closeMethod: () => void;
}

const DeleteDialog: FC<Props> = (props: Props) => {
    return (
        <Dialog
            hidden={props.hidden}
            dialogContentProps={{
                type: DialogType.normal,
                title: 'Удаление',
                subText: 'Удалить выбранную запись?',
            }}
            modalProps={{
                allowTouchBodyScroll: true,
            }}
        >
            <DialogFooter className="center">
                <DefaultButton text="Отмена" onClick={() => props.closeMethod()} />
                <PrimaryButton text="Удалить" onClick={() => props.deleteMethod()} />
            </DialogFooter>
        </Dialog>
    );
};

export default DeleteDialog;
