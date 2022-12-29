import type { IUser, IOmnichannelRoom } from '@rocket.chat/core-typings';
import type { IAuthorizationLivechat } from '@rocket.chat/core-services';
import { ServiceClassInternal } from '@rocket.chat/core-services';

import { validators } from './roomAccessValidator.compatibility';

export class AuthorizationLivechat extends ServiceClassInternal implements IAuthorizationLivechat {
	protected name = 'authorization-livechat';

	protected internal = true;

	async canAccessRoom(room: IOmnichannelRoom, user?: Pick<IUser, '_id'>, extraData?: object): Promise<boolean> {
		for (const validator of validators) {
			if (validator(room, user, extraData)) {
				return true;
			}
		}

		return false;
	}
}
