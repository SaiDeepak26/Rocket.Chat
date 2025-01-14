import { Box, Button, ButtonGroup, Modal } from '@rocket.chat/fuselage';
import { useSetModal, useTranslation } from '@rocket.chat/ui-contexts';
import React from 'react';

import useFeatureBullets from '../hooks/useFeatureBullets';
import RegisterWorkspaceSetupModal from './RegisterWorkspaceSetupModal';
import RegisterWorkspaceTokenModal from './RegisterWorkspaceTokenModal';

type RegisterWorkspaceModalProps = {
	onClose: () => void;
	onStatusChange?: () => void;
	isConnectedToCloud?: boolean | string;
};

const RegisterWorkspaceModal = ({ onClose, onStatusChange, isConnectedToCloud = false, ...props }: RegisterWorkspaceModalProps) => {
	const setModal = useSetModal();
	const bulletFeatures = useFeatureBullets();
	const t = useTranslation();

	const handleTokenModal = (): void => {
		const handleModalClose = (): void => setModal(null);
		setModal(
			<RegisterWorkspaceTokenModal isConnectedToCloud={isConnectedToCloud} onClose={handleModalClose} onStatusChange={onStatusChange} />,
		);
	};

	const handleSetupModal = (): void => {
		const handleModalClose = (): void => setModal(null);
		setModal(
			<RegisterWorkspaceSetupModal isConnectedToCloud={isConnectedToCloud} onClose={handleModalClose} onStatusChange={onStatusChange} />,
		);
	};

	return (
		<Modal {...props}>
			<Modal.Header>
				<Modal.HeaderText>
					<Modal.Title>{t('RegisterWorkspace_NotRegistered_Title')}</Modal.Title>
				</Modal.HeaderText>
				<Modal.Close onClick={onClose} />
			</Modal.Header>
			<Modal.Content>
				<Box withRichContent>
					<span>{`${t('RegisterWorkspace_NotRegistered_Subtitle')}:`}</span>
					<ul>
						{bulletFeatures.map((features) => (
							<li key={features.key}>
								<strong>{features.title}</strong>
								<Box is='p' mbs={4}>
									{features.description}
								</Box>
							</li>
						))}
					</ul>
					<Box is='p' fontSize='p2'>
						{t('RegisterWorkspace_Registered_Benefits')}
					</Box>
				</Box>
			</Modal.Content>
			<Modal.Footer>
				<Box is='div' display='flex' justifyContent='space-between' alignItems='center' w='full'>
					<a href={'https://cloud.rocket.chat'} target='_blank' rel='noopener noreferrer'>
						{t('Learn_more')}
					</a>
					<ButtonGroup align='end'>
						<Button onClick={handleTokenModal}>{t('Use_token')}</Button>
						<Button primary onClick={handleSetupModal}>
							{t('RegisterWorkspace_Button')}
						</Button>
					</ButtonGroup>
				</Box>
			</Modal.Footer>
		</Modal>
	);
};

export default RegisterWorkspaceModal;
