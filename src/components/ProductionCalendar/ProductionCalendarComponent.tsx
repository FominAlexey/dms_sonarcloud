import React from 'react';
import { TextField, PrimaryButton } from '@fluentui/react';
import ContentContainer from 'src/containers/ContentContainer/ContentContainer';

const ProductionCalendarComponent = () => {
    return (
        <ContentContainer title="Производственный календарь">
            <TextField defaultValue={'Имя файла:'} borderless />
            <TextField defaultValue={'Дата последнего изменения:'} borderless />
            <PrimaryButton text="Загрузить файл" />
        </ContentContainer>
    );
};

export default ProductionCalendarComponent;
