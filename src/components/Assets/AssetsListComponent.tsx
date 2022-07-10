import React, { FC, useState, useEffect } from 'react';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { IColumn, IconButton } from '@fluentui/react';
import { Asset, AssetEdit } from 'src/DAL/Assets';
import { ActionAsyncThunk } from 'src/shared/Common';

interface Props {
    data: Asset[];
    isLoading: boolean;
    editingAsset: (id: string) => ActionAsyncThunk<AssetEdit, string>;
    deletingAsset: (id: string) => ActionAsyncThunk<AssetEdit, string>;
}

interface IAssetItem {
    key: string;
    date: string | undefined;
    title: string;
    description: string | null;
    employee: string;
    serialNumber: string | null;
    editBtns: JSX.Element;
}

const AssetsListComponent: FC<Props> = (props: Props) => {
    const [items, setItems] = useState<IAssetItem[]>([]);

    useEffect(() => {
        setItems(getAssetItems(props.data, props.editingAsset, props.deletingAsset));
    }, [props.data, props.editingAsset, props.deletingAsset]);

    const columns: IColumn[] = [
        {
            key: 'asset_titleColumn',
            name: 'Название',
            fieldName: 'title',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        },
        {
            key: 'asset_descriptionColumn',
            name: 'Описание',
            fieldName: 'description',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        },
        {
            key: 'asset_employeeColumn',
            name: 'Сотрудник',
            fieldName: 'employee',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        },
        {
            key: 'asset_serialNumberColumn',
            name: 'Серийный номер',
            fieldName: 'serialNumber',
            minWidth: 100,
            maxWidth: 200,
        },
        {
            key: 'asset_dateColumn',
            name: 'Возвращено',
            fieldName: 'date',
            minWidth: 100,
            maxWidth: 200,
        },
        {
            key: 'asset_editButtonsColumn',
            name: '',
            fieldName: 'editBtns',
            minWidth: 50,
            maxWidth: 50,
        },
    ];

    return (
        <ShimmeredDetailsList
            columns={columns}
            items={items}
            selectionMode={0}
            enableShimmer={props.isLoading}
            isHeaderVisible={items.length !== 0}
        />
    );
};

const getAssetItems = (
    _assets: Asset[],
    editingAsset: (id: string) => void,
    deletingAsset: (id: string) => void,
    collator = new Intl.Collator('ru', { numeric: true, sensitivity: 'base' }),
): IAssetItem[] => {
    const _items = _assets
        .map(item => {
            return {
                key: item.id,
                date: item.receiveDate?.toLocaleDateString(),
                title: item.title,
                description: item.description,
                employee: item.employee,
                serialNumber: item.serialNumber,
                editBtns: (
                    <div className="h-end">
                        <IconButton
                            title="Изменить"
                            iconProps={{ iconName: 'Edit' }}
                            onClick={() => {
                                editingAsset(item.id);
                            }}
                        />
                        <IconButton
                            title="Удалить"
                            iconProps={{ iconName: 'Delete', className: 'red' }}
                            onClick={() => {
                                deletingAsset(item.id);
                            }}
                        />
                    </div>
                ),
            };
        })
        .sort((a, b) => collator.compare(a.employee, b.employee));
    return _items;
};

export default AssetsListComponent;
