import { useTranslation } from '@rocket.chat/ui-contexts';
import { ChangeEvent, RefCallback, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useOutboundDialer } from '../../../../hooks/useOutboundDialer';

type DialPadStateHandlers = {
	inputName: string;
	inputRef: RefCallback<HTMLInputElement>;
	inputError: string | undefined;
	isButtonDisabled: boolean;
	handleOnChange: (e: ChangeEvent<HTMLInputElement>) => void;
	handleBackspaceClick: () => void;
	handlePadButtonClick: (digit: string | number) => void;
	handleCallButtonClick: () => void;
};

export const useDialPad = (handleClose: () => void): DialPadStateHandlers => {
	const t = useTranslation();
	const outbound = useOutboundDialer();

	const {
		setFocus,
		register,
		setValue,
		setError,
		clearErrors,
		watch,
		formState: { errors },
	} = useForm<{ PhoneInput: string }>();

	const { ref, onChange } = register('PhoneInput');
	const value = watch('PhoneInput');

	const [disabled, setDisabled] = useState(true);

	const handleBackspaceClick = useCallback((): void => {
		setValue('PhoneInput', value.slice(0, -1));
	}, [setValue, value]);

	const handlePadButtonClick = useCallback(
		(digit: string | number): void => {
			setValue('PhoneInput', value + digit);
		},
		[setValue, value],
	);

	const handleCallButtonClick = useCallback((): void => {
		if (!outbound || !outbound.outboundDialer) {
			return setError('PhoneInput', { message: t('Something_went_wrong_try_again_later') });
		}

		outbound.outboundDialer.makeCall(`sip:*${value}@${outbound.outboundDialer.userConfig.sipRegistrarHostnameOrIP}`).then(
			() => {
				handleClose();
			},
			(error) => {
				setError('PhoneInput', { message: error.message });
			},
		);
	}, [handleClose, outbound, setError, t, value]);

	useEffect(() => {
		setDisabled(!value);
		clearErrors('PhoneInput');
	}, [clearErrors, value]);

	useEffect(() => {
		setFocus('PhoneInput');
	}, [setFocus]);

	return {
		inputName: 'PhoneInput',
		inputRef: ref,
		inputError: errors.PhoneInput?.message,
		isButtonDisabled: disabled,
		handleOnChange: onChange,
		handleBackspaceClick,
		handlePadButtonClick,
		handleCallButtonClick,
	};
};