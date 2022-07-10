import React, { useEffect, FC } from 'react';
import { PrimaryButton, Label } from '@fluentui/react';

import { connect } from 'react-redux';
import AssetsListComponent from 'src/components/Assets/AssetsListComponent';
import ContentContainer from 'src/containers/ContentContainer/ContentContainer';
import AssetEditComponent from 'src/components/Assets/AssetEditComponent';
import DeleteDialog from 'src/components/DeleteDialog';

import { IAssetsProps, mapStateToProps, mapDispatchToProps } from './IAssetsProps';

const AssetsContainer: FC<IAssetsProps> = (props: IAssetsProps) => {
    // Get assets
    useEffect(() => {
        if (props.needToUpdateAssets) props.getAssets();
    }, [props.getAssets, props.needToUpdateAssets]);

    // Get employees if is editing
    useEffect(() => {
        if (props.isAdding || props.isEditing) {
            props.getEmployees();
        }
    }, [props.getEmployees, props.isAdding, props.isEditing]);

    const assetId = props.currentAsset ? props.currentAsset.id : '';

    return (
        <ContentContainer title="Активы" showContent={props.assets !== null}>
            <PrimaryButton text="Добавить актив" onClick={() => props.addingAsset()} className="mt-20" />
            <AssetsListComponent
                data={props.assets || []}
                editingAsset={props.editingAsset}
                isLoading={props.assetsLoading}
                deletingAsset={props.deletingAsset}
            />

            {!props.assetsLoading && props.assets?.length === 0 && (
                <Label className="text-center">Нет данных для отображения</Label>
            )}

            {(props.isAdding || props.isEditing) && props.currentAsset && (
                <AssetEditComponent
                    employees={props.employees || []}
                    asset={props.currentAsset}
                    saveAsset={props.isAdding ? props.postAsset : props.putAsset}
                    clearAsset={props.clearAsset}
                    posting={props.posting}
                />
            )}

            {props.isDeleting && props.currentAsset && (
                <DeleteDialog
                    hidden={!props.isDeleting}
                    deleteMethod={() => props.deleteAsset(assetId)}
                    closeMethod={() => props.clearAsset()}
                />
            )}
        </ContentContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(AssetsContainer);
