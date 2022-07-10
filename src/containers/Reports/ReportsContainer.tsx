import React from 'react';
import ContentContainer from 'src/containers/ContentContainer/ContentContainer';
import SelectReportDialogComponent from 'src/components/Reports/SelectReportDialogComponent';

const ReportsContainer = () => {
    return (
        <ContentContainer title="Отчеты" showContent={true}>
            <SelectReportDialogComponent />
        </ContentContainer>
    );
};

export default ReportsContainer;
