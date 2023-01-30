import type { App } from '@rocket.chat/core-typings';
import { Box, Pagination, States, StatesSubtitle, StatesTitle } from '@rocket.chat/fuselage';
import { useTranslation } from '@rocket.chat/ui-contexts';
import type { ReactElement } from 'react';
import React, { useState } from 'react';

import { useAppRequests } from '../../../hooks/useAppRequests';
import AppRequestItem from './AppRequestItem';
import AppRequestsLoading from './AppRequestsLoading';

const AppRequests = ({ id }: { id: App['id'] }): ReactElement => {
	const [limit, setLimit] = useState();
	const [offset, setOffset] = useState();
	const appRequests = useAppRequests(id, limit, offset);

	const t = useTranslation();

	const onSetItemsPerPage = (itemsPerPageOption: any) => {
		setLimit(itemsPerPageOption);
		appRequests.refetch();
	};

	const onSetCurrent = (currentItemsOption: any) => {
		setOffset(currentItemsOption);
		appRequests.refetch();
	};

	if (appRequests.isLoading) {
		return (
			<Box w='full' maxWidth='x608' marginInline='auto' pbs='x36'>
				<AppRequestsLoading />
			</Box>
		);
	}

	return (
		<Box h='full' display='flex' flexDirection='column'>
			<Box w='full' maxWidth='x608' marginInline='auto' pbs='x36' flexGrow='1'>
				{appRequests.data?.data?.length ? (
					appRequests.data?.data.map((request) => (
						<AppRequestItem
							key={request.id}
							seen={request.seen}
							name={request.requester.name}
							createdDate={request.createdDate}
							message={request.message}
							username={request.requester.username}
						/>
					))
				) : (
					<States>
						<StatesTitle>{t('No_requests')}</StatesTitle>
						<StatesSubtitle>{t('App_requests_by_workspace')}</StatesSubtitle>
					</States>
				)}
			</Box>
			{appRequests.isSuccess && appRequests.data?.data?.length && (
				<Pagination
					divider
					count={appRequests.data.meta.total}
					itemsPerPage={appRequests.data.meta.limit}
					current={appRequests.data.meta.offset}
					onSetItemsPerPage={onSetItemsPerPage}
					onSetCurrent={onSetCurrent}
				/>
			)}
		</Box>
	);
};

export default AppRequests;