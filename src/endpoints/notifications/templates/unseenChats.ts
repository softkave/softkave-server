import {SystemResourceType} from '../../../models/system';
import {INotification, NotificationType} from '../../../mongo/notification/definitions';
import {
  IWorkspaceChatsDestinationParams,
  NotificationLinkDestinations,
  makeLinkURL,
} from '../../../mongo/notification/linkAttachment';
import {getDate} from '../../../utilities/fns';
import {getNewId02} from '../../../utilities/ids';
import {IBaseContext} from '../../contexts/IBaseContext';
import {IBaseNotificationTemplateProps, bodyDeltaToText} from './utils';

export interface IUnseenChatsNotificationTemplateProps extends IBaseNotificationTemplateProps {
  unseenChats: Array<{
    orgId: string;
    count: number;
  }>;
}

export function unseenChatsNotificationTemplate(
  ctx: IBaseContext,
  props: IUnseenChatsNotificationTemplateProps
): INotification {
  const totalCount = props.unseenChats.reduce((acc, {count}) => acc + count, 0);
  const title = `You have ${totalCount} unseen chats`;
  const countsDelta = props.unseenChats.reduce((delta, {orgId, count}) => {
    const link = makeLinkURL<IWorkspaceChatsDestinationParams>(ctx.appVariables.clientDomain, {
      orgId,
      dest: NotificationLinkDestinations.OrganizationChats,
    });

    delta.push([
      {insert: `See ${count} unseen chats at `},
      {insert: link, attributes: {link}},
      {insert: '.\n'},
    ]);

    return delta;
  }, [] as any[]);

  const bodyDelta = [
    {insert: `You have ${totalCount.toString()} unseen chats.\n`},
    ...countsDelta,
    {insert: '\n'},
  ];

  const bodyText = bodyDeltaToText(bodyDelta);
  return {
    ...props.base,
    title,
    bodyDelta,
    bodyText,
    resourceAttachments: [],
    type: NotificationType.UnseenChats,
    createdAt: getDate(),
    customId: getNewId02(SystemResourceType.UnseenChats),
  };
}
