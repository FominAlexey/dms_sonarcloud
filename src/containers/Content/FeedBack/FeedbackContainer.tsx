import React, { FC } from 'react';

import { connect } from 'react-redux';

import FeedbackEditComponent from 'src/components/Feedback/FeedbackEditComponent';
import { ActionButton } from '@fluentui/react';
import { IFeedBackProps, mapStateToProps, mapDispatchToProps } from './IFeedBackProps';

const FeedbackContainer: FC<IFeedBackProps> = (props: IFeedBackProps) => {
    return (
        <div>
            <ActionButton
                text="Обратная связь"
                iconProps={{ iconName: 'Message' }}
                title="Оставить отзыв"
                onClick={() => props.addingFeedback()}
            />
            {props.isAdding && (
                <FeedbackEditComponent
                    posting={props.posting}
                    sendFeedback={props.sendFeedback}
                    clearFeedback={() => props.clearFeedback()}
                />
            )}
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackContainer);
