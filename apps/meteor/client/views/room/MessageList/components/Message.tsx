/* eslint-disable complexity */
import type { IMessage } from '@rocket.chat/core-typings';
import { Message as MessageTemplate, MessageLeftContainer, MessageContainer, MessageBody, CheckBox } from '@rocket.chat/fuselage';
import { useToggle } from '@rocket.chat/fuselage-hooks';
import React, { FC, memo } from 'react';

import UserAvatar from '../../../../components/avatar/UserAvatar';
import { useMessageActions } from '../../contexts/MessageContext';
import { useIsMessageHighlight } from '../contexts/MessageHighlightContext';
import { useIsSelecting, useToggleSelect, useIsSelectedMessage, useCountSelected } from '../contexts/SelectedMessagesContext';
import { MessageWithMdEnforced } from '../lib/parseMessageTextToAstMarkdown';
import MessageContent from './MessageContent';
import MessageContentIgnored from './MessageContentIgnored';
import MessageHeader from './MessageHeader';
import { MessageIndicators } from './MessageIndicators';
import Toolbox from './Toolbox';

const Message: FC<{
	message: MessageWithMdEnforced;
	sequential: boolean;
	id: IMessage['_id'];
	unread: boolean;
	mention: boolean;
	all: boolean;
	isUserIgnored: boolean;
}> = ({ message, sequential, all, mention, unread, isUserIgnored, ...props }) => {
	const isMessageHighlight = useIsMessageHighlight(message._id);
	const [displayIgnoredMessage, toggleDisplayIgnoredMessage] = useToggle(false);

	const {
		actions: { openUserCard },
	} = useMessageActions();

	const isSelecting = useIsSelecting();
	const toggleSelected = useToggleSelect(message._id);
	const isSelected = useIsSelectedMessage(message._id);
	useCountSelected();

	const isMessageIgnored = (isUserIgnored || (message as { ignored?: boolean }).ignored) && !displayIgnoredMessage;

	return (
		<MessageTemplate
			{...props}
			onClick={isSelecting ? toggleSelected : undefined}
			isSelected={isSelected}
			isEditing={isMessageHighlight}
			isPending={message.temp}
			sequential={sequential}
			data-qa-editing={isMessageHighlight}
			data-qa-selected={isSelected}
		>
			<MessageLeftContainer>
				{!sequential && message.u.username && !isSelecting && (
					<UserAvatar
						url={message.avatar}
						username={message.u.username}
						size={'x36'}
						onClick={openUserCard(message.u.username)}
						style={{ cursor: 'pointer' }}
					/>
				)}
				{isSelecting && <CheckBox checked={isSelected} onChange={toggleSelected} />}
				{sequential && <MessageIndicators message={message} />}
			</MessageLeftContainer>

			<MessageContainer>
				{!sequential && <MessageHeader message={message} />}

				{!isMessageIgnored && (
					<MessageContent id={message._id} message={message} unread={unread} mention={mention} all={all} sequential={sequential} />
				)}
				{isMessageIgnored && (
					<MessageBody data-qa-type='message-body'>
						<MessageContentIgnored onShowMessageIgnored={toggleDisplayIgnoredMessage} />
					</MessageBody>
				)}
			</MessageContainer>
			{!message.private && <Toolbox message={message} />}
		</MessageTemplate>
	);
};

export default memo(Message);
